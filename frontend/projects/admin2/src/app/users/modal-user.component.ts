import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

import {AppModalAbstractComponent} from '../components/modal.component.abstract';
import {UsersService} from './users.service';
import {SettingsService} from '../settings/settings.service';
import {AppSettings} from '../services/app-settings.service';
import {User} from './models/user.model';

@Component({
    selector: 'app-modal-order',
    templateUrl: 'templates/modal-user.html',
    providers: []
})
export class ModalUserContentComponent extends AppModalAbstractComponent<User> implements OnInit, OnDestroy {

    model = new User(0, '', '', [], true, []);
    form = new FormGroup({
        id: new FormControl('', [])
    });

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public dataService: UsersService,
        private settingsService: SettingsService,
        private appSettings: AppSettings
    ) {
        super(ref, config, dataService);
    }
    
    ngOnInit() {
        super.ngOnInit();
    }
}
