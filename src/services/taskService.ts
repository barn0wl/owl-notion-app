//this function takes a task PageObjectResponse and transforms it into a business Task object

import { Task } from "../models/task.js";
import { IPageObjectResponse } from "../models/notionTypes.js";
import { Priority, Schedule, Weekday } from "../models/types.js";

export const parseNotionPageToTask = (notionPage: IPageObjectResponse): Task => {
    const name = notionPage.properties.Name?.title[0].text.content || ""
    const due = notionPage.properties.Due?.date?.start
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