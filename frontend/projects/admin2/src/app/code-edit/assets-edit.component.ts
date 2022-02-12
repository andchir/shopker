import {Component} from '@angular/core';

import {DialogService} from 'primeng/dynamicdialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

import {TemplatesEditService} from './services/templates-edit.service';
import {TemplatesEditComponent} from './templates-edit.component';
import {ContentTypesService} from '../catalog/services/content_types.service';

@Component({
    selector: 'app-assets-edit',
    templateUrl: './templates/assets-edit.component.html',
    providers: [DialogService, ConfirmationService, TemplatesEditService]
})
export class AssetsEditComponent extends TemplatesEditComponent {

    constructor(
        public dialogService: DialogService,
        public contentTypesService: ContentTypesService,
        public dataService: TemplatesEditService,
        public translateService: TranslateService,
        public messageService: MessageService,
        public confirmationService: ConfirmationService
    ) {
        super(dialogService, contentTypesService, dataService, translateService, messageService, confirmationService);
    }
    
}
