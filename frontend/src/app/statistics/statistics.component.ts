import {Component, OnInit} from '@angular/core';

import {StatisticsService} from './services/statistics.service';

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

    constructor(
        private dataService: StatisticsService
    ) {

    }

    ngOnInit() {
        this.getData();
    }

    getData(): void {
        this.loading = true;
        this.dataService.getStatisticsOrders(this.type)
            .subscribe((res) => {
                this.data = res;
                this.loading = false;
            }, (err) => {
                console.log(err);
                this.loading = false;
            });
    }

}
