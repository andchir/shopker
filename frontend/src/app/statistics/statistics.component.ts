import {Component, OnInit} from '@angular/core';

import {StatisticsService} from './services/statistics.service';
import {AppSettings} from '../services/app-settings.service';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.css'],
    providers: [StatisticsService]
})
export class StatisticsComponent implements OnInit {

    static title = 'STATISTICS';
    type = 'year';
    data: any;
    loading = false;
    rangeDates: Date[];
    locale: string;
    yearRangeString: string;
    dateFormat = 'dd.mm.yy';
    firstDayOfWeek = 0;

    constructor(
        private dataService: StatisticsService,
        private appSettings: AppSettings
    ) {
        this.rangeDates = [new Date(), new Date()];
        this.rangeDates[0].setMonth(this.rangeDates[1].getMonth() - 1);
        this.locale = this.appSettings.settings.locale;
        this.yearRangeString = [this.rangeDates[1].getFullYear() - 5, this.rangeDates[1].getFullYear()].join(':');
        if (this.locale !== 'en') {
            this.firstDayOfWeek = 1;
        }
    }

    ngOnInit() {
        this.getData();
    }

    getData(): void {
        if (!this.rangeDates[0] || !this.rangeDates[1]) {
            return;
        }
        this.loading = true;
        this.dataService.getStatisticsOrders(this.type, {
            dateFrom: this.getDateString(this.rangeDates[0]),
            dateTo: this.getDateString(this.rangeDates[1])
        })
            .subscribe((res) => {
                this.data = res;
                this.loading = false;
            }, (err) => {
                this.loading = false;
            });
    }

    getDateString(date: Date): string {
        let dateString = String(date.getFullYear());
        dateString += '-' + ('0' + (date.getMonth() + 1)).slice(-2);
        dateString += '-' + ('0' + date.getDate()).slice(-2);
        return dateString;
    }

}
