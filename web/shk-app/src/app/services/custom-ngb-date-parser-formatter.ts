import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

export class CustomNgbDateParserFormatter extends NgbDateParserFormatter {
    datePipe = new DatePipe('en-US');
    constructor(
        private dateFormatString: string) {
        super();
    }
    format(date: NgbDateStruct): string {
        if (date === null) {
            return '';
        }
        try {
            return this.datePipe.transform(new Date(date.year, date.month - 1, date.day), this.dateFormatString);
        } catch (e) {
            return '';
        }
    }
    parse(value: string): NgbDateStruct {
        let returnVal: NgbDateStruct;
        if (!value) {
            returnVal = null;
        } else {
            try {
                let dateParts = this.datePipe.transform(value, 'M-d-y').split('-');
                returnVal = {
                    year: parseInt(dateParts[2]),
                    month: parseInt(dateParts[0]),
                    day: parseInt(dateParts[1])
                };
            } catch (e) {
                returnVal = null;
            }
        }
        return returnVal;
    }
}