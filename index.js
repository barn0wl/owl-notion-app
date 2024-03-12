const { Client } = require('@notionhq/client')
const later = require('@breejs/later');
const cronstrue = require('cronstrue');
later.date.localTime();

const notion = new Client ({auth: process.env.NOTION_KEY})
const databaseId = process.env.NOTION_DATABASE_ID;

const uniqueRecurrTasks = []

async function getUniqueRecurr() {
    const response = await notion.databases.query({
        database_id: databaseId,
        filter: {

            //make sure that the task is recurring, not archived
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
    // here, we make sure that the same task isnt repeated (uniquetask)
    for (let task of response.results) {
        const uniqueTask = !uniqueRecurrTasks.some(t => t.properties.Name.title[0].text.content === task.properties.Name.title[0].text.content)
        if (uniqueTask) {
            console.log('this task isnt already in the list')
            uniqueRecurrTasks.push(task)
        }
        else {
            console.log('this task is already in the list')
        }
    }
}


async function createNextRecurr() {
    for(let rtask of uniqueRecurrTasks) {
        var sched = later.parse.cron(rtask.properties.Cron.rich_text[0].text.content);
        const nextDate = later.schedule(sched).next(1);
        //here, we look inside the database to see if the next occurence of current task isnt already created
        const response1 = await notion.databases.query({
            database_id: databaseId,
            filter: {

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
                },
                //add checkbox must not be checked
                {
                    "property": "Cron",
                    "rich_text": {
                        "equals": rtask.properties.Cron.rich_text[0].text.content
                      }
                },
                {
                    "property": "Planned",
                    "date": {
                        "equals": nextDate
                    }
                }
                ]
            }
        })
        //we only create a new iteration of the task if it isnt already there
        const recurrTaskNames = response1.results.map(t => t.properties.Name.title[0].text.content)
        if (!recurrTaskNames.includes(rtask.properties.Name.title[0].text.content)) {
            console.log('the next iteration of this task hasnt been created yet')
            console.log(`creating ${rtask.properties.Name.title[0].text.content} task`)
            console.log(`next date for this task: ${nextDate}`)
            const response2 = await notion.pages.create({
                "parent": {
                    "type": "database_id",
                    "database_id": databaseId
                },
                "properties": {
                    "Name": {
                        "title": [
                            {
                                "text": {
                                    "content": rtask.properties.Name.title[0].text.content
                                }
                            }
                        ]
                    },
                    "Recurring": {
                        "checkbox": true
                    },
                    "Planned": {
                        "date": {
                            "start": nextDate
                        }
                    },
                    "Cron": {
                        "rich_text": [
                            {
                                "text":  {
                                    "content": rtask.properties.Cron.rich_text[0].text.content
                                }
                            }
                        ]
                    },
                    "Interval": {
                        "rich_text": [
                            {
                                "text":  {
                                    "content": cronstrue.toString(rtask.properties.Cron.rich_text[0].text.content)
                                }
                            }
                        ]
                    }
                }
            })
            console.log(response2)
        }
        else {
            console.log('the next iteration of this task has already been created')
        }
    }
}

async function updatingTasks() {
    await getUniqueRecurr();
    await createNextRecurr();
}

updatingTasks();
  

