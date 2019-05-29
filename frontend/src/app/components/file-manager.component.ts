import {Component, ViewChild} from '@angular/core';

import {cloneDeep} from 'lodash';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';

import {FileManagerService} from '../services/file-manager.service';
import {FileModel} from '../models/file.model';
import {ModalFileContentComponent} from './modal-file.component';
import {ModalConfirmTextComponent, ConfirmModalContentComponent} from './modal-confirm-text.component';
import {ModalFileUploadContentComponent} from './modal-file-upload.component';

@Component({
    selector: 'app-file-manager',
    templateUrl: 'templates/file-manager.component.html',
    providers: [FileManagerService]
})
export class FileManagerComponent {

    @ViewChild('container') container;
    modalRef: NgbModalRef;
    isActive = false;
    files: any[] = [];
    loading = false;
    currentPath = '';
    errorMessage = '';

    constructor(
        public dataService: FileManagerService,
        public modalService: NgbModal,
        public translateService: TranslateService
    ) {

    }

    getFilesList(): void {
        this.errorMessage = '';
        this.files.splice(0, this.files.length);
        this.loading = true;
        this.dataService.getList({path: this.currentPath})
            .subscribe((res) => {
                this.loading = false;
                this.files = res;
            }, (err) => {
                this.loading = false;
                if (err['error']) {
                    this.errorMessage = err['error'];
                }
            });
    }

    openFileHandler(file: FileModel, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        if (file.isDir) {
            this.currentPath = this.getFilePath(file);
            this.getFilesList();
        } else {
            this.openModal(file);
        }
    }

    openModal(file: FileModel) {
        this.modalService.dismissAll();
        const currentFile = cloneDeep(file);
        this.modalRef = this.modalService.open(ModalFileContentComponent, {backdrop: 'static', keyboard: false});
        this.modalRef.componentInstance.modalTitle = currentFile.fileName;
        this.modalRef.componentInstance.file = currentFile;
        this.modalRef.componentInstance.filePath = `/${this.getFilePath(currentFile)}`;
        this.modalRef.result.then((result: string) => {
            switch (result) {
                case 'delete':
                    this.loading = true;
                    this.dataService.deleteFile(this.currentPath, currentFile)
                        .subscribe((res) => {
                            this.setActive();
                        }, (err) => {
                            this.loading = false;
                            if (err['error']) {
                                this.errorMessage = err['error'];
                                this.setActive(false);
                            }
                        });
                    break;
                case 'rename':
                    this.loading = true;
                    this.dataService.rename(this.getFilePath(currentFile), currentFile.title, 'file')
                        .subscribe((res) => {
                            this.setActive();
                        }, (err) => {
                            this.loading = false;
                            if (err['error']) {
                                this.errorMessage = err['error'];
                            }
                        });
                    break;
            }
        });
    }

    createFolder(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.modalService.dismissAll();
        this.errorMessage = '';
        this.modalRef = this.modalService.open(ModalConfirmTextComponent, {backdrop: 'static', keyboard: false});
        this.modalRef.componentInstance.modalTitle = 'CREATE_FOLDER';
        this.modalRef.componentInstance.labelText = 'FOLDER_NAME';
        this.modalRef.result.then((result) => {
            if (result) {
                this.loading = true;
                this.dataService.createFolder(this.currentPath, result)
                    .subscribe((res) => {
                        this.getFilesList();
                    }, (err) => {
                        this.loading = false;
                        if (err['error']) {
                            this.errorMessage = err['error'];
                        }
                        this.setActive();
                    });
            }
        });
    }

    deleteFolder(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.modalService.dismissAll();
        this.confirmAction(this.getLangString('YOU_SURE_YOU_WANT_DELETE_FOLDER'))
            .then((result) => {
                if (result === 'accept') {
                    this.loading = true;
                    this.dataService.deleteFolder(this.currentPath)
                        .subscribe((res) => {
                            this.openDirPrevious();
                        }, (err) => {
                            this.loading = false;
                            if (err['error']) {
                                this.errorMessage = err['error'];
                            }
                        });
                }
            });
    }

    renameFolder(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.modalService.dismissAll();
        this.errorMessage = '';

        const tmp = this.currentPath.split('/');
        const folderName = tmp.pop();

        this.modalRef = this.modalService.open(ModalConfirmTextComponent, {backdrop: 'static', keyboard: false});
        this.modalRef.componentInstance.modalTitle = 'RENAME_FOLDER';
        this.modalRef.componentInstance.labelText = 'FOLDER_NAME';
        this.modalRef.componentInstance.textValue = folderName;
        this.modalRef.componentInstance.buttonText = 'RENAME';
        this.modalRef.result.then((result) => {
            if (result && result !== folderName) {
                this.loading = true;
                this.dataService.rename(this.currentPath, result)
                    .subscribe((res) => {
                        this.openDirPrevious();
                    }, (err) => {
                        this.loading = false;
                        if (err['error']) {
                            this.errorMessage = err['error'];
                        }
                    });
            }
        });
    }

    uploadFiles(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.modalService.dismissAll();
        this.errorMessage = '';
        this.modalRef = this.modalService.open(ModalFileUploadContentComponent, {backdrop: 'static', keyboard: false});
        this.modalRef.result.then((result: File[]) => {
            if (result && result.length > 0) {

                this.loading = true;
                const data = {};
                result.forEach((file, index) => {
                    data[`file${index}`] = file;
                });
                this.dataService.postFormData(this.dataService.getFormData(data), this.currentPath)
                    .subscribe((res) => {
                        this.loading = false;
                        this.setActive();
                    }, (err) => {
                        this.loading = false;
                        if (err['error']) {
                            this.errorMessage = err['error'];
                        }
                    });
            }
        });
    }

    confirmAction(message: string) {
        this.modalRef = this.modalService.open(ConfirmModalContentComponent);
        this.modalRef.componentInstance.modalTitle = this.getLangString('CONFIRM');
        this.modalRef.componentInstance.modalContent = message;
        return this.modalRef.result;
    }

    getLangString(value: string): string {
        if (!this.translateService.store.translations[this.translateService.currentLang]) {
            return value;
        }
        const translations = this.translateService.store.translations[this.translateService.currentLang];
        return translations[value] || value;
    }

    getFilePath(file: FileModel): string {
        return this.currentPath
            ? `${this.currentPath}/${file.fileName}`
            : `${file.fileName}`;
    }

    openDirPrevious(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        if (!this.currentPath) {
            return;
        }
        const tmp = this.currentPath.split('/');
        tmp.pop();
        this.currentPath = tmp.join('/');
        this.getFilesList();
    }

    setActive(updateFiles = true): void {
        this.isActive = true;
        this.container.nativeElement.classList.add('active');
        if (updateFiles) {
            this.getFilesList();
        }
    }

    setUnactive(): void {
        this.isActive = false;
        this.container.nativeElement.classList.remove('active');
    }

    getIsImageFile(file: FileModel): boolean {
        return ['jpg', 'jpeg', 'png', 'webp', 'gif'].indexOf(file.extension) > -1;
    }

    getImageThumbnail(file: FileModel, filterSet = 'thumb_small'): string {
        const src = this.getFilePath(file);
        return `/media/cache/resolve/${filterSet}/${src}`;
    }
}
