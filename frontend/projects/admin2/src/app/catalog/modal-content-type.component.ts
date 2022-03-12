import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

import {takeUntil} from 'rxjs/operators';
import {ConfirmationService, MenuItem} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

import {AppModalAbstractComponent} from '../components/modal.component.abstract';
import {ContentType} from './models/content_type.model';
import {ContentTypesService} from './services/content_types.service';
import {CollectionsService} from './services/collections.service';
import {ContentField} from './models/content_field.model';
import {ModalContentTypeFieldComponent} from './modal-content-type-field';
import {SystemNameService} from '../services/system-name.service';

@Component({
    selector: 'app-modal-content-type',
    templateUrl: 'templates/modal-content-type.component.html',
    providers: [CollectionsService]
})
export class ModalContentTypeComponent extends AppModalAbstractComponent<ContentType> implements OnInit, OnDestroy {

    @ViewChild('formEl') formEl: ElementRef;
    @ViewChild('panelAddCollection', { static: true }) panelAddCollection;
    
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
    contextMenuItems: MenuItem[];
    itemSelected: ContentField;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public systemNameService: SystemNameService,
        public dataService: ContentTypesService,
        private dialogService: DialogService,
        private translateService: TranslateService,
        private collectionsService: CollectionsService,
        private confirmationService: ConfirmationService,
    ) {
        super(ref, config, systemNameService, dataService);
    }

    ngOnInit() {
        super.ngOnInit();
        this.getCollectionsList();
        this.contextMenuItems = [
            {
                label: this.getLangString('EDIT'),
                icon: 'pi pi-fw pi-pencil',
                command: () => this.editField(this.itemSelected)
            },
            {
                label: this.getLangString('CLONE'),
                icon: 'pi pi-fw pi-clone',
                command: () => this.copyField(this.itemSelected)
            },
            {
                label: this.getLangString('DELETE'),
                icon: 'pi pi-fw pi-trash',
                command: () => this.deleteField(this.itemSelected)
            }
        ];
    }

    getCollectionsList(): void {
        this.collectionsService.getList()
            .subscribe(data => {
                    if (data.length > 0) {
                        this.collections = data;
                        if (!this.model.collection) {
                            this.model.collection = data[0];
                            this.form.controls['collection'].setValue(data[0]);
                        }
                    }
                }
            );
    }

    addCollection(inputElement: HTMLInputElement, event?: MouseEvent): void {
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
        if (containerElement.className.indexOf('hidden') === -1) {
            containerElement.classList.add('hidden');
            return;
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
                            this.errorMessageTop = '';
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

    deleteField(field: ContentField, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        const index = this.model.fields.findIndex((f) => {
            return f.name === field.name;
        })
        if (index === -1 ) {
            this.errorMessage = this.getLangString('FIELD_NOR_FOUND');
            return;
        }
        this.model.fields.splice(index, 1);
    }
    
    modalContentTypeField(data: any, index = -1): void {
        const ref = this.dialogService.open(ModalContentTypeFieldComponent, {
            header: this.getLangString('EDIT_FIELD'), // EDIT_FIELD | ADD_FIELD
            width: '800px',
            data: data
        });
        ref.onClose
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (result) => {
                    if (result && result.name) {
                        if (index > -1) {
                            Object.assign(this.model.fields[index], result);
                        } else {
                            this.model.fields.push(Object.assign({}, result));
                        }
                        if (this.model.groups.indexOf(result.group) === -1) {
                            this.model.groups.push(result.group);
                        }
                    }
                }
            });
    }

    editField(field: ContentField, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        const index = this.model.fields.findIndex((f) => {
            return f.name === field.name;
        });
        const data = {
            field: Object.assign({}, field),
            contentType: this.model
        };
        if (data.field.inputProperties) {
            data.field.inputProperties = Object.assign({}, field.inputProperties);
        }
        if (data.field.outputProperties) {
            data.field.outputProperties = Object.assign({}, field.outputProperties);
        }
        this.modalContentTypeField(data, index);
    }

    addField(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        const data = {
            field: null,
            contentType: this.model
        };
        this.modalContentTypeField(data);
    }

    copyField(field: ContentField, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        console.log('copyField', field);
    }

    getLangString(value: string): string {
        if (!this.translateService.store.translations[this.translateService.currentLang]) {
            return value;
        }
        const translations = this.translateService.store.translations[this.translateService.currentLang];
        return translations[value] || value;
    }

    getFormData(): any {
        const data = super.getFormData();
        data.id = this.model.id || 0;
        data.fields = this.model.fields;
        data.groups = this.model.groups;
        return data;
    }
}
