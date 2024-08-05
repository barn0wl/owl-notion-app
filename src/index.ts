import later from '@breejs/later';
later.date.localTime();
import { notion, databaseId } from './app.js';

const tempRecurrTasks = []

export async function getTempRecurr() {
    
    
    //this checks if any of the returned temp tasks isnt found in our 
    //list of temp tasks and adds it 
    const newTempList = response.results;
    for(let nt of newTempList){
        if (!tempRecurrTasks.includes(nt)){
            tempRecurrTasks.push(nt);
        }
    }
    console.log('New tasks have been added to the template list!')

    //this checks if a temp task that was previously in our temp task list isnt found
    //in the database anymore (it has been deleted or archived)
    for(let tempTask of tempRecurrTasks){
        if (!newTempList.includes(tempTask)){
            const index = tempRecurrTasks.indexOf(tempTask);
            tempRecurrTasks.splice(index, 1)
        }
    }
    console.log('Some tasks have been removed from the template list!')
}


async function createNewRecurr() {
    //here, we are looking to create the next 3 instances of each template task, if they're not already created
    for(let rtask of tempRecurrTasks) {
        var sched = later.parse.cron(rtask.properties.Cron.rich_text[0].text.content);
        const upcomingDates = later.schedule(sched).next(3);
        //query the db to find tasks that could be instances of our recurring tasks
        //this query returns only tasks that arent templates and respect all criterias
        //of an instance of a template task other than the name
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
                {
                    "property": "Done",
                    "checkbox": {
                        "equals": false
                    }
                },
                {
                    "property": "Cron",
                    "rich_text": {
                        "equals": rtask.properties.Cron.rich_text[0].text.content
                      }
                },
                {
                    "or": [ {
                        "property": "Planned",
                        "date": {
                            "equals": upcomingDates[0]
                        }
                    },
                    {
                        "property": "Planned",
                        "date": {
                            "equals": upcomingDates[1]
                        }
                    },
                    {
                        "property": "Planned",
                        "date": {
                            "equals": upcomingDates[2]
                        }
                    }
                    ]
                }
                ]
            }
        })

        //we filter the list of queried tasks to find those that have the same name
        const queriedTasks = response1.results
        const instanceTasks = queriedTasks.filter(task =>
            task.properties.Name.title[0].text.content === rtask.properties.Name.title[0].text.content )
        const nbOfInstancesToCreate = 3 - instanceTasks.length
        //3 is a number we arbitrarily chose for how many instances of the task we want to be created ahead
        //e.g. if the nb of instance tasks is 1, we want to create 2
        for(let i=0; i<nbOfInstancesToCreate; i++) {

            const response2 = await notion.pages.create({
                "parent": {
                    "type": "database_id",
                    "database_id": databaseId
                },
                "icon": {
                    "emoji" : rtask.icon.emoji
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
                            "start": upcomingDates[i]
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
                    }
                }
            })
        }
        console.log(`${nbOfInstancesToCreate} instances have been created for task ${rtask.properties.Name.title[0].text.content}`)
    }
}

async function updatingTasks() {
    console.log('Time to update tasks!');
    await getTempRecurr();
    await createNewRecurr();
}