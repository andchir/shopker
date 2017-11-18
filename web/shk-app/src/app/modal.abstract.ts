import { Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

import { SystemNameService } from './services/system-name.service';
import { DataService } from './services/data-service.abstract';

export abstract class ModalContentAbstractComponent<M> implements OnInit {
    @Input() modalTitle: string;
    @Input() itemId: number | null;
    @Input() isItemCopy: boolean;
    @Input() isEditMode: boolean;

    submitted: boolean = false;
    loading: boolean = false;
    errorMessage: string;
    form: FormGroup;
    formErrors: { [key: string]: string } = {};
    validationMessages: { [key: string]: { [key: string]: string } } = {};
    formFields = {};
    model: { [key: string]: any } = {};
    files: { [key: string]: File } = {};

    abstract save();

    constructor(
        public fb: FormBuilder,
        public dataService: DataService<any>,
        public systemNameService: SystemNameService,
        public activeModal: NgbActiveModal,
        public tooltipConfig: NgbTooltipConfig
    ) {
        tooltipConfig.placement = 'bottom';
        tooltipConfig.container = 'body';
        tooltipConfig.triggers = 'hover click';
    }

    ngOnInit(): void {
        this.buildForm();
        if (this.isEditMode || this.isItemCopy) {
            this.getModelData();
        }
    }

    getSystemFieldName(): string {
        return 'name';
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
        let controls = this.buildControls(this.formFields, 'model');
        this.form = this.fb.group(controls);
        this.form.valueChanges
            .subscribe(() => this.onValueChanged('form'));
    }

    /** Build controls */
    buildControls(options: {}, modelName: string, keyPrefix: string = ''): { [s: string]: FormControl; } {
        let controls = {};
        for (let key in options) {
            if (!options.hasOwnProperty(key)) {
                continue;
            }
            let opts = options[key];
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
    onValueChanged(formName: string, keyPrefix: string = ''): void {
        if (!this[formName]) {
            return;
        }
        let data = this[formName].value;

        for (let fieldName in data) {
            if (!data.hasOwnProperty(fieldName)) {
                continue;
            }
            this.formErrors[keyPrefix + fieldName] = '';
            let control = this[formName].get(fieldName);
            if (control && (control.dirty || this[keyPrefix + 'submitted']) && !control.valid) {
                for (let key in control.errors) {
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
        display = display || element.style.display == 'none';
        element.style.display = display ? 'block' : 'none';
    }

    generateName(model): void {
        let title = model.title || '';
        model.name = this.systemNameService.generateName(title);
    }

    /** Close modal */
    closeModal() {
        let reason = this.itemId ? 'edit' : 'create';
        this.activeModal.close({reason: reason, data: this.model});
    }

    close(e: MouseEvent) {
        e.preventDefault();
        this.activeModal.dismiss('canceled');
    }

    saveRequest() {
        if (this.isEditMode) {
            return this.dataService.update(this.model);
        } else {
            return this.dataService.create(this.model);
        }
    }

    /** Submit form */
    onSubmit() {
        this.submitted = true;
        this.closeModal();
    }
}
