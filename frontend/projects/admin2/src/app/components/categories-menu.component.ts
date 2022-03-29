import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

import {Category, CategoryNode} from '../catalog/models/category.model';
import {QueryOptions} from '../models/query-options';
import {CategoriesService} from '../catalog/services/categories.service';

@Component({
    selector: 'app-categories-menu',
    templateUrl: 'templates/categories-menu.html'
})
export class CategoriesMenuComponent implements OnInit, OnDestroy {
    
    @Input() rootTitle = 'Категории';
    @Output() changeRequest = new EventEmitter<Category>();
    currentCategory: Category = new Category(null, false, 0, 'root', this.rootTitle, '', '', true);
    currentCategoryNode: CategoryNode = {id: 0, key: 0} as CategoryNode;
    categoriesTree: CategoryNode[] = [{
        id: 0,
        key: 0,
        parentId: 0,
        label: '',
        expanded: true,
        children: null
    }];
    categories: Category[] = [];
    errorMessage = '';
    categoryId = 0;
    loading = false;
    destroyed$ = new Subject<void>();

    constructor(
        public router: Router,
        private route: ActivatedRoute,
        private categoriesService: CategoriesService,
        private translateService: TranslateService
    ) {
    }

    getLangString(value: string): string {
        const translations = this.translateService.store.translations[this.translateService.currentLang];
        return translations[value] || value;
    }
    
    ngOnInit(): void {
        this.loading = true;
        this.getCategories().then((categories: Category[]) => {
            // this.loading = false;
            // this.route.paramMap
            //     .pipe(takeUntil(this.destroyed$))
            //     .subscribe(
            //         params => {
            //             this.categoryId = params.get('categoryId')
            //                 ? parseInt(params.get('categoryId'), 10)
            //                 : 0;
            //             this.selectCurrent();
            //         }
            //     );
        });
    }
    
    selectCurrent(): void {
        if (this.currentCategory.id === this.categoryId) {
            return;
        }
        console.log(this.categoryId);
        // const index = findIndex(this.categories, {id: this.categoryId});
        // if (index > -1) {
        //     this.currentCategory = cloneDeep(this.categories[index]);
        //     this.changeRequest.emit(this.currentCategory);
        // } else {
        //     this.openRootCategory();
        // }
        // this.currentCategoryNode = Category.getCurrentNode(this.currentCategory.id, this.categoriesTree[0]);
    }
    
    getCategories(): Promise<Category[]> {
        return new Promise((resolve, reject) => {
            this.categoriesService.getListPage(
                new QueryOptions(1, 0, 'menuIndex,title')
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
    
    openModalCategory(itemId?: number, isItemCopy: boolean = false): void {

        // Hide drop-down menu
        // this.categoriesDropdown.nativeElement.previousSibling.classList.remove('dropdown-toggle-hover');
        // setTimeout(() => {
        //     this.categoriesDropdown.nativeElement.previousSibling.classList.add('dropdown-toggle-hover');
        // }, 1);
        //
        // const modalId = '';//this.getModalElementId(itemId);
        // window.document.body.classList.add('modal-open');
        // if (window.document.getElementById(modalId)) {
        //     const modalEl = window.document.getElementById(modalId);
        //     const backdropEl = modalEl.previousElementSibling;
        //     modalEl.classList.add('d-block');
        //     modalEl.classList.remove('modal-minimized');
        //     backdropEl.classList.remove('d-none');
        //     return;
        // }
        // const isRoot = itemId === 0 || itemId === null;
        // const isEditMode = typeof itemId !== 'undefined' && !isItemCopy;
        // this.modalRef = this.modalService.open(CategoriesModalComponent, {
        //     size: 'lg',
        //     backdrop: 'static',
        //     keyboard: false,
        //     backdropClass: 'modal-backdrop-left45',
        //     windowClass: 'modal-left45',
        //     container: '#modals-container'
        // });
        // this.modalRef.componentInstance.modalTitle = isEditMode
        //     ? this.getLangString('CATEGORY') + (itemId ? ` #${itemId}` : '')
        //     : this.getLangString('ADD_NEW_CATEGORY');
        // this.modalRef.componentInstance.modalId = modalId;
        // this.modalRef.componentInstance.itemId = itemId || 0;
        // this.modalRef.componentInstance.isItemCopy = isItemCopy || false;
        // this.modalRef.componentInstance.currentCategory = this.currentCategory;
        // this.modalRef.componentInstance.isRoot = isRoot;
        // this.modalRef.componentInstance.isEditMode = isEditMode;
        // this.modalRef.result.then((result) => {
        //     if (this.destroyed$.isStopped) {
        //         return;
        //     }
        //     this.currentCategory.id = null; // For update current category data
        //     this.loading = true;
        //     this.getCategories().then(() => {
        //         this.selectCurrent();
        //         this.loading = false;
        //     });
        // }, (reason) => {
        //     if (this.destroyed$.isStopped) {
        //         return;
        //     }
        //     if (reason && ['submit', 'updated'].indexOf(reason) > -1) {
        //         this.currentCategory.id = null;
        //         this.loading = true;
        //         this.getCategories().then(() => {
        //             this.selectCurrent();
        //             this.loading = false;
        //         });
        //     }
        //     this.loading = false;
        // });
    }
    
    deleteCategoryItemConfirm(itemId: number): void {
        // const index = findIndex(this.categories, {id: itemId});
        // if (index === -1) {
        //     return;
        // }
        // this.modalRef = this.modalService.open(ConfirmModalContentComponent);
        // this.modalRef.componentInstance.modalTitle = this.getLangString('CONFIRM');
        // this.modalRef.componentInstance.modalContent = this.getLangString('YOU_SURE_YOU_WANT_DELETE_CATEGORY')
        //     + ` "${this.categories[index].title}"?`;
        // this.modalRef.result.then((result) => {
        //     if (result === 'accept') {
        //         this.deleteCategoryItem(itemId);
        //     }
        // }, (reason) => {
        //
        // });
    }
    
    deleteCategoryItem(itemId: number): void {
        this.loading = true;
        this.categoriesService.deleteItem(itemId)
            .subscribe((data) => {
                    this.categoryId = 0;
                    this.getCategories().then(() => {
                        this.goToRootCategory();
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
        this.router.navigate(['/catalog/category', event.node['id']]);
    }
    
    goToRootCategory(): void {
        this.router.navigate(['/catalog/category', '']);
    }
    
    openRootCategory(): void {
        this.currentCategory = new Category(null, false, 0, 'root', this.rootTitle, '', '', true);
        this.currentCategoryNode = this.categoriesTree[0];
        this.changeRequest.emit(this.currentCategory);
    }
    
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