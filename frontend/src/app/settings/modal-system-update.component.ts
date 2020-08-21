import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {FileWidgetComponent} from '../components/file-widget.component';
import {SettingsService} from './settings.service';
import {AppSettings} from '../services/app-settings.service';

@Component({
    selector: 'app-modal-file-upload',
    templateUrl: 'templates/modal-system-update.component.html'
})
export class ModalSystemUpdateComponent implements OnInit, OnDestroy {
    
    @ViewChild('filesWidget') filesWidget: FileWidgetComponent;
    errorMessage: string;
    loading = false;
    destroyed$ = new Subject<void>();
    stepNumber = 2;
    changelogContent: string;
    isCollapsed = true;
    currentVersion: string;
    version: string;
    
    constructor(
        private activeModal: NgbActiveModal,
        private dataService: SettingsService,
        private appSettings: AppSettings
    ) {
    }
    
    ngOnInit(): void {
        this.currentVersion = this.appSettings.settings.version;
    }

    nextStepHandler(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.errorMessage = '';
        
        switch (this.stepNumber) {
            case 1:
    
                if (this.filesWidget.filesRaw.length === 0) {
                    this.errorMessage = 'PLEASE_SELECT_FILE';
                    return;
                }
    
                const formData = new FormData();
                formData.append('file', this.filesWidget.filesRaw[0]);
    
                this.loading = true;
                this.dataService.postFormData(formData, 'admin/system_update/upload')
                    .pipe(takeUntil(this.destroyed$))
                    .subscribe({
                        next: (res) => {
                            this.loading = false;
                            this.stepNumber = 2;
                        },
                        error: (err) => {
                            if (err['error']) {
                                this.errorMessage = err['error'];
                            }
                            this.loading = false;
                        }
                    });
                
                break;
            case 2:
        
                this.loading = true;
                this.dataService.runAction('admin/system_update/pre_update')
                    .pipe(takeUntil(this.destroyed$))
                    .subscribe({
                        next: (res) => {
                            
                            this.version = res.version || '';
                            this.changelogContent = res.changelogContent || '';
                            this.loading = false;
                            // this.stepNumber = 3;
                        },
                        error: (err) => {
                            if (err['error']) {
                                this.errorMessage = err['error'];
                            }
                            this.loading = false;
                        }
                    });
                
                break;
            case 3:
        
                break;
        }
    }
    
    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
