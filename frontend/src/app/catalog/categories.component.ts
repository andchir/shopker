import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {NgbModal, NgbActiveModal, NgbModalRef, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {TreeNode} from 'primeng/primeng';

import {findIndex, clone} from 'lodash';
import {TranslateService} from '@ngx-translate/core';

import {ContentType} from './models/content_type.model';
import {Category} from './models/category.model';
import {ConfirmModalContentComponent} from '../app.component';
import {ListRecursiveComponent} from '../list-recursive.component';
import {ModalContentAbstractComponent} from '../modal.abstract';
import {QueryOptions} from '../models/query-options';

import {SystemNameService} from '../services/system-name.service';
import {CategoriesService} from './services/categories.service';
import {ContentTypesService} from './services/content_types.service';
import {FormFieldInterface} from '../models/form-field.interface';

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

    formFields: FormFieldInterface = {
        title: {
            value: '',
            disabled: false,
            validators: [Validators.required],
            messages: {
                required: 'Title is required.'
            }
        },
        name: {
            value: '',
            disabled: false,
            validators: [Validators.required],
            messages: {
                required: 'Name is required.'
            }
        },
        description: {
            value: '',
            disabled: false,
            validators: [],
            messages: {}
        },
        parentId: {
            value: 0,
            disabled: false,
            validators: [],
            messages: {}
        },
        contentTypeName: {
            value: '',
            disabled: false,
            validators: [Validators.required],
            messages: {
                required: 'Content type is required.'
            }
        },
        menuIndex: {
            value: 0,
            disabled: false,
            validators: [],
            messages: {}
        },
        isActive: {
            value: false,
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
        private contentTypesService: ContentTypesService
    ) {
        super(fb, dataService, systemNameService, activeModal, tooltipConfig, translateService);
    }

    /** On initialize */
    ngOnInit(): void {
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

    save(): void {
        this.submitted = true;
        if (!this.form.valid) {
            this.onValueChanged('form');
            this.submitted = false;
            return;
        }
        this.loading = true;

        this.saveRequest()
            .subscribe(() => this.closeModal(),
                err => {
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
        this.categoriesService.deleteItem(itemId)
            .subscribe((data) => {
                    this.categoryId = 0;
                    this.selectCurrent();
                    this.getCategories();
                },
                err => this.errorMessage = err
            );
    }

    /** Open root category */
    openRootCategory(): void {
        this.currentCategory = new Category(null, false, 0, 'root', this.rootTitle, '', '', true);
        this.changeRequest.emit(this.currentCategory);
    }

    /** Go to root category */
    goToRootCategory(): void {
        this.router.navigate(['/catalog/category/0']);
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

