import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as _ from "lodash";

@Component({
    selector: 'cmp-table',
    templateUrl: 'templates/cmp-table.html'
})
export class TableComponent implements OnInit {
    @Input() items: any[];
    @Input() tableFields: any[];
    @Input() itemsTotal: number;
    @Output() editItemRequest = new EventEmitter();
    loading: boolean = false;
    selectedIds: string[] = [];
    sortBy: string;
    sortDir: string = 'asc';

    constructor(
        public router: Router
    ) {}

    ngOnInit(): void {
        this.sortBy = this.tableFields[0].name;
    }

    editItem(itemId: number): void {
        this.editItemRequest.emit( itemId );
    }

    selectSortBy(fieldName: string): void {
        if( this.sortBy == fieldName ){
            this.sortDir = this.sortDir == 'asc' ? 'desc' : 'asc';
        } else {
            this.sortBy = fieldName;
        }
    }

    selectAll( event ): void{
        this.selectedIds = [];
        if( event.target.checked ){
            for( let item of this.items ){
                this.selectedIds.push( item.id );
            }
        }
    }

    setSelected( event, itemId: string ): void{
        const index = this.selectedIds.indexOf( itemId );
        if( event.target.checked ){
            if( index == -1 ){
                this.selectedIds.push( itemId );
            }
        } else if( index > -1 ){
            this.selectedIds.splice( index, 1 );
        }
    }

    getIsSelected( itemId: string ): boolean{
        return this.selectedIds.lastIndexOf( itemId ) > -1;
    }

}