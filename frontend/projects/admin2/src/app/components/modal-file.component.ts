import {Component, Input, OnInit} from '@angular/core';

import { ClipboardService } from 'ngx-clipboard'
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

import {FileModel} from '../models/file.model';

@Component({
    selector: 'app-modal-file',
    templateUrl: 'templates/modal-file.html'
})
export class ModalFileContentComponent implements OnInit {
    
    @Input() file: FileModel;
    @Input() filePath: string;
    messageText: string;
    actionName = '';
    isArchiveFile = false;

    constructor(
        private ref: DynamicDialogRef,
        private config: DynamicDialogConfig,
        private clipboardService: ClipboardService
    ) {
    }

    ngOnInit() {
        if (this.config.data.file) {
            this.file = this.config.data.file;
        }
        if (this.config.data.filePath) {
            this.filePath = this.config.data.filePath;
        }
        if (this.file && ['zip'].indexOf(this.file.extension) > -1) {
            this.isArchiveFile = true;
        }
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
        this.ref.close('rename');
    }

    deleteFileHandler(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.ref.close('delete');
    }

    unpackHandler(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.ref.close('unpack');
    }

    showMessage(messageText, delay = 3000): void {
        this.messageText = messageText;
        if (delay) {
            setTimeout(() => {
                this.messageText = '';
            }, delay);
        }
    }

    dismissModal(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.ref.close(null);
    }
}
