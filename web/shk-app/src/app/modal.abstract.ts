import {Input, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {NgbAccordion, NgbActiveModal, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import {TranslateService} from '@ngx-translate/core';

import {SystemNameService} from './services/system-name.service';
import {DataService} from './services/data-service.abstract';

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
    formFields = {};
    model: {[key: string]: any} = {};
    files: {[key: string]: File} = {};

    abstract save();

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
            this.getModelData();
        }
    }

    onBeforeInit(): void {}
    onAfterInit(): void {}

    getSystemFieldName(): string {
        return 'name';
    }

    getLangString(value: string): string {
        const translations = this.translateService.store.translations[this.translateService.currentLang];
        return translations[value] || value;
    }

    getModelData(): void {
        this.loading = true;
        this.dataService.getItem(this.itemId)
            .subscribe(data => {
                if (this.isItemCopy) {
                    data.id = null;
                    data[this.getSystemFieldName()] = '';
                }
                this.model = data as M;
                this.loading = false;
            }, (err) => {
                this.errorMessage = err.error || 'Error.';
                this.loading = false;
            });
    }

    /** Build form groups */
    buildForm(): void {
        const controls = this.buildControls(this.formFields, 'model');
        this.form = this.fb.group(controls);
        this.form.valueChanges
            .subscribe(() => this.onValueChanged('form'));
    }

    /** Build controls */
    buildControls(options: {}, modelName: string, keyPrefix: string = ''): { [s: string]: FormControl; } {
        const controls = {};
        for (const key in options) {
            if (!options.hasOwnProperty(key)) {
                continue;
            }
            const opts = options[key];
            if (!this[modelName][key]) {
                this[modelName][key] = opts.value;
            }
            controls[key] = new FormControl({
                value: this[modelName][key] || '',
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
    onValueChanged(formName?: string, keyPrefix: string = ''): void {
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
        return _.cloneDeep(this.model);
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
}
