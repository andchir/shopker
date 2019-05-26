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
