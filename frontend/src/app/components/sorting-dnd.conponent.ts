import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {DragulaService} from 'ng2-dragula';

export interface SortData {
    id?: number;
    name?: string;
    title?: string;
}

@Component({
    selector: 'app-sorting-dnd',
    templateUrl: 'templates/sorting-dnd.html'
})
export class SortingComponent implements OnDestroy {
    @Input() title: string;
    @Input() items: SortData[];
    @Output() itemsChange = new EventEmitter<any[]>();
    @Output() save = new EventEmitter<any[]>();
    @Output() cancel = new EventEmitter();
    BAG = "DRAGULA_EVENTS";
    subs = new Subscription();

    constructor(
        private dragulaService: DragulaService
    ) {
        this.subs.add(dragulaService.drop(this.BAG)
            .subscribe(() => {
                this.onChange();
            })
        );
    }

    onChange(): void {
        this.itemsChange.emit(this.items);
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

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
