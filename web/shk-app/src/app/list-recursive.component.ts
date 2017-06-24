import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'list-recursive',
    template: `
        <ul>
            <li *ngFor="let item of items">
                <a class="dropdown-item">
                    {{item.title}}
                </a>
                <list-recursive [inputItems]="inputItems" [parentId]="item.id" [currentId]="currentId"></list-recursive>
            </li>
        </ul>
    `
})
export class ListRecursiveComponent implements OnInit, OnChanges {
    @Input() inputItems: any[];
    @Input() items: any[];
    @Input() parentId: number;
    @Input() currentId: number;

    ngOnInit(): void {
        this.filterInputItems();
    }

    ngOnChanges(changes: SimpleChanges) {
        if( changes.inputItems ){
            this.filterInputItems();
        }
    }

    filterInputItems()
    {
        this.items = [];
        let items = this.items;
        const parentId = this.parentId;
        this.inputItems.forEach(function(item){
            if( item.parent_id === parentId ){
                items.push( item );
            }
        });
    }

}
