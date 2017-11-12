import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbTooltipConfig  } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import * as _ from "lodash";

import { ContentType } from './models/content_type.model';
import { Category } from "./models/category.model";
import { ModalContentAbstractComponent } from './modal.abstract';
import { CategoriesService } from './services/categories.service';
import { ContentTypesService } from './services/content_types.service';
import { ProductsService } from './services/products.service';
import { SystemNameService } from './services/system-name.service';
import { Product } from './models/product.model';
import { FilesService } from './services/files.service';

@Component({
    selector: 'product-modal-content',
    templateUrl: 'templates/modal-product.html',
    providers: [ SystemNameService, FilesService ]
})
export class ProductModalContent extends ModalContentAbstractComponent<Product> {

    @Input() category: Category;
    categories: Category[] = [];
    contentTypes: ContentType[] = [];
    currentContentType: ContentType = new ContentType(0, '', '', '', '', [], [], true);
    model: Product = {} as Product;

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
        public fb: FormBuilder,
        public dataService: ProductsService,
        public systemNameService: SystemNameService,
        public activeModal: NgbActiveModal,
        public tooltipConfig: NgbTooltipConfig,
        private contentTypesService: ContentTypesService,
        private categoriesService: CategoriesService,
        private filesService: FilesService
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
            }, (err) => {
                this.errorMessage = err.error || 'Error.';
            });
    }

    getSystemFieldName(): string {
        const index = _.findIndex(this.currentContentType.fields, {inputType: 'system_name'});
        return index > -1 ? this.currentContentType.fields[index].name : 'name';
    }

    getCategories() {
        this.loading = true;
        this.categoriesService.getListPage()
            .subscribe(data => {
                this.categories = data.items;
                this.loading = false;
            }, (err) => {
                this.errorMessage = err.error || 'Error.';
            });
    }

    getContentType(): Promise<ContentType> {
        if(!this.category.contentTypeName){
            return Promise.reject({error: 'Content type name not found.'});
        }
        return new Promise((resolve, reject) => {
            this.contentTypesService.getItemByName(this.category.contentTypeName)
                .subscribe((data) => {
                    this.currentContentType = data as ContentType;
                    this.errorMessage = '';
                    this.updateForm();
                    this.loading = false;
                    resolve(data);
                }, (err) => {
                    this.errorMessage = err.error || 'Error.';
                    this.loading = false;
                    reject(err);
                });
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

    saveFiles(itemId: number) {
        if (Object.keys(this.files).length === 0) {
            this.closeModal();
            return;
        }

        const formData: FormData = new FormData();
        for (let key in this.files) {
            if (this.files.hasOwnProperty(key) && this.files[key] instanceof File) {
                formData.append(key, this.files[key], this.files[key].name);
            }
        }
        formData.append('itemId', itemId);
        formData.append('ownerType', this.currentContentType.name);

        this.filesService.postFormData(formData)
            .subscribe(() => {
                this.closeModal();
            },
            err => {
                this.errorMessage = err.error || 'Error.';
                this.submitted = false;
            });
    }

    save() {
        this.submitted = true;
        if(!this.form.valid){
            this.onValueChanged('form');
            this.submitted = false;
            return;
        }

        this.dataService.setRequestUrl('admin/products/' + this.category.id);

        this.saveRequest()
            .subscribe((data) => {
                    if (Object.keys(this.files).length > 0) {
                        this.saveFiles(data._id);
                    } else {
                        this.closeModal();
                    }
                },
                err => {
                    this.errorMessage = err.error || 'Error.';
                    this.submitted = false;
                });
    }
}
