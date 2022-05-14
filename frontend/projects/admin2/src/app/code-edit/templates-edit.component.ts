import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {takeUntil} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';

import {QueryOptions} from '../models/query-options';
import {TableField} from '../components/table-page.components.abstract';
import {ContentTypesService} from '../catalog/services/content_types.service';
import {EditableFile} from './models/editable-file.model';
import {FileEditService} from './services/file-edit.service';
import {ModalFileEditComponent} from './modal-file-edit.component';
import {AssetsEditComponent} from './assets-edit.component';

@Component({
    selector: 'app-template-edit',
    templateUrl: './templates/templates-edit.component.html',
    providers: [DialogService, FileEditService]
})
export class TemplatesEditComponent extends AssetsEditComponent implements OnInit, OnDestroy {
    
    queryOptions: QueryOptions = new QueryOptions(1, 20, 'path', 'asc');
    themes: {name: string, title: string}[] = [];
    cols: TableField[] = [
        { field: 'name', header: 'NAME', outputType: 'text', outputProperties: {} },
        { field: 'themeName', header: 'TEMPLATE_THEME_NAME', outputType: 'text', outputProperties: {} },
        { field: 'path', header: 'PATH', outputType: 'text', outputProperties: {} }
    ];

    constructor(
        public dialogService: DialogService,
        public contentTypesService: ContentTypesService,
        public dataService: FileEditService,
        public translateService: TranslateService,
        public messageService: MessageService,
        public confirmationService: ConfirmationService
    ) {
        super(dialogService, contentTypesService, dataService, translateService, messageService, confirmationService);
    }

    ngOnInit() {
        this.menuItems = [
            {
                label: this.getLangString('REFRESH'),
                icon: 'pi pi-refresh',
                command: (event?: any) => {
                    this.queryOptions.page = 1;
                    this.queryOptions.search_word = '';
                    this.getData();
                }
            },
            {
                label: this.getLangString('DELETE_SELECTED'),
                icon: 'pi pi-times',
                command: (event?: any) => {
                    this.deleteSelected();
                }
            }
        ];
        this.contextMenuItems = [
            {
                label: this.getLangString('EDIT'),
                icon: 'pi pi-fw pi-pencil',
                command: () => this.openModal(this.itemSelected)
            },
            {
                label: this.getLangString('DELETE'),
                icon: 'pi pi-fw pi-trash',
                command: () => this.deleteItem(this.itemSelected)
            }
        ];
        this.getThemesList();
    }

    getThemesList(): void {
        this.dataService.getThemesList()
            .subscribe({
                next: (res) => {
                    this.themes = res.map((item) => {
                        if (!item.title) {
                            item.title = item.name;
                        }
                        return item;
                    });
                    this.themes.unshift({
                        name: '',
                        title: this.getLangString('ALL')
                    });
                }
            });
    }
    
    onThemeChange(): void {
        this.queryOptions.page = 1;
        this.getData();
    }

    deleteSelected() {
        if (!this.itemsSelected || this.itemsSelected.length === 0) {
            this.showAlert(this.getLangString('NOTHING_IS_SELECTED'));
            return;
        }
        this.confirmationService.confirm({
            message: this.getLangString('YOU_SURE_YOU_WANT_DELETE'),
            accept: () => {
                const pathArr = [];
                this.itemsSelected.forEach((item) => {
                    pathArr.push(EditableFile.getPath(item));
                });
                this.dataService.deleteFilesBatch(pathArr)
                    .pipe(takeUntil(this.destroyed$))
                    .subscribe({
                        next: (res) => {
                            this.messageService.add({
                                key: 'message',
                                severity: 'success',
                                detail: this.getLangString('DELETED_SUCCESSFULLY')
                            });
                            if (this.items.length === 1) {
                                this.queryOptions.page = 1;
                            }
                            this.getData();
                        },
                        error: (err) => {
                            if (err.error) {
                                this.messageService.add({
                                    key: 'message',
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

    deleteItem(item: EditableFile, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.confirmationService.confirm({
            message: this.getLangString('YOU_SURE_YOU_WANT_DELETE'),
            accept: () => {
                const filePath = EditableFile.getPath(item);
                this.dataService.deleteFileItem(filePath)
                    .pipe(takeUntil(this.destroyed$))
                    .subscribe({
                        next: (res) => {
                            this.messageService.add({
                                key: 'message',
                                severity: 'success',
                                detail: this.getLangString('DELETED_SUCCESSFULLY')
                            });
                            if (this.items.length === 1) {
                                this.queryOptions.page = 1;
                            }
                            this.getData();
                        },
                        error: (err) => {
                            if (err.error) {
                                this.messageService.add({
                                    key: 'message',
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
}
