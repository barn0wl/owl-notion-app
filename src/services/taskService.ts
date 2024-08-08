
import { Task } from "../models/task.js";
import { IPageObject } from "../models/notion/notionTypes.js";
import { Priority, RecurrenceInterval, Weekday } from "../models/types.js";
import { TaskDocument } from "../models/mongo/taskSchema.js";

export const parseNotionPageToTask = (notionPage: IPageObject): Task => {
    //this function takes a task PageObject and transforms it into a business Task object
    const name = notionPage.properties.Name?.title[0].text.content || ""
    const due = notionPage.properties.Due?.date?.start || null
    const done = notionPage.properties.Done?.checkbox
    const recurrenceInterval = notionPage.properties["Recurrence Interval"]?.select?.name as RecurrenceInterval || RecurrenceInterval.None
    const priority = parsePriorityProperty(notionPage.properties.Priority?.select?.name)
    const scheduledDays : Weekday[] = []
    notionPage.properties["Recurrence Days"]?.multi_select.forEach(dayProp => {
        const day = parseWeekdayProperty(dayProp.name)
        if (day) {
            scheduledDays.push(day)
        }
    })
    const newTask = scheduledDays.length > 0 ? new Task(name, recurrenceInterval, done, priority, due, scheduledDays) : new Task(name, recurrenceInterval, done, priority, due)
    return newTask
}

const priorityMap: Record<string, Priority> = {
    Low: Priority.Low,
    Mid: Priority.Mid,
    High: Priority.High,
  }

const parsePriorityProperty = (priority: string | undefined): Priority => {
    if (priority) {
        return priorityMap[priority as keyof typeof priorityMap]
    }
    return Priority.None
}

const weekdayMap: Record<string, Weekday> = {
    Sunday: Weekday.Sunday,
    Monday: Weekday.Monday,
    Tuesday: Weekday.Tuesday,
    Wednesday: Weekday.Wednesday,
    Thursday: Weekday.Thursday,
    Friday: Weekday.Friday,
    Saturday : Weekday.Saturday
  }

const parseWeekdayProperty = (day : string | undefined) : Weekday | void => {
    if (day) {
        return weekdayMap[day as keyof typeof weekdayMap]
    }
    return
}

export const convertMongoToTask = (mongoTask: TaskDocument) : Task => {
    const name = mongoTask.name
    const nextDue = mongoTask.due
    const priority = mongoTask.priority
    const isChecked = mongoTask.done
    const recurrenceDays = mongoTask.recurrenceDays
    const recurrenceInterval = mongoTask.recurrenceInterval
    return  recurrenceDays? new Task(name, recurrenceInterval, isChecked, priority, nextDue, recurrenceDays) : new Task(name, recurrenceInterval, isChecked, priority, nextDue)
}

export const calculateNextDue = (task: Task) : Date | null  => {
    const currentDue = task.nextDue
    const interval = task.recurrenceInterval
    const recurrenceDays = task.recurrenceDays
    if (currentDue == null) {
        return null
    }
    const nextDue = new Date(currentDue)
    switch (interval) {
        case RecurrenceInterval.Daily:
            nextDue.setDate(nextDue.getDate() + 1)
            break
        case RecurrenceInterval.Weekly:
            if (recurrenceDays && recurrenceDays.length > 0) {
                let nextDayFound = false
                while (!nextDayFound) {
                    nextDue.setDate(nextDue.getDate() + 1)
                    if (recurrenceDays.includes(nextDue.getDay() as Weekday)) {
                        nextDayFound = true
                    }
                }
            } else {
                nextDue.setDate(nextDue.getDate() + 7)
            }
            break
        case RecurrenceInterval.Monthly:
            nextDue.setMonth(nextDue.getMonth() + 1)
            break;
    }
    return nextDue
}