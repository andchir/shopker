import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TemplatesEditService} from './services/templates-edit.service';
import {Template} from './models/template.model';

declare var ace: any;
import 'ace-builds';
import 'ace-builds/webpack-resolver';

@Component({
    selector: 'app-modal-template',
    templateUrl: './templates/modal-template.html',
    providers: [TemplatesEditService]
})
export class ModalTemplateEditComponent implements OnInit {

    @Input() modalTitle: string;
    @Input() template: Template;
    @Input() isItemCopy: boolean;
    @Input() isEditMode: boolean;
    @ViewChild('editor') editor: ElementRef;

    model = new Template(0, '', '');
    errorMessage = '';
    submitted = false;
    loading = false;

    constructor(
        private dataService: TemplatesEditService,
        private activeModal: NgbActiveModal
    ) {

    }

    ngOnInit(): void {
        ace.edit('editor', {
            mode: 'ace/mode/twig',
            theme: 'ace/theme/kuroir',
            maxLines: 30,
            minLines: 15,
            fontSize: 18
        });
        if (this.template && this.isEditMode) {
            this.model.name = this.template.name;
            this.model.path = this.template.path;
            this.getContent();
        }
    }

    getContent(): void {
        this.loading = true;
        const templatePath = `${this.template.path}/${this.template.name}`;
        this.dataService.getItemContent(templatePath)
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
        // this.saveRequest()
        //     .subscribe((res) => {
        //         this.closeModal();
        //     }, (err) => {
        //         this.errorMessage = err.error || 'Error.';
        //         this.loading = false;
        //         this.submitted = false;
        //     });
    }

}
