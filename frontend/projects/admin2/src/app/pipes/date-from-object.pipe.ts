import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';

@Pipe({
    name: 'dateFromObject'
})
export class DateFromObjectPipe implements PipeTransform {

    transform(dateObject: {date: string, timezone: string, timezone_type: number}, format: string): string {
        let date;
        if (dateObject instanceof Date) {
            date = dateObject;
        } else {
            date = this.createDate(dateObject);
        }
        return new DatePipe('en-US').transform(date, format);
    }

    createDate(dateObject: {date: string, timezone: string, timezone_type: number}): Date {
        if (typeof dateObject !== 'object' || !dateObject.date) {
            return null;
        }
        return new Date(dateObject.date);
    }
}
