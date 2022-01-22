import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import {TranslateService} from '@ngx-translate/core';

import {QueryOptions} from '../models/query-options';
import {SimpleEntity} from '../models/simple-entity.interface';
import {DataService} from '../services/data-service.abstract';
import {ContentField} from '../catalog/models/content_field.model';
import {ContentTypesService} from '../catalog/services/content_types.service';

declare const window: Window;

export interface TableField {
    field: string;
    header: string;
    outputType?: string;
    outputProperties?: {[key: string]: string|number};
}

@Component({
    template: ''
})
export abstract class AppTablePageAbstractComponent<T extends SimpleEntity> implements OnInit, OnDestroy {
    
    loading = false;
    items: T[] = [];
    itemSelected: T;
    itemsSelected: T[];
    itemsTotal = 0;
    cols: TableField[];
    contentTypeFields: ContentField[];
    queryOptions: QueryOptions = new QueryOptions(1, 12, 'createdDate', 'desc');
    searchTimer: any;
    destroyed$ = new Subject<void>();

    constructor(
        public dialogService: DialogService,
        public contentTypesService: ContentTypesService,
        public dataService: DataService<T>,
        public translateService: TranslateService,
        public messageService: MessageService,
        public confirmationService: ConfirmationService
    ) {
    }

    abstract getModalComponent();

    ngOnInit(): void {
        this.getContentTypeFields();
    }

    getData(event?: any): void {
        if (event && event.rows) {
            this.pageChanged(event);
        }
        if (event && event.sortField) {
            this.onSortingChange(event);
        }
        this.loading = true;
        this.dataService.getListPage(this.queryOptions)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (res) => {
                    this.items = res.items;
                    this.itemsTotal = res.total;
                    this.loading = false;
                },
                error: (err) => {
                    if (err.error) {
                        this.messageService.add({
                            severity: 'error',
                            detail: err.error
                        });
                    }
                    this.items = [];
                    this.itemsTotal = 0;
                    this.loading = false;
                }
            });
    }

    getContentTypeFields(): void {
        this.contentTypesService.getList()
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (res) => {
                    
                },
                error: (err) => {
                    if (err.error) {
                        this.messageService.add({
                            severity: 'error',
                            detail: err.error
                        });
                    }
                }
            });
    }

    getItemData(item: T): {[name: string]: number|string} {
        return {
            id: item ? item.id : 0
        };
    }

    getModalTitle(item: T): string {
        return item ? 'Edit item' : 'Create item';
    }

    openModal(item: T, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        const ref = this.dialogService.open(this.getModalComponent(), {
            header: this.getModalTitle(item),
            width: '800px',
            data: this.getItemData(item)
        });
        ref.onClose
            .pipe(takeUntil(this.destroyed$))
            .subscribe((itemCurrent: T) => {
                if (itemCurrent) {
                    this.messageService.add({
                        severity: 'success',
                        detail: item ? 'Edited successfully!' : 'Created successfully!'
                    });
                    this.getData();
                }
            });
    }

    deleteItem(item: T, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.confirmationService.confirm({
            message: 'Are you sure you want to remove this item?',
            accept: () => {
                this.loading = true;
                this.dataService.deleteItem(item.id)
                    .pipe(takeUntil(this.destroyed$))
                    .subscribe({
                        next: (res) => {
                            this.messageService.add({
                                severity: 'success',
                                detail: 'Deleted successfully!'
                            });
                            if (this.items.length === 1) {
                                this.queryOptions.page = 1;
                            }
                            this.getData();
                        },
                        error: (err) => {
                            if (err.error) {
                                this.messageService.add({
                                    severity: 'error',
                                    detail: err.error
                                });
                            }
                            this.loading = false;
                        }
                    });
            }
        });
    }

    onSortingChange(event?: any): void {
        if (event && event.sortField) {
            this.queryOptions.sort_by = event.sortField;
            this.queryOptions.sort_dir = event.sortOrder > 0 ? 'asc' : 'desc'
        }
    }

    pageChanged(event?: any): void {
        if (event && event.rows) {
            const page = event.first / event.rows;
            this.queryOptions.page = page + 1;
        }
    }

    onInputSearch(): void {
        clearTimeout(this.searchTimer);
        this.searchTimer = setTimeout(() => {
            this.getData();
        }, 500);
    }

    deleteSelected() {
        console.log('deleteSelected', this.itemsSelected);
    }

    navBarToggle(): void {
        window.document.querySelector('.layout-sidebar').classList.toggle('active');
        window.document.querySelector('.layout-mask').classList.toggle('layout-mask-active');
    }

    onOptionUpdate(e): void {
        const [object, optionName, value] = e;
        // Make save request
    }

    getLangString(value: string): string {
        if (!this.translateService.store.translations[this.translateService.currentLang]) {
            return value;
        }
        const translations = this.translateService.store.translations[this.translateService.currentLang];
        return translations[value] || value;
    }

    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
