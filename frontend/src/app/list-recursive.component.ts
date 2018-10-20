import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {findIndex} from 'lodash';

@Component({
    selector: 'app-list-recursive',
    template: `
        <ul>
            <li *ngFor="let item of items">
                <a class="dropdown-item">
                    {{item.title}}
                </a>
                <app-list-recursive [inputItems]="inputItems" [parentId]="item.id" [currentId]="currentId"></app-list-recursive>
            </li>
        </ul>
    `
})
export class ListRecursiveComponent implements OnInit, OnChanges {
    @Input() inputItems: any[];
    @Input() items: any[];
    @Input() parentId: number;
    @Input() currentId: number;
    currentParentsIds: number[];

    ngOnInit(): void {
        this.filterInputItems();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.inputItems) {
            this.filterInputItems();
        }
        if (changes.currentId) {
            this.updateParentsIds();
        }
    }

    filterInputItems() {
        this.items = [];
        const items = this.items;
        const parentId = this.parentId;
        this.inputItems.forEach(function (item) {
            if (item.id !== item.parentId && item.parentId === parentId) {
                items.push(item);
            }
        });
        this.updateParentsIds();
    }

    /**
     * Update parents ids
     */
    updateParentsIds(): void {
        const index = this.inputItems.findIndex((inputItem) => {
            return inputItem.id === this.currentId;
        });
        this.currentParentsIds = [];
        if (index === -1) {
            return;
        }
        this.currentParentsIds = this.getParentIds(this.inputItems[index].parentId);
    }

    /**
     *
     * @param parentId
     * @param parentIds
     * @returns {number[]}
     */
    getParentIds(parentId, parentIds ?: number[]): number[] {
        parentIds = parentIds || [];
        if (parentId > 0) {
            parentIds.push(parentId);
            const index = findIndex(this.inputItems, {id: parentId});
            if (index === -1) {
                return parentIds;
            }
            return this.getParentIds(this.inputItems[index].parentId, parentIds);
        } else {
            return parentIds;
        }
    }

    /**
     * Check parent id
     * @param itemId
     * @returns {boolean}
     */
    getIsActiveParent(itemId: number): boolean {
        return this.currentParentsIds.indexOf(itemId) > -1;
    }

}
