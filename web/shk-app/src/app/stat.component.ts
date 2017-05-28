import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'shk-settings',
    templateUrl: 'templates/page_statistics.html'
})
export class StatisticsComponent implements OnInit {
    title = 'Статистика';

    constructor(
        private titleService: Title
    ) {}

    ngOnInit(): void {
        this.setTitle( this.title );
    }

    public setTitle( newTitle: string ): void {
        this.titleService.setTitle( newTitle );
    }

}