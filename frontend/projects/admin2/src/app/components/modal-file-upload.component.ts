import {Component, ViewChild} from '@angular/core';

import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

import {FileWidgetComponent} from './file-widget.component';

@Component({
    selector: 'app-modal-file-upload',
    templateUrl: 'templates/modal-file-upload.html'
})
export class ModalFileUploadContentComponent {
    
    @ViewChild('filesWidget', { static: true }) filesWidget: FileWidgetComponent;
    loading = false;
    messageText: string;
    errorMessage = '';

    constructor(
        private ref: DynamicDialogRef,
        private config: DynamicDialogConfig
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
        this.ref.close(this.filesWidget.filesRaw);
    }

    dismissModal(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.ref.close(null);
    }
}
