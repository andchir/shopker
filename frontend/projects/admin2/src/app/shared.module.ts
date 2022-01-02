import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {TranslateModule} from '@ngx-translate/core';
import {TableModule} from 'primeng/table';

import {AppNavbarComponent} from './components/app-navbar.component';

const components = [
    AppNavbarComponent
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,

        TranslateModule,
        TableModule
    ],
    declarations: [
        ...components
    ],
    providers: [
        
    ],
    exports: [
        ...components,

        TranslateModule,
        TableModule
    ],
    entryComponents: [
        
    ]
})
export class SharedModule {
}
