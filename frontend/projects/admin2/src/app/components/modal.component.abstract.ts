import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

import {Subject, takeUntil} from 'rxjs';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {MenuItem} from 'primeng/api';

import {SimpleEntity} from '../models/simple-entity.interface';
import {FormFieldsErrors} from '../models/form-fields-options.interface';
import {DataService} from '../services/data-service.abstract';
import {FormFieldsData} from '../models/form-field.interface';
import {FileModel} from "../models/file.model";

@Component({
    template: ''
})
export abstract class AppModalAbstractComponent<T extends SimpleEntity> implements OnInit, OnDestroy {

    @ViewChild('formEl') formEl: ElementRef;
    protected _formFieldsErrors: FormFieldsErrors = {};
    loading = false;
    model: T;
    files: {[key: string]: File} = {};
    form: FormGroup;
    arrayFields: {[key: string]: any} = {};
    arrayFieldsData: {[key: string]: FormFieldsData} = {};
    destroyed$ = new Subject<void>();
    errorMessage = '';
    buttonMenuItems: MenuItem[];
    closeReason = 'canceled';

    set formFieldsErrors(formFieldsErrors: FormFieldsErrors) {
        for (const key in formFieldsErrors) {
            if (formFieldsErrors.hasOwnProperty(key)) {
                const control = this.form.get(key);
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
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public dataService: DataService<T>
    ) {

    }

    onGetData(item: T): void {
        this.model = item;
    }

    onDataSaved(): void {
        this.closeReason = 'updated';
        this.loading = false;
    }

    ngOnInit(): void {
        if (this.config.data.id) {
            this.getData(this.config.data.id);
        }
        this.form.valueChanges
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => this.onValueChanged('form'));
    }

    getData(itemId: number): void {
        this.loading = true;
        this.dataService.getItem(itemId)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (res) => {
                    this.onGetData(res);
                    this.updateControls();
                    setTimeout(() => {
                        this.loading = false;
                    }, 300);
                },
                error: (err) => {
                    if (err.error) {
                        this.errorMessage = err.error;
                    }
                    this.loading = false;
                }
            });
    }

    getFormData(): any {
        const data = this.form.value;
        Object.keys(this.model).forEach((key) => {
            if (this.files[key]) {
                data[key] = Array.isArray(this.model[key])
                    ? [ FileModel.getFileData(this.files[key]) ]
                    : FileModel.getFileData(this.files[key]);
            }
        });
        return data;
    }

    saveRequest() {
        if (this.model && this.model.id) {
            return this.dataService.update(this.getFormData());
        } else {
            return this.dataService.create(this.getFormData());
        }
    }

    saveData(autoClose = false, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.errorMessage = '';
        if (!this.form.valid) {
            this.formGroupMarkTouched(this.form);
            this.focusFormError();
            return;
        }
        this.loading = true;
        this.saveRequest()
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (res) => {
                    if (res.id) {
                        this.model = res;
                    }
                    this.onDataSaved();
                    if (autoClose) {
                        this.closeModal();
                    }
                },
                error: (err) => {
                    if (err.error) {
                        this.errorMessage = err.error;
                    }
                    if (err.errors) {
                        this.formFieldsErrors = err.errors;
                        this.focusFormError();
                    }
                    this.loading = false;
                }
            });
    }

    formGroupMarkTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(key => {
            formGroup.controls[key].markAsTouched();
            formGroup.controls[key].markAsDirty();
            if (formGroup.controls[key] instanceof FormArray) {
                Array.from((this.form.controls[key] as FormArray).controls).forEach((group: FormGroup) => {
                    this.formGroupMarkTouched(group);
                });
            }
        });
    }

    updateControls(): void {
        const controls = this.form.controls;
        Object.keys(controls).forEach((key) => {
            if (typeof this.model[key] !== 'undefined') {
                if (Array.isArray(this.model[key]) && this.arrayFields[key]) {
                    this.model[key].forEach((value, index) => {
                        this.arrayFieldAdd(key, value);
                    });
                } else {
                    controls[key].setValue(this.model[key]);
                }
            }
        });
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

    buildFormGroup(fieldName: string, data: {[key: string]: number|string}): FormGroup {
        if (!this.arrayFieldsData[fieldName]) {
            return new FormGroup({});
        }
        const controlsObj = {};
        for (let key in this.arrayFieldsData[fieldName]) {
            if (!this.arrayFieldsData[fieldName].hasOwnProperty(key)) {
                continue;
            }
            controlsObj[key] = new FormControl(data[key] || '', this.arrayFieldsData[fieldName][key].validators);
        }
        return new FormGroup(controlsObj);
    }

    arrayFieldAdd(fieldName: string, data?: {[key: string]: number|string}, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        if (!data) {
            data = {};
        }
        const formField = this.form.controls[fieldName];
        if (!formField || !this.arrayFields[fieldName]) {
            return;
        }
        const groupControls = this.buildFormGroup(fieldName, data);
        this.arrayFields[fieldName].push(groupControls);
    }

    arrayFieldDelete(fieldName: string, index: number, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.arrayFields[fieldName].removeAt(index);
    }

    focusFormError(): void {
        setTimeout(() => {
            if (this.formEl.nativeElement.querySelector('input.ng-invalid, textarea.ng-invalid')) {
                this.formEl.nativeElement.querySelector('input.ng-invalid, textarea.ng-invalid').focus();
            }
        }, 1);
    }

    onValueChanged(formName?: string): void {
        if (!this[formName]) {
            return;
        }
        if (this[formName].valid) {
            this.formFieldsErrors = {};
        }
    }

    closeModal(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.ref.close(this.closeReason);
    }

    dismissModal(event?: MouseEvent): void {
        this.ref.close(null);
    }

    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
