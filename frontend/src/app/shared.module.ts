import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {NgbModule, NgbActiveModal, NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import {EditorModule, CalendarModule, ChipsModule, ColorPickerModule, TreeModule, ChartModule} from 'primeng/primeng';
import {TranslateModule} from '@ngx-translate/core';
import {DragulaModule} from 'ng2-dragula';
import {ToastModule} from 'primeng/toast';
import {ClipboardModule} from 'ngx-clipboard';

import {TableComponent} from './table.component';
import {TranslationsComponent} from './translations.component';
import {SortingComponent} from './components/sorting-dnd.conponent';
import {InputFieldRenderComponent} from './render-input-field';
import {OutputFieldComponent} from './render-output-field';
import {SelectParentDropdownComponent} from './catalog/select-parent-dropdown.component';
import {FileWidgetComponent} from './components/file-widget.component';
import {NavbarMainComponent} from './components/navbar-main.component';
import {NotFoundComponent} from './not-found.component';
import {ModuleLoaderComponent} from './moduleloader/moduleloader.component';
import {FileManagerComponent} from './components/file-manager.component';
import {ModalFileContentComponent} from './components/modal-file.component';
import {ModalFileUploadContentComponent} from './components/modal-file-upload.component';

import {FilterFieldByGroupPipe} from './pipes/filter-field-by-group.pipe';
import {DateFromObjectPipe} from './pipes/date-from-object.pipe';
import {UserRoleColorPipe, UserRoleNamePipe} from './pipes/user-role.pipe';
import {OrderByPipe} from './pipes/orderby.pipe';
import {FilterArrayPipe} from './pipes/filter-array-pipe';

const components = [
    TableComponent,
    NotFoundComponent,
    ModuleLoaderComponent,
    TranslationsComponent,
    SortingComponent,
    InputFieldRenderComponent,
    OutputFieldComponent,
    SelectParentDropdownComponent,
    FileWidgetComponent,
    FileManagerComponent,
    NavbarMainComponent
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,

        EditorModule,
        CalendarModule,
        ChipsModule,
        ColorPickerModule,
        TreeModule,
        ChartModule,
        ToastModule,
        NgbModule,
        TranslateModule,
        DragulaModule.forRoot(),
        ClipboardModule
    ],
    declarations: [
        ...components,
        FilterFieldByGroupPipe,
        DateFromObjectPipe,
        UserRoleNamePipe,
        UserRoleColorPipe,
        OrderByPipe,
        FilterArrayPipe,

        ModalFileContentComponent,
        ModalFileUploadContentComponent
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
        ChartModule,
        ToastModule,
        TranslateModule,
        DragulaModule,
        FilterFieldByGroupPipe,
        DateFromObjectPipe,
        UserRoleNamePipe,
        UserRoleColorPipe,
        OrderByPipe,
        FilterArrayPipe
    ],
    entryComponents: [
        ModalFileContentComponent,
        ModalFileUploadContentComponent
    ]
})
export class SharedModule {
}
