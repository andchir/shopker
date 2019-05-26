import {Component, Input} from '@angular/core';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FileModel} from '../models/file.model';

@Component({
    selector: 'app-modal-alert',
    templateUrl: 'templates/modal-file.html'
})
export class ModalFileContentComponent {

    @Input() modalTitle: string;
    @Input() file: FileModel;
    @Input() filePath: string;

    constructor(public activeModal: NgbActiveModal) {
    }
}
