import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { QueryOptions } from './models/query-options';
import * as _ from "lodash";

@Component({
    selector: 'cmp-table',
    templateUrl: 'templates/cmp-table.html'
})
export class TableComponent implements OnInit {
    @Input() items: any[];
    @Input() tableFields: any[];
    @Input() collectionSize: number;
    @Input() currentPage: number;
    @Input() queryOptions: QueryOptions;
    @Input() loading: boolean;
    @Input() isCloneAllowed = false;
    @Input() selectedIds: number[] = [];
    @Output() actionRequest = new EventEmitter();
    @Output() changeRequest = new EventEmitter();

    constructor(
        public router: Router
    ) {
    }

    ngOnInit(): void {

    }

    selectSortBy(fieldName: string): void {
        if (this.queryOptions.sort_by == fieldName) {
            this.queryOptions.sort_dir = this.queryOptions.sort_dir == 'asc' ? 'desc' : 'asc';
        } else {
            this.queryOptions.sort_by = fieldName;
        }
        this.actionRequest.emit(['changeQuery', this.queryOptions]);
    }

    selectAll(event): void {
        if (event.target.checked) {
            for (let item of this.items) {
                this.selectedIds.push(item.id);
            }
        } else {
            this.selectedIds.splice(0);
        }
    }

    setSelected(event, itemId: number): void {
        const index = this.selectedIds.indexOf(itemId);
        if (event.target.checked) {
            if (index == -1) {
                this.selectedIds.push(itemId);
            }
        } else if (index > -1) {
            this.selectedIds.splice(index, 1);
        }
    }

    pageChange(): void{
        this.actionRequest.emit(['changeQuery', this.queryOptions]);
    }

    action(actionName: string, actionValue ?: number): void {
        this.actionRequest.emit([actionName, actionValue]);
    }

    getIsSelected(itemId: number): boolean {
        return this.selectedIds.lastIndexOf(itemId) > -1;
    }

    optionUpdate(e): void {
        this.changeRequest.emit(e);
    }

}