import { Component, OnInit, Input, OnChanges, SimpleChange, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { isNumeric } from 'rxjs/util/isNumeric';

import { ContentField } from "./models/content_field.model";
import { SystemNameService } from './services/system-name.service';
import { MultiValues } from './models/multivalues.model';
import { Properties } from './models/properties.iterface';

@Component({
    selector: 'input-field-renderer',
    templateUrl: 'templates/render-input-field.html',
    providers: [ SystemNameService ]
})
export class InputFieldRenderComponent implements OnInit, OnChanges {

    static extendProperties(object1: Properties, object2: Properties): Properties {
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

    @Input() fields: ContentField[];
    @Input() groups: string[];
    @Input() model: any;
    @Input() form: FormGroup;
    @Input() submitted: boolean;
    @Input() formErrors: {[key: string]: string};
    @Input() validationMessages: {[key: string]: {[key: string]: string}};
    fieldsMultivalues: {[key: string]: MultiValues} = {};
    calendarLocale = {
        en: {
            firstDayOfWeek: 0,
            dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            dayNamesMin: ['Su','Mo','Tu','We','Th','Fr','Sa'],
            monthNames: [ 'January','February','March','April','May','June','July','August','September','October','November','December' ],
            monthNamesShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
            today: 'Today',
            clear: 'Clear'
        },
        ru: {
            firstDayOfWeek: 1,
            dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
            dayNamesShort: ['Вос', 'Пон', 'Втор', 'Среда', 'Чет', 'Пятн', 'Суб'],
            dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            monthNames: [ 'Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь' ],
            monthNamesShort: [ 'Янв', 'Февр', 'Мар', 'Апр', 'Май', 'Июнь','Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек' ],
            today: 'Сегодня',
            clear: 'Сбросить'
        }
    };

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
            this.setFieldProperties(field);
            this.setFieldOptions(field);
            this.setValue(field);
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

        let propertiesDefault: Properties;

        switch (field.inputType) {
            case 'number':

                propertiesDefault = {
                    handler: '',
                    min: null,
                    max: null,
                    step: 1
                };
                field.inputProperties = InputFieldRenderComponent.extendProperties(
                    field.inputProperties,
                    propertiesDefault
                );

                break;
            case 'date':

                propertiesDefault = {
                    handler: '',
                    format: 'mm/dd/yy',
                    show_time: 0,
                    hour_format: 24,
                    locale: 'en'
                };
                field.inputProperties = InputFieldRenderComponent.extendProperties(
                    field.inputProperties,
                    propertiesDefault
                );

                break;
            default:

                break;
        }
    }

    setFieldOptions(field: ContentField): void {

        field.options = [];
        let valueArr;

        switch (field.inputType) {
            case 'radio':
            case 'select':

                valueArr = field.inputProperties.values_list
                    ? String(field.inputProperties.values_list).split('||')
                    : [];
                valueArr.forEach((optStr, index) => {
                    let opts = optStr.split('==');
                    if (!opts[1]) {
                        opts[1] = opts[0];
                    }
                    field.options.push(_.zipObject(['title','value'], opts));
                });

                break;
            case 'checkbox':

                valueArr = field.inputProperties.values_list
                    ? String(field.inputProperties.values_list).split('||')
                    : [];

                if (!_.isArray(this.model[field.name])) {
                    this.model[field.name] = [];
                }

                this.fieldsMultivalues[field.name] = new MultiValues([], []);
                valueArr.forEach((optStr, index) => {
                    let opts = optStr.split('==');
                    if (!opts[1]) {
                        opts[1] = opts[0];
                    }
                    field.options.push(_.zipObject(['title','value'], opts));
                    this.fieldsMultivalues[field.name].values.push(opts[1]);
                    this.fieldsMultivalues[field.name].checked.push(this.model[field.name].indexOf(opts[1]) > -1);
                });

                break;
        }
    }

    setValue(field: ContentField): void {
        let defaultValue = null,
            modelValue = this.model[field.name] || null;
        if (typeof field.inputProperties.value !== 'undefined') {
            defaultValue = field.inputProperties.value;
        }

        switch (field.inputType){
            case 'date':

                defaultValue = new Date();
                if (modelValue) {
                    modelValue = new Date(modelValue);
                }

                break;
            case 'number':
                defaultValue = parseInt(String(defaultValue));
                break;
            case 'checkbox':
                defaultValue = defaultValue ? defaultValue.split('||') : [];
                break;
        }
        this.model[field.name] = modelValue || defaultValue;
    }

    selectValue(e, fieldName: string, value: string): void {
        if (!_.isArray(this.model[fieldName])) {
            this.model[fieldName] = [];
        }
        const valIndex = this.fieldsMultivalues[fieldName].values.indexOf(value);
        if (valIndex === -1) {
            return;
        }
        if (e.target.checked) {
            this.model[fieldName].push(value);
            this.fieldsMultivalues[fieldName].checked[valIndex] = true;
        } else {
            this.model[fieldName].splice(this.model[fieldName].indexOf(value), 1);
            this.fieldsMultivalues[fieldName].checked[valIndex] = false;
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