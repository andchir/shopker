import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
    selector: 'app-file-manager',
    templateUrl: 'templates/file-manager.component.html',
    providers: []
})
export class FileManagerComponent implements OnInit {

    @ViewChild('container') container;
    isActive = false;
    files: any[] = [];
    loading = false;

    ngOnInit(): void {

        this.loading = true;
        this.files = [{},{},{},{},{},{},{}];

    }

    setActive(): void {
        this.isActive = true;
        setTimeout(() => {
            this.container.nativeElement.classList.add('active');
        }, 300);
    }

    setUnactive(): void {
        this.isActive = false;
        this.container.nativeElement.classList.remove('active');
    }
}
