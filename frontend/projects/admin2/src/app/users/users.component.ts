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
    providers: [DialogService, MessageService, ConfirmationService, UsersService]
})
export class UsersComponent extends AppTablePageAbstractComponent<User> implements OnInit, OnDestroy {
    
    queryOptions: QueryOptions = new QueryOptions(1, 12, 'id', 'desc');
    items: User[] = [];
    cols: TableField[] = [
        { field: 'id', header: 'ID', outputType: 'text-center', outputProperties: {} },
        { field: 'email', header: 'EMAIL', outputType: 'text', outputProperties: {} }
    ];
    menuItems: MenuItem[];

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
        this.menuItems = [
            {
                label: this.getLangString('REFRESH'),
                icon: 'pi pi-refresh',
                command: () => {
                    this.queryOptions.page = 1;
                    this.queryOptions.search_word = '';
                    this.getData();
                }
            },
            {
                label: this.getLangString('DELETE_SELECTED'),
                icon: 'pi pi-times',
                command: () => {
                    this.deleteSelected();
                }
            }
        ];
        super.ngOnInit();
    }

    getModalComponent() {
        return ModalUserContentComponent;
    }
}
