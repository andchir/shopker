import { Component, OnInit, Input, Pipe, PipeTransform } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoriesService } from './services/categories.service';
import { ContentTypesService } from './services/content_types.service';
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

    buildForm(): void {

        let group: any = {};
        this.currentContentType.fields.forEach(field => {
            group[field.name] = field.required
                ? new FormControl('', Validators.required)
                : new FormControl('');
        });
        this.form = new FormGroup(group);
        this.form.valueChanges
            .subscribe(data => this.onValueChanged(data));
    }

    getModelData(): void {

        console.log( 'getModelData', this.itemId );

    }

    selectCurrentContentType(): void {
        let index = _.findIndex( this.contentTypes, {name: this.model.content_type} );
        if( index == -1 ){
            index = 0;
        }
        if( this.contentTypes[index] ){
            this.currentContentType = _.clone( this.contentTypes[index] );
            if( !this.model.content_type ){
                this.model.content_type = this.currentContentType.name;
            }
            this.buildForm();
        }
    }

    onChangeContentType(): void {
        this.selectCurrentContentType();
    }

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

    onSubmit() {

        this.errorMessage = '';
        this.submitted = true;

        if( !this.form.valid ){
            this.onValueChanged();
            this.errorMessage = 'Please fix the errors fill.';
            return;
        }

        console.log( 'onSubmit', this.form.valid, this.form.value );

    }
}
