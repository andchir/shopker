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
                    format: 'yy-mm-dd H:i:s',
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
        const hourFormat = field.inputProperties && field.inputProperties.hour_format
            ? parseInt(String(field.inputProperties.hour_format))
            : 24;
        const dateFormat = field.inputProperties && field.inputProperties.format
            ? String(field.inputProperties.format)
            : '';
        const localeName = field.inputProperties && field.inputProperties.locale
            ? String(field.inputProperties.locale)
            : 'en';

        switch (field.inputType){
            case 'date':

                defaultValue = new Date();
                if (modelValue) {
                    modelValue = this.parseDateTime(modelValue, dateFormat, hourFormat, localeName);
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

    parseDateTime(text: string, dateFormat: string, hourFormat: number, localeName: string): Date {
        let date: Date,
            parts: string[] = text.replace('T',' ').split(' ');

        date = this.parseDate(parts[0], dateFormat, localeName);
        if (parts.length > 1) {
            parts[1] = parts[1].replace(/[^\d.:]/g, '');
            parts[2] = parts[2] ? parts[2].toUpperCase() : '';
            this.populateTime(date, hourFormat, parts[1], parts[2]);
        }
        return date;
    }

    populateTime(value: Date, hourFormat: number, timeString: string, ampm: string) {
        let time = this.parseTime(timeString, hourFormat, ampm);
        value.setHours(time.hour);
        value.setMinutes(time.minute);
        value.setSeconds(time.second);
    }

    parseTime(value: string, hourFormat: number, ampm: string) {
        const pm = (ampm === 'PM');
        let tokens: string[] = value.split(':');
        let h = parseInt(tokens[0]);
        let m = parseInt(tokens[1]);
        let s = tokens[2] ? parseInt(tokens[2]) : 0;
        if(isNaN(h) || isNaN(m)) {
            return {hour: 0, minute: 0, second: 0};
        }
        else {
            if(hourFormat == 12 && h !== 12 && pm) {
                h+= 12;
            }
            return {hour: h, minute: m, second: s};
        }
    }

    getDaysCountInMonth(month: number, year: number) {
        return 32 - this.daylightSavingAdjust(new Date(year, month, 32)).getDate();
    }

    daylightSavingAdjust(date) {
        if(!date) {
            return null;
        }
        date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
        return date;
    }

    // Ported from jquery-ui datepicker parseDate
    parseDate(value: string, format: string, localeName: string): Date {
        const optShortYearCutoff = '+10';
        const ticksTo1970 = (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
            Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000);
        const utc = false;
        if(format == null || value == null) {
            throw "Invalid arguments";
        }

        value = (typeof value === "object" ? String(value) : value + "");
        if(value === "") {
            return null;
        }

        let iFormat, dim, extra,
            iValue = 0,
            shortYearCutoff = (typeof optShortYearCutoff !== "string"
                ? optShortYearCutoff
                : new Date().getFullYear() % 100 + parseInt(optShortYearCutoff, 10)),
            year = -1,
            month = -1,
            day = -1,
            doy = -1,
            literal = false,
            date,
            lookAhead = (match) => {
                let matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
                if(matches) {
                    iFormat++;
                }
                return matches;
            },
            getNumber = (match) => {
                let isDoubled = lookAhead(match),
                    size = (match === "@" ? 14 : (match === "!" ? 20 :
                        (match === "y" && isDoubled ? 4 : (match === "o" ? 3 : 2)))),
                    minSize = (match === "y" ? size : 1),
                    digits = new RegExp("^\\d{" + minSize + "," + size + "}"),
                    num = value.substring(iValue).match(digits);
                if(!num) {
                    throw "Missing number at position " + iValue;
                }
                iValue += num[ 0 ].length;
                return parseInt(num[ 0 ], 10);
            },
            getName = (match, shortNames, longNames) => {
                let index = -1;
                let arr = lookAhead(match) ? longNames : shortNames;
                let names = [];

                for(let i = 0; i < arr.length; i++) {
                    names.push([i,arr[i]]);
                }
                names.sort((a,b) => {
                    return -(a[ 1 ].length - b[ 1 ].length);
                });

                for(let i = 0; i < names.length; i++) {
                    let name = names[i][1];
                    if(value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
                        index = names[i][0];
                        iValue += name.length;
                        break;
                    }
                }

                if(index !== -1) {
                    return index + 1;
                } else {
                    throw "Unknown name at position " + iValue;
                }
            },
            checkLiteral = () => {
                if(value.charAt(iValue) !== format.charAt(iFormat)) {
                    throw "Unexpected literal at position " + iValue;
                }
                iValue++;
            };

        for (iFormat = 0; iFormat < format.length; iFormat++) {
            if(literal) {
                if(format.charAt(iFormat) === "'" && !lookAhead("'")) {
                    literal = false;
                } else {
                    checkLiteral();
                }
            } else {
                switch (format.charAt(iFormat)) {
                    case "d":
                        day = getNumber("d");
                        break;
                    case "D":
                        getName("D", this.calendarLocale[localeName].dayNamesShort, this.calendarLocale[localeName].dayNames);
                        break;
                    case "o":
                        doy = getNumber("o");
                        break;
                    case "m":
                        month = getNumber("m");
                        break;
                    case "M":
                        month = getName("M", this.calendarLocale[localeName].monthNamesShort, this.calendarLocale[localeName].monthNames);
                        break;
                    case "y":
                        year = getNumber("y");
                        break;
                    case "@":
                        date = new Date(getNumber("@"));
                        year = date.getFullYear();
                        month = date.getMonth() + 1;
                        day = date.getDate();
                        break;
                    case "!":
                        date = new Date((getNumber("!") - ticksTo1970) / 10000);
                        year = date.getFullYear();
                        month = date.getMonth() + 1;
                        day = date.getDate();
                        break;
                    case "'":
                        if(lookAhead("'")) {
                            checkLiteral();
                        } else {
                            literal = true;
                        }
                        break;
                    default:
                        checkLiteral();
                }
            }
        }

        if(iValue < value.length) {
            extra = value.substr(iValue);
            if(!/^\s+/.test(extra)) {
                throw "Extra/unparsed characters found in date: " + extra;
            }
        }

        if(year === -1) {
            year = new Date().getFullYear();
        } else if(year < 100) {
            year += new Date().getFullYear() - new Date().getFullYear() % 100 +
                (year <= shortYearCutoff ? 0 : -100);
        }

        if(doy > -1) {
            month = 1;
            day = doy;
            do {
                dim = this.getDaysCountInMonth(year, month - 1);
                if(day <= dim) {
                    break;
                }
                month++;
                day -= dim;
            } while (true);
        }

        if (utc)
            date = new Date(Date.UTC(year, month - 1, day));
        else
            date = this.daylightSavingAdjust(new Date(year, month - 1, day));

        if(date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
            throw "Invalid date"; // E.g. 31/02/00
        }
        return date;
    }

}