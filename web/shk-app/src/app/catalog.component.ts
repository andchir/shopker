import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoriesService } from './services/categories.service';
import { Category } from "./models/category.model";
import { Product } from "./models/product.model";
import { ConfirmModalContent } from './app.component';
import { CategoriesComponent } from './categories.component';
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
        private categoriesService: CategoriesService,
        private titleService: Title
    ) {}

    ngOnInit(): void {
        this.setTitle( this.title );
        this.openRootCategory();
        this.getCategories();
    }

    getCategories() {
        this.categoriesService.getList()
            .then(
                items => {
                    this.categories = items;
                },
                error => this.errorMessage = <any>error);
    }

    modalOpen( itemId?: number ) {
        this.modalRef = this.modalService.open(ProductModalContent, {size: 'lg'});
        this.modalRef.componentInstance.modalTitle = 'Add product';
        this.modalRef.componentInstance.itemId = itemId || 0;
    }

    openModalCategory( itemId?: number, isItemCopy?: boolean ): void {
        this.modalRef = this.modalService.open(CategoriesComponent, {size: 'lg'});
        this.modalRef.componentInstance.modalTitle = 'Add category';
        this.modalRef.componentInstance.itemId = itemId || 0;
        this.modalRef.componentInstance.isItemCopy = isItemCopy || false;
        this.modalRef.result.then((result) => {
            if( result.reason && result.reason == 'edit' ){
                //Update category data
                this.currentCategory = _.clone( result.data );
                let index = _.findIndex( this.categories, {id: result.data.id} );
                if( index > -1 ){
                    this.categories[index] = _.clone( result.data );
                }
            } else {
                this.getCategories();
            }
        }, (reason) => {

        });
    }

    deleteCategoryItemConfirm( itemId: number ): void{
        let index = _.findIndex( this.categories, {id: itemId} );
        if( index == -1 ){
            return;
        }
        this.modalRef = this.modalService.open(ConfirmModalContent);
        this.modalRef.componentInstance.modalTitle = 'Confirm';
        this.modalRef.componentInstance.modalContent = 'Are you sure you want to remove category "' + this.categories[index].title + '"?';
        this.modalRef.result.then((result) => {
            if( result == 'accept' ){
                this.deleteCategoryItem( itemId );
            }
        }, (reason) => {

        });
    }

    deleteCategoryItem( itemId: number ): void{
        this.categoriesService.deleteItem( itemId )
            .then((res) => {
                if( res.success ){
                    this.openRootCategory();
                    this.getCategories();
                } else {
                    if( res.msg ){
                        //this.errorMessage = res.msg;
                    }
                }
            });
    }

    openRootCategory(): void {
        this.currentCategory = new Category(0,0,'root','Категории','');
        this.titleService.setTitle( this.title );
    }

    selectCategory( category: Category ): void {
        this.currentCategory = _.clone( category );
        this.titleService.setTitle( this.title + ' / ' + this.currentCategory.title );
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