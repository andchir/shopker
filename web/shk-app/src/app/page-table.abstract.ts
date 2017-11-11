import { OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { QueryOptions } from './models/query-options';
import { AlertModalContent, ConfirmModalContent } from './app.component';

import { DataService } from './services/data-service.abstract';

export abstract class PageTableAbstractComponent<M> implements OnInit {
    errorMessage: string;
    items: M[] = [];
    title: string = 'Page with data table';
    modalRef: NgbModalRef;
    loading: boolean = false;
    selectedIds: number[] = [];
    collectionSize = 0;
    queryOptions: QueryOptions = new QueryOptions('name', 'asc', 1, 10, 0, 0);

    abstract getModalContent();

    constructor(
        public dataService: DataService,
        public activeModal: NgbActiveModal,
        public modalService: NgbModal,
        public titleService: Title
    ) {

    }

    ngOnInit(): void {
        this.setTitle(this.title);
        this.getList();
    }

    public setTitle(newTitle: string) {
        this.titleService.setTitle(newTitle);
    }

    modalOpen(itemId?: number, isItemCopy: boolean = false): void {
        this.modalRef = this.modalService.open(this.getModalContent(), {size: 'lg', backdrop: 'static'});
        this.setModalInputs(itemId, isItemCopy);
        this.modalRef.result.then((result) => {
            this.getList();
        }, (reason) => {
            //console.log( 'reason', reason );
        });
    }

    setModalInputs(itemId?: number, isItemCopy: boolean = false): void {
        const isEditMode = typeof itemId !== 'undefined' && !isItemCopy;
        this.modalRef.componentInstance.modalTitle = isEditMode ? 'Edit' : 'Add';
        this.modalRef.componentInstance.itemId = itemId || 0;
        this.modalRef.componentInstance.isItemCopy = isItemCopy || false;
        this.modalRef.componentInstance.isEditMode = isEditMode;
    }

    deleteItemConfirm(itemId: number): void {
        this.modalRef = this.modalService.open(ConfirmModalContent);
        this.modalRef.componentInstance.modalTitle = 'Confirm';
        this.modalRef.componentInstance.modalContent = 'Are you sure you want to remove this item?';
        this.modalRef.result.then((result) => {
            if (result == 'accept') {
                this.deleteItem(itemId);
            }
        });
    }

    confirmAction(message: string) {
        this.modalRef = this.modalService.open(ConfirmModalContent);
        this.modalRef.componentInstance.modalTitle = 'Confirm';
        this.modalRef.componentInstance.modalContent = message;
        return this.modalRef.result;
    }

    blockSelected() {
        if (this.selectedIds.length === 0) {
            this.showAlert('Nothing is selected.');
            return;
        }
        console.log('blockSelected', this.selectedIds);
    }

    deleteSelected() {
        if (this.selectedIds.length === 0) {
            this.showAlert('Nothing is selected.');
            return;
        }
        this.confirmAction('Are you sure you want to delete all selected items?')
            .then((result) => {
                if (result == 'accept') {
                    this.dataService.deleteByArray(this.selectedIds)
                        .then((res) => {
                            if (res.success) {
                                this.getList();
                            } else {
                                if (res.msg) {
                                    this.showAlert(res.msg);
                                }
                            }
                        });
                }
            });
    }

    showAlert(message: string) {
        this.modalRef = this.modalService.open(AlertModalContent);
        this.modalRef.componentInstance.modalContent = message;
        this.modalRef.componentInstance.modalTitle = 'Error';
        this.modalRef.componentInstance.messageType = 'error';
    }

    deleteItem(itemId: number): void {
        this.confirmAction('Are you sure you want to remove this item?')
            .then((result) => {
                if (result == 'accept') {
                    this.dataService.deleteItem(itemId)
                        .then((res) => {
                            if (res.success) {
                                this.getList();
                            } else {
                                if (res.msg) {
                                    this.showAlert(res.msg);
                                }
                            }
                        });
                }
            });
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
        this.dataService.getList(this.queryOptions)
            .subscribe(
                preparedData => {
                    this.items = preparedData.data as M[];
                    this.collectionSize = preparedData.total;
                    this.errorMessage = preparedData.errorMsg;
                    this.loading = false;
                },
                error => this.errorMessage = <any>error
            );
    }

}
