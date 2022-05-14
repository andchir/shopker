import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FileModel} from '../models/file.model';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
    selector: 'app-modal-confirm-text',
    templateUrl: 'templates/modal-confirm-text.component.html'
})
export class ModalConfirmTextComponent implements OnInit, AfterViewInit {

    @ViewChild('inputElement') inputElement: ElementRef<HTMLInputElement>;
    modalTitle: string;
    textValue: string;
    labelText: string;
    buttonText = 'CREATE';
    loading = false;
    errorMessage = '';
    closeReason = '';

    constructor(
        private ref: DynamicDialogRef,
        private config: DynamicDialogConfig
    ) {
    }
    
    ngOnInit() {
        if (this.config.data.labelText) {
            this.labelText = this.config.data.labelText;
        }
        if (this.config.data.buttonText) {
            this.buttonText = this.config.data.buttonText;
        }
        if (this.config.data.textValue) {
            this.textValue = this.config.data.textValue;
        }
    }
    
    ngAfterViewInit() {
        if (this.inputElement) {
            this.inputElement.nativeElement.focus();
        }
    }

    saveHandler(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        if (!this.textValue) {
            return;
        }
        this.ref.close(this.textValue);
    }

    dismissModal(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.ref.close(null);
    }
}

@Component({
    selector: 'app-modal-confirm',
    template: ''
    // templateUrl: 'templates/modal-confirm.html'
})
export class ConfirmModalContentComponent {
    @Input() modalTitle;
    @Input() modalContent;

    constructor() {
    }

    accept() {
        
    }
}

@Component({
    selector: 'app-modal-alert',
    template: ''
    // templateUrl: 'templates/modal-alert.html'
})
export class AlertModalContentComponent {
    @Input() modalTitle;
    @Input() modalContent;
    @Input() messageType;

    constructor() {
    }
}
