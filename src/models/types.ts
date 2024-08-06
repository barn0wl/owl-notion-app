export enum Priority {
    None,
    Low,
    Mid,
    High
}

export enum Status {
    'Not started',
    'In progress',
    'Complete'
}

export type Weekday = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'

export type Schedule = { [ key in Weekday] : boolean }