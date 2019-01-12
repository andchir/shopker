// Dummy module

import {Component, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {SharedModule} from '../shared.module';

@Component({
    selector: 'app-default',
    template: `<div class="card">
    <div class="card-body">
        <h3>
            <i class="icon-inbox"></i>&nbsp;{{'IMPORT_EXPORT' | translate}}
        </h3>
        <hr>
        <div class="min-height400">
            <p>
                {{'BUY' | translate}}:
                <a href="https://modx-shopkeeper.ru/" target="_blank">
                    https://modx-shopkeeper.ru/
                </a>
            </p>
        </div></div></div>`
})
export class DefaultComponent {}

@Component({selector: 'app-import', template: ``})
export class ImportComponent {}

@Component({selector: 'app-export', template: ``})
export class ExportComponent {}

@Component({selector: 'app-modal-import', template: ``})
export class ModalImportContentComponent {}

@Component({selector: 'app-modal-export', template: ``})
export class ModalExportContentComponent {}

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: DefaultComponent}
    ])],
    exports: [RouterModule]
})
export class ImportExportRoutingModule {}

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ImportExportRoutingModule
    ],
    declarations: [
        DefaultComponent,
        ImportComponent,
        ExportComponent,

        ModalImportContentComponent,
        ModalExportContentComponent
    ],
    entryComponents: [
        ModalImportContentComponent,
        ModalExportContentComponent
    ],
})
export class ImportExportModule {

}
