import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {Observable, pluck} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

import {AppModalAbstractComponent} from '../components/modal.component.abstract';
import {UsersService} from './users.service';
import {SettingsService} from '../settings/settings.service';
import {AppSettings} from '../services/app-settings.service';
import {User} from './models/user.model';
import {FormFieldsData} from '../models/form-field.interface';
import {Setting} from '../settings/models/setting.model';

@Component({
    selector: 'app-modal-order',
    templateUrl: 'templates/modal-user.html',
    providers: []
})
export class ModalUserContentComponent extends AppModalAbstractComponent<User> implements OnInit, OnDestroy {

    model = new User(0, '', '', [], true, []);
    form = new FormGroup({
        id: new FormControl('', []),
        email: new FormControl('', [Validators.required]),
        fullName: new FormControl('', [Validators.required]),
        phone: new FormControl('', []),
        role: new FormControl('', [Validators.required]),
        groups: new FormControl([], []),
        isActive: new FormControl('', []),
        password: new FormControl('', []),
        confirmPassword: new FormControl('', []),
        apiToken: new FormControl('', []),
        options: new FormArray([])
    });
    arrayFieldsData: {[key: string]: FormFieldsData} = {
        options: {
            name: {validators: [Validators.required]},
            title: {validators: [Validators.required]},
            value: {validators: [Validators.required]}
        }
    };
    userRoles: {[key: string]: string}[];
    userGroups: Setting[];

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public dataService: UsersService,
        private messageService: MessageService,
        private settingsService: SettingsService,
        private appSettings: AppSettings
    ) {
        super(ref, config, dataService);
    }
    
    ngOnInit() {
        super.ngOnInit();
        this.createArrayFieldsProperty('options');
        this.getUserRoles();
        this.getUserGroups();
    }

    getUserRoles(): void {
        this.dataService.getRolesList()
            .pipe(
                takeUntil(this.destroyed$),
                pluck('roles')
            )
            .subscribe({
                next: (res) => {
                    this.userRoles = res;
                    this.loading = false;
                },
                error: (err) => {
                    if (err.error) {
                        this.messageService.add({ severity: 'error', detail: err.error });
                    }
                    this.loading = false;
                }
            });
    }

    getUserGroups(): void {
        this.settingsService.getSetting('SETTINGS_USER_GROUPS')
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (res) => {
                    this.userGroups = res;
                },
                error: (err) => {
                    if (err.error) {
                        this.messageService.add({ severity: 'error', detail: err.error });
                    }
                }
            });
    }

    clearApiToken(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.form.controls['apiToken'].setValue('');
    }

    generateApiToken(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.loading = true;
        this.dataService.createApiToken()
            .pipe(
                takeUntil(this.destroyed$)
            )
            .subscribe({
                next: (res) => {
                    this.form.controls['apiToken'].setValue(res.token);
                    this.loading = false;
                },
                error: (err) => {
                    if (err.error) {
                        this.errorMessage = err.error;
                    }
                    this.loading = false;
                }
            });
    }
}
