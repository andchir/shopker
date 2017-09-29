import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ContentField } from "./models/content_field.model";

@Component({
    selector: 'output-field',
    templateUrl: 'templates/render-output-field.html',
    providers: []
})
export class OutputFieldComponent implements OnInit {

    @Input() value: ContentField;
    @Input() outputType: string;
    @Input() options: {};

    constructor() {

    }

    ngOnInit(): void {
        //console.log(this.options);
    }

}