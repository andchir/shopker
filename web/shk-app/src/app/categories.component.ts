import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoriesService } from './services/categories.service'
import { ContentTypesService } from './services/content_types.service';
import { ContentType } from './models/content_type.model';
import { Category } from "./models/category.model";
import { ConfirmModalContent } from './app.component';
import 'rxjs/add/operator/switchMap';
import * as _ from "lodash";

/**
 * @class CategoriesModalComponent
 */
@Component({
    selector: 'category-modal-content',
    templateUrl: 'templates/modal_category.html',
    providers: [ CategoriesService ]
})
export class CategoriesModalComponent implements OnInit {
    @Input() modalTitle: string;
    @Input() itemId: number;
    @Input() isItemCopy: boolean;
    @Input() categories: Category[] = [];
    submitted: boolean = false;
    loading: boolean = false;
    errorMessage: string;
    model: Category = new Category(0,0,'','','','');
    contentTypes: ContentType[] = [];

    form: FormGroup;
    formErrors = {
        parent_id: '',
        name: '',
        title: '',
        content_type: ''
    };
    validationMessages = {
        parent_id: {
            required: 'Parent is required.'
        },
        title: {
            required: 'Title is required.'
        },
        name: {
            required: 'Name is required.',
            pattern: 'The name must contain only Latin letters.'
        },
        content_type: {
            required: 'Content type is required.'
        }
    };

    constructor(
        private fb: FormBuilder,
        private contentTypesService: ContentTypesService,
        private categoriesService: CategoriesService,
        public activeModal: NgbActiveModal
    ) {}

    /** On initialize */
    ngOnInit(): void {
        this.buildForm();
        this.getContentTypes();
        if( this.itemId ){
            this.getModelData();
        }
    }

    getModelData(){
        this.loading = true;
        this.categoriesService.getItem( this.itemId )
            .then(item => {
                if( this.isItemCopy ){
                    item.id = 0;
                    item.name = '';
                }
                this.model = item;
                this.loading = false;
            });
    }

    getContentTypes(){
        this.contentTypesService.getList()
            .then(
                items => {
                    this.contentTypes = items;
                },
                error => this.errorMessage = <any>error);
    }

    buildForm(): void {
        this.form = this.fb.group({
            parent_id: [this.model.parent_id, [Validators.required]],
            title: [this.model.title, [Validators.required]],
            name: [this.model.name, [Validators.required, Validators.pattern('[A-Za-z0-9_-]+')]],
            description: [this.model.description, []],
            content_type: [this.model.content_type, [Validators.required]]
        });
        this.form.valueChanges
            .subscribe(data => this.onValueChanged(data));
    }

    /**
     * On form value changed
     * @param data
     */
    onValueChanged(data?: any): void {
        if (!this.form) { return; }
        for (const field in this.formErrors) {
            this.formErrors[field] = '';
            const control = this.form.get(field);
            if (control && (control.dirty || this.submitted) && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    /**
     * On form submit
     */
    onSubmit() {
        this.submitted = true;

        if( !this.form.valid ){
            this.onValueChanged();
            return;
        }

        if( this.model.id ){

            this.categoriesService.editItem( this.model.id, this.model )
                .then((res) => {
                    if( res.success ){
                        this.closeModal();
                    } else {
                        if( res.msg ){
                            this.errorMessage = res.msg;
                        }
                    }
                });

        } else {

            this.categoriesService.createItem( this.model )
                .then((res) => {
                    if( res.success ){
                        this.closeModal();
                    } else {
                        if( res.msg ){
                            this.errorMessage = res.msg;
                        }
                    }
                });
        }
    }

    closeModal() {
        let reason = this.itemId ? 'edit' : 'create';
        this.activeModal.close( { reason: reason, data: this.model } );
    }

}

/**
 * @class CategoriesMenuComponent
 */
@Component({
    selector: 'categories-menu',
    templateUrl: 'templates/categories-menu.html',
    providers: [ CategoriesService ]
})
export class CategoriesMenuComponent implements OnInit {
    @Input() rootTitle: string = 'Категории';
    @Output() changeRequest = new EventEmitter<Category>();
    currentCategory: Category = new Category(0,0,'root',this.rootTitle,'','');
    categories: Category[] = [];
    errorMessage: string = '';
    modalRef: NgbModalRef;
    categoryId: number = 0;

    constructor(
        public router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private categoriesService: CategoriesService
    ) {}

    /** On initialize component */
    ngOnInit(): void {
        this.getCategories();

        let categoryId = this.route.snapshot.params['categoryId']
            ? parseInt( this.route.snapshot.params['categoryId'] )
            : 0;

        this.route.paramMap
            .subscribe(
                params => {
                    this.categoryId = params.get('categoryId')
                        ? parseInt( params.get('categoryId') )
                        : 0;
                    this.selectCurrent();
                }
            );

        if( !categoryId ){
            this.openRootCategory();
        }
    }

    selectCurrent(): void {
        for( let category of this.categories ){
            if( category.id == this.categoryId ){
                this.currentCategory = category;
                this.changeRequest.emit( this.currentCategory );
                break;
            }
        }
    }

    getCategories() {
        this.categoriesService.getList()
            .subscribe(
                items => {
                    this.categories = items;
                    this.selectCurrent();
                },
                error =>  this.errorMessage = <any>error
            );
    }

    openModalCategory( itemId?: number, isItemCopy?: boolean ): void {
        this.modalRef = this.modalService.open(CategoriesModalComponent, {size: 'lg'});
        this.modalRef.componentInstance.modalTitle = itemId && !isItemCopy ? 'Edit category' : 'Add category';
        this.modalRef.componentInstance.itemId = itemId || 0;
        this.modalRef.componentInstance.isItemCopy = isItemCopy || false;
        this.modalRef.componentInstance.categories = this.categories;
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
                        this.errorMessage = res.msg;
                    }
                }
            });
    }

    openRootCategory(): void {
        this.currentCategory = new Category(0,0,'root',this.rootTitle,'','');
        this.changeRequest.emit( this.currentCategory );
    }

    goToRootCategory(): void {
        this.router.navigate(['/catalog']);
    }

    selectCategory( category: Category ): void {
        this.router.navigate(['/catalog/category', category.id]);
    }

    copyCategory(){
        this.openModalCategory( this.currentCategory.id, true );
    }

    moveCategory(){

        console.log( 'moveCategory' );

    }

}

