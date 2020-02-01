import {ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
    @Input() modalId = '';
    @Input() isItemCopy: boolean;
    @Input() isEditMode: boolean;
    @ViewChild('formEl', {static: false}) formEl;

    private _formFieldsErrors: FormFieldsErrors = {};
    form: FormGroup;
    submitted = false;
    loading = false;
    errorMessage: string;
    closeReason = 'canceled';
    files: {[key: string]: File} = {};
    model: T;
    formFields: FormFieldsOptions[] = [];
    arrayFields: {[key: string]: any} = {};
    isSaveButtonDisabled = false;
    localeList: string[];
    localeDefault = '';
    localeCurrent = '';
    localeFieldsAllowed: string[] = [];
    localePreviousValues: {[fieldName: string]: string} = {};
    uniqueId = '';
    destroyed$ = new Subject<void>();

    set formErrors(formFieldsErrors: FormFieldsErrors) {
        for (const key in formFieldsErrors) {
            if (formFieldsErrors.hasOwnProperty(key)) {
                const control = this.getControl(this.form, null, key);
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
        public dataService: DataService<T>,
        public elRef: ElementRef
    ) {}

    ngOnInit(): void {
        this.uniqueId = this.createUniqueId();
        if (this.elRef) {
            this.getRootElement().setAttribute('id', this.modalId);
        }
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
        this.buildControls(this.form, this.formFields);
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
        this.form = this.fb.group(this.buildControls(null, this.formFields));
        this.form.valueChanges
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => this.onValueChanged());
    }

    buildControls(formGroup: FormGroup, options: FormFieldsOptions[], modelName = 'model'): { [k: string]: FormControl; } {
        const controls = {};
        if (typeof formGroup === 'undefined') {
            formGroup = this.form || null;
        }
        options.forEach((opt) => {
            const control = this.getControl(formGroup, opt);
            let value = null;
            if (modelName && this[modelName]) {
                if (!this[modelName].options) {
                    this[modelName].options = {};
                }
                value = opt.name.indexOf('options_') === 0
                    ? this[modelName].options[opt.name.substr(8)] || null
                    : this[modelName][opt.name] || null;
            } else {
                value = null;
            }
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
                        const groupControls = this.buildControls(null, formFields.children, null);
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
        const data = this[formName].value;
        Object.keys(data).forEach((fieldName) => {
            this.formErrors[fieldName] = '';
            const control = this.getControl(this.form, null, fieldName);
            if (control && !control.valid && control.errors) {
                let message = '';
                Object.keys(control.errors).forEach((errorKey) => {
                    message += (message ? ' ' : '') + this.getLangString('INVALID_' + errorKey.toUpperCase());
                });
                this.formErrors[fieldName] = message;
            }
        });
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

    getControl(formGroup: FormGroup, opt?: FormFieldsOptions|null, fieldName?: string): AbstractControl {
        if (!formGroup) {
            return null;
        }
        if (fieldName) {
            return formGroup.get(fieldName);
        }
        return formGroup.get(opt.name);
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

    getSaveRequest(data): Observable<T> {
        // if (Object.keys(this.files).length > 0) {
        //     return this.dataService.postFormData(this.dataService.createFormData(data));
        // } else
        if (data.id || data.name === 'root') {
            return this.dataService.update(data);
        } else {
            return this.dataService.create(data);
        }
    }

    getFormData(): T {
        const data = this.form.value;
        data.id = this.model.id || 0;
        if (typeof this.model.translations !== 'undefined') {
            data.translations = this.model.translations || null;
        }
        return data as T;
    }

    arrayFieldDelete(fieldName: string, index: number, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.arrayFields[fieldName].removeAt(index);
    }

    arrayFieldAdd(fieldName: string, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        const formField = this.getFormFieldByName(fieldName);
        if (!formField) {
            return;
        }
        const groupControls = this.buildControls(null, formField.children, null);
        this.arrayFields[fieldName].push(this.fb.group(groupControls));
    }

    closeModal(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.close(this.closeReason);
    }

    close(reason: string, event?: MouseEvent) {
        if (event) {
            event.preventDefault();
        }
        if (reason === 'submit') {
            this.activeModal.close(reason);
        } else {
            this.activeModal.dismiss(reason);
        }
    }

    minimize(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        window.document.body.classList.remove('modal-open');
        const modalEl = this.getRootElement();
        const backdropEl = modalEl.previousElementSibling;

        modalEl.classList.remove('d-block');
        modalEl.classList.add('modal-minimized');
        backdropEl.classList.add('d-none');
    }

    maximize(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        window.document.body.classList.add('modal-open');
        const modalEl = this.getRootElement();
        const backdropEl = modalEl.previousElementSibling;

        modalEl.classList.add('d-block');
        modalEl.classList.remove('modal-minimized');
        backdropEl.classList.remove('d-none');
    }

    save(autoClose = false, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.onSubmit(autoClose);
    }

    saveFiles(itemId: number) {
        if (Object.keys(this.files).length === 0) {
            this.close('submit');
            return;
        }

        const formData: FormData = new FormData();
        for (const key in this.files) {
            if (this.files.hasOwnProperty(key) && this.files[key] instanceof File) {
                formData.append(key, this.files[key], this.files[key].name);
            }
        }
        formData.append('itemId', String(itemId));

        this.dataService.postFormData(formData)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: () => {
                    this.close('submit');
                },
                error: (err) => {
                    this.errorMessage = err.error || this.getLangString('ERROR');
                    this.submitted = false;
                    this.loading = false
                }
            });
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
                    if (Object.keys(this.files).length > 0) {
                        this.saveFiles(res._id || res.id);
                    } else if (autoClose) {
                        this.close('submit');
                    }
                    if (res && res['id']) {
                        this.model.id = res['id'];
                    }
                    this.closeReason = 'updated';
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

    onLocaleSwitch(): void {
        if (this.localeCurrent === this.localeDefault) {
            this.localeFieldsAllowed.forEach((fieldName) => {
                this.model[fieldName] = this.localePreviousValues[fieldName];
                this.getControl(this.form, null, fieldName).setValue(this.localePreviousValues[fieldName]);
            });
            this.isSaveButtonDisabled = false;
            return;
        }
        if (!this.model.translations) {
            this.model.translations = {};
        }
        this.isSaveButtonDisabled = true;
        this.localeFieldsAllowed.forEach((fieldName) => {
            this.localePreviousValues[fieldName] = this.getControl(this.form, null, fieldName).value;
            if (this.model.translations[fieldName]) {
                this.model[fieldName] = this.model.translations[fieldName][this.localeCurrent] || '';
                this.getControl(this.form, null, fieldName).setValue(this.model[fieldName]);
            } else {
                this.model[fieldName] = '';
                this.getControl(this.form, null, fieldName).setValue('');
            }
        });
    }

    saveTranslations(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.localeFieldsAllowed.forEach((fieldName) => {
            if (this.getControl(this.form, null, fieldName) && this.getControl(this.form, null, fieldName).value) {
                if (!this.model.translations[fieldName]) {
                    this.model.translations[fieldName] = {};
                }
                this.model.translations[fieldName][this.localeCurrent] = this.getControl(this.form, null, fieldName).value;
            } else {
                if (this.model.translations[fieldName]) {
                    if (this.model.translations[fieldName][this.localeCurrent]) {
                        delete this.model.translations[fieldName][this.localeCurrent];
                    }
                    if (Object.keys(this.model.translations[fieldName]).length === 0) {
                        delete this.model.translations[fieldName];
                    }
                }
            }
        });
        this.localeCurrent = this.localeDefault;
        this.onLocaleSwitch();
    }

    emailValidator(control: FormControl): { [s: string]: boolean } {
        const EMAIL_REGEXP = /\S+@\S+\.\S+/;
        if (!control.value) {
            return {required: true};
        } else if (!EMAIL_REGEXP.test(control.value)) {
            return {email: true};
        }
    }

    getRootElement(): HTMLElement {
        return this.elRef.nativeElement.parentNode.parentNode.parentNode;
    }

    createUniqueId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
