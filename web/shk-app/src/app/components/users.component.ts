import { Component, OnInit, Input, ViewChild, Injectable, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal, NgbModalRef, NgbPopover, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import * as _ from "lodash";

import { User } from '../models/user.model';
import { PageTableAbstractComponent } from '../page-table.abstract';
import { UsersService } from '../services/users.service';


@Component({
    selector: 'shk-users',
    templateUrl: '../templates/page-users.html',
    providers: [ UsersService ]
})
export class UsersComponent extends PageTableAbstractComponent<User> {

    title: string = 'Users';

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
            name: 'isActive',
            title: 'ACTIVE',
            outputType: 'boolean',
            outputProperties: {}
        }
    ];

    getModalContent(){
        return null;// UserModalContent;
    }
}