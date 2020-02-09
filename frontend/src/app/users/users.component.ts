import {Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';

import {Observable, Subject} from 'rxjs';
import {takeUntil, map} from 'rxjs/operators';
import {findIndex} from 'lodash';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';

import {UserOption, User} from './models/user.model';
import {PageTableAbstractComponent} from '../page-table.abstract';
import {UsersService} from './users.service';
import {AppSettings} from '../services/app-settings.service';
import {QueryOptions} from '../models/query-options';
import {AppModalContentAbstractComponent} from '../components/app-modal-content.abstract';
import {FormFieldsOptions} from '../models/form-fields-options.interface';

@Component({
    selector: 'app-modal-user',
    templateUrl: './templates/modal-user.html',
    providers: []
})
export class ModalUserContentComponent extends AppModalContentAbstractComponent<User> {

    userRoles$: Observable<{[key: string]: string}[]>;
    baseUrl: string;
    allowImpersonation = false;

    model = new User(0, '', '', [], true, []);
    formFields: FormFieldsOptions[] = [
        {
            name: 'email',
            validators: [Validators.required, this.emailValidator]
        },
        {
            name: 'fullName',
            validators: [Validators.required]
        },
        {
            name: 'phone',
            validators: []
        },
        {
            name: 'role',
            validators: [Validators.required]
        },
        {
            name: 'isActive',
            validators: []
        },
        {
            name: 'password',
            validators: []
        },
        {
            name: 'confirmPassword',
            validators: []
        },
        {
            name: 'options',
            validators: [],
            children: [
                {
                    name: 'name',
                    validators: [Validators.required]
                },
                {
                    name: 'title',
                    validators: [Validators.required]
                },
                {
                    name: 'value',
                    validators: [Validators.required]
                }
            ]
        }
    ];

    constructor(
        public fb: FormBuilder,
        public activeModal: NgbActiveModal,
        public translateService: TranslateService,
        public dataService: UsersService,
        public elRef: ElementRef,
        private appSettings: AppSettings
    ) {
        super(fb, activeModal, translateService, dataService, elRef);
    }

    onBeforeInit(): void {
        if (!this.isEditMode) {
            const passwordIndex = findIndex<FormFieldsOptions>(this.formFields, {name: 'password'});
            if (passwordIndex > -1) {
                this.formFields[passwordIndex].validators.push(Validators.required);
                this.formFields[passwordIndex + 1].validators.push(Validators.required);
            }
        }
        this.baseUrl = AppSettings.getBaseUrl();
        this.getUserRoles();
    }

    onAfterGetData(): void {
        this.buildControls(this.form, this.formFields);
        if (this.isEditMode
            && this.appSettings.isSuperAdmin
            && this.appSettings.settings.userEmail !== this.model.email) {
                this.allowImpersonation = true;
        }
    }

    getUserRoles(): void {
        this.userRoles$ = this.dataService.getRolesList()
            .pipe(
                takeUntil(this.destroyed$),
                map(res => res['roles'])
            );
    }
}

@Component({
    selector: 'app-shk-users',
    templateUrl: './templates/page-users.html',
    providers: [ UsersService ]
})
export class UsersComponent extends PageTableAbstractComponent<User> implements OnInit {

    static title = 'USERS';
    queryOptions: QueryOptions = new QueryOptions('id', 'desc', 1, 10, 0, 0);

    tableFields = [
        {
            name: 'id',
            sortName: 'id',
            title: 'ID',
            outputType: 'text',
            outputProperties: {}
        },
        {
            name: 'email',
            sortName: 'email',
            title: 'EMAIL',
            outputType: 'text',
            outputProperties: {}
        },
        {
            name: 'fullName',
            sortName: 'fullName',
            title: 'FULL_NAME',
            outputType: 'text',
            outputProperties: {}
        },
        {
            name: 'role',
            sortName: 'roles',
            title: 'ROLE',
            outputType: 'userRole',
            outputProperties: {}
        },
        {
            name: 'createdDate',
            sortName: 'createdDate',
            title: 'DATE_TIME',
            outputType: 'date',
            outputProperties: {
                format: 'dd/MM/y H:mm:s'
            }
        },
        {
            name: 'isActive',
            sortName: 'isActive',
            title: 'STATUS',
            outputType: 'boolean',
            outputProperties: {}
        }
    ];

    constructor(
        public dataService: UsersService,
        public activeModal: NgbActiveModal,
        public modalService: NgbModal,
        public translateService: TranslateService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        super(dataService, activeModal, modalService, translateService);
    }

    ngOnInit(): void {
        this.afterInit();
    }

    afterInit(): void {
        this.route.paramMap
            .subscribe(
                params => {
                    this.queryOptions.search_word = params.get('userEmail');
                    this.getList();
                }
            );
    }

    onSearchClear(): void {
        if (this.route.snapshot.url && this.route.snapshot.url[0].path) {
            this.router.navigate(['/users', '']);
        } else {
            this.getList();
        }
    }

    setModalInputs(itemId?: number, isItemCopy: boolean = false, modalId = ''): void {
        const isEditMode = typeof itemId !== 'undefined' && !isItemCopy;
        this.modalRef.componentInstance.modalTitle = isEditMode
            ? `${this.getLangString('USER')} #${itemId}`
            : this.getLangString('ADD_USER');
        this.modalRef.componentInstance.modalId = modalId;
        this.modalRef.componentInstance.itemId = itemId || 0;
        this.modalRef.componentInstance.isItemCopy = isItemCopy || false;
        this.modalRef.componentInstance.isEditMode = isEditMode;
    }

    getModalElementId(itemId?: number): string {
        return ['modal', 'user', itemId || 0].join('-');
    }

    getModalContent() {
        return ModalUserContentComponent;
    }

    changeRequest(e): void {

    }
}
