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

    deleteSelected() {
        // if (this.selectedIds.length === 0) {
        //     this.showAlert(this.getLangString('NOTHING_IS_SELECTED'));
        //     return;
        // }
        // const pathArr = [];
        // this.selectedIds.forEach((id) => {
        //     const templateIndex = findIndex(this.items, {id: id});
        //     if (templateIndex > -1) {
        //         const template = templateIndex > -1 ? this.items[templateIndex] : null;
        //         pathArr.push(Template.getPath(template));
        //     }
        // });
        // this.confirmAction(this.getLangString('YOU_SURE_YOU_WANT_DELETE_SELECTED'))
        //     .then((result) => {
        //         if (result === 'accept') {
        //             this.dataService.deleteFilesBatch(pathArr)
        //                 .subscribe(res => {
        //                         this.clearSelected();
        //                         this.getList();
        //                     },
        //                     err => this.showAlert(err.error || this.getLangString('ERROR')));
        //         }
        //     });
    }

    // deleteItem(itemId: number): void {
    //     const templateIndex = findIndex(this.items, {id: itemId});
    //     const template = templateIndex > -1 ? this.items[templateIndex] : null;
    //     if (!template) {
    //         return;
    //     }
    //     const templatePath = Template.getPath(template);
    //     this.confirmAction(this.getLangString('YOU_SURE_YOU_WANT_DELETE'))
    //         .then((result) => {
    //             if (result === 'accept') {
    //                 this.dataService.deleteTemplateItem(templatePath)
    //                     .subscribe(() => {
    //                         this.getList();
    //                     }, (err) => {
    //                         if (err['error']) {
    //                             this.showAlert(err['error']);
    //                         }
    //                     });
    //             }
    //         });
    // }
}
