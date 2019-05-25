import {Component, OnInit, ViewChild} from '@angular/core';

import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FileManagerService} from '../services/file-manager.service';
import {FileModel} from '../models/file.model';
import {ModalFileContentComponent} from './modal-file.component';

@Component({
    selector: 'app-file-manager',
    templateUrl: 'templates/file-manager.component.html',
    providers: [FileManagerService]
})
export class FileManagerComponent implements OnInit {

    @ViewChild('container') container;
    modalRef: NgbModalRef;
    isActive = false;
    files: any[] = [];
    loading = false;
    currentPath = '';
    errorMessage = '';

    constructor(
        public dataService: FileManagerService,
        public modalService: NgbModal
    ) {

    }

    ngOnInit(): void {

    }

    getFilesList(): void {
        this.errorMessage = '';
        this.loading = true;
        this.dataService.getList({path: this.currentPath})
            .subscribe((res) => {
                this.loading = false;
                this.files = res;
            }, (err) => {
                this.loading = false;
                if (err['error']) {
                    this.errorMessage = err['error'];
                }
            });
    }

    openFileHandler(file: FileModel, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        if (file.isDir) {
            this.currentPath = this.getFilePath(file);
            this.getFilesList();
        } else {
            this.openModal(file);
        }
    }

    openModal(file: FileModel) {
        if (this.modalRef) {
            this.modalRef.close();
        }
        this.modalRef = this.modalService.open(ModalFileContentComponent);
        this.modalRef.componentInstance.modalTitle = file.fileName;
        this.modalRef.componentInstance.file = file;
        this.modalRef.componentInstance.filePath = this.getFilePath(file);
    }

    getFilePath(file: FileModel): string {
        return this.currentPath
            ? `${this.currentPath}/${file.fileName}`
            : file.fileName;
    }

    openDirPrevous(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        if (!this.currentPath) {
            return;
        }
        const tmp = this.currentPath.split('/');
        tmp.pop();
        this.currentPath = tmp.join('/');
        this.getFilesList();
    }

    setActive(): void {
        this.isActive = true;
        setTimeout(() => {
            this.container.nativeElement.classList.add('active');
            this.getFilesList();
        }, 300);
    }

    setUnactive(): void {
        this.isActive = false;
        this.container.nativeElement.classList.remove('active');
    }
}
