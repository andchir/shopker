import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-modal-content',
    templateUrl: 'templates/modal_product.html'
})
export class ProductModalContent {
    @Input() modalTitle;
    @Input() itemId;
    submitted: boolean = false;
    loading: boolean = false;
    errorMessage: string;

    constructor(
        public activeModal: NgbActiveModal
    ) {}

    onSubmit() {

        this.submitted = true;


    }
}

@Component({
    selector: 'category-modal-content',
    templateUrl: 'templates/modal_category.html'
})
export class CategoryModalContent {
    @Input() modalTitle;
    @Input() itemId;
    submitted: boolean = false;
    loading: boolean = false;
    errorMessage: string;

    constructor(
        public activeModal: NgbActiveModal
    ) {}

    onSubmit() {

        this.submitted = true;


    }

}

@Component({
    selector: 'shk-catalog',
    templateUrl: 'templates/page_catalog.html'
})
export class CatalogComponent implements OnInit {
    title = 'Каталог';
    modalRef: NgbModalRef;
    loading: boolean = false;

    constructor(
        private modalService: NgbModal,
        private titleService: Title
    ) {}

    ngOnInit(): void {
        this.setTitle( this.title );
    }

    modalOpen( itemId?: number ) {
        this.modalRef = this.modalService.open(ProductModalContent, {size: 'lg'});
        this.modalRef.componentInstance.modalTitle = 'Add product';
        this.modalRef.componentInstance.itemId = itemId || 0;
    }

    openModalCategory( itemId?: number ): void {
        this.modalRef = this.modalService.open(CategoryModalContent, {size: 'lg'});
        this.modalRef.componentInstance.modalTitle = 'Add category';
        this.modalRef.componentInstance.itemId = itemId || 0;
    }

    public setTitle( newTitle: string ): void {
        this.titleService.setTitle( newTitle );
    }

}