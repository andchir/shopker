import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ContentField } from "./models/content_field.model";

import { SystemNameService } from './services/system-name.service';

@Component({
    selector: 'input-field',
    templateUrl: 'templates/render-input-field.html',
    providers: [ SystemNameService ]
})
export class InputFieldComponent implements OnInit {

    @Input() fields: ContentField[];
    @Input() model: any;
    @Input() form: FormGroup;
    @Input() submitted: boolean;
    @Input() formErrors: {};
    @Input() validationMessages: {};

    constructor(
        private systemNameService: SystemNameService,
        private dateParserFormatter: NgbDateParserFormatter
    ) {

    }

    ngOnInit(): void {
        let controls = {};
        this.fields.forEach(function(field, index){
            if(!this.model[field.name]){
                this.model[field.name] = '';
            }
            controls[field.name] = new FormControl(this.model[field.name], this.getValidators(field));
            this.setDefaultValue(field.input_type, field.name);
            this.formErrors[field.name] = '';
            this.validationMessages[field.name] = this.getValidationMessages(field);
        }.bind(this));
    }

    setDefaultValue(fieldType: string, fieldName: string) {

        switch (fieldType){
            case 'date':
                if(!this.model[fieldName]){
                    const now = new Date();
                    this.model[fieldName] =  {
                        year: now.getFullYear(),
                        month: now.getMonth() + 1,
                        day: now.getDate()
                    };
                }
                break;
        }
    }

    getValidators(field: ContentField): any[] {
        let validators = [];
        if(field.required){
            validators.push(Validators.required);
        }
        return validators;
    }

    getValidationMessages(field: ContentField): any[] {
        let messages: any = {};
        if(field.required){
            messages.required = 'This field is required.';
        }
        return messages;
    }

    generateName(model): void {
        let title = model.title || '';
        model.name = this.systemNameService.generateName(title);
    }

}