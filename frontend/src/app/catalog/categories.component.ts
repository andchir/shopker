import {
    Component,
    OnInit,
    AfterViewInit,
    Input,
    Output,
    EventEmitter,
    forwardRef,
    ElementRef,
    ViewChild, OnDestroy
} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';

import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {TreeNode} from 'primeng/primeng';

import {findIndex, clone, cloneDeep} from 'lodash';
import {TranslateService} from '@ngx-translate/core';

import {NgbModal, NgbActiveModal, NgbModalRef, NgbTooltipConfig, NgbAccordion} from '@ng-bootstrap/ng-bootstrap';
import {ContentType} from './models/content_type.model';
import {Category, CategoryNode} from './models/category.model';
import {ListRecursiveComponent} from '../list-recursive.component';
import {AppModalContentAbstractComponent} from '../components/app-modal-content.abstract';
import {QueryOptions} from '../models/query-options';
import {ConfirmModalContentComponent} from '../components/modal-confirm-text.component';

import {SystemNameService} from '../services/system-name.service';
import {CategoriesService} from './services/categories.service';
import {ContentTypesService} from './services/content_types.service';
import {AppSettings} from '../services/app-settings.service';
import {FilesService} from './services/files.service';
import {FormFieldsOptions} from '../models/form-fields-options.interface';

/**
 * @class CategoriesModalComponent
 */
@Component({
    selector: 'app-category-modal-content',
    templateUrl: 'templates/modal-category.html'
})
export class CategoriesModalComponent extends AppModalContentAbstractComponent<Category> implements OnInit, AfterViewInit {

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

    formFields: FormFieldsOptions[] = [
        {
            name: 'title',
            validators: [Validators.required]
        },
        {
            name: 'name',
            validators: [Validators.required]
        },
        {
            name: 'description',
            validators: []
        },
        {
            name: 'parentId',
            validators: []
        },
        {
            name: 'image',
            validators: []
        },
        {
            name: 'contentTypeName',
            validators: []
        },
        {
            name: 'menuIndex',
            validators: []
        },
        {
            name: 'isActive',
            validators: []
        },
        {
            name: 'clearCache',
            validators: []
        }
    ];

    constructor(
        public fb: FormBuilder,
        public activeModal: NgbActiveModal,
        public translateService: TranslateService,
        public dataService: CategoriesService,
        public elRef: ElementRef,
        private filesService: FilesService,
        private contentTypesService: ContentTypesService,
        private appSettings: AppSettings,
        private systemNameService: SystemNameService
    ) {
        super(fb, activeModal, translateService, dataService, elRef);
    }

    /** On initialize */
    ngOnInit(): void {
        this.uniqueId = this.createUniqueId();
        this.localeList = this.appSettings.settings.localeList;
        if (this.localeList.length > 0) {
            this.localeDefault = this.localeList[0];
            this.localeCurrent = this.localeList[0];
        }
        if (typeof this.itemId !== 'undefined') {
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
        }
        this.getContentTypes();

        super.ngOnInit();
    }

    ngAfterViewInit(): void {
        if (this.elRef.nativeElement.querySelector('#fieldTitle')) {
            this.elRef.nativeElement.querySelector('#fieldTitle').focus();
        }
    }

    onAfterGetData() {
        this.model.clearCache = true;
        if (!this.model.translations || Array.isArray(this.model.translations)) {
            this.model.translations = {};
        }
        super.onAfterGetData();
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

    generateName(model, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        const title = this.getControl(this.form, null, 'title').value || '';
        model.name = this.systemNameService.generateName(title);
        this.getControl(this.form, null, 'name').setValue(model.name);
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
export class CategoriesMenuComponent implements OnInit, OnDestroy {
    @ViewChild('categoriesDropdown', { static: true }) categoriesDropdown;
    @Input() rootTitle = 'Категории';
    @Output() changeRequest = new EventEmitter<Category>();
    currentCategory: Category = new Category(null, false, 0, 'root', this.rootTitle, '', '', true);
    currentCategoryNode: CategoryNode = {id: 0} as CategoryNode;
    categoriesTree: CategoryNode[] = [{
        id: 0,
        parentId: 0,
        label: '',
        expanded: true,
        children: null
    }];
    categories: Category[] = [];
    errorMessage = '';
    modalRef: NgbModalRef;
    categoryId = 0;
    loading = false;
    destroyed$ = new Subject<void>();

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
        this.loading = true;
        this.getCategories().then((categories: Category[]) => {
            this.loading = false;
            this.route.paramMap
                .pipe(takeUntil(this.destroyed$))
                .subscribe(
                    params => {
                        this.categoryId = params.get('categoryId')
                            ? parseInt(params.get('categoryId'), 10)
                            : 0;
                        this.selectCurrent();
                    }
                );
        });
    }

    /** Select current category */
    selectCurrent(): void {
        if (this.currentCategory.id === this.categoryId) {
            return;
        }
        const index = findIndex(this.categories, {id: this.categoryId});
        if (index > -1) {
            this.currentCategory = cloneDeep(this.categories[index]);
            this.changeRequest.emit(this.currentCategory);
        } else {
            this.openRootCategory();
        }
        this.currentCategoryNode = Category.getCurrentNode(this.currentCategory.id, this.categoriesTree[0]);
    }

    /** Get categories */
    getCategories(): Promise<Category[]> {
        return new Promise((resolve, reject) => {
            this.categoriesService.getListPage(
                new QueryOptions('menuIndex,title', 'asc', 1)
            )
                .subscribe(
                    data => {
                        if (data.items && data.items.length > 0) {
                            this.categories = data.items;
                            this.categoriesTree = [Category.createTree(data.items)];
                        }
                        resolve(data.items);
                    },
                    error => {
                        this.errorMessage = error;
                        reject();
                    }
                );
        });
    }

    /**
     * Open modal category
     * @param itemId
     * @param isItemCopy
     */
    openModalCategory(itemId?: number, isItemCopy: boolean = false): void {

        // Hide drop-down menu
        this.categoriesDropdown.nativeElement.previousSibling.classList.remove('dropdown-toggle-hover');
        setTimeout(() => {
            this.categoriesDropdown.nativeElement.previousSibling.classList.add('dropdown-toggle-hover');
        }, 1);

        const modalId = this.getModalElementId(itemId);
        window.document.body.classList.add('modal-open');
        if (window.document.getElementById(modalId)) {
            const modalEl = window.document.getElementById(modalId);
            const backdropEl = modalEl.previousElementSibling;
            modalEl.classList.add('d-block');
            modalEl.classList.remove('modal-minimized');
            backdropEl.classList.remove('d-none');
            return;
        }
        const isRoot = itemId === 0 || itemId === null;
        const isEditMode = typeof itemId !== 'undefined' && !isItemCopy;
        this.modalRef = this.modalService.open(CategoriesModalComponent, {
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            backdropClass: 'modal-backdrop-left45',
            windowClass: 'modal-left45',
            container: '#modals-container'
        });
        this.modalRef.componentInstance.modalTitle = isEditMode
            ? this.getLangString('CATEGORY') + (itemId ? ` #${itemId}` : '')
            : this.getLangString('ADD_NEW_CATEGORY');
        this.modalRef.componentInstance.modalId = modalId;
        this.modalRef.componentInstance.itemId = itemId || 0;
        this.modalRef.componentInstance.isItemCopy = isItemCopy || false;
        this.modalRef.componentInstance.currentCategory = this.currentCategory;
        this.modalRef.componentInstance.isRoot = isRoot;
        this.modalRef.componentInstance.isEditMode = isEditMode;
        this.modalRef.result.then((result) => {
            if (this.destroyed$.isStopped) {
                return;
            }
            this.currentCategory.id = null; // For update current category data
            this.loading = true;
            this.getCategories().then(() => {
                this.loading = false;
            });
        }, (reason) => {
            if (this.destroyed$.isStopped) {
                return;
            }
            if (reason && ['submit', 'updated'].indexOf(reason) > -1) {
                this.currentCategory.id = null;
                this.loading = true;
                this.getCategories().then(() => {
                    this.loading = false;
                });
            }
            this.loading = false;
        });
    }

    getModalElementId(itemId?: number): string {
        return ['modal', 'category', itemId || 0].join('-');
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
                    this.getCategories().then(() => {
                        this.loading = false;
                    });
                },
                (err) => {
                    if (err['error']) {
                        this.errorMessage = err['error'];
                    }
                    this.loading = false;
                }
            );
    }

    openCategory(event): void {
        this.router.navigate(['/catalog/category', event['node']['id']]);
    }

    /** Go to root category */
    goToRootCategory(): void {
        this.router.navigate(['/catalog/category', '']);
    }

    /** Open root category */
    openRootCategory(): void {
        this.currentCategory = new Category(null, false, 0, 'root', this.rootTitle, '', '', true);
        this.currentCategoryNode = this.categoriesTree[0];
        this.changeRequest.emit(this.currentCategory);
    }

    /** Copy category */
    copyCategory(): void {
        this.openModalCategory(this.currentCategory.id, true);
    }

    expandAll(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.categoriesTree.forEach(node => {
            this.expandRecursive(node, true);
        });
    }

    collapseAll(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.categoriesTree.forEach(node => {
            this.expandRecursive(node, false);
        });
    }

    private expandRecursive(node: CategoryNode, isExpand: boolean): void {
        node.expanded = isExpand;
        if (node.children) {
            node.children.forEach(childNode => {
                this.expandRecursive(childNode, isExpand);
            });
        }
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}

