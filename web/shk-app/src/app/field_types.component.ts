import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbActiveModal, NgbModalRef, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { ContentTypesService } from './services/content_types.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContentField } from './models/content_field.model';
import { ContentType } from './models/content_type.model';
import { ConfirmModalContent } from './app.component';
import * as _ from "lodash";

@Component({
    selector: 'shk-field-types',
    templateUrl: 'templates/page_field_types.html'
})
export class FieldTypesComponent implements OnInit {
    errorMessage: string;
    items: ContentType[] = [];
    title: string = 'Типы полей';
    modalRef: NgbModalRef;
    loading: boolean = false;
    selectedIds: string[] = [];

    constructor(
        tooltipConfig: NgbTooltipConfig
    ) {
        tooltipConfig.placement = 'bottom';
        tooltipConfig.container = 'body';
    }

    /** On initialize */
    ngOnInit(): void {

    }

}