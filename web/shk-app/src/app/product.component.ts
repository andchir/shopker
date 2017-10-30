import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbTooltipConfig  } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { ContentType } from './models/content_type.model';
import { Category } from "./models/category.model";
import * as _ from "lodash";

import { ModalContentAbstractComponent } from './page-table.abstract';
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
    categories: Category[] = [];
    contentTypes: ContentType[] = [];
    currentContentType: ContentType = new ContentType(0, '', '', '', '', [], [], true);
    model: {[key: string]: any} = {};

    formFields = {
        parentId: {
            value: 0,
            validators: [Validators.required],
            messages: {
                required: 'Category is required.'
            }
        },
        isActive: {
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
        private contentTypesService: ContentTypesService,
        private categoriesService: CategoriesService
    ) {
        super(fb, dataService, systemNameService, activeModal, tooltipConfig);

        this.model.id = 0;
        this.model.parentId = 0;
    }

    ngOnInit(): void {
        this.model.parentId = this.category.id;
        this.dataService.setRequestUrl('admin/products/' + this.category.id);

        this.buildForm();
        this.getCategories();
        this.getContentType()
            .then(() => {
                if (this.itemId) {
                    this.getModelData();
                }
            });
    }

    getSystemFieldName(): string {
        const index = _.findIndex(this.currentContentType.fields, {inputType: 'system_name'});
        return index > -1 ? this.currentContentType.fields[index].name : 'name';
    }

    getCategories() {
        this.loading = true;
        this.categoriesService.getList()
            .subscribe(preparedData => {
                this.categories = preparedData.data;
                this.errorMessage = preparedData.errorMsg;
                this.loading = false;
            });
    }

    getContentType(): Promise<any> {
        if(!this.category.contentTypeName){
            return Promise.reject('Content type name not found.');
        }
        this.loading = true;
        return this.contentTypesService.getItemByName(this.category.contentTypeName)
            .then((res) => {
                if(res.success){
                    this.currentContentType = res.data as ContentType;
                    this.updateForm();
                } else {
                    if (res.msg) {
                        this.errorMessage = res.msg;
                    }
                }
                this.loading = false;
            });
    }

    updateForm(data ?: any): void {
        if(!data){
            data = _.clone(this.model);
        }
        let newKeys = _.map(this.currentContentType.fields, function(field){
            return field.name;
        });
        newKeys.push('parentId', 'isActive');

        //Remove keys
        for (let key in this.form.controls) {
            if (this.form.controls.hasOwnProperty(key)) {
                if(newKeys.indexOf(key) === -1){
                    this.form.removeControl(key);
                }
            }
        }
        this.model = _.pick(data, newKeys);
    }

    onChangeContentType(): void {
        const parentId = parseInt(String(this.model.parentId));
        let index = _.findIndex(this.categories, {id: parentId});
        if (index == -1) {
            return;
        }
        this.category = _.clone(this.categories[index]);
        this.getContentType();
    }

    save() {
        this.submitted = true;

        if(!this.form.valid){
            this.onValueChanged('form');
            this.submitted = false;
            return;
        }

        this.dataService.setRequestUrl('admin/products/' + this.category.id);

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

        if (this.model.id) {
            this.dataService.update(this.model).then(callback.bind(this));
        } else {
            this.dataService.create(this.model).then(callback.bind(this));
        }
    }
}
