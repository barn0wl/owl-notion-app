import { PageObject } from "@notionhq/client/build/src/api-endpoints.js"
import { notion, databaseId } from "../app.js"
import { isFullPage } from "@notionhq/client"
import { Task } from "../models/task.js"
import { IPageObject } from "../models/notion/notionTypes.js"

export const getAllNotionTasks = async () : Promise<PageObject[]> => {
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            filter:
                //make sure that the task is recurring, not archived, and has no planned date
                //all of this indicates that the task is a template for future recurring tasks
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
                date: {
                    start: task.nextDue,
                    }
            },
            Done: {
                type: 'checkbox',
                checkbox: task.isChecked,
              },
            Priority: {
                type: "select",
                select : {
                  name: ,
                }
            },
            'Recurrence Days': {
                type: "multi-select",
                multi_select : {
                  name: string,
                } []
            },
            'Recurrence Interval': {
                type: "select",
                select : {
                  name: task.recurrenceInterval,
                }
            }
        }
    } as IPageObject
}

export const postTaskToNotion = async (task: Task) => {
    try {
        const response = await notion.pages.create({
            parent: {
                type: 'database_id',
                database_id: databaseId,
            },
            properties: {
                Name: {
                    title: [
                        {
                            text: {
                                content: task.name
                            }
                        }
                    ]
                }
            }
        }).then()
    }
}