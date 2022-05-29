import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {takeUntil} from 'rxjs';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

import {AppModalAbstractComponent} from '../components/modal.component.abstract';
import {Category} from './models/category.model';
import {CategoriesService} from './services/categories.service';
import {SystemNameService} from '../services/system-name.service';
import {ContentType} from './models/content_type.model';
import {ContentTypesService} from './services/content_types.service';
import {FilesService} from './services/files.service';
import {AppSettings} from '../services/app-settings.service';

@Component({
    selector: 'app-modal-category',
    templateUrl: 'templates/modal-category.component.html',
    providers: [FilesService]
})
export class ModalCategoryComponent extends AppModalAbstractComponent<Category> implements OnInit, OnDestroy {
    
    model = new Category(null, false, 0, '', '', '', '', true);
    form = new FormGroup({
        id: new FormControl('', []),
        title: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required]),
        description: new FormControl('', []),
        parentId: new FormControl('', []),
        image: new FormControl('', []),
        contentTypeName: new FormControl('', []),
        menuIndex: new FormControl('', []),
        isActive: new FormControl('', []),
        clearCache: new FormControl('', [])
    });
    contentTypes: ContentType[] = [];
    isRoot = false;
    isItemCopy = false;
    filterParentId: number = null;
    parentId: number;
    localeFieldsAllowed: string[] = ['title', 'description'];
    
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public systemNameService: SystemNameService,
        public dataService: CategoriesService,
        private contentTypesService: ContentTypesService,
        private filesService: FilesService,
        private appSettings: AppSettings
    ) {
        super(ref, config, systemNameService, dataService);
    }

    ngOnInit(): void {
        this.createLanguageSettings(this.appSettings.settings);
        this.getContentTypes();
        if (typeof this.config.data.isItemCopy !== 'undefined') {
            this.isItemCopy = this.config.data.isItemCopy;
        }
        if (typeof this.config.data.parentId !== 'undefined') {
            this.parentId = this.config.data.parentId;
        }
        if (typeof this.config.data.id !== 'undefined' && this.config.data.id !== null) {
            if (!this.config.data.id) {
                this.isRoot = true;
            }
            this.getData(this.config.data.id);
        } else {
            this.updateControls();
            if (this.parentId) {
                this.form.controls.parentId.setValue(this.parentId);
            }
        }
        this.form.valueChanges
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => this.onValueChanged('form'));
    }

    onGetData(item: Category): void {
        this.model = item;
        if (this.isRoot) {
            this.model.id = 0;
            this.model.name = 'root';
        }
        this.filterParentId = this.model.id;
        this.updateControls();
        setTimeout(() => {
            if (this.isItemCopy) {
                this.model.id = 0;
            }
        }, 1);
    }

    closeModal(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        if (this.closeReason === 'updated') {
            this.ref.close(this.model);
        } else {
            this.ref.close(this.closeReason);
        }
    }

    getContentTypes() {
        this.contentTypesService.getListPage()
            .subscribe({
                next: (res) => {
                    this.contentTypes = res.items;
                },
                error: (error) => {
                    this.errorMessage = error;
                }
            });
    }

    filesUploadRequest(formData: FormData, itemId: number) {
        return this.filesService.postFormData(formData);
    }

    saveFiles(itemId: number, ownerType = '', autoClose = false) {
        super.saveFiles(itemId, 'category', autoClose);
    }

    saveRequest() {
        if (this.model && (this.model.id || this.isRoot)) {
            return this.dataService.update(this.getFormData());
        } else {
            return this.dataService.create(this.getFormData());
        }
    }
}
