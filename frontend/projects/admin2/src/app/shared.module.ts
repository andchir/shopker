import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {TranslateModule} from '@ngx-translate/core';
import {TableModule} from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {InputNumberModule} from 'primeng/inputnumber';
import {MultiSelectModule} from 'primeng/multiselect';
import {InputSwitchModule} from 'primeng/inputswitch';
import {DropdownModule} from 'primeng/dropdown';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DialogModule} from 'primeng/dialog';
import {DynamicDialogModule} from 'primeng/dynamicdialog';
import {SplitButtonModule} from 'primeng/splitbutton';
import {TooltipModule} from 'primeng/tooltip';
import {MenuModule} from 'primeng/menu';
import {SidebarModule} from 'primeng/sidebar';
import {CardModule} from 'primeng/card';
import {AccordionModule} from 'primeng/accordion';
import {ToastModule} from 'primeng/toast';
import {ColorPickerModule} from 'primeng/colorpicker';

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
        TableModule,
        InputTextModule,
        InputTextareaModule,
        InputNumberModule,
        MultiSelectModule,
        InputSwitchModule,
        DropdownModule,
        ButtonModule,
        RippleModule,
        ConfirmDialogModule,
        DialogModule,
        DynamicDialogModule,
        SplitButtonModule,
        TooltipModule,
        MenuModule,
        SidebarModule,
        CardModule,
        AccordionModule,
        ToastModule,
        ColorPickerModule
    ],
    declarations: [
        ...components
    ],
    providers: [
        
    ],
    exports: [
        ...components,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        TranslateModule,
        TableModule,
        InputTextModule,
        InputTextareaModule,
        InputNumberModule,
        MultiSelectModule,
        InputSwitchModule,
        DropdownModule,
        ButtonModule,
        RippleModule,
        ConfirmDialogModule,
        DialogModule,
        DynamicDialogModule,
        SplitButtonModule,
        TooltipModule,
        MenuModule,
        SidebarModule,
        CardModule,
        AccordionModule,
        ToastModule,
        ColorPickerModule
    ],
    entryComponents: [
        
    ]
})
export class SharedModule {
}
