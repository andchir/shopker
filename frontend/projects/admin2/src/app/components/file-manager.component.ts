import {
    Component, ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';

import {defer, Subject} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import {ContextMenu} from 'primeng/contextmenu';

import {FileManagerService} from '../services/file-manager.service';
import {FileModel} from '../models/file.model';
import {ModalConfirmTextComponent} from './modal-confirm-text.component';
import {FileData} from '../catalog/models/file-data.model';
import {ModalFileUploadContentComponent} from './modal-file-upload.component';
import {ModalFileContentComponent} from './modal-file.component';

@Component({
    selector: 'app-file-manager',
    templateUrl: 'templates/file-manager.component.html',
    providers: [FileManagerService, DialogService]
})
export class FileManagerComponent implements OnInit, OnDestroy {
    
    files: FileModel[] = [];
    fileItemSelected: FileModel;
    loading = false;
    currentPath = '';
    errorMessage = '';
    closed$ = new Subject<void>();
    destroyed$ = new Subject<void>();
    private _isActive = false;
    contextMenuItems: MenuItem[];
    
    @ViewChild('contextMenu', { static: true }) contextMenu: ContextMenu;
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

    ngOnInit(): void {
        this.contextMenuItems = [
            {
                label: this.getLangString('RENAME'),
                icon: 'pi pi-pencil',
                command: () => {
                    this.renameItem(this.fileItemSelected);
                }
            },
            {
                label: this.getLangString('DELETE'),
                icon: 'pi pi-trash',
                command: () => {
                    this.deleteItem(this.fileItemSelected);
                }
            }
        ];
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
            this.currentPath = FileModel.getFilePath(file, this.currentPath);
            this.getFilesList();
        } else {
            this.openModal(file);
        }
    }

    openModal(file: FileModel) {
        this.errorMessage = '';
        const currentFile = Object.assign({}, file);
        const ref = this.dialogService.open(ModalFileContentComponent, {
            header: currentFile.fileName,
            width: '400px',
            style: {maxWidth: '100%'},
            data: {
                file: currentFile,
                filePath: `/${FileModel.getFilePath(currentFile, this.currentPath)}`
            }
        });
        ref.onClose
            .pipe(take(1))
            .subscribe((result) => {
                if (result) {
                    switch (result) {
                        case 'delete':
                            this.deleteItemAction(currentFile);
                            break;
                        case 'rename':
                            this.renameItemAction(currentFile.title, currentFile);
                            break;
                        case 'unpack':
                            this.loading = true;
                            this.dataService.unpackFile(this.currentPath, currentFile)
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
                                            if (!this.isActive) {
                                                this.activeToggle();
                                            }
                                        }
                                        this.loading = false;
                                    }
                                });
                            break;
                    }
                }
            });
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
    
    deleteItemAction(item?: FileModel): void {
        this.loading = true;
        defer(() => {
            return item && !item.isDir
                ? this.dataService.deleteFile(this.currentPath, item)
                : this.dataService.deleteFolder(this.currentPath + (item && item.isDir ? '/' + item.fileName : ''));
        })
        .pipe(takeUntil(this.closed$))
        .subscribe({
            next: () => {
                if (item) {
                    this.getFilesList();
                } else {
                    this.openDirPrevious();
                }
            },
            error: (err) => {
                if (err['error']) {
                    this.errorMessage = err['error'];
                }
                this.loading = false;
            }
        });
    }

    deleteItem(item?: FileModel, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.confirmationService.confirm({
            message: item && !item.isDir
                ? this.getLangString('YOU_SURE_YOU_WANT_DELETE')
                : this.getLangString('YOU_SURE_YOU_WANT_DELETE_FOLDER'),
            accept: () => {
                this.deleteItemAction(item);
            }
        });
    }

    renameItemAction(newTitle: string, item?: FileModel): void {
        this.loading = true;
        const targetType = !item || item.isDir ? 'folder' : 'file';
        defer(() => {
            return item
                ? this.dataService.rename(FileModel.getFilePath(item, this.currentPath), newTitle, targetType)
                : this.dataService.rename(this.currentPath, newTitle);
        })
            .pipe(takeUntil(this.closed$))
            .subscribe({
                next: (res) => {
                    if (!res || !res.success) {
                        this.loading = false;
                        return;
                    }
                    if (item) {
                        this.getFilesList();
                    } else {
                        this.openDirPrevious();
                    }
                },
                error: (err) => {
                    if (err['error']) {
                        this.errorMessage = err['error'];
                    }
                    this.loading = false;
                }
            });
    }

    renameItem(item?: FileModel, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.errorMessage = '';
        const tmp = this.currentPath.split('/');
        const itemName = item ? item.title : tmp.pop();
        const fileExtension = item ? item.extension : '';
        const labelName = !item || item.isDir ? 'FOLDER_NAME' : 'FILE_NAME';

        const ref = this.dialogService.open(ModalConfirmTextComponent, {
            header: this.getLangString(labelName),
            width: '400px',
            style: {maxWidth: '100%'},
            data: {
                labelText: labelName,
                buttonText: 'RENAME',
                textValue: itemName,
                fileExtension
            }
        });
        ref.onClose
            .pipe(takeUntil(this.destroyed$))
            .subscribe((result) => {
                if (result && result !== itemName) {
                    this.renameItemAction(result, item);
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
    
    onContextMenu(index: number, event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.fileItemSelected = this.files[index];
        this.contextMenu.show(event);
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
        const src = FileModel.getFilePath(file, this.currentPath);
        return `/media/cache/resolve/${filterSet}/${src}`;
    }

    ngOnDestroy(): void {
        this.closed$.next();
        this.closed$.complete();
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
