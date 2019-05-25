import {Component, OnInit, ViewChild} from '@angular/core';

import {FileManagerService} from '../services/file-manager.service';
import {FileModel} from '../models/file.model';

@Component({
    selector: 'app-file-manager',
    templateUrl: 'templates/file-manager.component.html',
    providers: [FileManagerService]
})
export class FileManagerComponent implements OnInit {

    @ViewChild('container') container;
    isActive = false;
    files: any[] = [];
    loading = false;
    currentPath = '';
    errorMessage = '';

    constructor(
        public dataService: FileManagerService
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

    openDir(file: FileModel, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        if (!file.isDir) {
            return;
        }
        this.currentPath += this.currentPath ? `/${file.fileName}` : file.fileName;
        this.getFilesList();
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
