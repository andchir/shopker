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
        DefaultComponent
    ]
})
export class ImportExportModule {

}
