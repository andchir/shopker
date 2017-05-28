import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'shk-settings',
    templateUrl: 'templates/page_settings.html'
})
export class SettingsComponent implements OnInit {
    title = 'Настройки';

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