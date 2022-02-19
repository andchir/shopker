import {Component, OnDestroy, OnInit} from '@angular/core';

import {DialogService} from 'primeng/dynamicdialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

import {AppTablePageAbstractComponent} from '../components/table-page.components.abstract';
import {ContentTypesService} from './services/content_types.service';
import {ContentType} from './models/content_type.model';

@Component({
    selector: 'app-catalog-category',
    templateUrl: './templates/catalog-category.component.html',
    providers: [DialogService, ConfirmationService, ContentTypesService]
})
export class ContentTypesComponent extends AppTablePageAbstractComponent<ContentType> implements OnInit, OnDestroy {

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

    getModalComponent() {
        return null;
    }
}
