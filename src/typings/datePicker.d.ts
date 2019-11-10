interface DatePicker {
    show: (options?: DatePickerOptions, ok?: (data: any) => void, err?: (err: any) => void) => void;
}

interface DatePickerOptions {
    mode?: 'date' | 'time' | 'datetime';
    date?: Date;
    minDate?: Date;
    maxDate?: Date;
    titleText?: string;
    okText?: string;
    cancelText?: string;
    todayText?: string;
    nowText?: string;
    is24Hour?: boolean;
    androidTheme?: 0 | 1 | 2 | 3 | 4;
    allowOldDates?: boolean;
    allowFutureDates?: boolean;
    doneButtonLabel?: string;
    doneButtonColor?: string;
    cancelButtonLabel?: string;
    cancelButtonColor?: string;
    x?: string;
    y?: string;
    minuteInterval?: number;
    popoverArrowDirection?: 'up' | 'down' | 'left' | 'right' | 'any';
    locale?: string;
}

declare const datePicker: DatePicker;