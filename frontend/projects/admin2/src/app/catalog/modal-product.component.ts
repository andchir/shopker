import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

import {AppModalAbstractComponent} from '../components/modal.component.abstract';
import {Product} from './models/product.model';
import {ProductsService} from './services/products.service';
import {SystemNameService} from '../services/system-name.service';
import {Category} from './models/category.model';
import {ContentType} from './models/content_type.model';
import {ContentTypesService} from './services/content_types.service';
import {CategoriesService} from './services/categories.service';
import {FilesService} from './services/files.service';
import {AppSettings} from '../services/app-settings.service';

@Component({
    selector: 'app-modal-product',
    templateUrl: 'templates/modal-product.component.html',
    providers: [FilesService]
})
export class ModalProductComponent extends AppModalAbstractComponent<Product> implements OnInit, OnDestroy {

    dataLoaded = false;
    model: Product;
    categories: Category[] = [];
    contentTypes: ContentType[] = [];
    currentContentType: ContentType = new ContentType(0, '', '', '', '', [], [], true);
    localeList: string[];
    localeDefault = '';
    localeCurrent = '';
    localeFieldsAllowed: string[] = [];
    localePreviousValues: {[fieldName: string]: string} = {};
    form = new FormGroup({
        id: new FormControl('', [])
    });

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public systemNameService: SystemNameService,
        public dataService: ProductsService,
        private contentTypesService: ContentTypesService,
        private categoriesService: CategoriesService,
        private filesService: FilesService,
        private appSettings: AppSettings
    ) {
        super(ref, config, systemNameService, dataService);
    }

    ngOnInit() {
        this.model = {
            id: this.config.data.id || 0,
            parentId: this.config.data.parentId || 0
        } as Product;
        this.localeList = this.appSettings.settings.localeList;
        if (this.localeList.length > 0) {
            this.localeDefault = this.localeList[0];
            this.localeCurrent = this.localeList[0];
        }
        this.dataService.setRequestUrl(`/admin/products/${this.model.parentId}`);

        this.getCategories();
        this.getContentType()
            .then((data) => {
                if (this.config.data.id) {
                    this.getData(this.config.data.id);
                } else {
                    this.updateControls();
                    this.dataLoaded = true;
                }
            }, (err) => {
                this.dataLoaded = true;
                this.errorMessage = err.error || 'Error.';
                this.dataLoaded = true;
            });
    }

    onGetData(item: Product): void {
        this.model = item;
        this.dataLoaded = true;
        this.updateControls();
    }

    getCategories() {
        this.categoriesService.getListPage()
            .subscribe({
                next: (data) => {
                    this.categories = data.items;
                },
                error: (err) => {
                    this.errorMessage = err.error || 'Error.';
                }
            });
    }

    getContentType(): Promise<ContentType> {
        this.loading = true;
        return new Promise((resolve, reject) => {
            this.contentTypesService.getItemByCategory(this.model.parentId)
                .subscribe({
                    next: (data) => {
                        Object.assign(this.currentContentType, data);
                        this.errorMessage = '';
                        this.loading = false;
                        resolve(data);
                    },
                    error: (err) => {
                        this.errorMessage = err.error || 'Error.';
                        this.loading = false;
                        reject(err);
                    }
                });
        });
    }
}
