import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

    static createDate(dateObject: {date: string, timezone: string, timezone_type: number}): Date {
        if (typeof dateObject !== 'object' || !dateObject.date) {
            return null;
        }
        return new Date(dateObject.date);
    }

    constructor() {
    }
}
