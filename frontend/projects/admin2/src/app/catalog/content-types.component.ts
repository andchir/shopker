import {Component, OnDestroy, OnInit} from '@angular/core';

import {DialogService} from 'primeng/dynamicdialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

import {AppTablePageAbstractComponent, TableField} from '../components/table-page.components.abstract';
import {ContentTypesService} from './services/content_types.service';
import {ContentType} from './models/content_type.model';
import {QueryOptions} from '../models/query-options';
import {ModalContentTypeComponent} from './modal-content-type.component';

@Component({
    selector: 'app-catalog-category',
    templateUrl: './templates/content-types.component.html',
    providers: [DialogService, ConfirmationService, ContentTypesService]
})
export class ContentTypesComponent extends AppTablePageAbstractComponent<ContentType> implements OnInit, OnDestroy {

    queryOptions: QueryOptions = new QueryOptions(1, 12, 'name', 'desc');
    items: ContentType[] = [];
    cols: TableField[] = [
        { field: 'id', header: 'ID', outputType: 'text-center', outputProperties: {} },
        { field: 'title', header: 'TITLE', outputType: 'text', outputProperties: {} },
        { field: 'name', header: 'SYSTEM_NAME', outputType: 'text', outputProperties: {} },
        { field: 'collection', header: 'COLLECTION', outputType: 'text', outputProperties: {} },
        { field: 'isActive', header: 'STATUS', outputType: 'boolean', outputProperties: {} }
    ];
    
    constructor(
        public dialogService: DialogService,
        public contentTypesService: ContentTypesService,
        public dataService: ContentTypesService,
        public translateService: TranslateService,
        public messageService: MessageService,
        public confirmationService: ConfirmationService
    ) {
        super(dialogService, contentTypesService, dataService, translateService, messageService, confirmationService);
    }

    ngOnInit() {
        super.ngOnInit();
        this.menuItems.push({
            label: this.getLangString('DISABLE_ENABLE'),
            icon: 'pi pi-times-circle',
            command: () => {
                this.blockSelected();
            }
        });
    }

    getModalComponent() {
        return ModalContentTypeComponent;
    }
}
