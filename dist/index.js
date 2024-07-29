var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Client } from '@notionhq/client';
import later from '@breejs/later';
later.date.localTime();
const notion = new Client({ auth: process.env.NOTION_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;
const tempRecurrTasks = [];
function getTempRecurr() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield notion.databases.query({
            database_id: databaseId,
            filter: {
                //make sure that the task is recurring, not archived, and has no planned date
                //all of this indicates that the task is a template for future recurring tasks
                "and": [{
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
                        "property": "Planned",
                        "date": {
                            "is_empty": true
                        }
                    }
                ]
            }
        });
        //this checks if any of the returned temp tasks isnt found in our 
        //list of temp tasks and adds it 
        const newTempList = response.results;
        for (let nt of newTempList) {
            if (!tempRecurrTasks.includes(nt)) {
                tempRecurrTasks.push(nt);
            }
        }
        console.log('New tasks have been added to the template list!');
        //this checks if a temp task that was previously in our temp task list isnt found
        //in the database anymore (it has been deleted or archived)
        for (let tempTask of tempRecurrTasks) {
            if (!newTempList.includes(tempTask)) {
                const index = tempRecurrTasks.indexOf(tempTask);
                tempRecurrTasks.splice(index, 1);
            }
        }
        console.log('Some tasks have been removed from the template list!');
    });
}
function createNewRecurr() {
    return __awaiter(this, void 0, void 0, function* () {
        //here, we are looking to create the next 3 instances of each template task, if they're not already created
        for (let rtask of tempRecurrTasks) {
            var sched = later.parse.cron(rtask.properties.Cron.rich_text[0].text.content);
            const upcomingDates = later.schedule(sched).next(3);
            //query the db to find tasks that could be instances of our recurring tasks
            //this query returns only tasks that arent templates and respect all criterias
            //of an instance of a template task other than the name
            const response1 = yield notion.databases.query({
                database_id: databaseId,
                filter: {
                    "and": [{
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
                            "or": [{
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
            });
            //we filter the list of queried tasks to find those that have the same name
            const queriedTasks = response1.results;
            const instanceTasks = queriedTasks.filter(task => task.properties.Name.title[0].text.content === rtask.properties.Name.title[0].text.content);
            const nbOfInstancesToCreate = 3 - instanceTasks.length;
            //3 is a number we arbitrarily chose for how many instances of the task we want to be created ahead
            //e.g. if the nb of instance tasks is 1, we want to create 2
            for (let i = 0; i < nbOfInstancesToCreate; i++) {
                const response2 = yield notion.pages.create({
                    "parent": {
                        "type": "database_id",
                        "database_id": databaseId
                    },
                    "icon": {
                        "emoji": rtask.icon.emoji
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
                                    "text": {
                                        "content": rtask.properties.Cron.rich_text[0].text.content
                                    }
                                }
                            ]
                        }
                    }
                });
            }
            console.log(`${nbOfInstancesToCreate} instances have been created for task ${rtask.properties.Name.title[0].text.content}`);
        }
    });
}
function updatingTasks() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Time to update tasks!');
        yield getTempRecurr();
        yield createNewRecurr();
    });
}
export { getTempRecurr, createNewRecurr, updatingTasks };
