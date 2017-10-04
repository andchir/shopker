import { Component, OnInit, Input, Pipe, PipeTransform } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef, NgbTooltipConfig  } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContentType } from './models/content_type.model';
import { Category } from "./models/category.model";
import { Product } from "./models/product.model";
import { QueryOptions } from './models/query-options';
import { ContentField } from "./models/content_field.model";
import { FilterFieldByGroup } from "./pipes/filter-field-by-group.pipe";
import { DataService } from './services/data-service.abstract';
import { PageTableAbstractComponent, ModalContentAbstractComponent } from './page-table.abstract';
import * as _ from "lodash";

import { CategoriesService } from './services/categories.service';
import { ContentTypesService } from './services/content_types.service';
import { ProductsService } from './services/products.service';
import { SystemNameService } from './services/system-name.service';

@Component({
    selector: 'product-modal-content',
    templateUrl: 'templates/modal-product.html',
    providers: [ SystemNameService ]
})
export class ProductModalContent extends ModalContentAbstractComponent {

    @Input() category: Category;
    contentTypes: ContentType[] = [];
    currentContentType: ContentType = new ContentType(0, '', '', '', '', [], [], true);
    model: Product = new Product(0, true, 0, '', '', '');

    formFields = {
        content_type: {
            value: '',
            validators: [],
            messages: {}
        },
        is_active: {
            value: true,
            validators: [],
            messages: {}
        }
    };

    constructor(
        fb: FormBuilder,
        dataService: ProductsService,
        systemNameService: SystemNameService,
        activeModal: NgbActiveModal,
        tooltipConfig: NgbTooltipConfig,
        private contentTypesService: ContentTypesService
    ) {
        super(fb, dataService, systemNameService, activeModal, tooltipConfig);
    }

    /** On initialize */
    ngOnInit(): void {

        this.buildForm();
        if(this.itemId){

            this.getModelData();

        } else {
            this.getContentTypes()
                .subscribe(
                    res => {
                        if(res.success){
                            this.contentTypes = res.data;
                            this.selectCurrentContentType();
                            this.updateForm();
                        } else {
                            if(res.msg){
                                this.errorMessage = res.msg;
                            }
                        }
                    },
                    error => this.errorMessage = <any>error);
        }
    }

    /** Build form */
    updateForm(data ?: any): void {
        if(!data){
            data = this.form.value;
        }
        let newKeys = _.map(this.currentContentType.fields, function(field){
            return field.name;
        });
        newKeys.push('content_type');

        //Remove keys
        for (let key in this.form.controls) {
            if (this.form.controls.hasOwnProperty(key)) {
                if(newKeys.indexOf(key) === -1){
                    this.form.removeControl(key);
                }
            }
        }

        //Add new controls
        this.currentContentType.fields.forEach(field => {
            if (!this.form.controls[field.name]) {
                let group = field.required
                    ? new FormControl(data[field.name] || '', Validators.required)
                    : new FormControl(data[field.name] || '');
                this.form.addControl(field.name, group);
            }
        });
    }

    getModelData(): void {
        this.loading = true;

        this.dataService.getItem(this.itemId)
            .then(data => {
                return new Promise((resolve, reject) => {
                    this.getContentTypes()
                        .subscribe(res => {
                            if(res.success){
                                this.contentTypes = res.data;
                                resolve(res.data);
                            }
                        });
                });
            })
            .then(data => {
                this.setCurrentContentType(data.content_type);
                this.updateForm(data);
                this.loading = false;
            });
    }

    /** Select current content type */
    selectCurrentContentType(): void {
        let index = _.findIndex(this.contentTypes, {name: this.form.get('content_type').value});
        if (index == -1) {
            index = 0;
        }
        if (this.contentTypes[index]) {
            this.currentContentType = _.clone(this.contentTypes[index]);
            this.form.get('content_type').setValue(this.currentContentType.name);
            this.updateForm();
        }
    }

    setCurrentContentType(contentTypeName: string): void {
        let index = _.findIndex(this.contentTypes, {name: contentTypeName});
        if (index == -1) {
            index = 0;
        }
        if (this.contentTypes[index]) {
            this.currentContentType = _.clone(this.contentTypes[index]);
            this.form.get('content_type').setValue(this.currentContentType.name);
        }
    }

    /** On change content type */
    onChangeContentType(): void {
        this.selectCurrentContentType();
    }

    /** Get content types */
    getContentTypes() {
        let queryOptions = new QueryOptions('name', 'asc', 1, 0, 1, 1);
        return this.contentTypesService.getList(queryOptions);
    }

    // /**
    //  * On form value changed
    //  * @param data
    //  */
    // onValueChanged(data?: any) {
    //     if (!this.form) {
    //         return;
    //     }
    //
    //     console.log('onValueChange', data);
    //
    // }

    save() {
        this.submitted = true;

        console.log('SAVE', this.form.valid, this.form.value);

        if(!this.form.valid){
            this.onValueChanged('form');
            this.submitted = false;
            return;
        }

        let callback = function (res: any) {
            if (res.success) {
                this.closeModal();
            } else {
                if (res.msg) {
                    this.submitted = false;
                    this.errorMessage = res.msg;
                }
            }
        };

        this.model.parent_id = this.category.id;

        if (this.model.id) {
            this.dataService.update(this.model).then(callback.bind(this));
        } else {
            this.dataService.create(this.model).then(callback.bind(this));
        }

    }
}
