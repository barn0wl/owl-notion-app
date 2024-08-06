import mongoose, {Document, Schema} from "mongoose";
import { Priority, Schedule } from "../types.js";

export interface TaskDocument extends Document {
    name: string,
    recurring: boolean,
    done: boolean,
    priority: Priority,
    due: Date | null,
    schedule: Schedule
}

const scheduleSchema = new Schema<Schedule>({
    Sun: { type: Boolean, required: true },
    Mon: { type: Boolean, required: true },
    Tue: { type: Boolean, required: true },
    Wed: { type: Boolean, required: true },
    Thu: { type: Boolean, required: true },
    Fri: { type: Boolean, required: true },
    Sat: { type: Boolean, required: true },
  }, { _id: false }); // _id: false to prevent creating an _id for the subdocument

const taskSchema = new Schema<TaskDocument>({
    name: {type: String, required: true},
    done: {type: Boolean, required: true},
    recurring: {type: Boolean, required: true},
    priority: {type: Number, required: true},
    due: {type: Date, required: false},
    schedule: {type: scheduleSchema, required: true}
})

export const Task = mongoose.model<TaskDocument>('Task', taskSchema)
  