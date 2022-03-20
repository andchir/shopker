import {Component, OnDestroy, OnInit} from '@angular/core';

import {DragulaService} from 'ng2-dragula';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {TranslateService} from '@ngx-translate/core';

import {ContentField} from './models/content_field.model';
import {SortData} from '../components/sorting-dnd.conponent';

@Component({
    selector: 'app-modal-content-type-fields-sorting',
    templateUrl: 'templates/modal-content-type-fields-sorting.html',
    providers: [DragulaService]
})
export class ModalContentTypeFieldsSortingComponent implements OnInit {
    
    closeReason = 'canceled';
    fields: ContentField[] = [];
    sortData: SortData[] = [];
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
    sortingFieldName = '';
    errorMessage = '';
    
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
        this.sortingInit();
    }
    
    saveData(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.sortingApply();
        this.ref.close({
            reason: 'submit',
            data: this.fields
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

    getLangString(value: string): string {
        if (!this.translateService.store.translations[this.translateService.currentLang]) {
            return value;
        }
        const translations = this.translateService.store.translations[this.translateService.currentLang];
        return translations[value] || value;
    }

    sortingInit(): void {
        this.sortingApply();
        const sortTypeValueArr = this.sortType.split('-');
        this.sortingFieldName = sortTypeValueArr[0];
        const filteredData = sortTypeValueArr[1]
            ? this.fields.filter((field) => {
                return field[sortTypeValueArr[1]];
            })
            : this.fields;
        filteredData.sort(function(a, b) {
            return a[sortTypeValueArr[0]] - b[sortTypeValueArr[0]]
        });
        if (filteredData.length === 0) {
            this.errorMessage = this.getLangString('SORT_FIELDS_EMPTY');
            return;
        }
        this.sortData = filteredData.map((data) => {
            return {name: data.name, title: data.title};
        });
        this.sortData = filteredData.map((data) => {
            return {name: data.name, title: data.title};
        });
    }

    sortingApply(): void {
        if (this.sortingFieldName) {
            this.sortData.forEach((field, index) => {
                const ind = this.fields.findIndex((fld) => {
                    return fld.name === field.name;
                });
                if (ind > -1) {
                    this.fields[ind][this.sortingFieldName] = index;
                }
            });
        } else {
            const sortedNames = this.sortData.map((item) => {
                return item['name'];
            });
            this.fields.sort(function(a, b) {
                return sortedNames.indexOf(a['name']) - sortedNames.indexOf(b['name']);
            });
        }
    }

    sortingReset(): void {
        this.sortData.splice(0, this.sortData.length);
        this.sortingFieldName = '';
    }
}
