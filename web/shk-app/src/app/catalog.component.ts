import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoriesService } from './services/categories.service';
import { Category } from "./models/category.model";
import { Product } from "./models/product.model";
import * as _ from "lodash";

@Component({
    selector: 'ngbd-modal-content',
    templateUrl: 'templates/modal_product.html'
})
export class ProductModalContent implements OnInit {
    @Input() modalTitle;
    @Input() itemId;
    submitted: boolean = false;
    loading: boolean = false;
    errorMessage: string;

    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        public activeModal: NgbActiveModal
    ) {}

    /** On initialize */
    ngOnInit(): void {
        this.buildForm();
    }

    buildForm(): void {
        this.form = this.fb.group({
            title: ['', [Validators.required]],
            name: ['', [Validators.required, Validators.pattern('[A-Za-z0-9_-]+')]],
            description: ['', []]
        });
        this.form.valueChanges
            .subscribe(data => this.onValueChanged(data));
    }

    /**
     * On form value changed
     * @param data
     */
    onValueChanged(data?: any){
        if (!this.form) { return; }

        console.log( data );

    }

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
    errorMessage: string = '';
    modalRef: NgbModalRef;
    loading: boolean = false;
    categories: Category[] = [];
    currentCategory: Category;
    items: Product[] = [];
    selectedIds: number[] = [];

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

    public setTitle( newTitle: string ): void {
        this.titleService.setTitle( newTitle );
    }

    selectAll( event ): void{
        this.selectedIds = [];
        if( event.target.checked ){
            for( let item of this.items ){
                this.selectedIds.push( item.id );
            }
        }
    }

}
