import { Priority, Weekday } from "./types.js";

export class Task {

    public nextDue: Date | null
    public priority: Priority
    public isChecked: boolean
    public recurring: boolean
    public schedule: { [ key in Weekday] : boolean }

    constructor(
        public name: string,
        recurring?: boolean,
        isChecked?: boolean,
        priority?: Priority,
        schedule?: { [ key in Weekday] : boolean },
        nextDue?: Date
    ) {
        this.name = name
        this.recurring = recurring?? false
        this.isChecked = isChecked?? false
        this.nextDue = nextDue?? null
        this.priority = priority?? Priority.None
        this.schedule = schedule ?? this.getDefaultSchedule()
    }

    private getDefaultSchedule = () : { [ key in Weekday] : boolean } => {
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