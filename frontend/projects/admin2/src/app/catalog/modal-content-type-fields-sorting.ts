import {Component, OnDestroy, OnInit} from '@angular/core';

import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ContentField} from './models/content_field.model';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-modal-content-type-fields-sorting',
    templateUrl: 'templates/modal-content-type-fields-sorting.html',
    providers: []
})
export class ModalContentTypeFieldsSortingComponent implements OnInit {

    closeReason = 'canceled';
    fields: ContentField[] = [];
    sortOptions: {name: string, title: string}[] = [
        {
            name: '',
            title: 'SORT_FIELDS'
        },
        {
            name: 'listOrder-showInList',
            title: 'SORT_FIELDS_LIST'
        },
        {
            name: 'pageOrder-showOnPage',
            title: 'SORT_FIELDS_PAGE'
        },
        {
            name: 'filterOrder-isFilter',
            title: 'SORT_FILTERS'
        }
    ];
    sortType = '';
    
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private translateService: TranslateService
    ) {

    }

    ngOnInit() {
        this.sortOptions.forEach((sortOption) => {
            sortOption.title = this.getLangString(sortOption.title);
        });
        if (this.config.data.fields) {
            this.fields = this.config.data.fields;
        }
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

    getLangString(value: string): string {
        if (!this.translateService.store.translations[this.translateService.currentLang]) {
            return value;
        }
        const translations = this.translateService.store.translations[this.translateService.currentLang];
        return translations[value] || value;
    }
}
