import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'dateFromObject'
})
export class DateFromObject implements PipeTransform {

    transform(dateObject: {date: string, timezone: string, timezone_type: number}, format: string): string {
        let date = this.createDate(dateObject);
        return new DatePipe('en-US').transform(date, format);
    }

    createDate(dateObject: {date: string, timezone: string, timezone_type: number}): Date {
        if (typeof dateObject !== 'object' || !dateObject.date) {
            return null;
        }
        return new Date(dateObject.date);
    }
}