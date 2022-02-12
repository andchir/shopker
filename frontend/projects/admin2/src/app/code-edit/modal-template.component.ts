import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';

import {TemplatesEditService} from './services/templates-edit.service';
import {Template} from './models/template.model';
import {FileRegularInterface} from './models/file-regular.interface';
import {AppSettings} from '../services/app-settings.service';
import {SettingsService} from '../settings/settings.service';
import {AppModalAbstractComponent} from '../components/modal.component.abstract';

declare const ace: any;

@Component({
    selector: 'app-modal-template',
    templateUrl: './templates/modal-template.html',
    providers: [TemplatesEditService]
})
export class ModalTemplateEditComponent extends AppModalAbstractComponent<Template> implements OnInit, AfterViewInit, OnDestroy {
    
    template: Template;
    file: FileRegularInterface;
    isItemCopy: boolean;
    isEditMode: boolean;
    modalId: string;

    form = new FormGroup({
        id: new FormControl('', [])
    });

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
        public dataService: TemplatesEditService,
        private messageService: MessageService,
        private settingsService: SettingsService,
        private appSettings: AppSettings
    ) {
        super(ref, config, dataService);
    }

    ngOnInit(): void {
        this.modalId = String(this.config.data.id);
        this.model = new Template(this.config.data.id, '', '');
        if (this.config.data.id) {
            this.isEditMode = true;
            this.model.name = this.config.data.name;
            this.model.path = this.config.data.path;
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
        let filePath, fileType;
        // if (this.template) {
        //     filePath = Template.getPath(this.template);
        //     fileType = 'twig';
        // } else if (this.file) {
        //     filePath = Template.getPath(this.file);
        //     fileType = this.file.type;
        // }
        fileType = 'twig';
        filePath = Template.getPath(this.model);
        this.dataService.getItemContent(filePath, fileType)
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
            ? modelist.getModeForPath(this.model.path + '/' + this.model.name).mode
            : 'ace/mode/twig';
        
        ace.config.setModuleUrl('ace/mode/javascript_worker', '../js/ace/worker-javascript.js');
        ace.config.setModuleUrl('ace/mode/css_worker', '../js/ace/worker-css.js');
        
        this.editor = ace.edit(`editor-${this.modalId}`, {
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
