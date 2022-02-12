import {Component, OnDestroy, OnInit} from '@angular/core';

import {DialogService} from 'primeng/dynamicdialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

import {ContentTypesService} from '../catalog/services/content_types.service';
import {AppTablePageAbstractComponent, TableField} from '../components/table-page.components.abstract';
import {ModalTemplateEditComponent} from './modal-template.component';
import {FileRegularInterface} from './models/file-regular.interface';
import {AssetsService} from './services/assets.service';
import {QueryOptions} from '../models/query-options';

@Component({
    selector: 'app-assets-edit',
    templateUrl: './templates/assets-edit.component.html',
    providers: [DialogService, ConfirmationService, AssetsService]
})
export class AssetsEditComponent extends AppTablePageAbstractComponent<FileRegularInterface> implements OnInit, OnDestroy {

    queryOptions: QueryOptions = new QueryOptions(1, 20, 'name', 'asc');
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
        public dataService: AssetsService,
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
    }

    getModalComponent() {
        return ModalTemplateEditComponent;
    }

    getEditableFiles(): void {
        // this.dataService.getEditableFiles()
        //     .subscribe((res) => {
        //         if (res.items) {
        //             // this.files['css'] = res.items.filter((item) => {
        //             //     return item.type === 'css';
        //             // });
        //             // this.files['js'] = res.items.filter((item) => {
        //             //     return item.type === 'js';
        //             // });
        //             // this.files['config'] = res.items.filter((item) => {
        //             //     return item.type === 'config';
        //             // });
        //             // this.files['translations'] = res.items.filter((item) => {
        //             //     return item.type === 'translations';
        //             // });
        //         }
        //     });
    }
}
