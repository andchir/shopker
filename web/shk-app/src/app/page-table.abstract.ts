import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbActiveModal, NgbModalRef, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DataService } from './services/data-service.abstract';
import { AlertModalContent, ConfirmModalContent } from './app.component';

@Component({

})
export abstract class ModalContentAbstractComponent implements OnInit {
    @Input() modalTitle;
    @Input() itemId;
    @Input() isItemCopy;

    private fb: FormBuilder;
    public dataService: DataService;
    private activeModal: NgbActiveModal;

    submitted: boolean = false;
    loading: boolean = false;
    errorMessage: string;
    form: FormGroup;
    formErrors = {};
    validationMessages = {};
    formFields = {};
    data = {};

    constructor(
        fb: FormBuilder,
        dataService: DataService,
        activeModal: NgbActiveModal,
        tooltipConfig: NgbTooltipConfig
    ) {
        this.fb = fb;
        this.dataService = dataService;
        this.activeModal = activeModal;

        tooltipConfig.placement = 'bottom';
        tooltipConfig.container = 'body';
    }

    ngOnInit(): void {
        this.buildForm(this.formFields);
        if(this.itemId){
            this.getModelData();
        }
    }

    getModelData(): void {
        this.loading = true;
        this.dataService.getItem(this.itemId)
            .then(item => {
                if(this.isItemCopy){
                    item.id = '';
                    item.name = '';
                }
                this.data = item;
                this.loading = false;
            });
    }

    /** Build form groups */
    buildForm(formFields: any): void {
        let controls = {};
        for (let key in formFields) {
            let options = formFields[key];
            if(!this.data[key]){
                this.data[key] = options.value;
            }
            controls[key] = new FormControl(this.data[key], options.validators);
            this.formErrors[key] = '';
            this.validationMessages[key] = options.messages;
        }

        this.form = this.fb.group(controls);
        this.form.valueChanges
            .subscribe(data => this.onValueChanged(data));
    }

    /** Callback on form value changed */
    onValueChanged(data?: any): void{
        if (!this.form) { return; }

        for (let fieldName in data) {
            this.formErrors[fieldName] = '';
            let control = this.form.get(fieldName);
            if (control && (control.dirty || this.submitted) && !control.valid) {
                for (let key in control.errors) {
                    this.formErrors[fieldName] += this.validationMessages[fieldName][key] + ' ';
                }
            }

        }
    }

    /** Close modal */
    closeModal() {
        this.activeModal.close();
    }

    /** Submit form */
    onSubmit() {
        this.submitted = true;
        this.closeModal();
    }
}

@Component({
    //providers: [ NgbTooltipConfig ]
})
export abstract class PageTableAbstractComponent implements OnInit {
    errorMessage: string;
    items: any[] = [];
    title: string = 'Page with data table';
    modalRef: NgbModalRef;
    loading: boolean = false;
    selectedIds: string[] = [];

    public dataService: DataService;
    private activeModal: NgbActiveModal;
    private modalService: NgbModal;
    private titleService: Title;

    constructor(
        dataService: DataService,
        activeModal: NgbActiveModal,
        modalService: NgbModal,
        titleService: Title
    ) {
        this.dataService = dataService;
        this.activeModal = activeModal;
        this.modalService = modalService;
        this.titleService = titleService;
    }

    ngOnInit(): void {
        this.setTitle( this.title );
        this.getList();
    }

    public setTitle( newTitle: string ) {
        this.titleService.setTitle( newTitle );
    }

    modalOpen(itemId?: number, isItemCopy?: boolean): void {
        this.modalRef = this.modalService.open(this.getModalContent(), {size: 'lg'});
        this.modalRef.componentInstance.modalTitle = itemId && !isItemCopy
            ? 'Edit'
            : 'Add';
        this.modalRef.componentInstance.itemId = itemId || 0;
        this.modalRef.componentInstance.isItemCopy = isItemCopy || false;
        this.modalRef.result.then((result) => {
            this.getList();
        }, (reason) => {
            //console.log( 'reason', reason );
        });
    }

    deleteItemConfirm(itemId): void{
        this.modalRef = this.modalService.open(ConfirmModalContent);
        this.modalRef.componentInstance.modalTitle = 'Confirm';
        this.modalRef.componentInstance.modalContent = 'Are you sure you want to remove this item?';
        this.modalRef.result.then((result) => {
            if( result == 'accept' ){
                this.deleteItem(itemId);
            }
        }, (reason) => {

        });
    }

    deleteItem(itemId: number): void{
        this.dataService.deleteItem(itemId)
            .then((res) => {
                if(res.success){
                    this.getList();
                } else {
                    if(res.msg){
                        this.modalRef = this.modalService.open(AlertModalContent);
                        this.modalRef.componentInstance.modalContent = res.msg;
                        this.modalRef.componentInstance.modalTitle = 'Error';
                        this.modalRef.componentInstance.messageType = 'error';
                    }
                }
            });
    }

    getModalContent(){
        return ModalContentAbstractComponent;
    }

    getList(): void {
        this.loading = true;

    }

}
