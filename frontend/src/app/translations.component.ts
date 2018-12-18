import {Component, forwardRef, Input, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import {NgbAccordion} from '@ng-bootstrap/ng-bootstrap';
import {EntityTranslation} from './models/entity-translation';

const customValueProvider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TranslationsComponent),
    multi: true
};

@Component({
    selector: 'app-translations',
    templateUrl: './templates/translations.component.html',
    providers: [customValueProvider]
})
export class TranslationsComponent implements ControlValueAccessor {

    @ViewChild('accordionTranslations') accordionTranslations: NgbAccordion;
    translations: {[fieldName: string]: EntityTranslation[]} = {};
    translateTimer: any;
    _value: {[fieldName: string]: {[lang: string]: string}}|null = {};

    constructor() {

    }

    propagateChange:any = () => {};

    writeValue(value: any) {
        if (value) {
            this._value = value;
            this.translationsSyncInit();
        }
    }

    registerOnChange(fn) {
        this.propagateChange = fn;
    }
    registerOnTouched(fn: () => void): void { }

    onChange(event){
        this.propagateChange(event.target.value);
    }

    addTranslation(fieldName: string): void {
        if (!this.translations[fieldName]) {
            this.translations[fieldName] = [];
        }
        this.translations[fieldName].push({lang: '', value: ''});
        this.translationsSync();
        setTimeout(() => {
            this.accordionTranslations.expand('accordion-translations');
        }, 1);
        console.log('addTranslation', fieldName);
    }

    removeTranslation(fieldName: string, index: number, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        if (!this.translations[fieldName]) {
            return;
        }
        this.translations[fieldName].splice(index, 1);
        if (this.translations[fieldName].length === 0) {
            delete this.translations[fieldName];
        }
        this.translationsSync();
    }

    translationsSyncInit(): void {
        if (!this._value) {
            return;
        }
        const fields = Object.keys(this._value);
        fields.forEach((fieldName) => {
            this.translations[fieldName] = [];
            Object.keys(this._value[fieldName]).forEach((lang) => {
                const value = this._value[fieldName][lang];
                this.translations[fieldName].push({lang: lang, value: value});
            });
        });
    }

    translationsSync(): void {
        const langs = Object.keys(this.translations);
        if (langs.length === 0) {
            this._value = null;
            return;
        }
        if (!this._value) {
            this._value = {};
        }
        Object.keys(this._value).forEach((fieldName) => {
            Object.keys(this._value[fieldName]).forEach((lang) => {
                if (langs.indexOf(lang) === -1) {
                    delete this._value[fieldName][lang];
                }
                if (Object.keys(this._value[fieldName]).length === 0) {
                    delete this._value[fieldName];
                }
            });
        });
        Object.keys(this.translations).forEach((fieldName) => {
            this.translations[fieldName].forEach((translation) => {
                if (!translation.lang) {
                    return;
                }
                if (!this._value[fieldName]) {
                    this._value[fieldName] = {};
                }
                this._value[fieldName][translation.lang] = translation.value;
            });
        });
    }

    onUpdateTranslation(): void {
        clearTimeout(this.translateTimer);
        this.translateTimer = setTimeout(() => {
            this.translationsSync();
        }, 500);
    }
}
