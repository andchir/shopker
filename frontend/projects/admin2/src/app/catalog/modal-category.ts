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

@Component({
    selector: 'app-modal-category',
    templateUrl: 'templates/modal-category.component.html',
    providers: []
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
    
    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public systemNameService: SystemNameService,
        public dataService: CategoriesService,
        private contentTypesService: ContentTypesService
    ) {
        super(ref, config, systemNameService, dataService);
    }

    ngOnInit(): void {
        this.getContentTypes();
        if (typeof(this.config.data.id) !== 'undefined') {
            if (!this.config.data.id) {
                this.isRoot = true;
            }
            this.getData(this.config.data.id);
        } else {
            this.updateControls();
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
}
