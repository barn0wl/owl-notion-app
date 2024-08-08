import { Priority, RecurrenceInterval, Weekday } from "./types.js";

export class Task {
    public name: string
    public nextDue: Date | null
    public priority: Priority
    public isChecked: boolean
    public recurrenceInterval: RecurrenceInterval
    public recurrenceDays?: Weekday[]

    constructor(
        name: string,
        recurrenceInterval?: RecurrenceInterval,
        isChecked?: boolean,
        priority?: Priority,
        nextDue?: Date | null,
        recurrenceDays?: Weekday[]
    ) {
        this.name = name
        this.recurrenceInterval = recurrenceInterval?? RecurrenceInterval.None
        this.isChecked = isChecked?? false
        this.nextDue = nextDue?? null
        this.priority = priority?? Priority.None
        this.recurrenceDays = recurrenceDays
    }
}