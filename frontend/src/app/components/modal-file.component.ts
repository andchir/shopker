import {Component, Input} from '@angular/core';

import { ClipboardService } from 'ngx-clipboard'
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FileModel} from '../models/file.model';

@Component({
    selector: 'app-modal-file',
    templateUrl: 'templates/modal-file.html'
})
export class ModalFileContentComponent {

    @Input() modalTitle: string;
    @Input() file: FileModel;
    @Input() filePath: string;
    messageText: string;
    actionName = '';

    constructor(
        public activeModal: NgbActiveModal,
        private clipboardService: ClipboardService
    ) {
    }

    copyToClipboard(text: string, event?: MouseEvent){
        if (event) {
            event.preventDefault();
        }
        this.clipboardService.copyFromContent(text);
        this.showMessage('FILE_PATH_COPIED');
    }

    switchAction(actionName: string, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        if (this.actionName === actionName) {
            this.actionName = '';
            return;
        }
        this.actionName = actionName;
    }

    renameHandler(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.activeModal.close('rename');
    }

    deleteFileHandler(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.activeModal.close('delete');
    }

    showMessage(messageText, delay = 3000): void {
        this.messageText = messageText;
        if (delay) {
            setTimeout(() => {
                this.messageText = '';
            }, delay);
        }
    }

}
