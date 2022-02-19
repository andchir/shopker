import {Component, OnDestroy, OnInit} from '@angular/core';

import {DialogService} from 'primeng/dynamicdialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

import {AppTablePageAbstractComponent, TableField} from '../components/table-page.components.abstract';
import {ContentTypesService} from './services/content_types.service';
import {FieldType} from './models/field-type.model';
import {FieldTypesService} from './services/field-types.service';

@Component({
    selector: 'app-catalog-category',
    templateUrl: './templates/catalog-category.component.html',
    providers: [DialogService, ConfirmationService, FieldTypesService]
})
export class FieldTypesComponent extends AppTablePageAbstractComponent<FieldType> implements OnInit, OnDestroy {

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

    getModalComponent() {
        return null;
    }
}
