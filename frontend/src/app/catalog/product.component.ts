import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormBuilder, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {findIndex, clone, cloneDeep, map, pick} from 'lodash';
import {TranslateService} from '@ngx-translate/core';

import {ContentType} from './models/content_type.model';
import {Category} from './models/category.model';
import {ModalContentAbstractComponent} from '../modal.abstract';
import {SystemNameService} from '../services/system-name.service';
import {Product} from './models/product.model';

import {CategoriesService} from './services/categories.service';
import {ContentTypesService} from './services/content_types.service';
import {ProductsService} from './services/products.service';
import {FilesService} from './services/files.service';
import {ContentField, FieldIndexData} from './models/content_field.model';
import {TranslationsComponent} from '../translations.component';
import {AppSettings} from '../services/app-settings.service';
import {FormFieldInterface} from '../models/form-field.interface';

@Component({
    selector: 'app-product-modal-content',
    templateUrl: 'templates/modal-product.html',
    providers: [ProductsService]
})
export class ProductModalContentComponent extends ModalContentAbstractComponent<Product> implements OnInit {

    @Input() category: Category;
    categories: Category[] = [];
    contentTypes: ContentType[] = [];
    currentContentType: ContentType = new ContentType(0, '', '', '', '', [], [], true);
    model = {} as Product;
    timer: any;

    formFields: FormFieldInterface = {
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
        },
        clearCache: {
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
        public translateService: TranslateService,
        public elRef: ElementRef,
        private contentTypesService: ContentTypesService,
        private categoriesService: CategoriesService,
        private filesService: FilesService,
        private appSettings: AppSettings
    ) {
        super(fb, dataService, systemNameService, activeModal, tooltipConfig, translateService, elRef);

        this.model.id = 0;
        this.model.parentId = 0;
    }

    ngOnInit(): void {
        this.uniqueId = this.createUniqueId();
        if (this.elRef) {
            this.getRootElement().setAttribute('id', this.modalId);
        }
        this.localeList = this.appSettings.settings.localeList;
        if (this.localeList.length > 0) {
            this.localeDefault = this.localeList[0];
            this.localeCurrent = this.localeList[0];
        }
        this.model.clearCache = true;
        this.model.parentId = this.category.id;
        this.dataService.setRequestUrl('/admin/products/' + this.category.id);

        this.buildForm();
        this.getCategories();
        this.getContentType()
            .then((data) => {
                if (this.itemId) {
                    return this.getModelData();
                } else {
                    return Promise.reject('');
                }
            }, (err) => {
                this.errorMessage = err.error || 'Error.';
                return Promise.reject('');
            })
            .then((data) => {
                this.onAfterGetData();
                this.updateForm();
            }, () => {
                this.onAfterGetData();
            });
    }

    onAfterGetData() {
        // Search fields allowed to translation
        this.currentContentType.fields.forEach((field) => {
            if (['text', 'textarea', 'rich_text'].indexOf(field.inputType) > -1) {
                this.localeFieldsAllowed.push(field.name);
            }
        });
        if (!this.model.translations || Array.isArray(this.model.translations)) {
            this.model.translations = {};
        }
    }

    getSystemFieldName(): string {
        return ContentType.getSystemFieldName(this.currentContentType);
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
        this.loading = true;
        if (!this.category.contentTypeName) {
            return Promise.reject({error: 'Content type name not found.'});
        }
        return new Promise((resolve, reject) => {
            this.contentTypesService.getItemByName(this.category.contentTypeName)
                .subscribe((data) => {
                    this.currentContentType = data as ContentType;
                    this.errorMessage = '';
                    this.loading = false;
                    resolve(data);
                }, (err) => {
                    this.errorMessage = err.error || 'Error.';
                    this.loading = false;
                    reject(err);
                });
        });
    }

    /**
     * Update form
     * @param data
     */
    updateForm(data ?: any): void {
        if (!data) {
            data = clone(this.model);
        }
        const newKeys = map(this.currentContentType.fields, function(field) {
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
                const newField = cloneDeep(this.currentContentType.fields[fieldIndexData.index]);
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
        this.model = pick(data, newKeys) as Product;
    }

    onChangeContentType(): void {
        const parentId = parseInt(String(this.model.parentId), 10);
        const index = findIndex(this.categories, {id: parentId});
        if (index === -1) {
            return;
        }
        if (!this.currentContentType
            || (this.currentContentType.name !== this.categories[index].contentTypeName)) {
                this.model.previousParentId = this.category.id;
                this.category = cloneDeep(this.categories[index]);
                this.getContentType();
        }
    }

    saveFiles(itemId: number) {
        if (Object.keys(this.files).length === 0) {
            this.closeModal();
            return;
        }

        const formData: FormData = new FormData();
        for (const key in this.files) {
            if (this.files.hasOwnProperty(key) && this.files[key] instanceof File) {
                formData.append(key, this.files[key], this.files[key].name);
            }
        }
        formData.append('itemId', String(itemId));
        formData.append('ownerType', this.currentContentType.name);
        formData.append('categoryId', String(this.model.parentId));
        formData.append('fieldsSort', this.getFieldsSortData().join(','));

        this.filesService.postFormData(formData)
            .subscribe(() => {
                this.closeModal();
            },
            err => {
                this.errorMessage = err.error || 'Error.';
                this.submitted = false;
                this.loading = false;
            });
    }

    getErrorsString(): string {
        const errors: string[] = [];
        Object.keys(this.form.controls).forEach((key) => {
            if (this.form.controls[key].invalid) {
                if (this.validationMessages[key]) {
                    const fieldBaseName = ContentField.getFieldBaseName(key);
                    const field = ContentType.getFieldByName(this.currentContentType, fieldBaseName);
                    if (!field) {
                        return;
                    }
                    let err = '';
                    if (this.formErrors[key]) {
                        err = this.formErrors[key];
                    } else {
                        err = `${field.title} - error.`;
                    }
                    errors.push(err);
                }
            }
        });
        return errors.join(' ');
    }

    getFormData() {
        const data = cloneDeep(this.model);

        // Delete temporary data
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                if (data[key]
                    && typeof data[key] === 'object'
                    && data[key].dataUrl) {
                        delete data[key].dataUrl;
                }
            }
        }

        data['fieldsSort'] = this.getFieldsSortData();
        return data;
    }

    getFieldsSortData(): string[] {
        let sordData = this.currentContentType.fields.map((field) => {
            return field.name;
        });
        sordData = sordData.filter((fieldName: string) => {
            if (!this.model[fieldName] || fieldName.indexOf('__') === -1) {
                return false;
            }
            const tmp = fieldName.split('__');
            return !isNaN(tmp[1] as any);
        });
        return sordData;
    }

    save(autoClose = false) {
        this.submitted = true;
        this.errorMessage = null;

        if (!this.form.valid) {
            this.onValueChanged('form');
            this.errorMessage = this.getErrorsString();
            this.submitted = false;
            return;
        }

        this.loading = true;
        this.dataService.setRequestUrl('/admin/products/' + this.category.id);

        this.saveRequest()
            .subscribe({
                next: (res) => {
                    if (Object.keys(this.files).length > 0) {
                        this.saveFiles(res['id'] || res['_id']);
                    } else {
                        if (autoClose) {
                            this.closeModal();
                        } else if (res && (res['id'] || res['_id'])) {
                            this.model = res as Product;
                            this.model.id = res['id'] || res['_id'];
                            this.isEditMode = true;
                        }
                        this.closeReason = 'updated';
                        this.loading = false;
                        this.submitted = false;
                    }
                },
                error: (err) => {
                    this.errorMessage = err.error || 'Error.';
                    this.submitted = false;
                    this.loading = false;
                }
            });
    }
}
