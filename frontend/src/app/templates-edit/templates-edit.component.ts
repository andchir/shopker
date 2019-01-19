import {Component, OnInit} from '@angular/core';

import {findIndex} from 'lodash';
import {TemplatesEditService} from './services/templates-edit.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';

import {PageTableAbstractComponent} from '../page-table.abstract';
import {Template} from './models/template.model';
import {QueryOptions} from '../models/query-options';
import {ModalTemplateEditComponent} from './modal-template.component';

@Component({
    selector: 'app-template-edit',
    templateUrl: './templates/templates-edit.component.html',
    styleUrls: ['./templates-edit.component.css'],
    providers: [TemplatesEditService]
})
export class TemplatesEditComponent extends PageTableAbstractComponent<Template> {

    title = 'TEMPLATES';
    queryOptions: QueryOptions = new QueryOptions('path', 'asc', 1, 10, 0, 0);

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
            title: 'TEMPLATE_THEME_NAME',
            outputType: 'text',
            outputProperties: {}
        },
        {
            name: 'path',
            sortName: 'path',
            title: 'PATH',
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
        return ModalTemplateEditComponent;
    }

    setModalInputs(itemId?: number, isItemCopy: boolean = false): void {
        const templateIndex = findIndex(this.items, {id: itemId});
        const template = templateIndex > -1 ? this.items[templateIndex] : null;
        const isEditMode = template && template.id > -1;
        this.modalRef.componentInstance.modalTitle = isEditMode
            ? this.getLangString('EDITING')
            : this.getLangString('ADD');
        this.modalRef.componentInstance['isItemCopy'] = isItemCopy || false;
        this.modalRef.componentInstance['isEditMode'] = isEditMode;
        this.modalRef.componentInstance['template'] = template;
    }
}
