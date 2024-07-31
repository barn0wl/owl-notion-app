import { Status, Priority } from "./enums.js";
import { Task } from "./task.js";

export class Project {

    public status: Status
    public tasks : Task[]
    public priority: Priority

    constructor(
        public name: string,
        tasks?: Task[],
        status?: Status,
        priority?: Priority,
    ) {
        this.name = name,
        this.status = status?? Status["Not started"],
        this.tasks = tasks ?? [],
        this.priority = priority?? Priority.None
    }
}