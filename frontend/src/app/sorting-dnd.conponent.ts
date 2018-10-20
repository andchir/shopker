import {Component, EventEmitter, Input, Output} from '@angular/core';

export interface SortData {
    id?: number;
    name?: string;
    title?: string;
}

@Component({
    selector: 'app-sorting-dnd',
    templateUrl: 'templates/sorting-dnd.html'
})
export class SortingComponent {
    @Input() items: SortData[];
    @Output() itemsChange = new EventEmitter<any[]>();
    @Input() title: string;
    @Output() save = new EventEmitter<any[]>();
    @Output() cancel = new EventEmitter();

    constructor() {
    }

    sortApply(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.itemsChange.emit(this.items);
        this.save.emit(this.items);
    }

    sortCancel(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.cancel.emit();
    }
}
