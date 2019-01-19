import {Component, OnInit} from '@angular/core';

import {TemplatesEditService} from './services/templates-edit.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';

import {PageTableAbstractComponent} from '../page-table.abstract';
import {Template} from './models/template.model';
import {QueryOptions} from '../models/query-options';

@Component({
    selector: 'app-template-edit',
    templateUrl: './templates-edit.component.html',
    styleUrls: ['./templates-edit.component.css'],
    providers: [TemplatesEditService]
})
export class TemplatesEditComponent extends PageTableAbstractComponent<Template> {

    title = 'TEMPLATES';
    queryOptions: QueryOptions = new QueryOptions('id', 'desc', 1, 10, 0, 0);

    tableFields = [
        {
            name: 'name',
            sortName: 'name',
            title: 'NAME',
            outputType: 'text',
            outputProperties: {}
        },
        {
            name: 'themeName',
            sortName: 'themeName',
            title: 'THEME_NAME',
            outputType: 'text',
            outputProperties: {}
        }
    ];

    constructor(
        public dataService: TemplatesEditService,
        public activeModal: NgbActiveModal,
        public modalService: NgbModal,
        public translateService: TranslateService
    ) {
        super(dataService, activeModal, modalService, translateService);
    }

    getModalContent() {
        return null;
    }

}
