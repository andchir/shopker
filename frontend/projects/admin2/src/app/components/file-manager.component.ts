import {Component, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';

import {FileManagerService} from '../services/file-manager.service';
import {FileModel} from '../models/file.model';
import {ModalConfirmTextComponent} from './modal-confirm-text.component';
import {FileData} from '../catalog/models/file-data.model';
import {ModalFileUploadContentComponent} from './modal-file-upload.component';

@Component({
    selector: 'app-file-manager',
    templateUrl: 'templates/file-manager.component.html',
    providers: [FileManagerService, DialogService]
})
export class FileManagerComponent implements OnDestroy {
    
    files: any[] = [];
    loading = false;
    currentPath = '';
    errorMessage = '';
    closed$ = new Subject<void>();
    destroyed$ = new Subject<void>();
    private _isActive = false;

    @ViewChild('container', { static: true }) container;
    @Output() isActiveChange = new EventEmitter<boolean>();
    @Input() set isActive(value: boolean) {
        this._isActive = value;
        this.onAfterActiveToggle();
    }

    get isActive(): boolean {
        return this._isActive;
    }

    constructor(
        public dataService: FileManagerService,
        public dialogService: DialogService,
        public confirmationService: ConfirmationService,
        public translateService: TranslateService
    ) {

    }

    getFilesList(): void {
        this.errorMessage = '';
        this.files.splice(0, this.files.length);
        this.loading = true;
        this.dataService.getList({path: this.currentPath})
            .pipe(takeUntil(this.closed$))
            .subscribe({
                next: (res) => {
                    this.files = res;
                    this.loading = false;
                },
                error: (err) => {
                    if (err['error']) {
                        this.errorMessage = err['error'];
                    }
                    this.loading = false;
                }
            });
    }

    dragStartHandler(file: FileModel, event: DragEvent): void {
        if (file.isDir) {
            return;
        }
        const path = this.currentPath ? `/${this.currentPath}` : '';
        event.dataTransfer.setData('text/plain', `${path}/${file.fileName}`);
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
        console.log('openModal', file);
        
        const currentFile = Object.assign({}, file);

        // this.modalRef = this.modalService.open(ModalFileContentComponent, {backdrop: 'static', keyboard: false});
        // this.modalRef.componentInstance.modalTitle = currentFile.fileName;
        // this.modalRef.componentInstance.file = currentFile;
        // this.modalRef.componentInstance.filePath = `/${this.getFilePath(currentFile)}`;
        // this.modalRef.result.then((result: string) => {
        //     switch (result) {
        //         case 'delete':
        //             this.loading = true;
        //             this.dataService.deleteFile(this.currentPath, currentFile)
        //                 .pipe(takeUntil(this.closed$))
        //                 .subscribe((res) => {
        //                     if (!this.isActive) {
        //                         this.activeToggle();
        //                     }
        //                     this.getFilesList();
        //                 }, (err) => {
        //                     if (err['error']) {
        //                         this.errorMessage = err['error'];
        //                         if (!this.isActive) {
        //                             this.activeToggle();
        //                         }
        //                     }
        //                     this.loading = false;
        //                 });
        //             break;
        //         case 'rename':
        //             this.loading = true;
        //             this.dataService.rename(this.getFilePath(currentFile), currentFile.title, 'file')
        //                 .pipe(takeUntil(this.closed$))
        //                 .subscribe((res) => {
        //                     if (!this.isActive) {
        //                         this.activeToggle();
        //                     }
        //                     this.getFilesList();
        //                 }, (err) => {
        //                     if (err['error']) {
        //                         this.errorMessage = err['error'];
        //                     }
        //                     this.loading = false;
        //                 });
        //             break;
        //     }
        // });
    }

    createFolder(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.errorMessage = '';
        const ref = this.dialogService.open(ModalConfirmTextComponent, {
            header: this.getLangString('CREATE_FOLDER'),
            width: '400px',
            style: {maxWidth: '100%'},
            data: {
                labelText: 'FOLDER_NAME',
                buttonText: 'CREATE'
            }
        });
        ref.onClose
            .pipe(takeUntil(this.destroyed$))
            .subscribe((result) => {
                if (result) {
                    this.loading = true;
                    this.dataService.createFolder(this.currentPath, result)
                        .pipe(takeUntil(this.closed$))
                        .subscribe({
                            next: () => {
                                if (!this.isActive) {
                                    this.activeToggle();
                                }
                                this.getFilesList();
                            },
                            error: (err) => {
                                if (err['error']) {
                                    this.errorMessage = err['error'];
                                }
                                if (!this.isActive) {
                                    this.activeToggle();
                                }
                                this.loading = false;
                            }
                        });
                }
            });
    }

    deleteFolder(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.confirmationService.confirm({
            message: this.getLangString('YOU_SURE_YOU_WANT_DELETE_FOLDER'),
            accept: () => {
                this.loading = true;
                this.dataService.deleteFolder(this.currentPath)
                    .subscribe({
                        next: () => {
                            this.openDirPrevious();
                            this.loading = false;
                        },
                        error: (err) => {
                            if (err['error']) {
                                this.errorMessage = err['error'];
                            }
                            this.loading = false;
                        }
                    });
            }
        });
    }

    renameFolder(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.errorMessage = '';
        const tmp = this.currentPath.split('/');
        const folderName = tmp.pop();

        const ref = this.dialogService.open(ModalConfirmTextComponent, {
            header: this.getLangString('FOLDER_NAME'),
            width: '400px',
            style: {maxWidth: '100%'},
            data: {
                labelText: 'FOLDER_NAME',
                buttonText: 'RENAME',
                textValue: folderName
            }
        });
        ref.onClose
            .pipe(takeUntil(this.destroyed$))
            .subscribe((result) => {
                if (result && result !== folderName) {
                    this.loading = true;
                    this.dataService.rename(this.currentPath, result)
                        .pipe(takeUntil(this.closed$))
                        .subscribe({
                            next: () => {
                                this.openDirPrevious();
                                this.loading = false;
                            },
                            error: (err) => {
                                if (err['error']) {
                                    this.errorMessage = err['error'];
                                }
                                this.loading = false;
                            }
                        });
                }
            });
    }

    uploadFiles(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.errorMessage = '';
        const ref = this.dialogService.open(ModalFileUploadContentComponent, {
            header: this.getLangString('UPLOAD_FILES'),
            width: '400px',
            style: {maxWidth: '100%'},
            data: {}
        });
        ref.onClose
            .pipe(takeUntil(this.destroyed$))
            .subscribe((result) => {
                if (result && result.length > 0) {
                    this.loading = true;
                    const data = {};
                    result.forEach((file, index) => {
                        data[`file${index}`] = file;
                    });
                    this.dataService.postFormData(this.dataService.getFormData(data), this.currentPath)
                        .pipe(takeUntil(this.closed$))
                        .subscribe({
                            next: (res) => {
                                if (!this.isActive) {
                                    this.activeToggle();
                                }
                                this.getFilesList();
                            },
                            error: (err) => {
                                if (err['error']) {
                                    this.errorMessage = err['error'];
                                }
                                this.loading = false;
                            }
                        });
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

    onAfterActiveToggle(): void {
        if (this.isActive) {
            this.getFilesList();
            this.container.nativeElement.classList.add('active');
        } else {
            this.closed$.next();
            this.container.nativeElement.classList.remove('active');
        }
    }

    activeToggle(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.isActiveChange.emit(!this._isActive);
    }

    getIsImageFile(fileExtension: string): boolean {
        return FileData.getIsImageFile(fileExtension);
    }

    getImageThumbnail(file: FileModel, filterSet = 'thumb_small'): string {
        const src = this.getFilePath(file);
        return `/media/cache/resolve/${filterSet}/${src}`;
    }

    ngOnDestroy(): void {
        this.closed$.next();
        this.closed$.complete();
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
