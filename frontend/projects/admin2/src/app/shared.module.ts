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
import {ContextMenuModule} from 'primeng/contextmenu';
import {SidebarModule} from 'primeng/sidebar';
import {CardModule} from 'primeng/card';
import {AccordionModule} from 'primeng/accordion';
import {ToastModule} from 'primeng/toast';
import {ColorPickerModule} from 'primeng/colorpicker';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ChartModule} from 'primeng/chart';
import {CalendarModule} from 'primeng/calendar';
import {PanelModule} from 'primeng/panel';

import {AppNavbarComponent} from './components/app-navbar.component';
import {RenderOutputTypeComponent} from './components/render-output-type.component';

import {FilterFieldByGroupPipe} from './pipes/filter-field-by-group.pipe';
import {DateFromObjectPipe} from './pipes/date-from-object.pipe';
import {UserRoleColorPipe, UserRoleNamePipe} from './pipes/user-role.pipe';
import {OrderByPipe} from './pipes/orderby.pipe';
import {FilterArrayPipe} from './pipes/filter-array-pipe';
import {IfEmptyPipe} from './pipes/if-empty.pipe';

const components = [
    AppNavbarComponent,
    RenderOutputTypeComponent
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
        ContextMenuModule,
        SidebarModule,
        CardModule,
        AccordionModule,
        ToastModule,
        ColorPickerModule,
        ProgressSpinnerModule,
        MessagesModule,
        MessageModule,
        ChartModule,
        CalendarModule,
        PanelModule
    ],
    declarations: [
        ...components,

        FilterFieldByGroupPipe,
        DateFromObjectPipe,
        UserRoleNamePipe,
        UserRoleColorPipe,
        OrderByPipe,
        FilterArrayPipe,
        IfEmptyPipe
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
        ContextMenuModule,
        SidebarModule,
        CardModule,
        AccordionModule,
        ToastModule,
        ColorPickerModule,
        ProgressSpinnerModule,
        MessagesModule,
        MessageModule,
        ChartModule,
        CalendarModule,
        PanelModule,

        FilterFieldByGroupPipe,
        DateFromObjectPipe,
        UserRoleNamePipe,
        UserRoleColorPipe,
        OrderByPipe,
        FilterArrayPipe,
        IfEmptyPipe
    ],
    entryComponents: [
        
    ]
})
export class SharedModule {
}
