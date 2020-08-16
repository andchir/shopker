import {Component, OnDestroy, ViewChild} from '@angular/core';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';

import {FileWidgetComponent} from '../components/file-widget.component';
import {SettingsService} from './settings.service';
import {takeUntil} from "rxjs/operators";

@Component({
    selector: 'app-modal-file-upload',
    templateUrl: 'templates/modal-system-update.component.html'
})
export class ModalSystemUpdateComponent implements OnDestroy {
    
    @ViewChild('filesWidget') filesWidget: FileWidgetComponent;
    errorMessage: string;
    loading = false;
    destroyed$ = new Subject<void>();
    stepNumber = 1;
    
    constructor(
        private activeModal: NgbActiveModal,
        private dataService: SettingsService
    ) {
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
