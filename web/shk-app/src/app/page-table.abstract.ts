import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbActiveModal, NgbModalRef, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DataService } from './services/data-service.abstract';
import { QueryOptions } from './models/query-options';
import { AlertModalContent, ConfirmModalContent } from './app.component';

@Component({

})
export abstract class ModalContentAbstractComponent implements OnInit {
    @Input() modalTitle;
    @Input() itemId;
    @Input() isItemCopy;

    //private fb: FormBuilder;
    //public dataService: DataService;
    //private activeModal: NgbActiveModal;

    submitted: boolean = false;
    loading: boolean = false;
    errorMessage: string;
    form: FormGroup;
    formErrors = {};
    validationMessages = {};
    formFields = {};
    model = {};

    constructor(
        public fb: FormBuilder,
        public dataService: DataService,
        public activeModal: NgbActiveModal,
        public tooltipConfig: NgbTooltipConfig
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
            .then(res => {
                if(this.isItemCopy){
                    res.data.id = '';
                    res.data.name = '';
                }
                this.model = res.data;
                this.loading = false;
            });
    }

    /** Build form groups */
    buildForm(formFields: any): void {
        let controls = this.buildControls(formFields, 'model');
        this.form = this.fb.group(controls);
        this.form.valueChanges
            .subscribe(data => this.onValueChanged(data));
    }

    buildControls(options: {}, modelName: string, keyPrefix: string = ''): {[s: string]: FormControl;} {
        let controls = {};
        for (let key in options) {
            let opts = options[key];
            if(!this[modelName][key]){
                this[modelName][key] = opts.value;
            }
            controls[key] = new FormControl(this[modelName][key], opts.validators);
            this.formErrors[keyPrefix + key] = '';
            this.validationMessages[keyPrefix + key] = opts.messages;
        }
        return controls;
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

    /** Element display toggle */
    displayToggle(element: HTMLElement, display?: boolean): void {
        display = display || element.style.display == 'none';
        element.style.display = display ? 'block' : 'none';
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
    collectionSize = 0;
    queryOptions: QueryOptions = new QueryOptions('name', 'asc', 1, 10, 0);

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

    deleteItemConfirm(itemId: number): void{
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

    actionRequest(actionValue : [string, number]): void {

        console.log(actionValue);

        switch(actionValue[0]){
            case 'edit':
                this.modalOpen(actionValue[1]);
                break;
            case 'copy':
                this.modalOpen(actionValue[1], true);
                break;
            case 'delete':
                this.deleteItemConfirm(actionValue[1]);
                break;
            case 'changeQuery':
                this.getList();
                break;
        }
    }

    getModalContent(){
        return ModalContentAbstractComponent;
    }

    getList(): void {
        this.loading = true;
        this.dataService.getList(this.queryOptions)
            .subscribe(
                res => {
                    this.items = res.data;
                    this.collectionSize = res.total;
                    this.loading = false;
                },
                error =>  this.errorMessage = <any>error
            );
    }

}
