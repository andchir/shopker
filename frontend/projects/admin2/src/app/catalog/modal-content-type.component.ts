import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

import {AppModalAbstractComponent} from '../components/modal.component.abstract';
import {ContentType} from './models/content_type.model';
import {ContentTypesService} from './services/content_types.service';
import {CollectionsService} from './services/collections.service';

@Component({
    selector: 'app-modal-content-type',
    templateUrl: 'templates/modal-content-type.component.html',
    providers: [CollectionsService]
})
export class ModalContentTypeComponent extends AppModalAbstractComponent<ContentType> implements OnInit, OnDestroy {

    model = new ContentType(0, '', '', '', '', [], [], true);
    form = new FormGroup({
        id: new FormControl('', []),
        title: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z0-9_-]+')]),
        description: new FormControl('', []),
        collection: new FormControl('', [Validators.required]),
        isActive: new FormControl('', []),
        isCreateByUsersAllowed: new FormControl('', []),
    });
    collections: string[] = ['products'];

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public dataService: ContentTypesService,
        private collectionsService: CollectionsService
    ) {
        super(ref, config, dataService);
    }

    ngOnInit() {
        super.ngOnInit();
        this.getCollectionsList();
    }

    getCollectionsList(): void {
        this.collectionsService.getList()
            .subscribe(data => {
                    if (data.length > 0) {
                        this.collections = data;
                    }
                }
            );
    }

    addCollectionToggle(newCollectionField: HTMLInputElement, event?: MouseEvent): void {
        console.log('addCollectionToggle', newCollectionField);
    }

    deleteCollection(): void {
        console.log('deleteCollection');
    }
}
