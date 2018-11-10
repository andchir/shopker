import {Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {NgbAccordion, NgbActiveModal, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {cloneDeep} from 'lodash';
import {TranslateService} from '@ngx-translate/core';

import {SystemNameService} from './services/system-name.service';
import {DataService} from './services/data-service.abstract';
import {FileModel} from './models/file.model';
import {FormFieldInterface} from './models/form-field.interface';

export abstract class ModalContentAbstractComponent<M> implements OnInit {
    @Input() modalTitle: string;
    @Input() itemId: number | null;
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

    constructor(
        public fb: FormBuilder,
        public dataService: DataService<any>,
        public systemNameService: SystemNameService,
        public activeModal: NgbActiveModal,
        public tooltipConfig: NgbTooltipConfig,
        public translateService: TranslateService
    ) {
        tooltipConfig.placement = 'bottom';
        tooltipConfig.container = 'body';
        tooltipConfig.triggers = 'hover click';
    }

    ngOnInit(): void {
        this.onBeforeInit();
        this.buildForm();
        if (this.isEditMode || this.isItemCopy) {
            this.getModelData().then(() => {
                this.onAfterGetData();
            });
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
                .subscribe(data => {
                    if (this.isItemCopy) {
                        data.id = null;
                        data[this.getSystemFieldName()] = '';
                    }
                    this.model = data as M;
                    this.loading = false;
                    resolve(data as M);
                }, (err) => {
                    this.errorMessage = err.error || 'Error.';
                    this.loading = false;
                    reject(err);
                });
        });
    }

    /** Build form groups */
    buildForm(): void {
        const controls = this.buildControls(this.formFields, 'model');
        this.form = this.fb.group(controls);
        this.form.valueChanges
            .subscribe((value: any) => this.onValueChanged('form', '', value));
    }

    /** Build controls */
    buildControls(options: {}, modelName: string, keyPrefix: string = ''): { [s: string]: FormControl; } {
        const controls = {};
        for (const key in options) {
            if (!options.hasOwnProperty(key)) {
                continue;
            }
            const opts = options[key];
            const object = opts['dataKey'] ? this[modelName][opts['dataKey']] : this[modelName];
            if (!object[key]) {
                object[key] = opts.value;
            }
            controls[key] = new FormControl({
                value: object[key] || '',
                disabled: opts.disabled || false
            }, opts.validators);
            this.formErrors[keyPrefix + key] = '';
            this.validationMessages[keyPrefix + key] = opts.messages;
        }
        return controls;
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
                        this.formErrors[keyPrefix + fieldName] += 'Error. ';
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
    closeModal() {
        const reason = this.itemId ? 'edit' : 'create';
        this.activeModal.close({reason: reason, data: this.model});
    }

    close(e: MouseEvent) {
        e.preventDefault();
        this.activeModal.dismiss('canceled');
    }

    getFormData(): any {
        const data = {};
        Object.keys(this.model).forEach((key) => {
            if (this.files[key]) {
                data[key] = FileModel.getFileData(this.files[key]);
            } else {
                data[key] = this.model[key];
            }
        });
        return data;
    }

    fileChange(event, fieldName: string) {
        const fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.model[fieldName] = FileModel.getFileData(fileList[0]);
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
            .subscribe(() => {
                    this.closeModal();
                },
                err => {
                    this.errorMessage = err.error || 'Error.';
                    this.submitted = false;
                    this.loading = false;
                });
    }

    save(): void {
        this.submitted = true;

        if (!this.form.valid) {
            this.onValueChanged('form');
            this.submitted = false;
            return;
        }

        this.loading = true;
        this.saveRequest()
            .subscribe((res) => {
                if (Object.keys(this.files).length > 0) {
                    this.saveFiles(res._id || res.id);
                } else {
                    this.closeModal();
                }
            }, (err) => {
                this.errorMessage = err.error || 'Error.';
                this.loading = false;
                this.submitted = false;
            });
    }
}
