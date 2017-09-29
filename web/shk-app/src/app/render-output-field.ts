import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ContentField } from "./models/content_field.model";

@Component({
    selector: 'output-field',
    templateUrl: 'templates/render-output-field.html',
    providers: []
})
export class OutputFieldComponent implements OnInit {

    @Input() field: ContentField;
    @Input() fieldName: string;
    @Input() outputType: string;

    constructor() {

    }

    ngOnInit(): void {

    }

}