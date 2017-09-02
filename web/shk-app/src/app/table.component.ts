import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
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
    @Output() actionRequest = new EventEmitter();
    loading: boolean = false;
    selectedIds: string[] = [];
    sortBy: string;
    sortDir: string = 'asc';
    limit: number = 10;

    constructor(public router: Router) {
    }

    ngOnInit(): void {
        this.sortBy = this.tableFields[0].name;
    }

    editItem(itemId: number): void {
        //this.editItemRequest.emit(itemId);
    }

    copyItem(itemId: number): void {
        //this.copyItemRequest.emit(itemId);
    }

    deleteItem(itemId: number): void {
        //this.deleteItemRequest.emit(itemId);
    }

    selectSortBy(fieldName: string): void {
        if (this.sortBy == fieldName) {
            this.sortDir = this.sortDir == 'asc' ? 'desc' : 'asc';
        } else {
            this.sortBy = fieldName;
        }
    }

    selectAll(event): void {
        this.selectedIds = [];
        if (event.target.checked) {
            for (let item of this.items) {
                this.selectedIds.push(item.id);
            }
        }
    }

    setSelected(event, itemId: string): void {
        const index = this.selectedIds.indexOf(itemId);
        if (event.target.checked) {
            if (index == -1) {
                this.selectedIds.push(itemId);
            }
        } else if (index > -1) {
            this.selectedIds.splice(index, 1);
        }
    }

    pageChange(page: number): void{
        this.actionRequest.emit(['pageChange', page]);
    }

    action(actionName: string, actionValue ?: number): void {
        this.actionRequest.emit([actionName, actionValue]);
    }

    getIsSelected(itemId: string): boolean {
        return this.selectedIds.lastIndexOf(itemId) > -1;
    }

}