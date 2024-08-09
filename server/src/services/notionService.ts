import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints.js"
import { notion, databaseId } from "../index.js"
import { isFullPage } from "@notionhq/client"
import { Task } from "../models/task.js"
import { IPageObject } from "../models/notion/notionTypes.js"
import { Priority, Weekday } from "../models/types.js"

export const getAllNotionTasks = async () : Promise<PageObjectResponse[]> => {
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            filter:
                {
                    property: "Archive",
                    checkbox: {
                    equals: false
                    }
                },
            filter_properties: ["title", "%3EU%3D%3F", "%3FrqN", "ExKE", "Zm%3AU", "nThT", "%7CcWV"]
        })

        const pageResults = response.results.filter(isFullPage)
        return pageResults

    } catch(error) {
        console.error("Error querying Notion database:", error);
        throw error;
    }
}

export const convertTaskToNotion = (task: Task) : IPageObject => {
    const dayProp : {name: string}[] = []
    if (task.recurrenceDays) {
        task.recurrenceDays.forEach(day => 
            dayProp.push(convertToDayProp(parseWeekdayAsString(day)))
        )
    }
    return {
        properties: {
            Name: {
                type: "title",
                title: [
                    {
                        type: "text",
                        text: {
                            content: task.name
                        }
                    }
                ]
            },
            Due: {
                type: "date",
                date: task.nextDue? {
                    start: task.nextDue.toDateString(),
                    } : null
            },
            Done: {
                type: "checkbox",
                checkbox: task.isChecked,
              },
            Priority: {
                type: "select",
                select : {
                  name: parsePriorityAsString(task.priority),
                }
            },
            'Recurrence Days': {
                type: "multi_select",
                multi_select : dayProp
            },
            'Recurrence Interval': {
                type: "select",
                select : {
                  name: task.recurrenceInterval as string,
                }
            }
        }
    }
}

export const postTaskToNotion = async (task: Task) => {
    const page = convertTaskToNotion(task)
    try {
        const response = await notion.pages.create({
            parent: {
                type: 'database_id',
                database_id: databaseId,
            },
            properties: page.properties
        })
    }catch(error) {
        console.log("Error adding task to Notion:", error)
    }
}


//helper functions that helps convert numbers in the recurrenceDays 1 priority props to actual day & priority strings
const priorityValueMap : Record<Priority, string> = {
    0 : 'None',
    1 : 'Low',
    2 : 'Mid',
    3 : 'High'
}

const weekdayValueMap : Record<Weekday, string> = {
    0 : 'Sunday',
    1 : 'Monday',
    2 : 'Tuesday',
    3 : 'Wednesday',
    4 : 'Thursday',
    5 : 'Friday',
    6 : 'Saturday',
}

const parsePriorityAsString = (priority: Priority) : string => {
    return priorityValueMap[priority]
}

const parseWeekdayAsString = (weekday: Weekday): string => {
    return weekdayValueMap[weekday]
  }

const convertToDayProp = (day: string) : {name: string} => {
    return {name: day}
  }