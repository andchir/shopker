import {ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {NgbAccordion, NgbActiveModal, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';

import {SystemNameService} from './services/system-name.service';
import {DataService} from './services/data-service.abstract';
import {FileModel} from './models/file.model';
import {FormFieldInterface, FormFieldOptionsInterface} from './models/form-field.interface';

/**
 * @deprecated since version 4.1.1. Use AppModalContentAbstractComponent instead.
 */
export abstract class ModalContentAbstractComponent<M> implements OnInit, OnDestroy {

    @Input() modalTitle: string;
    @Input() itemId: number | null;
    @Input() modalId = '';
    @Input() isItemCopy: boolean;
    @Input() isEditMode: boolean;

    submitted = false;
    loading = false;
    errorMessage: string;
    form: FormGroup;
    formErrors: {[key: string]: string} = {};
    validationMessages: {[key: string]: { [key: string]: string }} = {};
    formFields: FormFieldInterface = {};
    model: any;
    files: {[key: string]: File} = {};

    isSaveButtonDisabled = false;
    localeList: string[];
    localeDefault = '';
    localeCurrent = '';
    localeFieldsAllowed: string[] = [];
    localePreviousValues: {[fieldName: string]: string} = {};
    closeReason = 'canceled';
    uniqueId = '';
    destroyed$ = new Subject<void>();

    constructor(
        public fb: FormBuilder,
        public dataService: DataService<any>,
        public systemNameService: SystemNameService,
        public activeModal: NgbActiveModal,
        public tooltipConfig: NgbTooltipConfig,
        public translateService: TranslateService,
        public elRef: ElementRef
    ) {
        tooltipConfig.placement = 'bottom';
        tooltipConfig.container = 'body';
        tooltipConfig.triggers = 'hover click';
    }

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
    onAfterGetData(): void {}

    getSystemFieldName(): string {
        return 'name';
    }

    getLangString(value: string): string {
        const translations = this.translateService.store.translations[this.translateService.currentLang];
        return translations[value] || value;
    }

    getModelData(): Promise<M> {
        this.loading = true;
        return new Promise((resolve, reject) => {
            this.dataService.getItem(this.itemId)
                .pipe(takeUntil(this.destroyed$))
                .subscribe({
                    next: (data) => {
                        if (this.isItemCopy) {
                            data.id = null;
                            data[this.getSystemFieldName()] = '';
                        }
                        this.model = data as M;
                        this.loading = false;
                        resolve(data as M);
                    },
                    error: (err) => {
                        this.errorMessage = err.error || this.getLangString('ERROR');
                        this.loading = false;
                        reject(err);
                    }
                });
        });
    }

    /** Build form groups */
    buildForm(): void {
        const controls = this.buildControls(this.formFields, 'model');
        this.form = this.fb.group(controls);
        this.form.valueChanges
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (value: any) => this.onValueChanged('form', '', value)
            });
    }

    /** Build controls */
    buildControls(options: {}, modelName: string, keyPrefix: string = ''): { [s: string]: FormControl; } {
        const controls = {};
        for (const key in options) {
            if (!options.hasOwnProperty(key)) {
                continue;
            }
            const opts = options[key] as FormFieldOptionsInterface;
            const object = opts['dataKey'] ? this[modelName][opts['dataKey']] : this[modelName];
            if (!object[key]) {
                object[key] = opts.value;
            }
            controls[key] = new FormControl({
                value: object[key] || '',
                disabled: opts.disabled || false
            }, opts.validators);
            this.formErrors[keyPrefix + key] = '';
            this.translateValidationMessages(keyPrefix, key, opts);
        }
        return controls;
    }

    translateValidationMessages(keyPrefix: string, fieldKey: string, fieldOptions: FormFieldOptionsInterface): void {
        const messages: {[key: string]: string } = {};
        if (!fieldOptions.fieldLabel) {
            return;
        }
        Object.keys(fieldOptions.messages).forEach((messageKey) => {
            if (messageKey === 'required') {
                return;
            }
            this.translateService.get(String(fieldOptions.messages[messageKey]))
                .subscribe((res: string) => {
                    messages[messageKey] = res;
                });
        });
        if (fieldOptions.validators.indexOf(Validators.required) > -1) {
            this.translateService.get(fieldOptions.fieldLabel)
                .subscribe((fieldLabel: string) => {
                    this.translateService.get('FIELD_REQUIRED', {name: fieldLabel})
                        .subscribe((res: string) => {
                            messages.required = res;
                        });
                });
        }
        this.validationMessages[keyPrefix + fieldKey] = messages;
    }

    getControl(name: string): AbstractControl {
        return this.form.controls['name'];
    }

    /** Callback on form value changed */
    onValueChanged(formName?: string, keyPrefix: string = '', value?: any): void {
        if (!this[formName]) {
            return;
        }
        const data = this[formName].value;
        for (const fieldName in data) {
            if (!data.hasOwnProperty(fieldName)) {
                continue;
            }
            this.formErrors[keyPrefix + fieldName] = '';
            const control = this[formName].get(fieldName);
            if (control && (control.dirty || this[keyPrefix + 'submitted']) && !control.valid) {
                for (const key in control.errors) {
                    if (this.validationMessages[keyPrefix + fieldName][key]) {
                        this.formErrors[keyPrefix + fieldName] += this.validationMessages[keyPrefix + fieldName][key] + ' ';
                    } else {
                        this.formErrors[keyPrefix + fieldName] += this.getLangString('ERROR') + ' ';
                    }
                }
            }
        }
    }

    /** Element display toggle */
    displayToggle(element: HTMLElement, display?: boolean): void {
        display = display || element.style.display === 'none';
        element.style.display = display ? 'block' : 'none';
    }

    toggleAccordion(accordion: NgbAccordion, panelId: string, display?: boolean): void {
        const isOpened = accordion.activeIds.indexOf(panelId) > -1;
        if (isOpened && display) {
            return;
        }
        accordion.toggle(panelId);
    }

    generateName(model): void {
        const title = model.title || '';
        model.name = this.systemNameService.generateName(title);
    }

    /** Close modal */
    closeModal(event?: MouseEvent) {
        if (event) {
            event.preventDefault();
        }
        const reason = this.itemId ? 'edit' : 'create';
        this.activeModal.close({reason: reason, data: this.model});
    }

    close(event?: MouseEvent) {
        if (event) {
            event.preventDefault();
        }
        this.activeModal.dismiss(this.closeReason);
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

    getFormData(): any {
        const data = {};
        Object.keys(this.model).forEach((key) => {
            if (this.files[key]) {
                data[key] = Array.isArray(this.model[key])
                    ? [ FileModel.getFileData(this.files[key]) ]
                    : FileModel.getFileData(this.files[key]);
            } else {
                data[key] = this.model[key];
            }
        });
        return data;
    }

    fileChange(event, fieldName: string, isArray = false) {
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.model[fieldName] = isArray
                ? [ FileModel.getFileData(fileList[0]) ]
                : FileModel.getFileData(fileList[0]);
            this.files[fieldName] = fileList[0];
            this.form.controls[fieldName].setValue(this.files[fieldName].name);
        }
    }

    fileClear(fieldName: string, inputElement: HTMLInputElement) {
        this.model[fieldName] = null;
        this.form.controls[fieldName].reset(null);
        inputElement.files = null;
        inputElement.value = '';
        delete this.files[fieldName];
    }

    onLocaleSwitch(): void {
        if (this.localeCurrent === this.localeDefault) {
            this.localeFieldsAllowed.forEach((fieldName) => {
                this.model[fieldName] = this.localePreviousValues[fieldName];
            });
            this.isSaveButtonDisabled = false;
            return;
        }
        if (!this.model.translations) {
            this.model.translations = {};
        }
        this.isSaveButtonDisabled = true;
        this.localeFieldsAllowed.forEach((fieldName) => {
            this.localePreviousValues[fieldName] = this.model[fieldName] || '';
            if (this.model.translations[fieldName]) {
                this.model[fieldName] = this.model.translations[fieldName][this.localeCurrent] || '';
            } else {
                this.model[fieldName] = '';
            }
        });
    }

    saveTranslations(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.localeFieldsAllowed.forEach((fieldName) => {
            if (this.model[fieldName]) {
                if (!this.model.translations[fieldName]) {
                    this.model.translations[fieldName] = {};
                }
                this.model.translations[fieldName][this.localeCurrent] = this.model[fieldName];
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

    saveRequest() {
        if (this.isEditMode) {
            return this.dataService.update(this.getFormData());
        } else {
            return this.dataService.create(this.getFormData());
        }
    }

    /** Submit form */
    onSubmit() {
        this.submitted = true;
        this.closeModal();
    }

    appendFormData(formData: FormData): void {

    }

    saveFiles(itemId: number) {
        if (Object.keys(this.files).length === 0) {
            this.closeModal();
            return;
        }

        const formData: FormData = new FormData();
        for (const key in this.files) {
            if (this.files.hasOwnProperty(key) && this.files[key] instanceof File) {
                formData.append(key, this.files[key], this.files[key].name);
            }
        }
        formData.append('itemId', String(itemId));
        this.appendFormData(formData);

        this.dataService.postFormData(formData)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: () => {
                    this.closeModal();
                },
                error: (err) => {
                    this.errorMessage = err.error || this.getLangString('ERROR');
                    this.submitted = false;
                    this.loading = false
                }
            });
    }

    save(autoClose = false, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.submitted = true;
        this.errorMessage = '';

        if (!this.form.valid) {
            this.onValueChanged('form');
            this.submitted = false;
            return;
        }

        this.loading = true;
        this.saveRequest()
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (res) => {
                    if (Object.keys(this.files).length > 0) {
                        this.saveFiles(res._id || res.id);
                    } else {
                        if (autoClose) {
                            this.closeModal();
                        } else if (res && res['id']) {
                            this.model = res as M;
                            this.onAfterGetData();
                            this.isEditMode = true;
                        }
                        this.closeReason = 'updated';
                        this.loading = false;
                        this.submitted = false;
                    }
                },
                error: (err) => {
                    this.errorMessage = err.error || this.getLangString('ERROR');
                    this.loading = false;
                    this.submitted = false;
                }
            });
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
