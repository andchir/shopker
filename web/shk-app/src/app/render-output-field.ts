import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ContentField } from "./models/content_field.model";
import * as _ from 'lodash';
import { isNumeric } from 'rxjs/util/isNumeric';

import { Properties } from './models/properties.iterface';

@Component({
    selector: 'output-field',
    templateUrl: 'templates/render-output-field.html',
    providers: []
})
export class OutputFieldComponent implements OnInit {

    @Input() value: string | number | boolean;
    @Input() outputType: string;
    @Input() options: {};

    constructor() {

    }

    ngOnInit(): void {
        this.updateOptions();
    }

    updateOptions(): void {

        let propertiesDefault: Properties;

        switch (this.outputType) {
            case 'date':

                propertiesDefault = {
                    format: 'mm/dd/yy'
                };
                this.options = this.extendProperties(
                    this.options,
                    propertiesDefault
                );

                break;
        }
    }

    extendProperties(object1: Properties, object2: Properties): Properties {
        object1 = _.extend({}, object2, object1);
        for (let key in object1) {
            if (object1.hasOwnProperty(key)) {
                if (isNumeric(object1[key])) {
                    object1[key] = parseInt(String(object1[key]));
                }
            }
        }
        return object1;
    }

}