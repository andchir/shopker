import {AfterViewInit, Component, OnInit} from '@angular/core';

import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

declare const ace: any;

@Component({
    selector: 'app-modal-content-type-fields-export',
    templateUrl: 'templates/modal-content-type-fields-export.html',
    providers: []
})
export class ModalContentTypeFieldsExportComponent implements OnInit, AfterViewInit {

    closeReason = 'canceled';
    errorMessage = '';
    textValue = '';
    editor: any;
    
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig
    ) {

    }
    
    ngOnInit() {
        if (this.config.data.textValue) {
            this.textValue = this.config.data.textValue;
        }
    }

    ngAfterViewInit(): void {
        this.editorInit();
    }

    editorInit(): void {
        ace.config.setModuleUrl('ace/mode/json_worker', '../js/ace/worker-json.js');
        this.editor = ace.edit('editor-json', {
            mode: 'ace/mode/json',
            theme: 'ace/theme/kuroir',
            maxLines: 30,
            minLines: 15,
            fontSize: 18
        });
        this.editor.setValue(this.textValue, -1);
    }
    
    saveData(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.ref.close({
            reason: 'submit',
            data: this.editor.getValue()
        });
    }

    closeModal(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.ref.close(this.closeReason);
    }

    dismissModal(event?: MouseEvent): void {
        this.ref.close(null);
    }
}
