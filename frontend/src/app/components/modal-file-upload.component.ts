import {Component, ViewChild} from '@angular/core';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FileWidgetComponent} from './file-widget.component';

@Component({
    selector: 'app-modal-file-upload',
    templateUrl: 'templates/modal-file-upload.html'
})
export class ModalFileUploadContentComponent {

    messageText: string;
    @ViewChild('filesWidget', { static: true }) filesWidget: FileWidgetComponent;

    constructor(
        public activeModal: NgbActiveModal
    ) {
    }

    submitHandler(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.messageText = '';
        if (this.filesWidget.filesRaw.length === 0) {
            this.messageText = 'PLEASE_SELECT_FILE';
            return;
        }
        this.activeModal.close(this.filesWidget.filesRaw);
    }

}
