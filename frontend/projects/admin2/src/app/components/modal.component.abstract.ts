import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

import {Subject, takeUntil} from 'rxjs';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {MenuItem} from 'primeng/api';

import {SimpleEntity} from '../models/simple-entity.interface';
import {FormFieldsErrors} from '../models/form-fields-options.interface';
import {DataService} from '../services/data-service.abstract';
import {FormFieldsData} from '../models/form-field.interface';
import {FileModel} from '../models/file.model';
import {SystemNameService} from '../services/system-name.service';
import {SettingPretty} from '../settings/models/setting.model';
import {AppSettingsModel} from '../models/app-settings.model';

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
    
    localeListFull: {name: string, title: string}[] = [];
    localeList: string[];
    localeDefault = '';
    localeCurrent = '';
    localeFieldsAllowed: string[] = [];
    localePreviousValues: {[fieldName: string]: string} = {};

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
        public systemNameService: SystemNameService,
        public dataService: DataService<T>
    ) {

    }

    ngOnInit(): void {
        if (this.config.data.id) {
            this.getData(this.config.data.id, this.config.data.isClone || false);
        } else {
            setTimeout(() => {
                this.updateControls();
                if (this.form.controls.isActive) {
                    this.form.controls.isActive.setValue(true);
                }
            }, 0);
        }
        this.form.valueChanges
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => this.onValueChanged('form'));
    }

    onGetData(item: T, isClone = false): void {
        this.model = item;
        if (isClone) {
            this.model.id = 0;
        }
        this.updateControls();
    }

    onDataSaved(): void {
        this.closeReason = 'updated';
        this.loading = false;
    }

    onFilesSaved(response: any): void {
        
    }

    getData(itemId: number, isClone = false): void {
        this.loading = true;
        this.dataService.getItem(itemId)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (res) => {
                    this.onGetData(res, isClone);
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
        if (this.model) {
            Object.keys(this.model).forEach((key) => {
                if (this.files[key]) {
                    data[key] = Array.isArray(this.model[key])
                        ? [ FileModel.getFileData(this.files[key]) ]
                        : FileModel.getFileData(this.files[key]);
                }
            });
        }
        if (this.model.translations && Object.keys(this.model.translations).length > 0) {
            data.translations = this.model.translations;
        }
        Object.keys(data).forEach((key) => {
            if (key.indexOf('__') > -1) {
                const tmp = key.split('__');
                if (!Number.isNaN(tmp[1] as string)) {
                    return;
                }
                if (!data[tmp[0]]) {
                    data[tmp[0]] = {};
                }
                data[tmp[0]][tmp[1]] = data[key];
                delete data[key];
            }
        });
        if (this.model.id && !data.id) {
            data.id = this.model.id;
        }
        return data;
    }

    saveRequest() {
        if (this.model && this.model.id) {
            return this.dataService.update(this.getFormData());
        } else {
            return this.dataService.create(this.getFormData());
        }
    }
    
    filesUploadRequest(formData: FormData, itemId: number) {
        return this.dataService.postFormData(formData);
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
        this.onLocaleSwitch(this.localeDefault);
        this.loading = true;
        this.saveRequest()
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (res) => {
                    if (res.id) {
                        this.model = res;
                    }
                    if (Object.keys(this.files).length > 0) {
                        this.saveFiles(res._id || res.id, '', autoClose);
                        return;
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

    saveFiles(itemId: number, ownerType = '', autoClose = false) {
        if (Object.keys(this.files).length === 0) {
            if (autoClose) {
                this.closeModal();
            }
            return;
        }
        const formData = new FormData();
        for (const key in this.files) {
            if (this.files.hasOwnProperty(key) && this.files[key] instanceof File) {
                formData.append(key, this.files[key], this.files[key].name);
            }
        }
        formData.append('itemId', String(itemId));
        formData.append('ownerType', 'category');
        this.filesUploadRequest(formData, itemId)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (res: any) => {
                    this.files = {};
                    this.onDataSaved();
                    if (autoClose) {
                        this.closeModal();
                    } else {
                        this.onFilesSaved(res);
                    }
                },
                error: (err) => {
                    this.errorMessage = err.error;
                    this.loading = false
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
        let controlValue = '';
        Object.keys(this.arrayFieldsData).forEach((key) => {
            this.arrayFields[key].clear();
        });
        Object.keys(controls).forEach((key) => {
            if (key.indexOf('__') > -1) {
                const tmp = key.split('__');
                if (!Number.isNaN(tmp[1] as string)) {
                    controlValue = this.model[key] || '';
                } else {
                    if (!this.model[tmp[0]]) {
                        this.model[tmp[0]] = {};
                    }
                    controlValue = this.model[tmp[0]][tmp[1]] ?? '';
                }
            } else {
                controlValue = this.model[key] || '';
            }
            if (Array.isArray(controlValue) && this.arrayFields[key]) {
                controlValue.forEach((value, index) => {
                    this.arrayFieldAdd(key, value);
                });
            } else {
                if (controls[key] instanceof FormArray) {
                    
                } else {
                    controls[key].setValue(controlValue || '');
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

    arrayFieldUpdate(fieldName: string, data: {[key: string]: number|string}[]): void {
        const formField = this.form.controls[fieldName];
        if (!formField || !this.arrayFields[fieldName]) {
            return;
        }
        this.arrayFields[fieldName].clear();
        data.forEach((value, index) => {
            this.arrayFieldAdd(fieldName, value);
        });
    }

    onLocaleSwitch(localeCurrent: string): void {
        if (!this.model.translations || Array.isArray(this.model.translations)) {
            this.model.translations = {};
        }
        this.saveTranslations();
        if (localeCurrent === this.localeDefault) {
            this.localeFieldsAllowed.forEach((fieldName) => {
                if (typeof this.localePreviousValues[fieldName] !== 'undefined') {
                    this.model[fieldName] = this.localePreviousValues[fieldName];
                    this.form.controls[fieldName].setValue(this.model[fieldName]);
                    delete this.localePreviousValues[fieldName];
                }
            });
            this.localeCurrent = localeCurrent;
            return;
        }
        this.localeFieldsAllowed.forEach((fieldName) => {
            this.localePreviousValues[fieldName] = this.form.controls[fieldName].value || '';
            if (this.model.translations[fieldName]) {
                this.model[fieldName] = this.model.translations[fieldName][localeCurrent] || '';
            } else {
                this.model[fieldName] = '';
            }
            this.form.controls[fieldName].setValue(this.model[fieldName]);
        });
        this.localeCurrent = localeCurrent;
    }

    saveTranslations(): void {
        if (this.localeCurrent === this.localeDefault) {
            return;
        }
        this.localeFieldsAllowed.forEach((fieldName) => {
            if (this.form.controls[fieldName].value) {
                if (!this.model.translations[fieldName]) {
                    this.model.translations[fieldName] = {};
                }
                this.model.translations[fieldName][this.localeCurrent] = this.form.controls[fieldName].value;
            } else if (this.model.translations[fieldName]) {
                if (this.model.translations[fieldName][this.localeCurrent]) {
                    delete this.model.translations[fieldName][this.localeCurrent];
                }
                if (Object.keys(this.model.translations[fieldName]).length === 0) {
                    delete this.model.translations[fieldName];
                }
            }
        });
    }
    
    createLanguageSettings(settings: AppSettingsModel): void {
        this.localeListFull = this.getLanguagesList(settings.systemSettings.SETTINGS_LANGUAGES);
        this.localeList = settings.localeList;
        if (this.localeList.length > 0) {
            this.localeDefault = this.localeList[0];
            this.localeCurrent = this.localeList[0];
        }
    }

    getLanguagesList(languages: SettingPretty[]): {name: string, title: string}[] {
        const langOptions = [];
        languages.forEach((lang) => {
            langOptions.push({
                title: lang.name,
                name: lang.options.value
            });
        });
        return langOptions;
    }

    generateName(model: any, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        const title = this.form.controls['title'] ? this.form.controls['title'].value : (model.title || '');
        const currentName = this.form.controls['name'] ? this.form.controls['name'].value : (model.name || '');
        if (currentName === 'root') {
            return;
        }
        model.name = this.systemNameService.generateName(title);
        if (this.form.controls['name']) {
            this.form.controls['name'].setValue(model.name);
        }
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
        if (event) {
            event.preventDefault();
        }
        this.ref.close(null);
    }

    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
