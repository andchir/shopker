import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoriesService } from './services/categories.service'
import { ContentTypesService } from './services/content_types.service';
import { ContentType } from './models/content_type.model';
import { Category } from "./models/category.model";
import { ConfirmModalContent } from './app.component';
import 'rxjs/add/operator/switchMap';
import * as _ from "lodash";

@Component({
    selector: 'category-modal-content',
    templateUrl: 'templates/modal_category.html',
    providers: [ CategoriesService ]
})
export class CategoriesModalComponent implements OnInit {
    @Input() modalTitle;
    @Input() itemId;
    @Input() isItemCopy;
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

@Component({
    selector: 'categories-menu',
    templateUrl: 'templates/categories-menu.html',
    providers: [ CategoriesService ]
})
export class CategoriesMenuComponent implements OnInit {
    @Input() rootTitle: string = '';
    currentCategory: Category;
    categories: Category[] = [];
    errorMessage: string = '';
    modalRef: NgbModalRef;

    constructor(
        public router: Router,
        private modalService: NgbModal,
        private categoriesService: CategoriesService,
        private route: ActivatedRoute,
        private location: Location,
        private titleService: Title
    ) {}

    ngOnInit(): void {
        this.getCategories();
        this.openRootCategory();

        let routeParams = this.route.params['value'];
        if( routeParams.categoryId ){
            this.route.params
                .switchMap((params: Params) => this.categoriesService.getItem(params['categoryId']))
                .subscribe((category: Category) => this.currentCategory = category);
        }
    }

    getCategories() {
        this.categoriesService.getList()
            .then(
                items => {
                this.categories = items;
            },
            error => this.errorMessage = <any>error);
    }

    openModalCategory( itemId?: number, isItemCopy?: boolean ): void {
        this.modalRef = this.modalService.open(CategoriesModalComponent, {size: 'lg'});
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
                        this.errorMessage = res.msg;
                    }
                }
            });
    }

    openRootCategory(): void {
        this.currentCategory = new Category(0,0,'root','Категории','','');
        this.titleService.setTitle( this.rootTitle );
    }

    selectCategory( category: Category ): void {
        this.router.navigate(['/catalog', category.id]);
        //this.currentCategory = _.clone( category );
        //this.titleService.setTitle( this.rootTitle + ' / ' + this.currentCategory.title );
    }

    copyCategory(){

        console.log( 'copyCategory' );

    }

    moveCategory(){

        console.log( 'moveCategory' );

    }

}

