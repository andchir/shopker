import {ChangeDetectorRef, Component, Input, OnChanges, OnInit} from "@angular/core";
import {ContentField} from "../catalog/models/content_field.model";
import {ControlValueAccessor} from "@angular/forms";

import {FileData} from '../catalog/models/file-data.model';

@Component({
    selector: 'app-file-widget',
    templateUrl: 'templates/app-file-widget.html',
    providers: []
})
export class FileWidgetComponent implements OnInit, ControlValueAccessor {

    @Input() fieldName: string;
    @Input() fieldTitle: string;
    @Input() hasPreviewImage = false;
    @Input() allowedExtensions = '';
    @Input() files: { [key: string]: File } = {};
    @Input('controlValue') _controlValue: FileData|null = null;
    filesDirBaseUrl: string;

    get controlValue() {
        return this._controlValue;
    }

    set controlValue(val: FileData) {
        this._controlValue = val;
        this.onChange(val);
    }

    onChange: (value: FileData) => void = () => null;

    ngOnInit(): void {
        if (!this.fieldName) {
            this.fieldName = 'image';
        }
    }

    fileChange(event, imgPreview?: HTMLImageElement) {
        const fileList: FileList = event.target.files;
        let value: FileData;
        if (fileList.length > 0) {

            value = FileData.getFileData(fileList[0]);
            this.files[this.fieldName] = fileList[0];
            this.writeValue(value);

            if (this.hasPreviewImage && fileList[0].type.indexOf('image/') > -1) {

                imgPreview.style.display = 'block';

                const reader = new FileReader();
                reader.onload = (e: ProgressEvent) => {
                    const fr = e.target as FileReader;
                    value.dataUrl = fr.result;
                    this.controlValue = value;
                };
                reader.readAsDataURL(fileList[0]);

            } else {
                imgPreview.style.display = 'none';
            }
        }
    }

    getImageUrl(): string|ArrayBuffer {
        return FileData.getImageUrl(this.filesDirBaseUrl, this.controlValue);
    }

    fileClear(imgPreviewEl?: HTMLImageElement) {
        this.writeValue(null);
        delete this.files[this.fieldName];
        if (imgPreviewEl) {
            imgPreviewEl.src = '';
            imgPreviewEl.style.display = 'none';
        }
    }

    writeValue(value: FileData|null) {
        this.controlValue = value;
    }

    registerOnChange(fn: (_: FileData) => void): void {
        this.onChange = fn;
    }

    registerOnTouched() {}

}
