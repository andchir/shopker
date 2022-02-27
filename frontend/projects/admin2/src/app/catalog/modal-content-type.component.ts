import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

import {TranslateService} from '@ngx-translate/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

import {AppModalAbstractComponent} from '../components/modal.component.abstract';
import {ContentType} from './models/content_type.model';
import {ContentTypesService} from './services/content_types.service';
import {CollectionsService} from './services/collections.service';
import {ConfirmationService} from "primeng/api";

@Component({
    selector: 'app-modal-content-type',
    templateUrl: 'templates/modal-content-type.component.html',
    providers: [CollectionsService]
})
export class ModalContentTypeComponent extends AppModalAbstractComponent<ContentType> implements OnInit, OnDestroy {

    @ViewChild('panelAddCollection', { static: true }) panelAddCollection;
    @ViewChild('panelAddGroup', { static: true }) panelAddGroup;
    
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
    errorMessageTop = '';

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public dataService: ContentTypesService,
        public translateService: TranslateService,
        private collectionsService: CollectionsService,
        private confirmationService: ConfirmationService
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

    addCollection(inputElement: HTMLInputElement, event?: MouseEvent) {
        if (event) {
            event.preventDefault();
        }
        this.errorMessageTop = '';
        if (!inputElement.value) {
            inputElement.focus();
            return;
        }
        const value = inputElement.value;
        if (this.collections.indexOf(value) > -1) {
            this.errorMessageTop = this.getLangString('COLLECTION_EXISTS');
            return;
        }
        this.collections.push(value);
        this.form.controls['collection'].setValue(value);
        inputElement.value = '';
        this.panelAddCollection.nativeElement.classList.add('hidden');
    }

    openBlock(containerElement: HTMLElement, inputElement?: HTMLInputElement, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        containerElement.classList.remove('hidden');
        if (inputElement) {
            inputElement.focus();
        }
        this.errorMessageTop = '';
        this.errorMessage = '';
    }

    closeBlock(containerElement: HTMLElement, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        containerElement.classList.add('hidden');
    }

    deleteCollection(): void {
        this.errorMessageTop = '';
        this.confirmationService.confirm({
            message: this.getLangString('YOU_SURE_YOU_WANT_DELETE'),
            accept: () => {
                const collectionName = this.form.controls['collection'].value;
                this.loading = true;
                this.collectionsService.deleteItemByName(collectionName)
                    .subscribe({
                        next: () => {
                            const index = this.collections.indexOf(collectionName);
                            if (index > -1) {
                                this.collections.splice(index, 1);
                                this.form.controls['collection'].setValue(this.collections[0] || '');
                            }
                            this.loading = false;
                        },
                        error: (err) => {
                            this.errorMessageTop = err.error || 'Error.';
                            this.loading = false;
                        }
                    });
            }
        });
    }

    getLangString(value: string): string {
        if (!this.translateService.store.translations[this.translateService.currentLang]) {
            return value;
        }
        const translations = this.translateService.store.translations[this.translateService.currentLang];
        return translations[value] || value;
    }
}
