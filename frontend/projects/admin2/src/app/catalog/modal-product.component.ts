import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';

import {AppModalAbstractComponent} from '../components/modal.component.abstract';
import {Product} from './models/product.model';
import {ProductsService} from './services/products.service';
import {SystemNameService} from '../services/system-name.service';

@Component({
    selector: 'app-modal-product',
    templateUrl: 'templates/modal-product.component.html',
    providers: []
})
export class ModalProductComponent extends AppModalAbstractComponent<Product> implements OnInit, OnDestroy {

    model = {id: 0, parentId: 0};
    form = new FormGroup({
        id: new FormControl('', [])
    });

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public systemNameService: SystemNameService,
        public dataService: ProductsService
    ) {
        super(ref, config, systemNameService, dataService);
    }

    ngOnInit() {
        super.ngOnInit();
    }
}
