import {Component, OnInit, Input, Output, EventEmitter, forwardRef} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';

import {Observable} from 'rxjs';
import {TreeNode} from 'primeng/primeng';

import {findIndex, clone} from 'lodash';
import {TranslateService} from '@ngx-translate/core';

import {NgbModal, NgbActiveModal, NgbModalRef, NgbTooltipConfig, NgbAccordion} from '@ng-bootstrap/ng-bootstrap';
import {ContentType} from './models/content_type.model';
import {Category} from './models/category.model';
import {ListRecursiveComponent} from '../list-recursive.component';
import {ModalContentAbstractComponent} from '../modal.abstract';
import {QueryOptions} from '../models/query-options';
import {ConfirmModalContentComponent} from '../components/modal-confirm-text.component';

import {SystemNameService} from '../services/system-name.service';
import {CategoriesService} from './services/categories.service';
import {ContentTypesService} from './services/content_types.service';
import {FormFieldInterface} from '../models/form-field.interface';
import {AppSettings} from '../services/app-settings.service';
import {FilesService} from './services/files.service';

/**
 * @class CategoriesModalComponent
 */
@Component({
    selector: 'app-category-modal-content',
    templateUrl: 'templates/modal-category.html'
})
export class CategoriesModalComponent extends ModalContentAbstractComponent<Category> implements OnInit {

    @Input() currentCategory: Category;
    @Input() isRoot = false;
    model: Category = new Category(null, false, 0, '', '', '', '', true);
    contentTypes: ContentType[] = [];
    loadingCategories = false;
    categories: TreeNode[] = [];
    currentCategoryNode: TreeNode;
    isCollapsed = false;
    localeFieldsAllowed: string[] = ['title', 'description'];
    files: { [key: string]: File } = {};

    formFields: FormFieldInterface = {
        title: {
            fieldLabel: 'TITLE',
            value: '',
            disabled: false,
            validators: [Validators.required],
            messages: {}
        },
        name: {
            fieldLabel: 'SYSTEM_NAME',
            value: '',
            disabled: false,
            validators: [Validators.required],
            messages: {}
        },
        description: {
            fieldLabel: 'DESCRIPTION',
            value: '',
            disabled: false,
            validators: [],
            messages: {}
        },
        parentId: {
            fieldLabel: 'PARENT_FOLDER',
            value: 0,
            disabled: false,
            validators: [],
            messages: {}
        },
        image: {
            fieldLabel: 'IMAGE',
            value: null,
            disabled: false,
            validators: [],
            messages: {}
        },
        contentTypeName: {
            fieldLabel: 'CONTENT_TYPE',
            value: '',
            disabled: false,
            validators: [Validators.required],
            messages: {}
        },
        menuIndex: {
            fieldLabel: 'MENU_INDEX',
            value: 0,
            disabled: false,
            validators: [],
            messages: {}
        },
        isActive: {
            fieldLabel: 'ACTIVE',
            value: true,
            disabled: false,
            validators: [],
            messages: {}
        },
        clearCache: {
            fieldLabel: 'CLEAR_FILE_CACHE',
            value: true,
            disabled: false,
            validators: [],
            messages: {}
        }
    };

    constructor(
        public fb: FormBuilder,
        public dataService: CategoriesService,
        public systemNameService: SystemNameService,
        public activeModal: NgbActiveModal,
        public tooltipConfig: NgbTooltipConfig,
        public translateService: TranslateService,
        private filesService: FilesService,
        private contentTypesService: ContentTypesService,
        private appSettings: AppSettings
    ) {
        super(fb, dataService, systemNameService, activeModal, tooltipConfig, translateService);
    }

    /** On initialize */
    ngOnInit(): void {
        this.localeList = this.appSettings.settings.localeList;
        if (this.localeList.length > 0) {
            this.localeDefault = this.localeList[0];
            this.localeCurrent = this.localeList[0];
        }
        if (this.itemId) {
            this.model.id = this.itemId;
        }
        if (this.isEditMode) {
            this.model.parentId = this.currentCategory.parentId;
        } else {
            this.model.parentId = this.currentCategory.id;
        }
        this.model.contentTypeName = this.currentCategory.contentTypeName;
        if (this.isRoot) {
            this.model.id = 0;
            this.model.title = this.getLangString('ROOT_FOLDER');
            this.model.name = 'root';
            this.formFields.title.disabled = true;
            this.formFields.name.disabled = true;
            this.formFields.isActive.disabled = true;
        }
        ModalContentAbstractComponent.prototype.ngOnInit.call(this);
        this.getContentTypes();
    }

    onAfterGetData() {
        this.model.clearCache = true;
        if (!this.model.translations || Array.isArray(this.model.translations)) {
            this.model.translations = {};
        }
    }

    getContentTypes() {
        this.contentTypesService.getListPage()
            .subscribe(
                data => {
                    this.contentTypes = data.items;
                },
                error => this.errorMessage = <any>error);
    }

    onCategorySelect(e: any): void {
        this.form.controls.parentId.setValue(e.node.id);
        this.model.parentId = e.node.id;
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
        formData.append('ownerType', 'category');

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

    save(): void {
        this.submitted = true;
        if (!this.form.valid) {
            this.onValueChanged('form');
            this.submitted = false;
            return;
        }
        this.loading = true;
        this.saveRequest()
            .subscribe((data) => {
                if (Object.keys(this.files).length > 0) {
                    this.saveFiles(data._id || data.id);
                } else {
                    this.closeModal();
                }
            }, (err) => {
                this.errorMessage = err.error;
                this.submitted = false;
                this.loading = false;
            });
    }
}

/**
 * @class CategoriesListComponent
 */
@Component({
    selector: 'app-categories-list',
    templateUrl: 'templates/categories-menu-item.html'
})
export class CategoriesListComponent extends ListRecursiveComponent {

}

/**
 * @class CategoriesMenuComponent
 */
@Component({
    selector: 'app-categories-menu',
    templateUrl: 'templates/categories-menu.html'
})
export class CategoriesMenuComponent implements OnInit {
    @Input() rootTitle = 'Категории';
    @Output() changeRequest = new EventEmitter<Category>();
    currentCategory: Category = new Category(null, false, 0, 'root', this.rootTitle, '', '', true);
    categories: Category[] = [];
    errorMessage = '';
    modalRef: NgbModalRef;
    categoryId = 0;
    loading = false;

    constructor(
        public router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private categoriesService: CategoriesService,
        private translateService: TranslateService
    ) {
    }

    getLangString(value: string): string {
        const translations = this.translateService.store.translations[this.translateService.currentLang];
        return translations[value] || value;
    }

    /** On initialize component */
    ngOnInit(): void {
        this.getCategoriesRequest()
            .subscribe(
                data => {
                    this.categories = data.items;

                    this.route.paramMap
                        .subscribe(
                            params => {
                                this.categoryId = params.get('categoryId')
                                    ? parseInt(params.get('categoryId'), 10)
                                    : 0;
                                this.selectCurrent();
                            }
                        );
                },
                error => this.errorMessage = error
            );
    }

    /** Select current category */
    selectCurrent(): void {
        if (this.currentCategory.id === this.categoryId) {
            return;
        }
        const index = findIndex(this.categories, {id: this.categoryId});
        if (index > -1) {
            this.currentCategory = clone(this.categories[index]);
            this.changeRequest.emit(this.currentCategory);
        } else {
            this.openRootCategory();
        }
    }

    /** Get categories */
    getCategoriesRequest(): Observable<any> {
        return this.categoriesService.getListPage(
            new QueryOptions('menuIndex,title', 'asc', 1)
        );
    }

    /** Get categories */
    getCategories(): void {
        this.getCategoriesRequest()
            .subscribe(
                data => {
                    this.categories = data.items;
                    this.selectCurrent();
                },
                error => this.errorMessage = <any>error
            );
    }

    /**
     * Open modal category
     * @param itemId
     * @param isItemCopy
     */
    openModalCategory(itemId?: number, isItemCopy: boolean = false): void {
        const isRoot = itemId === 0 || itemId === null;
        const isEditMode = typeof itemId !== 'undefined' && !isItemCopy;
        this.modalRef = this.modalService.open(CategoriesModalComponent, {size: 'lg'});
        this.modalRef.componentInstance.modalTitle = isEditMode
            ? this.getLangString('EDIT_CATEGORY')
            : this.getLangString('ADD_NEW_CATEGORY');
        this.modalRef.componentInstance.itemId = itemId || 0;
        this.modalRef.componentInstance.isItemCopy = isItemCopy || false;
        this.modalRef.componentInstance.currentCategory = this.currentCategory;
        this.modalRef.componentInstance.isRoot = isRoot;
        this.modalRef.componentInstance.isEditMode = isEditMode;
        this.modalRef.result.then((result) => {
            this.currentCategory.id = null; // For update current category data
            this.getCategories();
        }, (reason) => {

        });
    }

    /**
     * Update category data
     * @param itemId
     * @param data
     */
    updateCategoryData(itemId: number, data: any): void {
        const index = findIndex(this.categories, {id: itemId});
        if (index === -1) {
            return;
        }
        const category = this.categories[index];
        if (category.parentId === data.parentId) {
            Object.keys(category).forEach(function (k, i) {
                if (data[k]) {
                    category[k] = data[k];
                }
            });
        } else {
            this.getCategories();
        }
    }

    /**
     * Confirm delete category
     * @param itemId
     */
    deleteCategoryItemConfirm(itemId: number): void {
        const index = findIndex(this.categories, {id: itemId});
        if (index === -1) {
            return;
        }
        this.modalRef = this.modalService.open(ConfirmModalContentComponent);
        this.modalRef.componentInstance.modalTitle = this.getLangString('CONFIRM');
        this.modalRef.componentInstance.modalContent = this.getLangString('YOU_SURE_YOU_WANT_DELETE_CATEGORY')
            + ` "${this.categories[index].title}"?`;
        this.modalRef.result.then((result) => {
            if (result === 'accept') {
                this.deleteCategoryItem(itemId);
            }
        }, (reason) => {

        });
    }

    /**
     * Delete category
     * @param itemId
     */
    deleteCategoryItem(itemId: number): void {
        this.loading = true;
        this.categoriesService.deleteItem(itemId)
            .subscribe((data) => {
                    this.categoryId = 0;
                    this.selectCurrent();
                    this.getCategories();
                    this.loading = false;
                },
                (err) => {
                    if (err['error']) {
                        this.errorMessage = err['error'];
                    }
                    this.loading = false;
                }
            );
    }

    /** Open root category */
    openRootCategory(): void {
        this.currentCategory = new Category(null, false, 0, 'root', this.rootTitle, '', '', true);
        this.changeRequest.emit(this.currentCategory);
    }

    /** Go to root category */
    goToRootCategory(): void {
        this.router.navigate(['/catalog/category', '']);
    }

    /**
     * Select category
     * @param category
     */
    selectCategory(category: Category): void {
        this.router.navigate(['/catalog/category', category.id]);
    }

    /** Copy category */
    copyCategory(): void {
        this.openModalCategory(this.currentCategory.id, true);
    }
}

