import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints.js"
import { notion, databaseId } from "../app.js"
import { isFullPage } from "@notionhq/client"

export const getAllTasks = async () : Promise<PageObjectResponse[]> => {
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