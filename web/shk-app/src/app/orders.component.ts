import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'shk-settings',
    templateUrl: 'templates/page_orders.html'
})
export class OrdersComponent implements OnInit {
    title = 'Заказы';

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