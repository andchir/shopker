import {Component, OnDestroy, OnInit} from '@angular/core';

import {DialogService} from 'primeng/dynamicdialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

import {ContentTypesService} from '../catalog/services/content_types.service';
import {AppTablePageAbstractComponent, TableField} from '../components/table-page.components.abstract';
import {FileRegularInterface} from './models/file-regular.interface';
import {QueryOptions} from '../models/query-options';
import {EditableFile} from './models/editable-file.model';
import {FileEditService} from './services/file-edit.service';
import {ModalFileEditComponent} from './modal-file-edit.component';

@Component({
    selector: 'app-assets-edit',
    templateUrl: './templates/assets-edit.component.html',
    providers: [DialogService, ConfirmationService, FileEditService]
})
export class AssetsEditComponent extends AppTablePageAbstractComponent<EditableFile> implements OnInit, OnDestroy {

    queryOptions: QueryOptions = new QueryOptions(1, 20, 'type', 'asc');
    themes: {name: string, title: string}[] = [];
    cols: TableField[] = [
        { field: 'name', header: 'NAME', outputType: 'text', outputProperties: {} },
        { field: 'type', header: 'TYPE', outputType: 'text', outputProperties: {} },
        { field: 'path', header: 'PATH', outputType: 'text', outputProperties: {} },
        { field: 'fileSize', header: 'FILE_SIZE', outputType: 'number', outputProperties: {} }
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
        this.dataService.setRequestUrl('/admin/templates/editable_files');
        this.menuItems = [
            {
                label: this.getLangString('REFRESH'),
                icon: 'pi pi-refresh',
                command: (event?: any) => {
                    this.queryOptions.page = 1;
                    this.queryOptions.search_word = '';
                    this.getData();
                }
            }
        ];
        this.contextMenuItems = [
            {
                label: this.getLangString('EDIT'),
                icon: 'pi pi-fw pi-pencil',
                command: () => this.openModal(this.itemSelected)
            }
        ];
    }

    getModalComponent() {
        return ModalFileEditComponent;
    }

    getItemData(item: EditableFile): {[name: string]: number|string} {
        if (item) {
            return {
                id: item.id || 0,
                name: item.name,
                path: item.path,
                type: item.type,
                extension: item.extension,
                themeName: item.themeName || ''
            };
        }
        return {
            id: 0
        };
    }
}
