import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {NgbModule, NgbActiveModal, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {EditorModule, CalendarModule, ChipsModule, ColorPickerModule, TreeModule} from 'primeng/primeng';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {DragulaModule} from 'ng2-dragula';

import {TableComponent} from './table.component';
import {SortingComponent} from './sorting-dnd.conponent';
import {InputFieldRenderComponent} from './render-input-field';
import {OutputFieldComponent} from './render-output-field';
import {SelectParentDropdownComponent} from './catalog/select-parent-dropdown.component';

import {FilterFieldByGroupPipe} from './pipes/filter-field-by-group.pipe';
import {DateFromObjectPipe} from './pipes/date-from-object.pipe';
import {UserRoleColorPipe, UserRoleNamePipe} from './pipes/user-role.pipe';
import {OrderByPipe} from './pipes/orderby.pipe';
import {FilterArrayPipe} from './pipes/filter-array-pipe';

const components = [
    TableComponent,
    SortingComponent,
    InputFieldRenderComponent,
    OutputFieldComponent,
    SelectParentDropdownComponent
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        EditorModule,
        CalendarModule,
        ChipsModule,
        ColorPickerModule,
        TreeModule,
        NgbModule,
        TranslateModule,
        DragulaModule.forRoot()
    ],
    declarations: [
        ...components,
        FilterFieldByGroupPipe,
        DateFromObjectPipe,
        UserRoleNamePipe,
        UserRoleColorPipe,
        OrderByPipe,
        FilterArrayPipe,
    ],
    providers: [
        NgbActiveModal,
        NgbTooltipConfig
    ],
    exports: [
        ...components,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        EditorModule,
        CalendarModule,
        ChipsModule,
        ColorPickerModule,
        TreeModule,
        TranslateModule,
        DateFromObjectPipe,
        DragulaModule
    ]
})
export class SharedModule {
}
