import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';

import {AppSettings} from '../services/app-settings.service';
import {SettingsService} from '../settings/settings.service';
import {AppModalAbstractComponent} from '../components/modal.component.abstract';
import {EditableFile} from './models/editable-file.model';
import {FileEditService} from './services/file-edit.service';
import {SystemNameService} from '../services/system-name.service';

declare const ace: any;

@Component({
    selector: 'app-modal-file-edit',
    templateUrl: './templates/modal-file-edit.component.html',
    providers: [FileEditService]
})
export class ModalFileEditComponent extends AppModalAbstractComponent<EditableFile> implements OnInit, AfterViewInit, OnDestroy {

    form = new FormGroup({
        id: new FormControl('', [])
    });
    isEditMode = false;
    editor: any;
    errorMessage = '';
    submitted = false;
    loading = false;
    isPathReadOnly = false;
    closeReason = 'canceled';
    uniqueId = '';
    destroyed$ = new Subject<void>();

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public systemNameService: SystemNameService,
        public dataService: FileEditService,
        private messageService: MessageService,
        private settingsService: SettingsService,
        private appSettings: AppSettings
    ) {
        super(ref, config, systemNameService, dataService);
    }

    ngOnInit(): void {
        this.model = new EditableFile(this.config.data.id, '', '');
        this.model.type = this.config.data.type || 'template';
        if (this.config.data.name) {
            this.isEditMode = true;
            this.model.name = this.config.data.name;
            this.model.path = this.config.data.path;
            this.model.extension = this.config.data.extension;
            this.model.themeName = this.config.data.themeName;
        }
        if (this.isEditMode) {
            this.getContent();
        }
    }
    
    ngAfterViewInit(): void {
        this.editorInit();
    }

    getContent(): void {
        this.loading = true;
        const filePath = EditableFile.getPath(this.model);
        this.dataService.getItemContent(filePath, this.model.type)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (res) => {
                    if (res['content']) {
                        setTimeout(() => {
                            this.model.content = res['content'];
                            this.editor.setValue(this.model.content, -1);
                        }, 0);
                    }
                    this.loading = false;
                },
                error: (err) => {
                    if (err['error']) {
                        this.errorMessage = err['error'];
                    }
                    this.loading = false;
                }
            });
    }
    
    editorInit(): void {
        const modelist = ace.require('ace/ext/modelist');
        const editorMode = this.isEditMode
            ? modelist.getModeForPath(`${this.model.path}/${this.model.name}`).mode
            : 'ace/mode/twig';
        
        ace.config.setModuleUrl('ace/mode/javascript_worker', '../js/ace/worker-javascript.js');
        ace.config.setModuleUrl('ace/mode/css_worker', '../js/ace/worker-css.js');
        
        this.editor = ace.edit(`editor-${this.model.type}-${this.model.id}`, {
            mode: editorMode,
            theme: 'ace/theme/kuroir',
            maxLines: 30,
            minLines: 15,
            fontSize: 18
        });
    }

    saveRequest() {
        return this.dataService.saveContent(this.getFormData());
    }

    getFormData(): any {
        const data = Object.assign({}, this.model);
        data.content = this.editor.getValue();
        return data;
    }
}
