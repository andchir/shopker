import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {TranslateModule} from '@ngx-translate/core';

import {NavbarMainComponent} from './components/navbar-main.component';

const components = [
    NavbarMainComponent
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,

        TranslateModule
    ],
    declarations: [
        ...components
    ],
    providers: [
        
    ],
    exports: [
        ...components,

        TranslateModule
    ],
    entryComponents: [
        
    ]
})
export class SharedModule {
}
