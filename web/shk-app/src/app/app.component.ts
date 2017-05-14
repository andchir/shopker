import { Component, Input } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'modal_confirm',
    templateUrl: 'templates/modal_confirm.html',
    providers: []
})
export class ConfirmModalContent {
    @Input() modalTitle;
    @Input() modalContent;

    constructor( public activeModal: NgbActiveModal ) {}

    accept() {
        this.activeModal.close('accept');
    }
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'Shopkeeper';
}
