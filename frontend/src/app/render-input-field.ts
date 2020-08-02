import {
    Component,
    OnInit,
    Input,
    OnChanges,
    SimpleChange,
    ChangeDetectorRef,
    Output,
    EventEmitter, ViewChild
} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {cloneDeep, map, zipObject, extend, defer} from 'lodash';
import {isNumeric} from 'rxjs/util/isNumeric';
import {TranslateService} from '@ngx-translate/core';
import {TreeNode} from 'primeng';

import {
    FullCalendarComponent,
    CalendarOptions,
    EventInput,
    EventApi,
    DateSelectArg,
    EventClickArg,
    EventAddArg,
    EventChangeArg
} from '@fullcalendar/angular';
import ruLocale from '@fullcalendar/core/locales/ru';

import {ContentField} from './catalog/models/content_field.model';
import {MultiValues} from './models/multivalues.model';
import {Properties} from './models/properties.iterface';
import {FileData} from './catalog/models/file-data.model';

import {SystemNameService} from './services/system-name.service';
import {AppSettings} from './services/app-settings.service';
import {CategoriesService} from './catalog/services/categories.service';

export const calendarLocale = {
    en: {
        firstDayOfWeek: 0,
        dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        monthNames: [
            'January', 'February', 'March',
            'April', 'May', 'June',
            'July', 'August', 'September',
            'October', 'November', 'December'
        ],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        today: 'Today',
        clear: 'Clear',
        format: 'mm.dd.yy'
    },
    ru: {
        firstDayOfWeek: 1,
        dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        dayNamesShort: ['Вос', 'Пон', 'Втор', 'Среда', 'Чет', 'Пятн', 'Суб'],
        dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        monthNames: [
            'Январь', 'Февраль', 'Март',
            'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь',
            'Октябрь', 'Ноябрь', 'Декабрь'
        ],
        monthNamesShort: ['Янв', 'Февр', 'Мар', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        today: 'Сегодня',
        clear: 'Сбросить',
        format: 'dd.mm.yy'
    }
};

@Component({
    selector: 'app-input-field-renderer',
    templateUrl: 'templates/render-input-field.html',
    providers: []
})
export class InputFieldRenderComponent implements OnInit, OnChanges {

    @Input() fields: ContentField[];
    @Input() groups: string[];
    @Input() model: {[key: string]: any};
    @Input() form: FormGroup;
    @Input() formErrors: {[key: string]: string};
    @Input() validationMessages: {[key: string]: {[key: string]: string}};
    @Input() files: { [key: string]: File } = {};
    @Input() localeFieldsAllowed: string[] = [];
    @Input() isLocalizationActive: boolean;
    @Output() onAddTranslation = new EventEmitter<string>();
    @ViewChild('fullCalendar') private fullCalendar: FullCalendarComponent;
    fieldsMultivalues: {[key: string]: MultiValues} = {};
    submitted = false;
    filesDirBaseUrl: string;
    loadingCategories = false;
    categories = [];
    categoriesTree: TreeNode[] = [];
    categoriesSelection: {[key: string]: any} = {};
    calendarLocale = calendarLocale;
    fullCalendarOptions: {[key: string]: CalendarOptions};
    fullCalendarEvents: {[key: string]: EventInput[]};

    constructor(
        private changeDetectionRef: ChangeDetectorRef,
        private systemNameService: SystemNameService,
        private categoriesService: CategoriesService,
        private translateService: TranslateService,
        private appSettings: AppSettings
    ) {
        this.filesDirBaseUrl = this.appSettings.settings.filesDirUrl;
    }

    ngOnInit(): void {
        this.buildControls();
    }

    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
        this.buildControls();
        const changedKeys = Object.keys(changes);
        const fieldNames = map(this.fields, (field) => {
            return field.name;
        });
        if (this.categoriesTree.length === 0 && fieldNames.indexOf('categories') === -1) {
            this.getCategoriesTree();
        }
        if (changedKeys.indexOf('model') > -1) {
            this.updateTreeSelections();
        }
    }

    buildControls() {
        this.fields.forEach(function(field) {
            this.setFieldProperties(field);
            this.setFieldOptions(field);
            this.setValue(field);
            this.formErrors[field.name] = '';
            if (!this.validationMessages[field.name]) {
                this.validationMessages[field.name] = {};
            }
            if (field.inputType === 'categories') {
                this.categoriesSelection[field.name] = [];
            }

            if (!this.form.controls[field.name]) {
                const validators = this.getValidators(field);
                const control = new FormControl(this.model[field.name], validators);
                this.form.addControl(field.name, control);
            }
        }.bind(this));
        this.changeDetectionRef.detectChanges();
    }

    setFieldProperties(field: ContentField): void {

        let propertiesDefault: Properties;

        switch (field.inputType) {
            case 'number':

                propertiesDefault = {
                    handler: '',
                    multiple: 0,
                    min: null,
                    max: null,
                    step: 1
                };
                this.extendProperties(
                    field.inputProperties,
                    propertiesDefault
                );

                break;
            case 'date':

                propertiesDefault = {
                    handler: '',
                    multiple: 0,
                    format: 'MM/dd/yyyy',
                    show_time: 0,
                    hour_format: 24,
                    locale: 'en'
                };
                this.extendProperties(
                    field.inputProperties,
                    propertiesDefault
                );

                break;
            case 'schedule':
    
                propertiesDefault = {
                    slotDuration: '0:10:00'
                };
                this.extendProperties(
                    field.inputProperties,
                    propertiesDefault
                );
                
                if (!this.fullCalendarOptions) {
                    this.fullCalendarOptions = {};
                }
                if (!this.fullCalendarEvents) {
                    this.fullCalendarEvents = {};
                }
                this.fullCalendarEvents[field.name] = this.model[field.name] || [];
                this.fullCalendarOptions[field.name] = {
                    headerToolbar: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                    },
                    locales: [ruLocale],
                    locale: this.appSettings.settings.locale,
                    initialView: 'dayGridMonth',
                    weekends: true,
                    editable: true,
                    selectable: true,
                    selectMirror: true,
                    dayMaxEvents: true,
                    slotDuration: '0:10:00',
                    initialEvents: this.fullCalendarEvents[field.name],
                    select: (selectInfo: DateSelectArg) => {
                        this.handleFullCalendarDateSelect(field.name, selectInfo);
                    },
                    eventClick: (clickInfo: EventClickArg) => {
                        this.handleFullCalendarEventClick(field.name, clickInfo);
                    },
                    eventAdd: (api: EventAddArg) => {
                        this.handleFullCalendarEventAdd(field.name, api);
                    },
                    eventChange: (api: EventChangeArg) => {
                        this.handleFullCalendarEventChange(field.name, api);
                    }
                };
                Object.assign(this.fullCalendarOptions[field.name], field.inputProperties);
                
                break;
            case 'rich_text':

                propertiesDefault = {
                    handler: '',
                    multiple: 0,
                    formats: 'background,bold,color,font,code,italic,link,'
                    + 'strike,script,underline,blockquote,header,indent,'
                    + 'list,align,direction,code-block,formula,image,video,clean'
                };
                this.extendProperties(
                    field.inputProperties,
                    propertiesDefault
                );
                field.inputProperties['formats'] = String(field.inputProperties['formats']).split(',');

                break;
            case 'file':

                propertiesDefault = {
                    handler: '',
                    multiple: 0,
                    allowed_extensions: '.zip,.rar,.doc,.docx,.xls,.xlsx,.ods,.odt',
                    has_preview_image: 0
                };
                this.extendProperties(
                    field.inputProperties,
                    propertiesDefault
                );

                break;
            case 'categories':

                propertiesDefault = {
                    handler: '',
                    multiple: 0,
                    layout: 'vertical'
                };
                this.extendProperties(
                    field.inputProperties,
                    propertiesDefault
                );

                break;
            case 'color':

                propertiesDefault = {
                    handler: '',
                    multiple: 0,
                    inline: 0
                };
                this.extendProperties(
                    field.inputProperties,
                    propertiesDefault
                );

                break;
            default:

                propertiesDefault = {
                    handler: '',
                    multiple: 0
                };
                this.extendProperties(
                    field.inputProperties,
                    propertiesDefault
                );
        }
    }

    setFieldOptions(field: ContentField): void {

        field.options = [];
        let valueArr;

        switch (field.inputType) {
            case 'radio':
            case 'select':

                valueArr = field.inputProperties['values_list']
                    ? String(field.inputProperties['values_list']).split('||')
                    : [];
                valueArr.forEach((optStr, index) => {
                    const opts = optStr.split('==');
                    if (!opts[1]) {
                        opts[1] = opts[0];
                    }
                    field.options.push(zipObject(['title', 'value'], opts));
                });

                break;
            case 'checkbox':

                valueArr = field.inputProperties['values_list']
                    ? String(field.inputProperties['values_list']).split('||')
                    : [];

                if (!Array.isArray(this.model[field.name])) {
                    this.model[field.name] = [];
                }

                this.fieldsMultivalues[field.name] = new MultiValues([], []);
                valueArr.forEach((optStr, index) => {
                    const opts = optStr.split('==');
                    if (!opts[1]) {
                        opts[1] = opts[0];
                    }
                    field.options.push(zipObject(['title', 'value'], opts));
                    this.fieldsMultivalues[field.name].values.push(opts[1]);
                    this.fieldsMultivalues[field.name].checked.push(this.model[field.name].indexOf(opts[1]) > -1);
                });

                break;
        }
    }

    onGroupChange(e: any): void {
        // console.log('onGroupChange', e);
    }

    setValue(field: ContentField): void {
        let defaultValue = null,
            modelValue = typeof this.model[field.name] !== 'undefined' ? this.model[field.name] : null;
        if (typeof field.inputProperties.value !== 'undefined') {
            defaultValue = field.inputProperties.value;
        }

        switch (field.inputType) {
            case 'date':
                defaultValue = new Date();
                if (modelValue) {
                    modelValue = new Date(modelValue);
                }
                break;
            case 'number':
                defaultValue = defaultValue ? parseFloat(String(defaultValue)) : null;
                break;
            case 'parameters':
                if (typeof defaultValue !== 'object') {
                    defaultValue = defaultValue ? JSON.parse(defaultValue) : [];
                }
                if (!Array.isArray(defaultValue)) {
                    defaultValue = [defaultValue];
                }
                break;
            case 'tags':
            case 'checkbox':
                defaultValue = defaultValue ? defaultValue.split('||') : [];
                break;
        }
        this.model[field.name] = modelValue !== null ? modelValue : defaultValue;
    }

    selectValue(e, fieldName: string, value: string): void {
        if (!Array.isArray(this.model[fieldName])) {
            this.model[fieldName] = [];
        }
        const valIndex = this.fieldsMultivalues[fieldName].values.indexOf(value);
        if (valIndex === -1) {
            return;
        }
        if (e.target.checked) {
            this.model[fieldName].push(value);
            this.fieldsMultivalues[fieldName].checked[valIndex] = true;
        } else {
            this.model[fieldName].splice(this.model[fieldName].indexOf(value), 1);
            this.fieldsMultivalues[fieldName].checked[valIndex] = false;
        }
    }

    getValidators(field: ContentField): any[] {
        const validators = [];
        if (field.required) {
            validators.push(Validators.required);
            this.translateService.get('FIELD_REQUIRED', {name: field.title})
                .subscribe((res: string) => {
                    this.validationMessages[field.name].required = res;
                });
        }
        return validators;
    }

    extendProperties(object1: Properties, object2: Properties): void {
        object1 = Object.assign({}, object2, object1);
        for (const key in object1) {
            if (object1.hasOwnProperty(key)) {
                if (isNumeric(object1[key])) {
                    object1[key] = parseInt(String(object1[key]), 10);
                }
            }
        }
    }

    generateName(field: ContentField): void {
        const sourceFieldName = field.inputProperties.source_field
            ? String(field.inputProperties.source_field)
            : 'title';
        const title = this.model[sourceFieldName] || '';
        this.model[field.name] = this.systemNameService.generateName(title);
        this.changeDetectionRef.detectChanges();
    }

    fileChange(event, field: ContentField, imgPreview?: HTMLImageElement) {
        const fileList: FileList = event.target.files,
            fieldName = field.name;
        if (fileList.length > 0) {
            this.model[fieldName] = this.getFileData(fileList[0]);
            this.files[fieldName] = fileList[0];

            const parentEl = imgPreview.parentElement.parentElement;

            if (field.inputProperties.has_preview_image
                && fileList[0].type.indexOf('image/') > -1) {

                imgPreview.style.display = 'block';
                parentEl.querySelector('.file-buttons').classList.add('show-on-hover-child-left');

                const reader = new FileReader();
                reader.onload = (e: ProgressEvent) => {
                    const fr = e.target as FileReader;
                    this.model[fieldName].dataUrl = fr.result;
                };
                reader.readAsDataURL(fileList[0]);
            } else {
                imgPreview.style.display = 'none';
                parentEl.querySelector('.file-buttons').classList.remove('show-on-hover-child-left');
            }
        }
    }

    fileClear(fieldName: string, imgPreviewEl?: HTMLImageElement) {
        this.model[fieldName] = null;
        this.form.controls[fieldName].reset(null);
        delete this.files[fieldName];
        if (imgPreviewEl) {
            imgPreviewEl.src = '';
            imgPreviewEl.style.display = 'none';
        }
    }

    getFileData(file: File): FileData {
        const title = file.name.substr(0, file.name.lastIndexOf('.')),
            extension = file.name.substr(file.name.lastIndexOf('.') + 1),
            size = file.size;

        return new FileData(0, title, extension, size);
    }

    getImageUrl(fileData: FileData|null): string|ArrayBuffer {
        return FileData.getImageUrl(this.filesDirBaseUrl, fileData);
    }

    getCategoriesTree(): void {
        this.loadingCategories = true;
        this.categoriesService.getTree()
            .subscribe((data) => {
                this.categoriesTree = data;
                this.loadingCategories = false;
            }, (err) => {
                this.loadingCategories = false;
            });
    }

    updateTreeSelections(): void {
        this.fields.forEach((field) => {
            if (field.inputType === 'categories') {
                if (!this.categoriesSelection[field.name]) {
                    this.categoriesSelection[field.name] = [];
                }
                if (this.model[field.name] && Array.isArray(this.model[field.name])) {
                    this.model[field.name].forEach((id) => {
                        const category = this.getCategoryById(id, this.categoriesTree);
                        if (category) {
                            const parent = this.getCategoryById(category.parentId, this.categoriesTree);
                            if (parent) {
                                category.parent = parent;
                            }
                            this.categoriesSelection[field.name].push(category);
                        }
                    });
                }
            }
        });
    }

    getCategoryById(id: number, categoriesArr) {
        let output = null;
        categoriesArr.forEach((category) => {
            if (output) {
                return;
            }
            if (category.id === id) {
                output = category;
            } else if (category.children && category.children.length > 0) {
                output = this.getCategoryById(id, category.children);
            }
        });
        return output;
    }

    categorySelect(fieldName: string) {
        this.model[fieldName] = [];
        defer(() => {
            this.categoriesSelection[fieldName].forEach((category) => {
                if (this.model[fieldName].indexOf(category.id) === -1) {
                    this.model[fieldName].push(category.id);
                }
            });
        });
    }

    parametersRemove(fieldName: string, index: number): void {
        if (typeof this.model[fieldName] === 'object') {
            this.model[fieldName].splice(index, 1);
        }
    }

    parametersAdd(fieldName: string): void {
        if (!this.model[fieldName]) {
            this.model[fieldName] = [];
        }
        this.model[fieldName].push({
            name: '', value: '', price: 0, imageNum: 0
        });
    }

    /**
     * Move field
     * @param field
     * @param direction
     * @param event
     */
    fieldMove(field: ContentField, direction: string, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        if (direction === 'up' && field.name.indexOf('__') === -1) {
            return;
        }
        const fieldBaseName = ContentField.getFieldBaseName(field.name),
            baseFieldIndexData = ContentField.getFieldIndexData(this.fields, fieldBaseName),
            fieldIndexData = ContentField.getFieldIndexData(this.fields, field.name);
        if (fieldIndexData.index === -1) {
            return;
        }
        if (direction === 'up') {
            if (fieldIndexData.index - 1 === baseFieldIndexData.index) {
                return;
            }
            this.fields.splice(fieldIndexData.index, 1);
            this.fields.splice(fieldIndexData.index - 1, 0, field);
        }
        if (direction === 'down') {
            if (fieldIndexData.index - baseFieldIndexData.index === fieldIndexData.additFieldsCount) {
                return;
            }
            this.fields.splice(fieldIndexData.index, 1);
            this.fields.splice(fieldIndexData.index + 1, 0, field);
        }
    }

    /**
     * Add field
     * @param field
     * @param event
     */
    fieldAdd(field: ContentField, event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        const fieldIndexData = ContentField.getFieldIndexData(this.fields, field.name);
        if (fieldIndexData.index === -1) {
            return;
        }
        const baseFieldName = ContentField.getFieldBaseName(field.name),
            newField = cloneDeep(field);
        newField.name = `${baseFieldName}__${fieldIndexData.additFieldsCount + 1}`;

        this.fields.splice(fieldIndexData.index + 1, 0, newField);
        this.buildControls();
    }

    /**
     * Drop image from File Manager
     * @param event
     */
    onInitTextEditor(event: any): void {
        const quillEditorRef = event.editor;
        event.editor.container.ondrop = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            const value = e.dataTransfer.getData('text/plain');
            const ext = value.split('.').pop();
            if (['jpg', 'jpeg', 'png', 'gif'].indexOf(ext.toLowerCase()) === -1) {
                return;
            }
            const range = quillEditorRef.getSelection();
            quillEditorRef.insertEmbed(range.index, 'image', value, 'user');
        };
    }

    addTranslation(fieldName: string, event: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.onAddTranslation.emit(fieldName);
    }

    handleFullCalendarDateSelect(fieldName: string, selectInfo: DateSelectArg): void {
        const title = prompt('Please enter a new title for your event');
        const calendarApi = selectInfo.view.calendar;

        calendarApi.unselect();

        if (title) {
            calendarApi.addEvent({
                id: this.fullCalendarCreateId(fieldName),
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay
            });
        }
    }
    
    handleFullCalendarEventClick(fieldName: string, clickInfo: EventClickArg): void {
        if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
            clickInfo.event.remove();
            const event = clickInfo.event.toPlainObject();
            const index = this.fullCalendarEvents[fieldName].findIndex((item) => {
                return item.id === event.id;
            });
            if (index > -1) {
                this.fullCalendarEvents[fieldName].splice(index, 1);
                this.fullCalendarOptions[fieldName].initialEvents = this.fullCalendarEvents[fieldName];
                this.model[fieldName] = this.fullCalendarEvents[fieldName];
            }
        }
    }
    
    handleFullCalendarEventAdd(fieldName: string, api: EventAddArg): void {
        this.fullCalendarEvents[fieldName] = [...this.fullCalendarEvents[fieldName], api.event.toJSON()];
        this.fullCalendarOptions[fieldName].initialEvents = this.fullCalendarEvents[fieldName];
        this.model[fieldName] = this.fullCalendarEvents[fieldName];
    }
    
    handleFullCalendarEventChange(fieldName: string, api: EventChangeArg): void {
        const event = api.event.toPlainObject();
        const index = this.fullCalendarEvents[fieldName].findIndex((item) => {
            return item.id === event.id;
        });
        if (index > -1) {
            Object.assign(this.fullCalendarEvents[fieldName][index], event);
            this.fullCalendarOptions[fieldName].initialEvents = this.fullCalendarEvents[fieldName];
            this.model[fieldName] = this.fullCalendarEvents[fieldName];
        }
    }
    
    fullCalendarCreateId(fieldName: string): string {
        let lastId = 0;
        this.fullCalendarEvents[fieldName].forEach((item) => {
            if (parseInt(item.id, 10) > lastId) {
                lastId = parseInt(item.id, 10);
            }
        });
        return String(lastId + 1);
    }
}
