
import { Task } from "../models/task.js";
import { IPageObjectResponse } from "../models/notion/notionTypes.js";
import { Priority, Schedule, Weekday } from "../models/types.js";
import { TaskDocument } from "../models/mongo/taskSchema.js";

export const parseNotionPageToTask = (notionPage: IPageObjectResponse): Task => {
    //this function takes a task PageObjectResponse and transforms it into a business Task object
    const name = notionPage.properties.Name?.title[0].text.content || ""
    const due = notionPage.properties.Due?.date?.start || null
    const done = notionPage.properties.Done?.checkbox
    const recurring = notionPage.properties.Recurring?.checkbox
    const priority = parsePriorityProperty(notionPage.properties.Priority?.select?.name)
    const sheduledDays : string[] = []
    notionPage.properties.Schedule?.multi_select.forEach(day => sheduledDays.push(day.name))
    const schedule = parseScheduleProperty(sheduledDays)

    const newTask = new Task(name, recurring, done, priority, schedule, due)
    return newTask
}

const parsePriorityProperty = (priority: string | undefined): Priority => {
    switch (priority) {
        case "P0":
            return Priority.Low
        case "P1":
            return Priority.Mid
        case "P2":
            return Priority.High
        default:
            return Priority.None
    }
}

const parseScheduleProperty = (days : string[]) : Schedule => {
    const schedule = {
        Sun: false,
        Mon: false,
        Tue: false,
        Wed: false,
        Thu: false,
        Fri: false,
        Sat: false
    }
    days.forEach(day => schedule[day as Weekday] = true)
    return schedule
}

export const convertMongoToTask = (mongoTask: TaskDocument) : Task => {
    const name = mongoTask.name
    const nextDue = mongoTask.due
    const priority = mongoTask.priority
    const isChecked = mongoTask.done
    const recurring = mongoTask.recurring
    const schedule = mongoTask.schedule
    return new Task(name, recurring, isChecked, priority, schedule, nextDue)
}