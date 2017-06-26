import { Component, OnInit, Input, Pipe, PipeTransform } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoriesService } from './services/categories.service';
import { ContentTypesService } from './services/content_types.service';
import { ProductsService } from './services/products.service';
import { ContentType } from './models/content_type.model';
import { Category } from "./models/category.model";
import { Product } from "./models/product.model";
import { ContentField } from "./models/content_field.model";
import { filterFieldByGroup } from "./filter-field-by-group.pipe";
import * as _ from "lodash";

@Component({
    selector: 'ngbd-modal-content',
    templateUrl: 'templates/modal_product.html'
})
export class ProductModalContent implements OnInit {
    @Input() modalTitle: string;
    @Input() itemId: number;
    @Input() category: Category;
    submitted: boolean = false;
    loading: boolean = false;
    errorMessage: string;
    model: Product;
    contentTypes: ContentType[] = [];
    currentContentType: ContentType = new ContentType('','','','','',[],[],true);

    form: FormGroup;
    formErrors = {
        parent_id: '',
        name: '',
        title: '',
        content_type: ''
    };

    constructor(
        private fb: FormBuilder,
        public activeModal: NgbActiveModal,
        private contentTypesService: ContentTypesService,
        private productsService: ProductsService
    ) {}

    /** On initialize */
    ngOnInit(): void {
        this.model = new Product(0,0,this.category.content_type,'','','',0);

        this.buildForm();
        if( this.itemId ){

            this.getData();

        } else {
            this.getContentTypes()
                .then(
                    items => {
                        this.contentTypes = items;
                        this.selectCurrentContentType();
                        this.updateForm();
                    },
                    error => this.errorMessage = <any>error);
        }
    }

    buildForm(): void{
        let group: any = {};
        group['content_type'] = new FormControl(this.category.content_type, Validators.required);
        this.form = new FormGroup(group);
    }

    /** Build form */
    updateForm(data ?: any): void {
        if( !data ){
            data = this.form.value;
        }
        let newKeys = _.map(this.currentContentType.fields, function(field){
            return field.name;
        });
        newKeys.push( 'content_type' );

        //Remove keys
        for (let key in this.form.controls) {
            if (this.form.controls.hasOwnProperty(key)) {
                if( newKeys.indexOf(key) === -1 ){
                    this.form.removeControl( key );
                }
            }
        }

        //Add new controls
        this.currentContentType.fields.forEach(field => {
            if( !this.form.controls[ field.name ] ){
                let group = field.required
                    ? new FormControl(data[field.name] || '', Validators.required)
                    : new FormControl(data[field.name] || '');
                this.form.addControl( field.name, group );
            }
        });
    }

    getData(): void {
        this.loading = true;

        this.productsService.getItem( this.itemId )
            .then(data => {
                return new Promise((resolve, reject) => {
                    this.getContentTypes()
                        .then(items => {
                            this.contentTypes = items;
                            resolve(data);
                        });
                });
            })
            .then(data => {
                this.setCurrentContentType( data.content_type );
                this.updateForm( data );
                this.loading = false;
            });
    }

    /** Select current content type */
    selectCurrentContentType(): void {
        let index = _.findIndex( this.contentTypes, {name: this.form.get('content_type').value} );
        if( index == -1 ){
            index = 0;
        }
        if( this.contentTypes[index] ){
            this.currentContentType = _.clone( this.contentTypes[index] );
            this.form.get('content_type').setValue(this.currentContentType.name);
            this.updateForm();
        }
    }

    setCurrentContentType( contentTypeName: string ): void {
        let index = _.findIndex( this.contentTypes, {name: contentTypeName} );
        if( index == -1 ){
            index = 0;
        }
        if( this.contentTypes[index] ){
            this.currentContentType = _.clone( this.contentTypes[index] );
            this.form.get('content_type').setValue(this.currentContentType.name);
        }
    }

    /** On change content type */
    onChangeContentType(): void {
        this.selectCurrentContentType();
    }

    /** Get content types */
    getContentTypes(){
        return this.contentTypesService.getList( true );
    }

    /**
     * On form value changed
     * @param data
     */
    onValueChanged(data?: any){
        if (!this.form) { return; }

        //console.log( 'onValueChange', data );

    }

    /** Submit form */
    onSubmit() {

        this.errorMessage = '';
        this.submitted = true;

        if( !this.form.valid ){
            this.onValueChanged();
            this.errorMessage = 'Please fix the errors fill.';
            return;
        }

        let data = this.form.value;
        data.parent_id = this.category.id;

        //TODO: write code for update
        this.productsService.createItem( data )
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

    /** Close modal */
    closeModal() {
        let reason = this.itemId ? 'edit' : 'create';
        this.activeModal.close( { reason: reason, data: this.model } );
    }
}
