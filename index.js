require('dotenv').config()

const { Client } = require('@notionhq/client')
const cron = require('node-cron');

const notion = new Client ({auth: process.env.NOTION_KEY})

const recurringTasks = []

async function getRecurringTasks() {
    const databaseId = process.env.NOTION_DATABASE_ID;
    const response = await notion.databases.query({
        database_id: databaseId,
        filter: {

            //make sure that the task is recurring, not archived, and also isn't already in our array
            "and": [ {
                "property": "Recurring",
                "checkbox": {
                "equals": true
            }
            },
            {
                "property": "Archive",
                "checkbox": {
                "equals": false
            }
            }
            ]
        }
    })
    for (let task of response.results) {
        recurringTasks.push(task)
    }
}


async function createRecurringTasks() {
    const date = new Date();
    const databaseId = process.env.NOTION_DATABASE_ID;
    for(let task of recurringTasks) {
        console.log(`creating ${task.properties.Name.title[0].text.content} task`)
        const response = await notion.pages.create({
            "parent": {
                "type": "database_id",
                "database_id": databaseId
            },
            "properties": {
                "Name": {
                    "title": [
                        {
                            "text": {
                                "content": task.properties.Name.title[0].text.content
                            }
                        }
                    ]
                },
                "Recurring": {
                    "checkbox": true
                },
                "Planned": {
                    "date": {
                        "start": date
                    }
                },
                "Cron": {
                    "rich_text": [
                        {
                            "text":  {
                                "content": task.properties.Cron.rich_text[0].text.content
                            }
                        }
                    ]
                }
            }
        })
        console.log(response)
    }
}

getRecurringTasks().then((result) => {
    createRecurringTasks()
}).catch((err) => {

});

