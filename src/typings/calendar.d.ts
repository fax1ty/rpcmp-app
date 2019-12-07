interface CordovaPlugins {
    calendar: CaledarPlugin;
}

declare interface CaledarPlugin {
    createCalendar(name: string, success: (message: Object) => void, error: (message: string) => void): void;
    createCalendar(options: CreateCalendarOptions, success: (message: Object) => void, error: (message: string) => void): void;
    getCreateCalendarOptions(): CreateCalendarOptions;
    deleteCalendar(name: string, success: (message: Object) => void, error: (message: string) => void): void;
    createEvent(title: string, eventLocation: string, notes: string, startDate: Date, endDate: Date, success: (message: Object) => void, error: (message: string) => void): void;
    createEventWithOptions(title: string, eventLocation: string, notes: string, startDate: Date, endDate: Date, options: CreateCalendarOptions, success: (message: Object) => void, error: (message: string) => void): void;
    createEventInteractively(title: string, eventLocation: string, notes: string, startDate: Date, endDate: Date, success: (message: Object) => void, error: (message: string) => void): void;
    createEventWithOptions(title: string, eventLocation: string, notes: string, startDate: Date, endDate: Date, options: CreateCalendarOptions, success: (message: Object) => void, error: (message: string) => void): void;
    createEventInNamedCalendar(title: string, eventLocation: string, notes: string, startDate: Date, endDate: Date, calendarName: string, success: (message: Object) => void, error: (message: string) => void): void;
    findEvent(title: string, eventLocation: string, notes: string, startDate: Date, endDate: Date, success: (message: Object) => void, error: (message: string) => void): void;
    findEventWithOptions(title: string, eventLocation: string, notes: string, startDate: Date, endDate: Date, options: CreateCalendarOptions, success: (message: Object) => void, error: (message: string) => void): void;
    listEventsInRange(startDate: Date, endDate: Date, success: (message: Object) => void, error: (message: string) => void): void;
    listCalendars(success: (message: { id: string, name: string }) => void, error: (message: string) => void): void;
    findAllEventsInNamedCalendar(name: string, success: (message: { id: string, name: string }) => void, error: (message: string) => void): void;
    modifyEvent(title: string, eventLocation: string, notes: string, startDate: Date, endDate: Date, newTitle: string, newEventLocation: string, newNotes: string, newStartDate: Date, newEndDate: Date, success: (message: Object) => void, error: (message: string) => void): void;
    modifyEventWithOptions(title: string, eventLocation: string, notes: string, startDate: Date, endDate: Date, newTitle: string, newEventLocation: string, newNotes: string, newStartDate: Date, newEndDate: Date, options: CreateCalendarOptions, success: (message: Object) => void, error: (message: string) => void): void;
    deleteEvent(title: string, eventLocation: string, notes: string, startDate: Date, endDate: Date, success: (message: Object) => void, error: (message: string) => void): void;
    deleteEventFromNamedCalendar(title: string, eventLocation: string, notes: string, startDate: Date, endDate: Date, calendarName: string, success: (message: Object) => void, error: (message: string) => void): void;
    deleteEventById(id: string, fromDate: Date, success: (message: Object) => void, error: (message: string) => void): void;
    openCalendar(): void;
    openCalendar(date: Date, success?: (message: Object) => void, error?: (message: string) => void): void;
    hasReadWritePermission(cb: (result: boolean) => void): void;
    requestReadWritePermission(): void;
}

declare interface CreateCalendarOptions {
    calendarName?: string;
    calendarColor?: string;
    firstReminderMinutes?: number;
    secondReminderMinutes?: number;
    recurrence?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    recurrenceEndDate?: Date;
    calendarId?: string;
    recurrenceInterval: number;
    url: string;
}