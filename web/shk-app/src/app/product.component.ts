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
        parent_id: {
            value: 0,
            validators: [Validators.required],
            messages: {
                required: 'Category is required.'
            }
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
        private contentTypesService: ContentTypesService,
        private categoriesService: CategoriesService
    ) {
        super(fb, dataService, systemNameService, activeModal, tooltipConfig);

        this.model.id = 0;
        this.model.parent_id = 0;
    }

    /** On initialize */
    ngOnInit(): void {

        this.model.parent_id = this.category.id;
        this.dataService.setRequestUrl('admin/products/' + this.category.id);

        this.buildForm();
        this.getCategories();
        this.getContentType();

        if (this.itemId) {
            this.getModelData();
        }
    }

    getCategories() {
        this.loading = true;
        this.categoriesService.getList()
            .subscribe((res) => {
                if(res.success){
                    this.categories = res.data;
                } else {
                    if (res.msg) {
                        this.errorMessage = res.msg;
                    }
                }
                this.loading = false;
            });
    }

    getContentType() {
        if(!this.category.content_type_name){
            return;
        }
        this.loading = true;
        this.contentTypesService.getItemByName(this.category.content_type_name)
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

    /** Build form */
    updateForm(data ?: any): void {
        if(!data){
            data = _.clone(this.model);
        }
        let newKeys = _.map(this.currentContentType.fields, function(field){
            return field.name;
        });
        newKeys.push('parent_id', 'is_active');

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

    getModelData(): void {
        this.loading = true;
        this.dataService.getItem(this.itemId)
            .then(res => {
                if(res.success){
                    this.model = res.data;
                } else {
                    if (res.msg) {
                        this.errorMessage = res.msg;
                    }
                }
                this.loading = false;
            });
    }

    /** On change content type */
    onChangeContentType(): void {
        const parentId = parseInt(String(this.model.parent_id));
        let index = _.findIndex(this.categories, {id: parentId});
        if (index == -1) {
            return;
        }
        this.category = _.clone(this.categories[index]);
        this.getContentType();
    }

    /** Save data */
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
