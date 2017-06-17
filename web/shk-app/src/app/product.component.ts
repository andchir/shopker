import { Component, OnInit, Input, Pipe, PipeTransform } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
        this.form = this.fb.group({
            content_type: [this.model.content_type, [Validators.required]],
            title: [this.model.title, [Validators.required]],
            name: [this.model.name, [Validators.required, Validators.pattern('[A-Za-z0-9_-]+')]],
            description: [this.model.description, []]
        });
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
        }
        console.log( 'selectCurrentContentType', index, this.contentTypes, this.currentContentType );
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

        this.submitted = true;


    }
}
