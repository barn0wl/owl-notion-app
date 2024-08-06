import { Priority, Schedule } from "./types.js";

export class Task {

    public nextDue: Date | null
    public priority: Priority
    public isChecked: boolean
    public recurring: boolean
    public schedule: Schedule

    constructor(
        public name: string,
        recurring?: boolean,
        isChecked?: boolean,
        priority?: Priority,
        schedule?: Schedule,
        nextDue?: Date
    ) {
        this.name = name
        this.recurring = recurring?? false
        this.isChecked = isChecked?? false
        this.nextDue = nextDue?? null
        this.priority = priority?? Priority.None
        this.schedule = schedule ?? this.getDefaultSchedule()
    }

    private getDefaultSchedule = () : Schedule => {
        return {
            Sun: false,
            Mon: false,
            Tue: false,
            Wed: false,
            Thu: false,
            Fri: false,
            Sat: false
        }
    }
}