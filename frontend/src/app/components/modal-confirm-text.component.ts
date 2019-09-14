import {Component, Input} from '@angular/core';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FileModel} from '../models/file.model';

@Component({
    selector: 'app-modal-confirm-text',
    templateUrl: 'templates/modal-confirm-text.component.html'
})
export class ModalConfirmTextComponent {

    modalTitle: string;
    textValue: string;
    labelText: string;
    buttonText = 'CREATE';

    constructor(
        public activeModal: NgbActiveModal
    ) {
    }

    saveHandler(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        if (!this.textValue) {
            return;
        }
        this.activeModal.close(this.textValue);
    }
}

@Component({
    selector: 'app-modal-confirm',
    templateUrl: 'templates/modal-confirm.html'
})
export class ConfirmModalContentComponent {
    @Input() modalTitle;
    @Input() modalContent;

    constructor(public activeModal: NgbActiveModal) {
    }

    accept() {
        this.activeModal.close('accept');
    }
}

@Component({
    selector: 'app-modal-alert',
    templateUrl: 'templates/modal-alert.html'
})
export class AlertModalContentComponent {
    @Input() modalTitle;
    @Input() modalContent;
    @Input() messageType;

    constructor(public activeModal: NgbActiveModal) {
    }
}
