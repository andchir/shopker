import {Component, OnDestroy, OnInit} from '@angular/core';

import {DialogService} from 'primeng/dynamicdialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

import {AppTablePageAbstractComponent, TableField} from '../components/table-page.components.abstract';
import {ContentTypesService} from './services/content_types.service';
import {FieldType} from './models/field-type.model';
import {FieldTypesService} from './services/field-types.service';
import {QueryOptions} from '../models/query-options';
import {ModalFieldTypeComponent} from './modal-field-type.component';

@Component({
    selector: 'app-catalog-category',
    templateUrl: './templates/field-types.component.html',
    providers: [DialogService, ConfirmationService, FieldTypesService]
})
export class FieldTypesComponent extends AppTablePageAbstractComponent<FieldType> implements OnInit, OnDestroy {

    queryOptions: QueryOptions = new QueryOptions(1, 12, 'name', 'desc');
    items: FieldType[] = [];
    cols: TableField[] = [
        { field: 'id', header: 'ID', outputType: 'text-center', outputProperties: {} },
        { field: 'title', header: 'TITLE', outputType: 'text', outputProperties: {} },
        { field: 'name', header: 'SYSTEM_NAME', outputType: 'text', outputProperties: {} },
        { field: 'isActive', header: 'STATUS', outputType: 'boolean', outputProperties: {} }
    ];
    
    constructor(
        public dialogService: DialogService,
        public contentTypesService: ContentTypesService,
        public dataService: FieldTypesService,
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
        return ModalFieldTypeComponent;
    }
}
