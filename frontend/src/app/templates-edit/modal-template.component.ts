import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TemplatesEditService} from './services/templates-edit.service';
import {Template} from './models/template.model';
import {FileRegularInterface} from './models/file-regular.interface';

declare const ace: any;
import 'ace-builds/src-min-noconflict/ace';
import 'ace-builds/src-min-noconflict/theme-kuroir';
import 'ace-builds/src-min-noconflict/ext-modelist';
import 'ace-builds/webpack-resolver';

@Component({
    selector: 'app-modal-template',
    templateUrl: './templates/modal-template.html',
    providers: [TemplatesEditService]
})
export class ModalTemplateEditComponent implements OnInit {

    @Input() modalTitle: string;
    @Input() template: Template;
    @Input() file: FileRegularInterface;
    @Input() isItemCopy: boolean;
    @Input() isEditMode: boolean;
    @ViewChild('editor') editor: ElementRef;

    model: FileRegularInterface = {} as FileRegularInterface;
    errorMessage = '';
    submitted = false;
    loading = false;
    isPathReadOnly = false;

    constructor(
        private dataService: TemplatesEditService,
        public activeModal: NgbActiveModal
    ) {

    }

    ngOnInit(): void {
        if (this.template) {
            this.model.name = this.template.name;
            this.model.path = this.template.path;
            this.model.extension = 'twig';
        } else if (this.file) {
            this.model.name = this.file.name;
            this.model.path = this.file.path;
            this.model.extension = this.file.extension;
            this.isPathReadOnly = true;
        }
        const modelist = ace.require('ace/ext/modelist');
        const editorMode = this.isEditMode
            ? modelist.getModeForPath(this.model.path + '/' + this.model.name).mode
            : 'ace/mode/twig';
        ace.edit('editor', {
            mode: editorMode,
            theme: 'ace/theme/kuroir',
            maxLines: 30,
            minLines: 15,
            fontSize: 18
        });
        if (this.isEditMode) {
            this.getContent();
        }
    }

    getContent(): void {
        this.loading = true;
        let filePath, fileType;
        if (this.template) {
            filePath = Template.getPath(this.template);
            fileType = 'twig';
        } else if (this.file) {
            filePath = Template.getPath(this.file);
            fileType = this.file.extension;
        }
        this.dataService.getItemContent(filePath, fileType)
            .subscribe((res) => {
                if (res['content']) {
                    this.model.content = res['content'];
                    ace.edit('editor').setValue(this.model.content, -1);
                }
                this.loading = false;
            }, (err) => {
                if (err['error']) {
                    this.errorMessage = err['error'];
                }
                this.loading = false;
            });
    }

    /** Close modal */
    closeModal() {
        const reason = this.isEditMode ? 'edit' : 'create';
        this.activeModal.close({reason: reason, data: this.model});
    }

    close(e: MouseEvent) {
        e.preventDefault();
        this.activeModal.dismiss('canceled');
    }

    /** Submit form */
    onSubmit() {
        this.submitted = true;
        this.closeModal();
    }

    save(): void {
        this.submitted = true;
        this.loading = true;

        this.model.content = ace.edit('editor').getValue();

        this.dataService.saveContent(this.model)
            .subscribe((res) => {
                this.closeModal();
            }, (err) => {
                this.errorMessage = err.error || 'Error.';
                this.loading = false;
                this.submitted = false;
            });
    }

}
