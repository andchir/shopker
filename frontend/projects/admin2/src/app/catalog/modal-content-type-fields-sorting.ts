import {Component, OnDestroy, OnInit} from '@angular/core';

import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
    selector: 'app-modal-content-type-fields-sorting',
    templateUrl: 'templates/modal-content-type-fields-sorting.html',
    providers: []
})
export class ModalContentTypeFieldsSortingComponent implements OnInit {

    closeReason = 'canceled';
    
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig
    ) {

    }

    ngOnInit() {

    }
    
    saveData(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }

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
