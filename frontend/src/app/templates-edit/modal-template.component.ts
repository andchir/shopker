import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TemplatesEditService} from './services/templates-edit.service';
import {Template} from './models/template.model';

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
    @ViewChild('contentTextArea') contentTextArea: ElementRef;

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
        if (this.template && this.isEditMode) {
            this.model.name = this.template.name;
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
                    this.contentTextArea.nativeElement.value = this.model.content;
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

    saveRequest() {
        if (this.isEditMode) {
            return this.dataService.update(this.model);
        } else {
            return this.dataService.create(this.model);
        }
    }

    /** Submit form */
    onSubmit() {
        this.submitted = true;
        this.closeModal();
    }

    save(): void {
        this.submitted = true;
        this.loading = true;
        this.saveRequest()
            .subscribe((res) => {
                this.closeModal();
            }, (err) => {
                this.errorMessage = err.error || 'Error.';
                this.loading = false;
                this.submitted = false;
            });
    }

}
