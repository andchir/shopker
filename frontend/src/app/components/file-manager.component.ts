import {Component, OnInit, ViewChild} from '@angular/core';

import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';

import {FileManagerService} from '../services/file-manager.service';
import {FileModel} from '../models/file.model';
import {ModalFileContentComponent} from './modal-file.component';
import {ModalConfirmTextComponent} from './modal-confirm-text.component';
import {ConfirmModalContentComponent} from '../app.component';

@Component({
    selector: 'app-file-manager',
    templateUrl: 'templates/file-manager.component.html',
    providers: [FileManagerService]
})
export class FileManagerComponent implements OnInit {

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

    ngOnInit(): void {

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
        if (this.modalRef) {
            this.modalRef.close();
        }
        this.modalRef = this.modalService.open(ModalFileContentComponent);
        this.modalRef.componentInstance.modalTitle = file.fileName;
        this.modalRef.componentInstance.file = file;
        this.modalRef.componentInstance.filePath = this.getFilePath(file);
    }

    createFolder(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        if (this.modalRef) {
            this.modalRef.close();
        }
        this.errorMessage = '';
        this.modalRef = this.modalService.open(ModalConfirmTextComponent);
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
                    });
            }
        });
    }

    deleteFolder(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.confirmAction(this.getLangString('YOU_SURE_YOU_WANT_DELETE_FOLDER'))
            .then((result) => {
                if (result === 'accept') {
                    this.loading = true;
                    this.dataService.deleteFolder(this.currentPath)
                        .subscribe((res) => {
                            this.openDirPrevous();
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
        if (this.modalRef) {
            this.modalRef.close();
        }
        this.errorMessage = '';

        const tmp = this.currentPath.split('/');
        const folderName = tmp.pop();

        this.modalRef = this.modalService.open(ModalConfirmTextComponent);
        this.modalRef.componentInstance.modalTitle = 'RENAME_FOLDER';
        this.modalRef.componentInstance.labelText = 'FOLDER_NAME';
        this.modalRef.componentInstance.textValue = folderName;
        this.modalRef.componentInstance.buttonText = 'RENAME';
        this.modalRef.result.then((result) => {
            if (result && result !== folderName) {
                this.loading = true;
                this.dataService.rename(this.currentPath, result)
                    .subscribe((res) => {
                        this.openDirPrevous();
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
        if (this.modalRef) {
            this.modalRef.close();
        }
        this.errorMessage = '';

        console.log('uploadFiles', this.currentPath);

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
            : file.fileName;
    }

    openDirPrevous(event?: MouseEvent): void {
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

    setActive(): void {
        this.isActive = true;
        this.container.nativeElement.classList.add('active');
        this.getFilesList();
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
