import {Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';

import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';

import {SimpleEntity} from '../models/simple-entity.interface';
import {FormFieldsErrors, FormFieldsOptions} from '../models/form-fields-options.interface';
import {DataService} from '../services/data-service.abstract';

export abstract class AppModalContentAbstractComponent<T extends SimpleEntity> implements OnInit, OnDestroy {

    @Input() modalTitle: string;
    @Input() itemId: number | null;
    @Input() isItemCopy: boolean;
    @Input() isEditMode: boolean;
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

    set formErrors(formFieldsErrors: FormFieldsErrors) {
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

    get formErrors() {
        return this._formFieldsErrors;
    }

    constructor(
        public fb: FormBuilder,
        public activeModal: NgbActiveModal,
        public translateService: TranslateService,
        public dataService: DataService<T>
    ) {}

    ngOnInit(): void {
        this.onBeforeInit();
        this.buildForm();
        if (this.isEditMode || this.isItemCopy) {
            this.getModelData().then(() => {
                this.onAfterGetData();
            });
        } else {
            this.onAfterGetData();
        }
        this.onAfterInit();
    }

    onBeforeInit(): void {}
    onAfterInit(): void {}

    onAfterGetData(): void {
        this.buildControls(this.formFields);
    }

    getSystemFieldName(): string {
        return '';
    }

    getLangString(value: string): string {
        const translations = this.translateService.store.translations[this.translateService.currentLang];
        return translations[value] || value;
    }

    getModelData(): Promise<T> {
        this.loading = true;
        return new Promise((resolve, reject) => {
            this.dataService.getItem(this.itemId)
                .pipe(takeUntil(this.destroyed$))
                .subscribe({
                    next: (data: T) => {
                        if (this.isItemCopy) {
                            data.id = null;
                            const systemFieldName = this.getSystemFieldName();
                            if (systemFieldName) {
                                data[systemFieldName] = '';
                            }
                        }
                        Object.assign(this.model, data);
                        this.loading = false;
                        resolve(data as T);
                    },
                    error: (err) => {
                        this.errorMessage = err.error || this.getLangString('ERROR');
                        this.loading = false;
                        reject(err);
                    }
                });
        });
    }

    buildForm(): void {
        this.form = this.fb.group(this.buildControls(this.formFields));
        this.form.valueChanges
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => this.onValueChanged());
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

    onValueChanged(formName = 'form'): void {
        if (!this[formName]) {
            return;
        }
        if (this[formName].valid) {
            this.errorMessage = '';
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

    focusFormError(): void {
        setTimeout(() => {
            if (this.formEl.nativeElement.querySelector('.form-control.is-invalid')) {
                this.formEl.nativeElement.querySelector('.form-control.is-invalid').focus();
            }
        }, 1);
    }

    formGroupMarkTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(key => {
            formGroup.controls[key].markAsTouched();
            if (formGroup.controls[key] instanceof FormArray) {
                Array.from((this.form.controls[key] as FormArray).controls).forEach((group: FormGroup) => {
                    this.formGroupMarkTouched(group);
                });
            }
        });
    }

    close(reason = 'close', event?: MouseEvent) {
        if (event) {
            event.preventDefault();
        }
        this.activeModal.dismiss(reason);
    }

    getSaveRequest(data): Observable<T> {
        // if (Object.keys(this.files).length > 0) {
        //     return this.dataService.postFormData(this.dataService.createFormData(data));
        // } else
        if (data.id) {
            return this.dataService.update(data);
        } else {
            return this.dataService.create(data);
        }
    }

    getFormData(): T {
        const data = this.form.value;
        data.id = this.model.id || 0;
        for (const key in this.files) {
            if (this.files.hasOwnProperty(key)) {
                data[key] = this.files[key];
            }
        }
        return data as T;
    }

    save(autoClose = false, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.onSubmit(autoClose);
    }

    onSubmit(autoClose = false): void {
        this.formGroupMarkTouched(this.form);
        if (!this.form.valid) {
            this.errorMessage = this.getLangString('PLEASE_FIX_FORM_ERRORS');
            this.focusFormError();
            return;
        }
        this.errorMessage = '';
        this.loading = true;
        this.submitted = true;

        const data = this.getFormData();

        this.getSaveRequest(data)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (res) => {
                    if (autoClose) {
                        this.close('submit');
                    }
                    this.loading = false;
                    this.submitted = false;
                },
                error: (err) => {
                    if (err.error) {
                        this.errorMessage = err.error;
                    }
                    if (err.errors) {
                        this.formErrors = err.errors;
                        this.errorMessage = this.getLangString('PLEASE_FIX_FORM_ERRORS');
                    }
                    this.loading = false;
                    this.submitted = false;
                }
            });
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
