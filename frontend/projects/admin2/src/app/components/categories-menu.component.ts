import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {take, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';

import {Category, CategoryNode} from '../catalog/models/category.model';
import {QueryOptions} from '../models/query-options';
import {CategoriesService} from '../catalog/services/categories.service';

@Component({
    selector: 'app-categories-menu',
    templateUrl: 'templates/categories-menu.html'
})
export class CategoriesMenuComponent implements OnInit, OnDestroy {
    
    @Input() rootTitle = 'ROOT_FOLDER';
    @Output() changeRequest = new EventEmitter<Category>();
    @Output() onUpdated = new EventEmitter<Category>();
    @Output() onEditStarted = new EventEmitter<any>();
    @Output() onEditEnded = new EventEmitter<any>();
    @Output() onAction = new EventEmitter<any>();
    currentCategory: Category = null;
    currentCategoryNode: CategoryNode = null;
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
        public dialogService: DialogService,
        private categoriesService: CategoriesService,
        private translateService: TranslateService,
        private confirmationService: ConfirmationService
    ) {
    }

    getLangString(value: string): string {
        const translations = this.translateService.store.translations[this.translateService.currentLang];
        return translations[value] || value;
    }
    
    ngOnInit(): void {
        this.loading = true;
        this.getCategories().then((categories: Category[]) => {
            this.route.paramMap
                .pipe(takeUntil(this.destroyed$))
                .subscribe({
                    next: (params) => {
                        this.categoryId = params.get('categoryId')
                            ? parseInt(params.get('categoryId'), 10)
                            : 0;
                        this.selectCurrent();
                    },
                    error: (e) => {
                        console.log(e);
                    }
                });
        });
    }
    
    selectCurrent(): void {
        if (this.currentCategory && this.currentCategory.id === this.categoryId) {
            return;
        }
        if (!this.currentCategory) {
            this.currentCategory = new Category(0, false, 0, 'root', this.rootTitle, '', '', true);
        }
        if (this.categoryId === 0) {
            this.currentCategory.id = 0;
            this.currentCategoryNode = null;
            return;
        }
        const index = this.categories.findIndex((item) => {
            return item.id === this.categoryId;
        })
        if (index > -1) {
            Object.assign(this.currentCategory, this.categories[index]);
            this.changeRequest.emit(this.currentCategory);
        }
        if (!this.currentCategoryNode) {
            this.currentCategoryNode = Category.getCurrentNode(this.currentCategory.id, this.categoriesTree[0]);
        }
    }
    
    getCategories(): Promise<Category[]> {
        this.loading = true;
        return new Promise((resolve, reject) => {
            this.categoriesService.getListPage(
                new QueryOptions(1, 0, 'menuIndex,title')
            )
                .subscribe({
                    next: (res) => {
                        if (res.items && res.items.length > 0) {
                            this.categories = res.items;
                            this.categoriesTree = [Category.createTree(res.items)];
                        }
                        this.loading = false;
                        resolve(res.items);
                    },
                    error: (err) => {
                        this.errorMessage = err.error || err;
                        this.loading = false;
                        reject();
                    }
                })
        });
    }
    
    deleteCategoryItemConfirm(itemId: number): void {
        const index = this.categories.findIndex((item) => {
            return item.id === itemId;
        });
        if (index === -1) {
            return;
        }
        this.confirmationService.confirm({
            message: this.getLangString('YOU_SURE_YOU_WANT_DELETE'),
            accept: () => {
                this.deleteCategoryItem(itemId);
            }
        })
    }
    
    deleteCategoryItem(itemId: number): void {
        this.loading = true;
        this.categoriesService.deleteItem(itemId)
            .subscribe({
                next: () => {
                    this.categoryId = 0;
                    this.getCategories().then(() => {
                        this.goToRootCategory();
                        this.loading = false;
                    });
                },
                error: (err) => {
                    if (err.error) {
                        this.errorMessage = err.error;
                    }
                    this.loading = false;
                }
            });
    }

    callAction(action: string, itemId?: number): void {
        this.onAction.emit([action, itemId]);
    }

    openCategory(event): void {
        this.router.navigate(['/catalog/category', event.node['id']]);
    }
    
    goToRootCategory(): void {
        this.router.navigate(['/catalog/category']);
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
