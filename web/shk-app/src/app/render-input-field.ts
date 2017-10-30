import { Component, OnInit, Input, OnChanges, SimpleChange, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as _ from "lodash";

import { ContentField } from "./models/content_field.model";
import { SystemNameService } from './services/system-name.service';
import { MultiValues } from './models/multivalues.model';

@Component({
    selector: 'input-field-renderer',
    templateUrl: 'templates/render-input-field.html',
    providers: [ SystemNameService ]
})
export class InputFieldRenderComponent implements OnInit, OnChanges {

    @Input() fields: ContentField[];
    @Input() groups: string[];
    @Input() model: any;
    @Input() form: FormGroup;
    @Input() submitted: boolean;
    @Input() formErrors: {[key: string]: string};
    @Input() validationMessages: {[key: string]: {[key: string]: string}};
    fieldsMultivalues: {[key: string]: MultiValues} = {};

    constructor(
        private changeDetectionRef: ChangeDetectorRef,
        private systemNameService: SystemNameService
    ) {

    }

    ngOnInit(): void {
        this.buildControls();
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        this.buildControls();
    }

    buildControls() {
        this.fields.forEach(function(field){
            this.setDefaultValue(field);
            this.setFieldProperties(field);
            this.setFieldOptions(field);
            this.formErrors[field.name] = '';
            if(!this.validationMessages[field.name]){
                this.validationMessages[field.name] = {};
            }

            if (!this.form.controls[field.name]) {
                let validators = this.getValidators(field);
                let control = new FormControl(this.model[field.name], validators);
                this.form.addControl(field.name, control);
            }
        }.bind(this));
        this.changeDetectionRef.detectChanges();
    }

    setFieldProperties(field: ContentField): void {

        switch (field.inputType) {
            case 'number':

                const propertiesDefault = {
                    min: 0,
                    max: null,
                    step: 1
                };

                field.inputProperties = _.extend({}, propertiesDefault, field.inputProperties);

                break;
            default:

                break;
        }
    }

    setFieldOptions(field: ContentField): void {

        field.options = [];

        switch (field.inputType) {
            case 'radio':
            case 'checkbox':
            case 'select':

                const valueArr = field.inputProperties.values_list
                    ? field.inputProperties.values_list.split('||')
                    : [];

                this.fieldsMultivalues[field.name] = new MultiValues([], []);

                valueArr.forEach((optStr, index) => {
                    let opts = optStr.split('==');
                    field.options.push(_.zipObject(['title','value'], opts));
                    this.fieldsMultivalues[field.name].values.push(opts[1]);
                    this.fieldsMultivalues[field.name].checked.push(false);
                });

                break;
        }
    }

    setDefaultValue(field: ContentField): void {
        if(typeof this.model[field.name] !== 'undefined'){
            return;
        }

        let defaultValue = null;
        if (typeof field.inputProperties.value !== 'undefined') {
            defaultValue = field.inputProperties.value;
        }

        switch (field.inputType){
            case 'date':
                if(!this.model[field.name]){
                    const now = new Date();
                    // this.model[fieldName] = {
                    //     year: now.getFullYear(),
                    //     month: now.getMonth() + 1,
                    //     day: now.getDate()
                    // };
                    this.model[field.name] = new Date();
                }
                break;
            case 'number':

                this.model[field.name] = defaultValue;

                break;
            case 'color':

                this.model[field.name] = defaultValue;

                break;
        }
    }

    getValidators(field: ContentField): any[] {
        let validators = [];
        if(field.required){
            validators.push(Validators.required);
            this.validationMessages[field.name].required = field.title + ' is required.';
        }
        return validators;
    }

    generateName(field: ContentField): void {
        const sourceFieldName = field.inputProperties.source_field || 'title';
        const title = this.model[sourceFieldName] || '';
        this.model[field.name] = this.systemNameService.generateName(title);
        this.changeDetectionRef.detectChanges();
    }

}