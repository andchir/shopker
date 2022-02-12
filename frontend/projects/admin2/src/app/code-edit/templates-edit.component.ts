import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {TemplatesEditService} from './services/templates-edit.service';
import {TranslateService} from '@ngx-translate/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';

import {Template} from './models/template.model';
import {QueryOptions} from '../models/query-options';
import {ModalTemplateEditComponent} from './modal-template.component';
import {FileRegularInterface} from './models/file-regular.interface';
import {AppTablePageAbstractComponent, TableField} from '../components/table-page.components.abstract';
import {ContentTypesService} from '../catalog/services/content_types.service';

@Component({
    selector: 'app-template-edit',
    templateUrl: './templates/templates-edit.component.html',
    providers: [DialogService, ConfirmationService, TemplatesEditService]
})
export class TemplatesEditComponent extends AppTablePageAbstractComponent<Template> implements OnInit, OnDestroy {
    
    queryOptions: QueryOptions = new QueryOptions(1, 20, 'path', 'asc');
    themes: {name: string, title: string}[] = [];
    cols: TableField[] = [
        { field: 'name', header: 'NAME', outputType: 'text', outputProperties: {} },
        { field: 'themeName', header: 'TEMPLATE_THEME_NAME', outputType: 'text', outputProperties: {} },
        { field: 'path', header: 'PATH', outputType: 'text', outputProperties: {} }
    ];

    constructor(
        public dialogService: DialogService,
        public contentTypesService: ContentTypesService,
        public dataService: TemplatesEditService,
        public translateService: TranslateService,
        public messageService: MessageService,
        public confirmationService: ConfirmationService
    ) {
        super(dialogService, contentTypesService, dataService, translateService, messageService, confirmationService);
    }

    ngOnInit() {
        this.menuItems = [
            {
                label: this.getLangString('REFRESH'),
                icon: 'pi pi-refresh',
                command: (event?: any) => {
                    this.queryOptions.page = 1;
                    this.queryOptions.search_word = '';
                    this.getData();
                }
            },
            {
                label: this.getLangString('DELETE_SELECTED'),
                icon: 'pi pi-times',
                command: (event?: any) => {
                    this.deleteSelected();
                }
            }
        ];
        this.getThemesList();
    }

    getModalComponent() {
        return ModalTemplateEditComponent;
    }

    getThemesList(): void {
        this.dataService.getThemesList()
            .subscribe({
                next: (res) => {
                    this.themes = res.map((item) => {
                        if (!item.title) {
                            item.title = item.name;
                        }
                        return item;
                    });
                    this.themes.unshift({
                        name: '',
                        title: this.getLangString('ALL')
                    });
                }
            });
    }
    
    onThemeChange(): void {
        this.queryOptions.page = 1;
        this.getData();
    }

    getItemData(item: Template): {[name: string]: number|string} {
        if (item) {
            return {
                id: item.id,
                name: item.name,
                path: item.path,
                themeName: item.themeName
            };
        }
        return {
            id: 0
        };
    }

    setModalInputs(itemId?: number, isItemCopy: boolean = false, modalId = ''): void {
        // const templateIndex = findIndex(this.items, {id: itemId});
        // const template = templateIndex > -1 ? this.items[templateIndex] : null;
        // const isEditMode = template && template.id > -1;
        // this.modalRef.componentInstance.modalTitle = isEditMode
        //     ? this.getLangString('TEMPLATE')
        //     : this.getLangString('ADD_TEMPLATE');
        // this.modalRef.componentInstance.modalId = modalId;
        // this.modalRef.componentInstance['isItemCopy'] = isItemCopy || false;
        // this.modalRef.componentInstance['isEditMode'] = isEditMode;
        // this.modalRef.componentInstance['template'] = template;
    }

    deleteSelected() {
        // if (this.selectedIds.length === 0) {
        //     this.showAlert(this.getLangString('NOTHING_IS_SELECTED'));
        //     return;
        // }
        // const pathArr = [];
        // this.selectedIds.forEach((id) => {
        //     const templateIndex = findIndex(this.items, {id: id});
        //     if (templateIndex > -1) {
        //         const template = templateIndex > -1 ? this.items[templateIndex] : null;
        //         pathArr.push(Template.getPath(template));
        //     }
        // });
        // this.confirmAction(this.getLangString('YOU_SURE_YOU_WANT_DELETE_SELECTED'))
        //     .then((result) => {
        //         if (result === 'accept') {
        //             this.dataService.deleteFilesBatch(pathArr)
        //                 .subscribe(res => {
        //                         this.clearSelected();
        //                         this.getList();
        //                     },
        //                     err => this.showAlert(err.error || this.getLangString('ERROR')));
        //         }
        //     });
    }

    // deleteItem(itemId: number): void {
    //     const templateIndex = findIndex(this.items, {id: itemId});
    //     const template = templateIndex > -1 ? this.items[templateIndex] : null;
    //     if (!template) {
    //         return;
    //     }
    //     const templatePath = Template.getPath(template);
    //     this.confirmAction(this.getLangString('YOU_SURE_YOU_WANT_DELETE'))
    //         .then((result) => {
    //             if (result === 'accept') {
    //                 this.dataService.deleteTemplateItem(templatePath)
    //                     .subscribe(() => {
    //                         this.getList();
    //                     }, (err) => {
    //                         if (err['error']) {
    //                             this.showAlert(err['error']);
    //                         }
    //                     });
    //             }
    //         });
    // }

    editFile(file: FileRegularInterface, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        console.log('editFile', file);
        // const modalId = ['modal', 'file', file.type, file.name].join('-');
        // window.document.body.classList.add('modal-open');
        // if (window.document.getElementById(modalId)) {
        //     const modalEl = window.document.getElementById(modalId);
        //     const backdropEl = modalEl.previousElementSibling;
        //     modalEl.classList.add('d-block');
        //     modalEl.classList.remove('modal-minimized');
        //     backdropEl.classList.remove('d-none');
        //     return;
        // }
        // this.modalRef = this.modalService.open(ModalTemplateEditComponent, {
        //     size: 'lg',
        //     backdrop: 'static',
        //     keyboard: false,
        //     backdropClass: 'modal-backdrop-left45',
        //     windowClass: 'modal-left45',
        //     container: '#modals-container'
        // });
        // this.modalRef.componentInstance.modalTitle = this.getLangString('EDITING') + ` ${file.name}`;
        // this.modalRef.componentInstance.isItemCopy = false;
        // this.modalRef.componentInstance.isEditMode = true;
        // this.modalRef.componentInstance.file = file;
        // this.modalRef.componentInstance.modalId = modalId;
        // this.modalRef.result.then((result) => {
        //     if (this.destroyed$.isStopped) {
        //         return;
        //     }
        //     this.getEditableFiles();
        // }, (reason) => {
        //     // console.log( 'reason', reason );
        // });
    }

    getModalElementId(itemId?: number|string): string {
        return ['modal', 'template', itemId || 0].join('-');
    }
}
