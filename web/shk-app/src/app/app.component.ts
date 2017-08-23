import { Component, Input } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';

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
    templateUrl: './templates/app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [ NgbTooltipConfig ]
})
export class AppComponent {
    title = 'Shopkeeper';
    constructor(tooltipConfig: NgbTooltipConfig) {
        tooltipConfig.placement = 'bottom';
        tooltipConfig.container = 'body';
    }
}
