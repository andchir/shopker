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
import * as _ from "lodash";

import { PageTableAbstractComponent, ModalContentAbstractComponent } from './page-table.abstract';
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
    model = {
        id: 0,
        parent_id: 0
    };

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

        this.dataService.setRequestUrl('admin/products/' + this.category.id);
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
            data = this.model;
        }
        let newKeys = _.map(this.currentContentType.fields, function(field){
            return field.name;
        });
        newKeys.push('content_type', 'is_active');

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
                this.model[field.name] = data[field.name] || '';
                let validators = [];
                if(field.required){
                    validators.push(Validators.required);
                }
                let control = new FormControl(this.model[field.name], validators);
                this.form.addControl(field.name, control);
            }
        });
    }

    getModelData(): void {
        this.loading = true;
        this.dataService.getItem(this.itemId)
            .then(res => {
                return new Promise((resolve, reject) => {
                    this.getContentTypes()
                        .subscribe(resp => {
                            if(resp.success){
                                this.contentTypes = resp.data;
                                if(res.success){
                                    resolve(res.data);
                                } else {
                                    reject(res);
                                }
                            }
                        });
                });
            })
            .then(data => {
                this.model = data;
                this.selectCurrentContentType(data.content_type);
                this.loading = false;
            });
    }

    /** Select current content type */
    selectCurrentContentType(contentTypeName?: string): void {
        contentTypeName = contentTypeName || this.form.get('content_type').value;
        let index = _.findIndex(this.contentTypes, {name: contentTypeName});
        if (index == -1) {
            index = 0;
        }
        if (this.contentTypes[index]) {
            this.currentContentType = _.clone(this.contentTypes[index]);
            this.form.get('content_type').setValue(this.currentContentType.name);
            this.updateForm();
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

    save() {
        this.submitted = true;

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
