import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbActiveModal, NgbModalRef, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from './services/data-service.abstract';

@Component({

})
export abstract class ModalContentAbstractComponent implements OnInit {
    @Input() modalTitle;
    @Input() itemId;
    @Input() isItemCopy;

    submitted: boolean = false;
    loading: boolean = false;
    errorMessage: string;

    constructor(
        private fb: FormBuilder,
        private dataService: DataService,
        private activeModal: NgbActiveModal,
        private tooltipConfig: NgbTooltipConfig
    ) {
        tooltipConfig.placement = 'bottom';
        tooltipConfig.container = 'body';
    }

    ngOnInit(): void {


    }

    /** Close modal */
    closeModal() {
        this.activeModal.close();
    }

    /** Submit form */
    onSubmit() {

        this.submitted = true;

        console.log('onSubmit');

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
