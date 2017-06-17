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
    @Input() modalTitle;
    @Input() itemId;
    @Input() categoryContentTypeName;
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
        this.model = new Product(0,0,this.categoryContentTypeName,'','','');

        this.buildForm();
        this.getContentTypes();
        if( this.itemId ){
            this.getModelData();
        }
    }

    /** Build form */
    buildForm(): void {
        if( !this.form ){

            let group: any = {};
            group['content_type'] = new FormControl('', Validators.required);
            this.currentContentType.fields.forEach(field => {
                group[field.name] = field.required
                    ? new FormControl('', Validators.required)
                    : new FormControl('');
            });
            this.form = new FormGroup(group);
            this.form.valueChanges
                .subscribe(data => this.onValueChanged(data));

        } else {

            let data = this.form.value;
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
                    console.log( 'ADD CONTROL', field.name );
                    let group = field.required
                        ? new FormControl(data[field.name] || '', Validators.required)
                        : new FormControl(data[field.name] || '');
                    this.form.addControl( field.name, group );
                }
            });
        }
    }

    getModelData(): void {

        console.log( 'getModelData', this.itemId );

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
            this.buildForm();
        }
    }

    /** On change content type */
    onChangeContentType(): void {
        this.selectCurrentContentType();
    }

    /** Get content types */
    getContentTypes(){
        this.contentTypesService.getList( true )
            .then(
                items => {
                    this.contentTypes = items;
                    this.selectCurrentContentType();
                },
                error => this.errorMessage = <any>error);
    }

    /**
     * On form value changed
     * @param data
     */
    onValueChanged(data?: any){
        if (!this.form) { return; }

        console.log( 'onValueChange', data );

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

        this.productsService.createItem( this.form.value )
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
        this.activeModal.close();
    }
}
