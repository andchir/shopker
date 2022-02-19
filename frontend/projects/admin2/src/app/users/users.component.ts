import {Component, OnInit, Input, ElementRef, OnDestroy} from '@angular/core';

import {DialogService} from 'primeng/dynamicdialog';
import {ConfirmationService, MenuItem, MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

import {UsersService} from './users.service';
import {QueryOptions} from '../models/query-options';
import {AppTablePageAbstractComponent, TableField} from '../components/table-page.components.abstract';
import {ContentTypesService} from '../catalog/services/content_types.service';
import {ModalUserContentComponent} from './modal-user.component';
import {User} from './models/user.model';

@Component({
    selector: 'app-orders',
    templateUrl: 'templates/users.component.html',
    providers: [DialogService, ConfirmationService, UsersService]
})
export class UsersComponent extends AppTablePageAbstractComponent<User> implements OnInit, OnDestroy {
    
    queryOptions: QueryOptions = new QueryOptions(1, 12, 'id', 'desc');
    items: User[] = [];
    cols: TableField[] = [
        { field: 'id', header: 'ID', outputType: 'text-center', outputProperties: {} },
        { field: 'email', header: 'EMAIL', outputType: 'text', outputProperties: {} },
        { field: 'fullName', header: 'FULL_NAME', outputType: 'text', outputProperties: {} },
        { field: 'role', header: 'ROLE', outputType: 'userRole', outputProperties: {} },
        { field: 'createdDate', header: 'DATE_TIME', outputType: 'date', outputProperties: {format: 'dd/MM/y HH:mm:ss'} },
        { field: 'isActive', header: 'STATUS', outputType: 'boolean', outputProperties: {} }
    ];

    constructor(
        public dialogService: DialogService,
        public contentTypesService: ContentTypesService,
        public dataService: UsersService,
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
        return ModalUserContentComponent;
    }
}
