import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

import {distinct, from, map} from 'rxjs';
import {TreeNode} from 'primeng/api';
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
import {ContentField, FieldIndexData} from './models/content_field.model';
import {RenderInputTypeComponent} from '../components/render-input-type.component';

@Component({
    selector: 'app-modal-product',
    templateUrl: 'templates/modal-product.component.html',
    providers: [FilesService]
})
export class ModalProductComponent extends AppModalAbstractComponent<Product> implements OnInit, OnDestroy {

    dataLoaded = false;
    model: Product;
    categoriesTree: TreeNode[] = [];
    categories: Category[] = [];
    currentCategoryNode: TreeNode;
    contentTypes: ContentType[] = [];
    currentContentType: ContentType = new ContentType(0, '', '', '', '', [], [], true);
    localeList: string[];
    localeDefault = '';
    localeCurrent = '';
    localeFieldsAllowed: string[] = [];
    localePreviousValues: {[fieldName: string]: string} = {};
    form = new FormGroup({
        id: new FormControl(0, []),
        parentId: new FormControl(0, []),
        isActive: new FormControl(true, []),
        clearCache: new FormControl(true, [])
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
        this.createLanguageSettings(this.appSettings.settings);
        this.dataService.setRequestUrl(`/admin/products/${this.model.parentId}`);

        this.form.controls['parentId'].setValue(this.model.parentId);
        this.getContentType()
            .then((data) => {
                if (this.config.data.id) {
                    this.getData(this.config.data.id);
                } else {
                    this.updateForm();
                    this.buildControls();
                    setTimeout(() => {
                        this.updateControls();
                        if (this.form.controls.isActive) {
                            this.form.controls.isActive.setValue(true);
                        }
                    }, 0);
                    this.dataLoaded = true;
                }
                this.currentContentType.fields.forEach((field) => {
                    if (['text', 'textarea', 'rich_text'].indexOf(field.inputType) > -1) {
                        this.localeFieldsAllowed.push(field.name);
                    }
                });
                this.currentContentType.groups = [];
                from(this.currentContentType.fields)
                    .pipe(map((v) => v.group), distinct())
                    .subscribe((value) => {
                        this.currentContentType.groups.push(value);
                    });
            }, (err) => {
                this.dataLoaded = true;
                this.errorMessage = err.error || 'Error.';
                this.dataLoaded = true;
            });
    }

    onGetData(item: Product): void {
        this.model = item;
        this.dataLoaded = true;
        this.getCategories();
        this.updateForm();
        this.buildControls();
        setTimeout(() => {
            this.updateControls();
        }, 0);
    }

    buildControls() {
        this.currentContentType.fields.forEach((field) => {
            if (!this.form.controls[field.name]) {
                if (['parameters'].indexOf(field.inputType) > -1) {
                    RenderInputTypeComponent.getParametersOptions(field);
                    this.arrayFieldsData[field.name] = {};
                    (field.inputProperties.keys as string[]).forEach((k) => {
                        this.arrayFieldsData[field.name][k] = {validators: []}
                    });
                    this.createArrayFieldsProperty(field.name);
                    const control = new FormArray([]);
                    this.form.addControl(field.name, control);
                } else {
                    const validators = this.getValidators(field);
                    const control = new FormControl(this.model[field.name] || '', validators);
                    this.form.addControl(field.name, control);
                }
            }
        });
    }

    updateForm(data ?: any): void {
        if (!data) {
            data = JSON.parse(JSON.stringify(this.model));
        }
        const newKeys = this.currentContentType.fields.map((field) => {
            return field.name;
        });
        newKeys.push('id', 'parentId', 'previousParentId', 'isActive', 'clearCache', 'translations');
        data.clearCache = true;
        Object.keys(this.model).forEach((key) => {
            if (key.indexOf('__') > -1) {
                const fieldBaseName = ContentField.getFieldBaseName(key);
                if (fieldBaseName === key) {
                    return;
                }
                const fieldIndexData: FieldIndexData = ContentField.getFieldIndexData(this.currentContentType.fields, fieldBaseName);
                if (fieldIndexData.index === -1) {
                    return;
                }
                const newField = JSON.parse(JSON.stringify(this.currentContentType.fields[fieldIndexData.index]));
                newField.name = key;
                this.currentContentType.fields.splice(
                    fieldIndexData.index + fieldIndexData.additFieldsCount + 1,
                    0,
                    newField
                );
                newKeys.push(key);
            }
        });

        // Remove keys
        for (const key in this.form.controls) {
            if (this.form.controls.hasOwnProperty(key)) {
                if (newKeys.indexOf(key) === -1) {
                    this.form.removeControl(key);
                }
            }
        }
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

    getValidators(field: ContentField): any[] {
        const validators = [];
        if (field.required) {
            validators.push(Validators.required);
        }
        return validators;
    }
    
    onParametersDelete(data: any[]): void {
        this.arrayFieldDelete(data[0], data[1]);
    }

    onParametersUpdate(data: any[]): void {
        this.arrayFieldUpdate(data[0], data[1]);
    }

    getFormData(): any {
        const data = super.getFormData();
        if (this.model && this.model.parentId && typeof data.parentId === 'undefined') {
            data.parentId = this.model.parentId;
        }
        data['fieldsSort'] = this.getFieldsSortData();
        return data;
    }

    fieldAdd(field: ContentField): void {
        const fieldIndexData = ContentField.getFieldIndexData(this.currentContentType.fields, field.name);
        if (fieldIndexData.index === -1) {
            return;
        }
        const baseFieldName = ContentField.getFieldBaseName(field.name);
        const newField = JSON.parse(JSON.stringify(field));
        newField.name = `${baseFieldName}__${fieldIndexData.additFieldsCount + 1}`;
        this.currentContentType.fields.splice(fieldIndexData.index + 1, 0, newField);
        this.buildControls();
    }

    filesUploadRequest(formData: FormData, itemId: number) {
        formData.append('itemId', String(itemId));
        formData.append('ownerType', this.currentContentType.name);
        formData.append('categoryId', String(this.model.parentId));
        formData.append('fieldsSort', this.getFieldsSortData().join(','));
        return this.filesService.postFormData(formData);
    }

    getFieldsSortData(): string[] {
        const fileFields = this.currentContentType.fields.filter((field) => {
            return field.inputType === 'file';
        });
        return fileFields.map((field) => {
            return field.name;
        });
    }
}
