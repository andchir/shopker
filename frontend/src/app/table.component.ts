import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {QueryOptions} from './models/query-options';

@Component({
    selector: 'app-table',
    templateUrl: 'templates/app-table.html'
})
export class TableComponent implements OnInit {
    @Input() items: any[];
    @Input() tableFields: any[];
    @Input() collectionSize: number;
    @Input() currentPage: number;
    @Input() queryOptions = new QueryOptions('name', 'asc', 1, 10, 0, 0);
    @Input() loading: boolean;
    @Input() isCloneAllowed = false;
    @Input() selectedIds: number[] = [];
    @Output() actionRequest = new EventEmitter();
    @Output() changeRequest = new EventEmitter();
    @ViewChild('tableElement', { static: true }) tableElement;

    constructor(
        public router: Router
    ) {
    }

    ngOnInit(): void {

    }

    selectSortBy(fieldName: string): void {
        if (this.queryOptions.sort_by === fieldName) {
            this.queryOptions.sort_dir = this.queryOptions.sort_dir === 'asc' ? 'desc' : 'asc';
        } else {
            this.queryOptions.sort_by = fieldName;
        }
        this.actionRequest.emit(['changeQuery', this.queryOptions]);
    }

    selectAll(event): void {
        if (event.target.checked) {
            for (const item of this.items) {
                this.selectedIds.push(item.id);
            }
        } else {
            this.selectedIds.splice(0);
        }
    }

    setSelected(event, itemId: number): void {
        const index = this.selectedIds.indexOf(itemId);
        if (event.target.checked) {
            if (index === -1) {
                this.selectedIds.push(itemId);
            }
        } else if (index > -1) {
            this.selectedIds.splice(index, 1);
        }
    }

    clearSelected(): void {
        this.selectedIds.splice(0);
        const checkboxSelectAllElement = this.tableElement.nativeElement.querySelector('input[type="checkbox"]');
        if (checkboxSelectAllElement) {
            checkboxSelectAllElement.checked = false;
        }
    }

    pageChange(type: string): void {
        if (type === 'limit') {
            this.queryOptions.page = 1;
            this.queryOptions.limit = parseInt(String(this.queryOptions.limit), 10);
        }
        this.actionRequest.emit(['changeQuery', this.queryOptions]);
    }

    action(actionName: string, actionValue ?: number): void {
        this.actionRequest.emit([actionName, actionValue]);
    }

    getIsSelected(itemId: number): boolean {
        return this.selectedIds.lastIndexOf(itemId) > -1;
    }

    getIsSelectedAll(): boolean {
        return this.selectedIds.length === this.items.length;
    }

    optionUpdate(e): void {
        const [object, optionName, value] = e;
        switch (optionName) {
            case 'dropDownOpenChange':
                const tableParentEl = this.tableElement.nativeElement.parentNode;
                if (value) {
                    tableParentEl.classList.remove('table-responsive');
                } else {
                    tableParentEl.classList.add('table-responsive');
                }
                break;
            default:
                this.changeRequest.emit(e);
        }
    }

}
