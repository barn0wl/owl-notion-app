import { TaskDocument, Task as taskSchema} from "../models/mongo/taskSchema.js";
import { Task } from "../models/task.js";

export const addTaskToMongo = async (task: Task) => {
    //add task to mongo
    try {
        const taskData: Partial<TaskDocument> = {
            name: task.name,
            recurring: task.recurring,
            done: task.isChecked,
            priority: task.priority,
            due: task.nextDue?? null,
            schedule: task.schedule
        }
        const newTask = new taskSchema(taskData)
        await newTask.save();
        console.log("Task added to mongo!", newTask)
    } catch (error) {
        console.error(error)
    }
  }
