import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbActiveModal, NgbModalRef, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DataService } from './services/data-service.abstract';

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

    }

    /** Build form groups */
    buildForm(formFields: any): void {
        let controls = {};
        for (let key in formFields) {
            let options = formFields[key];
            controls[key] = new FormControl(options.value, options.validators);
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

    constructor(
        //private fb: FormBuilder,
        private dataService: DataService,
        private activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private titleService: Title
    ) {

    }

    ngOnInit(): void {
        this.setTitle( this.title );
        this.getList();
    }

    public setTitle( newTitle: string ) {
        this.titleService.setTitle( newTitle );
    }

    modalOpen( itemId?: number, isItemCopy?: boolean ): void {
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

    getModalContent(){
        return ModalContentAbstractComponent;
    }

    getList(): void {
        this.loading = true;

    }

}
