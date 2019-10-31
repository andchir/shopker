import {OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {SimpleEntity} from '../models/simple-entity.interface';
import {FormFieldsErrors, FormFieldsOptions} from '../models/form-fields-options.interface';
import {DataService} from '../services/data-service.abstract';

export abstract class AppModalContentAbstractComponent<T extends SimpleEntity> implements OnInit, OnDestroy {

    @ViewChild('formEl', {static: false}) formEl;
    private _formFieldsErrors: FormFieldsErrors = {};
    form: FormGroup;
    submitted = false;
    loading = false;
    errorMessage: string;
    files: {[key: string]: File} = {};
    model: T;
    formFields: FormFieldsOptions[] = [];
    arrayFields: {[key: string]: any} = {};
    destroyed$ = new Subject<void>();

    set formFieldsErrors(formFieldsErrors: FormFieldsErrors) {
        for (const key in formFieldsErrors) {
            if (formFieldsErrors.hasOwnProperty(key)) {
                const control = this.getControl(null, key);
                if (control) {
                    control.setErrors({incorrect: true});
                }
            }
        }
        this._formFieldsErrors = formFieldsErrors;
    }

    get formFieldsErrors() {
        return this._formFieldsErrors;
    }

    constructor(
        public fb: FormBuilder,
        public dataService: DataService<T>
    ) {}

    ngOnInit(): void {
        this.buildForm();
    }

    onAfterGetData(): void {
        this.buildControls(this.formFields);
    }

    buildForm(): void {
        this.form = this.fb.group(this.buildControls(this.formFields));
        this.form.valueChanges
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => this.onValueChanged('form'));
    }

    buildControls(options: FormFieldsOptions[], modelName = 'model'): { [k: string]: FormControl; } {
        const controls = {};
        if (!this[modelName].options) {
            this[modelName].options = {};
        }
        options.forEach((opt) => {
            const control = this.getControl(opt);
            const value = opt.name.indexOf('options_') === 0
                ? this[modelName].options[opt.name.substr(8)] || ''
                : this[modelName][opt.name] || '';
            if (control) {
                if (opt.disabled) {
                    control.disable();
                }
                if (opt.children) {
                    const valueArr = value as Array<any>;
                    const arrayControl = control as FormArray;
                    arrayControl.clear();
                    valueArr.forEach((val, ind) => {
                        const formFields = this.getFormFieldByName(opt.name);
                        const groupControls = this.buildControls(formFields.children);
                        arrayControl.push(this.fb.group(groupControls));
                    });
                    arrayControl.patchValue(valueArr);
                } else {
                    control.setValue(value);
                }
            } else {
                if (opt.children) {
                    controls[opt.name] = this.fb.array([]);
                    this.createArrayFieldsProperty(opt.name);
                } else {
                    controls[opt.name] = this.fb.control({
                        value,
                        disabled: opt.disabled || false
                    }, opt.validators);
                }
            }
        });
        return controls;
    }

    onValueChanged(formName?: string): void {
        if (!this[formName]) {
            return;
        }
        if (this[formName].valid) {
            // this.alertsClear();
        }
    }

    getFormFieldByName(fieldName: string) {
        const formFields = this.formFields.filter((formField) => {
            return formField.name === fieldName;
        });
        return formFields.length > 0 ? formFields[0] : null;
    }

    createArrayFieldsProperty(key): void {
        Object.defineProperty(this.arrayFields, key, {
            get: () => {
                if (!this.form) {
                    return null;
                }
                return this.form.get(key) as FormArray;
            }
        });
    }

    getControl(opt?: FormFieldsOptions, fieldName?: string): AbstractControl {
        if (!this.form) {
            return null;
        }
        if (fieldName) {
            return this.form.get(fieldName);
        }
        return this.form.get(opt.name);
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
