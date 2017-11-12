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

@Component({
    selector: 'product-modal-content',
    templateUrl: 'templates/modal-product.html',
    providers: [ SystemNameService ]
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
            .subscribe(() => {
                if (this.itemId) {
                    this.getModelData();
                }
            }, (msg) => {
                this.errorMessage = msg;
            });
    }

    getSystemFieldName(): string {
        const index = _.findIndex(this.currentContentType.fields, {inputType: 'system_name'});
        return index > -1 ? this.currentContentType.fields[index].name : 'name';
    }

    getCategories() {
        this.loading = true;
        this.categoriesService.getList()
            .subscribe(data => {
                this.categories = data;
                this.loading = false;
            }, (err) => {
                this.errorMessage = err;
            });
    }

    getContentType(): Observable<ContentType> {
        if(!this.category.contentTypeName){
            // return Promise.reject('Content type name not found.');
        }
        this.loading = true;
        return this.contentTypesService.getItemByName(this.category.contentTypeName);
            // .subscribe((data) => {
            //     this.currentContentType = data as ContentType;
            //     this.errorMessage = '';
            //     this.updateForm();
            //     this.loading = false;
            // }, (err) => {
            //     this.errorMessage = err;
            // });
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

        console.log('SAVE FILES', this.files, itemId);

        const formData: FormData = new FormData();
        for (let key in this.files) {
            if (this.files.hasOwnProperty(key) && this.files[key] instanceof File) {
                formData.append(key, this.files[key], this.files[key].name);
            }
        }

        // TODO: Save files

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
                if (!_.isEmpty(this.files) && res.data._id) {
                    this.saveFiles(res.data._id);
                } else {
                    this.closeModal();
                }
            } else {
                if (res.msg) {
                    this.submitted = false;
                    this.errorMessage = res.msg;
                }
            }
        };

        if (this.model.id) {
            // this.dataService.update(this.model).then(callback.bind(this));
        } else {
            // this.dataService.create(this.model).then(callback.bind(this));
        }
    }
}
