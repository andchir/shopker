import {AfterViewInit, Component, OnDestroy} from '@angular/core';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';

declare const ace: any;

@Component({
    selector: 'app-modal-edit-textarea',
    templateUrl: 'templates/modal-edit-textarea.component.html'
})
export class ModalEditTextareaComponent implements AfterViewInit, OnDestroy {

    modalTitle: string;
    textValue: string;
    labelText: string;
    submitted = false;
    editor: any;
    destroyed$ = new Subject<void>();

    constructor(
        public activeModal: NgbActiveModal
    ) {
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

    saveHandler(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.activeModal.close({
            reason: 'submit',
            data: this.editor.getValue()
        });
    }

    closeModal(event?: MouseEvent) {
        if (event) {
            event.preventDefault();
        }
        this.activeModal.dismiss('cancel');
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
