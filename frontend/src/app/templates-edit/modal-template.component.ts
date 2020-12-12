import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TemplatesEditService} from './services/templates-edit.service';
import {Template} from './models/template.model';
import {FileRegularInterface} from './models/file-regular.interface';
import {AppSettings} from '../services/app-settings.service';

declare const ace: any;

@Component({
    selector: 'app-modal-template',
    templateUrl: './templates/modal-template.html',
    providers: [TemplatesEditService]
})
export class ModalTemplateEditComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() modalTitle: string;
    @Input() template: Template;
    @Input() file: FileRegularInterface;
    @Input() isItemCopy: boolean;
    @Input() isEditMode: boolean;
    @Input() modalId = '';

    editor: any;
    model: FileRegularInterface = {} as FileRegularInterface;
    errorMessage = '';
    submitted = false;
    loading = false;
    isPathReadOnly = false;
    closeReason = 'canceled';
    uniqueId = '';
    destroyed$ = new Subject<void>();

    constructor(
        private dataService: TemplatesEditService,
        private activeModal: NgbActiveModal,
        private appSettings: AppSettings,
        private elRef: ElementRef
    ) {

    }

    ngOnInit(): void {
        this.uniqueId = Math.random().toString(36).substr(2, 9);
        if (this.elRef) {
            this.getRootElement().setAttribute('id', this.modalId);
        }
        if (this.template) {
            this.model.name = this.template.name;
            this.model.path = this.template.path;
            this.model.extension = 'twig';
            this.model.type = 'template';
            this.modalTitle += ` ${this.model.name}`;
        } else if (this.file) {
            this.model.name = this.file.name;
            this.model.path = this.file.path;
            this.model.extension = this.file.extension;
            this.model.type = this.file.type;
            this.isPathReadOnly = true;
        }
        if (this.isEditMode) {
            this.getContent();
        } else {
            this.model.path = this.appSettings.settings.templateTheme;
            this.model.type = 'template';
        }
    }
    
    ngAfterViewInit(): void {
        this.editorInit();
    }

    getContent(): void {
        this.loading = true;
        let filePath, fileType;
        if (this.template) {
            filePath = Template.getPath(this.template);
            fileType = 'twig';
        } else if (this.file) {
            filePath = Template.getPath(this.file);
            fileType = this.file.type;
        }
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
        
        ace.config.setModuleUrl('ace/mode/javascript_worker', '../js/worker-javascript.js');
        ace.config.setModuleUrl('ace/mode/css_worker', '../js/worker-css.js');
        
        this.editor = ace.edit(`editor-${this.modalId}`, {
            mode: editorMode,
            theme: 'ace/theme/kuroir',
            maxLines: 30,
            minLines: 15,
            fontSize: 18
        });
    }

    closeModal(event?: MouseEvent) {
        if (event) {
            event.preventDefault();
        }
        this.close(this.closeReason);
    }

    close(reason: string, event?: MouseEvent) {
        if (event) {
            event.preventDefault();
        }
        this.activeModal.dismiss(this.closeReason);

        if (['submit', 'updated'].indexOf(this.closeReason) > -1) {
            const reasonStr = this.isEditMode ? 'edit' : 'create';
            this.activeModal.close({reason: reasonStr, data: this.model});
        } else {
            this.activeModal.dismiss(reason);
        }
    }

    /** Submit form */
    onSubmit() {
        this.submitted = true;
        this.closeModal();
    }

    save(autoClose = false, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.submitted = true;
        this.loading = true;

        this.model.content = this.editor.getValue();

        this.dataService.saveContent(this.model)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (res) => {
                    this.closeReason = 'updated';
                    if (autoClose) {
                        this.closeModal();
                    } else if (res && res['id']) {
                        this.model = res as FileRegularInterface;
                    }
                    this.loading = false;
                    this.submitted = false;
                },
                error: (err) => {
                    this.errorMessage = err.error || 'Error.';
                    this.loading = false;
                    this.submitted = false;
                }
            });
    }

    minimize(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        window.document.body.classList.remove('modal-open');
        const modalEl = this.getRootElement();
        const backdropEl = modalEl.previousElementSibling;

        modalEl.classList.remove('d-block');
        modalEl.classList.add('modal-minimized');
        backdropEl.classList.add('d-none');
    }

    maximize(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        window.document.body.classList.add('modal-open');
        const modalEl = this.getRootElement();
        const backdropEl = modalEl.previousElementSibling;

        modalEl.classList.add('d-block');
        modalEl.classList.remove('modal-minimized');
        backdropEl.classList.remove('d-none');
    }

    getRootElement(): HTMLElement {
        return this.elRef.nativeElement.parentNode.parentNode.parentNode;
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
