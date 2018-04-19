import { Component, OnInit, Input, ViewChild, Injectable, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal, NgbModalRef, NgbPopover, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import * as _ from "lodash";

import { User } from '../models/user.model';
import { PageTableAbstractComponent } from '../page-table.abstract';
import { UsersService } from '../services/users.service';
import { SettingsService } from '../services/settings.service';
import { SystemNameService } from '../services/system-name.service';
import { ModalContentAbstractComponent } from '../modal.abstract';
import { AppSettings } from '../services/app-settings.service';

@Component({
    selector: 'modal-user',
    templateUrl: '../templates/modal-user.html',
    providers: [UsersService, SettingsService, SystemNameService]
})
export class ModalUserContent extends ModalContentAbstractComponent<User> {

    model = new User(0, '', '', [], true);
    modalTitle = 'User';

    formFields = {
        fullName: {
            value: '',
            validators: [Validators.required],
            messages: {
                required: 'Full name is required.'
            }
        },
        email: {
            value: '',
            validators: [Validators.required],
            messages: {
                required: 'Email is required.'
            }
        },
        phone: {
            value: '',
            validators: [],
            messages: {}
        },
        address: {
            value: '',
            validators: [],
            messages: {}
        }
    };

    constructor(
        public fb: FormBuilder,
        public dataService: UsersService,
        public systemNameService: SystemNameService,
        public activeModal: NgbActiveModal,
        public tooltipConfig: NgbTooltipConfig,
        private modalService: NgbModal,
        private settingsService: SettingsService,
        private appSettings: AppSettings
    ) {
        super(fb, dataService, systemNameService, activeModal, tooltipConfig);
    }

    save(): void {
        this.loading = true;
        this.dataService.update(this.getFormData())
            .subscribe((res) => {
                this.closeModal();
            }, () => {
                this.loading = false;
            });
    }

}

@Component({
    selector: 'shk-users',
    templateUrl: '../templates/page-users.html',
    providers: [ UsersService ]
})
export class UsersComponent extends PageTableAbstractComponent<User> {

    title: string = 'USERS';

    constructor(
        dataService: UsersService,
        activeModal: NgbActiveModal,
        modalService: NgbModal
    ) {
        super(dataService, activeModal, modalService);
    }

    tableFields = [
        {
            name: 'id',
            title: 'ID',
            outputType: 'text',
            outputProperties: {}
        },
        {
            name: 'email',
            title: 'EMAIL',
            outputType: 'text',
            outputProperties: {}
        },
        {
            name: 'fullName',
            title: 'FULL_NAME',
            outputType: 'text',
            outputProperties: {}
        },
        {
            name: 'isActive',
            title: 'ACTIVE',
            outputType: 'boolean',
            outputProperties: {}
        }
    ];

    setModalInputs(itemId?: number, isItemCopy: boolean = false): void {
        this.modalRef.componentInstance.modalTitle = `User #${itemId}`;
        this.modalRef.componentInstance.itemId = itemId || 0;
        this.modalRef.componentInstance.isItemCopy = isItemCopy || false;
        this.modalRef.componentInstance.isEditMode = true;
    }

    getModalContent(){
        return ModalUserContent;
    }
}