import {OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal, NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {QueryOptions} from './models/query-options';
import {DataService} from './services/data-service.abstract';
import {AlertModalContentComponent, ConfirmModalContentComponent} from './components/modal-confirm-text.component';

export abstract class PageTableAbstractComponent<M> implements OnInit, OnDestroy {

    static title = '';
    @ViewChild('table', { static: true }) table;
    errorMessage: string;
    items: M[] = [];
    modalRef: NgbModalRef;
    loading = false;
    selectedIds: number[] = [];
    collectionSize = 0;
    searchTimer: any;
    queryOptions = new QueryOptions('name', 'asc', 1, 10, 0, 0);
    destroyed$ = new Subject<void>();

    abstract getModalContent();

    constructor(
        public dataService: DataService<any>,
        public activeModal: NgbActiveModal,
        public modalService: NgbModal,
        public translateService: TranslateService
    ) {

    }

    ngOnInit(): void {
        this.getList();
        this.afterInit();
    }

    afterInit(): void {}
    onSearchClear(): void {
        this.getList();
    }
    onModalClose(result: any): void {}

    onSearchWordUpdate(value?: string): void {
        if (typeof value !== 'undefined') {
            this.queryOptions.search_word = value;
            if (!this.queryOptions.search_word) {
                this.onSearchClear();
            } else {
                this.getList();
            }
            return;
        }
        clearTimeout(this.searchTimer);
        this.searchTimer = setTimeout(() => {
            this.getList();
        }, 700);
    }

    getModalElementId(itemId?: number): string {
        return ['modal', itemId || 0].join('-');
    }

    setModalInputs(itemId?: number, isItemCopy: boolean = false, modalId = ''): void {
        const isEditMode = typeof itemId !== 'undefined' && !isItemCopy;
        this.modalRef.componentInstance.modalTitle = isEditMode
            ? this.getLangString('EDITING')
            : this.getLangString('ADD');
        this.modalRef.componentInstance.modalId = modalId;
        this.modalRef.componentInstance.itemId = itemId || 0;
        this.modalRef.componentInstance.isItemCopy = isItemCopy || false;
        this.modalRef.componentInstance.isEditMode = isEditMode;
    }

    modalOpen(itemId?: number, isItemCopy: boolean = false): void {
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
        this.modalRef = this.modalService.open(this.getModalContent(), {
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            backdropClass: 'modal-backdrop-left45',
            windowClass: 'modal-left45',
            container: '#modals-container'
        });
        this.setModalInputs(itemId, isItemCopy, modalId);
        this.modalRef.result.then((result) => {
            if (this.destroyed$.isStopped) {
                return;
            }
            this.onModalClose(result);
            this.getList();
        }, (reason) => {
            if (this.destroyed$.isStopped) {
                return;
            }
            this.onModalClose(reason);
            if (reason && ['submit', 'updated'].indexOf(reason) > -1) {
                this.getList();
            }
        });
    }

    deleteItemConfirm(itemId: number): void {
        this.modalRef = this.modalService.open(ConfirmModalContentComponent);
        this.modalRef.componentInstance.modalTitle = this.getLangString('CONFIRM');
        this.modalRef.componentInstance.modalContent = this.getLangString('YOU_SURE_YOU_WANT_DELETE');
        this.modalRef.result.then((result) => {
            if (result === 'accept') {
                this.deleteItem(itemId);
            }
        });
    }

    getLangString(value: string): string {
        if (!this.translateService.store.translations[this.translateService.currentLang]) {
            return value;
        }
        const translations = this.translateService.store.translations[this.translateService.currentLang];
        return translations[value] || value;
    }

    confirmAction(message: string) {
        this.modalRef = this.modalService.open(ConfirmModalContentComponent);
        this.modalRef.componentInstance.modalTitle = this.getLangString('CONFIRM');
        this.modalRef.componentInstance.modalContent = message;
        return this.modalRef.result;
    }

    blockSelected() {
        if (this.selectedIds.length === 0) {
            this.showAlert(this.getLangString('NOTHING_IS_SELECTED'));
            return;
        }
        this.dataService.actionBatch(this.selectedIds, 'block')
            .subscribe(res => {
                    this.clearSelected();
                    this.getList();
                },
                err => this.showAlert(err.error || this.getLangString('ERROR')));
    }

    deleteSelected() {
        if (this.selectedIds.length === 0) {
            this.showAlert(this.getLangString('NOTHING_IS_SELECTED'));
            return;
        }
        this.confirmAction(this.getLangString('YOU_SURE_YOU_WANT_DELETE_SELECTED'))
            .then((result) => {
                if (result === 'accept') {
                    this.dataService.actionBatch(this.selectedIds, 'delete')
                        .subscribe(res => {
                                this.clearSelected();
                                this.getList();
                            },
                            err => this.showAlert(err.error || this.getLangString('ERROR')));
                }
            });
    }

    showAlert(message: string) {
        this.modalRef = this.modalService.open(AlertModalContentComponent);
        this.modalRef.componentInstance.modalContent = message;
        this.modalRef.componentInstance.modalTitle = this.getLangString('ERROR');
        this.modalRef.componentInstance.messageType = 'error';
    }

    deleteItem(itemId: number): void {
        this.confirmAction(this.getLangString('YOU_SURE_YOU_WANT_DELETE'))
            .then((result) => {
                if (result === 'accept') {
                    this.dataService.deleteItem(itemId)
                        .subscribe((res) => {
                            this.getList();
                        }, err => {
                            if (err['error']) {
                                this.showAlert(err['error']);
                            }
                        });
                }
            });
    }

    clearSelected(): void {
        if (this.table) {
            this.table.clearSelected();
        }
    }

    actionRequest(actionValue: [string, number]): void {
        switch (actionValue[0]) {
            case 'edit':
                this.modalOpen(actionValue[1]);
                break;
            case 'copy':
                this.modalOpen(actionValue[1], true);
                break;
            case 'delete':
                this.deleteItem(actionValue[1]);
                break;
            case 'changeQuery':
                this.getList();
                break;
        }
    }

    getList(): void {
        this.loading = true;
        this.dataService.getListPage(this.queryOptions)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (res) => {
                    this.items = res.items;
                    this.collectionSize = res.total;
                    this.loading = false;
                },
                error: (err) => {
                    this.items = [];
                    this.collectionSize = 0;
                    if (err.error) {
                        this.showAlert(err.error);
                    }
                    this.loading = false;
                }
            });
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
