import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {NgbModal, NgbActiveModal, NgbModalRef, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {FormGroup, FormControl, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {QueryOptions} from './models/query-options';
import {AlertModalContent, ConfirmModalContent} from './app.component';

import {DataService} from './services/data-service.abstract';
import {SystemNameService} from './services/system-name.service';

export abstract class ModalContentAbstractComponent implements OnInit {
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

    abstract save();

    constructor(
        public fb: FormBuilder,
        public dataService: DataService,
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
            .then(res => {
                if (res.success) {
                    if (this.isItemCopy) {
                        res.data.id = '';
                        res.data[this.getSystemFieldName()] = '';
                    }
                    this.model = res.data;
                } else {
                    if (res.msg) {
                        this.errorMessage = res.msg;
                    }
                }
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

    /** Submit form */
    onSubmit() {
        this.submitted = true;
        this.closeModal();
    }
}

export abstract class PageTableAbstractComponent implements OnInit {
    errorMessage: string;
    items: any[] = [];
    title: string = 'Page with data table';
    modalRef: NgbModalRef;
    loading: boolean = false;
    selectedIds: number[] = [];
    collectionSize = 0;
    queryOptions: QueryOptions = new QueryOptions('name', 'asc', 1, 10, 0, 0);

    abstract getModalContent();

    constructor(
        public dataService: DataService,
        public activeModal: NgbActiveModal,
        public modalService: NgbModal,
        public titleService: Title
    ) {

    }

    ngOnInit(): void {
        this.setTitle(this.title);
        this.getList();
    }

    public setTitle(newTitle: string) {
        this.titleService.setTitle(newTitle);
    }

    modalOpen(itemId?: number, isItemCopy: boolean = false): void {
        this.modalRef = this.modalService.open(this.getModalContent(), {size: 'lg'});
        this.setModalInputs(itemId, isItemCopy);
        this.modalRef.result.then((result) => {
            this.getList();
        }, (reason) => {
            //console.log( 'reason', reason );
        });
    }

    setModalInputs(itemId?: number, isItemCopy: boolean = false): void {
        const isEditMode = typeof itemId !== 'undefined' && !isItemCopy;
        this.modalRef.componentInstance.modalTitle = isEditMode ? 'Edit' : 'Add';
        this.modalRef.componentInstance.itemId = itemId || 0;
        this.modalRef.componentInstance.isItemCopy = isItemCopy || false;
        this.modalRef.componentInstance.isEditMode = isEditMode;
    }

    deleteItemConfirm(itemId: number): void {
        this.modalRef = this.modalService.open(ConfirmModalContent);
        this.modalRef.componentInstance.modalTitle = 'Confirm';
        this.modalRef.componentInstance.modalContent = 'Are you sure you want to remove this item?';
        this.modalRef.result.then((result) => {
            if (result == 'accept') {
                this.deleteItem(itemId);
            }
        });
    }

    confirmAction(message: string) {
        this.modalRef = this.modalService.open(ConfirmModalContent);
        this.modalRef.componentInstance.modalTitle = 'Confirm';
        this.modalRef.componentInstance.modalContent = message;
        return this.modalRef.result;
    }

    blockSelected() {
        if (this.selectedIds.length === 0) {
            this.showAlert('Nothing is selected.');
            return;
        }
        console.log('blockSelected', this.selectedIds);
    }

    deleteSelected() {
        if (this.selectedIds.length === 0) {
            this.showAlert('Nothing is selected.');
            return;
        }
        this.confirmAction('Are you sure you want to delete all selected items?')
            .then((result) => {
                if (result == 'accept') {
                    this.dataService.deleteByArray(this.selectedIds)
                        .then((res) => {
                            if (res.success) {
                                this.getList();
                            } else {
                                if (res.msg) {
                                    this.showAlert(res.msg);
                                }
                            }
                        });
                }
            });
    }

    showAlert(message: string) {
        this.modalRef = this.modalService.open(AlertModalContent);
        this.modalRef.componentInstance.modalContent = message;
        this.modalRef.componentInstance.modalTitle = 'Error';
        this.modalRef.componentInstance.messageType = 'error';
    }

    deleteItem(itemId: number): void {
        this.confirmAction('Are you sure you want to remove this item?')
            .then((result) => {
                if (result == 'accept') {
                    this.dataService.deleteItem(itemId)
                        .then((res) => {
                            if (res.success) {
                                this.getList();
                            } else {
                                if (res.msg) {
                                    this.showAlert(res.msg);
                                }
                            }
                        });
                }
            });
    }

    actionRequest(actionValue: [string, number]): void {
        switch (actionValue[0]) {
            case 'edit':
                this.modalOpen(actionValue[1]);
                break;
            case 'copy':
                this.modalOpen(actionValue[1], true);
                break;
            case 'delete':
                this.deleteItem(actionValue[1]);
                break;
            case 'changeQuery':
                this.getList();
                break;
        }
    }

    getList(): void {
        this.loading = true;
        this.dataService.getList(this.queryOptions)
            .subscribe(
                preparedData => {
                    this.items = preparedData.data;
                    this.collectionSize = preparedData.total;
                    this.errorMessage = preparedData.errorMsg;
                    this.loading = false;
                },
                error => this.errorMessage = <any>error
            );
    }

}
