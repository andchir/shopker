webpackJsonp([1,4],{

/***/ 129:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__ = __webpack_require__(31);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ConfirmModalContent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ConfirmModalContent = (function () {
    function ConfirmModalContent(activeModal) {
        this.activeModal = activeModal;
    }
    ConfirmModalContent.prototype.accept = function () {
        this.activeModal.close('accept');
    };
    return ConfirmModalContent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* Input */])(),
    __metadata("design:type", Object)
], ConfirmModalContent.prototype, "modalTitle", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* Input */])(),
    __metadata("design:type", Object)
], ConfirmModalContent.prototype, "modalContent", void 0);
ConfirmModalContent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Y" /* Component */])({
        selector: 'modal_confirm',
        template: __webpack_require__(230),
        providers: []
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["b" /* NgbActiveModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["b" /* NgbActiveModal */]) === "function" && _a || Object])
], ConfirmModalContent);

var AppComponent = (function () {
    function AppComponent(tooltipConfig) {
        this.title = 'Shopkeeper';
        tooltipConfig.placement = 'bottom';
        tooltipConfig.container = 'body';
    }
    return AppComponent;
}());
AppComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Y" /* Component */])({
        selector: 'app-root',
        template: __webpack_require__(229),
        styles: [__webpack_require__(226)],
        providers: [__WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["c" /* NgbTooltipConfig */]]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["c" /* NgbTooltipConfig */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["c" /* NgbTooltipConfig */]) === "function" && _b || Object])
], AppComponent);

var _a, _b;
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 130:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__ = __webpack_require__(31);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return NgbdModalContent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CatalogComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var NgbdModalContent = (function () {
    function NgbdModalContent(activeModal) {
        this.activeModal = activeModal;
    }
    return NgbdModalContent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* Input */])(),
    __metadata("design:type", Object)
], NgbdModalContent.prototype, "name", void 0);
NgbdModalContent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Y" /* Component */])({
        selector: 'ngbd-modal-content',
        template: "\n    <div class=\"modal-header\">\n      <h4 class=\"modal-title\">Add product</h4>\n      <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"activeModal.dismiss('Cross click')\">\n        <span aria-hidden=\"true\">&times;</span>\n      </button>\n    </div>\n    <div class=\"modal-body\">\n      <p>Hello, {{name}}!</p>\n    </div>\n    <div class=\"modal-footer\">\n      <button type=\"button\" class=\"btn btn-secondary\" (click)=\"activeModal.close('Close click')\">Close</button>\n    </div>\n  "
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["b" /* NgbActiveModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["b" /* NgbActiveModal */]) === "function" && _a || Object])
], NgbdModalContent);

var CatalogComponent = (function () {
    function CatalogComponent(modalService) {
        this.modalService = modalService;
        this.title = 'Каталог';
    }
    CatalogComponent.prototype.modalOpen = function () {
        //this.modalService.open(content, {size: 'lg'});
        var modalRef = this.modalService.open(NgbdModalContent, { size: 'lg' });
        modalRef.componentInstance.name = 'World';
    };
    return CatalogComponent;
}());
CatalogComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Y" /* Component */])({
        selector: 'shk-catalog',
        template: __webpack_require__(232)
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["d" /* NgbModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["d" /* NgbModal */]) === "function" && _b || Object])
], CatalogComponent);

var _a, _b;
//# sourceMappingURL=catalog.component.js.map

/***/ }),

/***/ 131:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_content_types_service__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_content_type_model__ = __webpack_require__(171);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_component__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_lodash__ = __webpack_require__(227);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_lodash__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ContentTypeModalContent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContentTypesComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var ContentTypeModalContent = (function () {
    function ContentTypeModalContent(fb, contentTypesService, activeModal, tooltipConfig) {
        this.fb = fb;
        this.contentTypesService = contentTypesService;
        this.activeModal = activeModal;
        this.model = new __WEBPACK_IMPORTED_MODULE_4__models_content_type_model__["a" /* ContentType */]('', '', '', '', 'products', [], ['Содержание', 'Служебное']);
        this.submitted = false;
        this.fieldSubmitted = false;
        this.loading = false;
        this.action = 'add_field';
        this.currentFieldName = '';
        this.collections = ['products'];
        this.formErrors = {
            contentType: {
                name: '',
                title: '',
                new_collection: ''
            },
            field: {
                name: '',
                title: '',
                input_type: '',
                output_type: '',
                group: '',
                new_group: ''
            }
        };
        this.validationMessages = {
            contentType: {
                title: {
                    required: 'Title is required.'
                },
                name: {
                    required: 'Name is required.',
                    pattern: 'The name must contain only Latin letters.'
                },
                new_collection: {
                    pattern: 'The collection name must contain only Latin letters.',
                    exists: 'Collection with the same name already exists.'
                }
            },
            field: {
                title: {
                    required: 'Title is required.'
                },
                name: {
                    required: 'Name is required.',
                    pattern: 'The name must contain only Latin letters.'
                },
                input_type: {
                    required: 'Input type is required.'
                },
                output_type: {
                    required: 'Output type is required.'
                },
                group: {
                    required: 'Group is required.'
                },
                new_group: {
                    exists: 'Group with the same name already exists.'
                }
            }
        };
        tooltipConfig.placement = 'bottom';
        tooltipConfig.container = 'body';
    }
    /** On initialize */
    ContentTypeModalContent.prototype.ngOnInit = function () {
        this.buildForm();
        if (this.itemId) {
            this.getModelData();
        }
    };
    /** Build form groups */
    ContentTypeModalContent.prototype.buildForm = function () {
        var _this = this;
        this.contentTypeForm = this.fb.group({
            title: [this.model.title, [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["e" /* Validators */].required]],
            name: [this.model.name, [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["e" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_3__angular_forms__["e" /* Validators */].pattern('[A-Za-z0-9_-]+')]],
            description: [this.model.description, []],
            collection: [this.model.collection, [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["e" /* Validators */].required]],
            new_collection: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["e" /* Validators */].pattern('[A-Za-z0-9_-]+')]]
        });
        this.contentTypeForm.valueChanges
            .subscribe(function (data) { return _this.onValueChanged('contentType', data); });
        this.fieldForm = this.fb.group({
            title: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["e" /* Validators */].required]],
            name: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["e" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_3__angular_forms__["e" /* Validators */].pattern('[A-Za-z0-9_-]+')]],
            description: ['', []],
            input_type: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["e" /* Validators */].required]],
            output_type: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["e" /* Validators */].required]],
            group: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["e" /* Validators */].required]],
            new_group: ['', []]
        });
        this.fieldForm.valueChanges
            .subscribe(function (data) { return _this.onValueChanged('field', data); });
    };
    ContentTypeModalContent.prototype.displayToggle = function (element) {
        element.style.display = element.style.display == 'none' ? 'block' : 'none';
    };
    /**
     * On form value changed
     * @param type
     * @param data
     */
    ContentTypeModalContent.prototype.onValueChanged = function (type, data) {
        if (!this.contentTypeForm) {
            return;
        }
        var form = type == 'contentType'
            ? this.contentTypeForm
            : this.fieldForm;
        var isSubmitted = type == 'contentType'
            ? this.submitted
            : this.fieldSubmitted;
        for (var field in this.formErrors[type]) {
            this.formErrors[type][field] = '';
            var control = form.get(field);
            if (control && (control.dirty || isSubmitted) && !control.valid) {
                var messages = this.validationMessages[type][field];
                for (var key in control.errors) {
                    this.formErrors[type][field] += messages[key] + ' ';
                }
            }
        }
    };
    ContentTypeModalContent.prototype.getModelData = function () {
        var _this = this;
        this.loading = true;
        this.contentTypesService.getItem(this.itemId)
            .then(function (item) {
            if (_this.isItemCopy) {
                item.id = '';
                item.name = '';
            }
            _this.model = item;
            _this.loading = false;
        });
    };
    ContentTypeModalContent.prototype.addCollection = function () {
        var fieldName = 'new_collection';
        var control = this.contentTypeForm.get(fieldName);
        if (!control.valid) {
            return false;
        }
        this.formErrors.contentType[fieldName] = '';
        var value = control.value;
        var exists = false;
        for (var _i = 0, _a = this.collections; _i < _a.length; _i++) {
            var name = _a[_i];
            if (value == name) {
                exists = true;
                break;
            }
        }
        if (exists) {
            this.formErrors.contentType[fieldName] += this.validationMessages.contentType[fieldName].exists;
            return false;
        }
        this.collections.push(value);
        this.elementAddCollectionBlock.nativeElement.style.display = 'none';
        return true;
    };
    ContentTypeModalContent.prototype.deleteCollection = function () {
        console.log('deleteCollection');
    };
    ContentTypeModalContent.prototype.addGroup = function () {
        var fieldName = 'new_group';
        var control = this.fieldForm.get(fieldName);
        if (!control || !control.valid || !control.value) {
            return false;
        }
        this.formErrors.field[fieldName] = '';
        var value = control.value;
        var index = this.model.groups.indexOf(value);
        if (index > -1) {
            this.formErrors.field[fieldName] += this.validationMessages.field[fieldName].exists;
            return false;
        }
        this.model.groups.push(value);
        this.elementAddGroupBlock.nativeElement.style.display = 'none';
        return true;
    };
    ContentTypeModalContent.prototype.deleteGroup = function () {
        console.log('deleteGroup');
    };
    ContentTypeModalContent.prototype.editField = function (field) {
        this.fieldForm.setValue(__WEBPACK_IMPORTED_MODULE_6_lodash__["clone"](field));
        this.currentFieldName = field.name;
        this.fieldSubmitted = false;
        this.action = 'edit_field';
    };
    ContentTypeModalContent.prototype.copyField = function (field) {
        var data = __WEBPACK_IMPORTED_MODULE_6_lodash__["clone"](field);
        data.name = '';
        this.fieldForm.setValue(data);
        this.currentFieldName = '';
        this.fieldSubmitted = false;
        this.action = 'add_field';
    };
    ContentTypeModalContent.prototype.deleteField = function (field) {
        var index = __WEBPACK_IMPORTED_MODULE_6_lodash__["findIndex"](this.model.fields, { name: field.name });
        if (index == -1) {
            this.errorMessage = 'Field not found.';
            return;
        }
        this.model.fields.splice(index, 1);
    };
    ContentTypeModalContent.prototype.resetFieldForm = function () {
        this.errorMessage = '';
        this.fieldSubmitted = false;
        this.currentFieldName = '';
        this.action = 'add_field';
        this.fieldForm.reset();
    };
    ContentTypeModalContent.prototype.editFieldCancel = function () {
        this.resetFieldForm();
        this.onValueChanged('field');
    };
    ContentTypeModalContent.prototype.submitField = function () {
        this.fieldSubmitted = true;
        if (!this.fieldForm.valid) {
            this.onValueChanged('field');
            return;
        }
        var data = this.fieldForm.value;
        var index = __WEBPACK_IMPORTED_MODULE_6_lodash__["findIndex"](this.model.fields, { name: data.name });
        if (index > -1 && this.currentFieldName != data.name) {
            this.errorMessage = 'A field named "' + data.name + '" already exists.';
            return;
        }
        if (this.action == 'add_field') {
            this.model.fields.push(__WEBPACK_IMPORTED_MODULE_6_lodash__["clone"](data));
        }
        else if (this.action == 'edit_field') {
            index = __WEBPACK_IMPORTED_MODULE_6_lodash__["findIndex"](this.model.fields, { name: this.currentFieldName });
            if (index > -1) {
                this.model.fields[index] = __WEBPACK_IMPORTED_MODULE_6_lodash__["clone"](data);
            }
        }
        this.resetFieldForm();
    };
    ContentTypeModalContent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = true;
        if (!this.contentTypeForm.valid) {
            this.onValueChanged('contentType');
            return;
        }
        if (this.model.fields.length == 0) {
            this.errorMessage = 'You have not created any fields.';
            return;
        }
        if (this.model.id) {
            this.contentTypesService.editItem(this.model.id, this.model)
                .then(function (res) {
                if (res.success) {
                    _this.closeModal();
                }
                else {
                    if (res.msg) {
                        _this.errorMessage = res.msg;
                    }
                }
            });
        }
        else {
            this.contentTypesService.createItem(this.model)
                .then(function (res) {
                if (res.success) {
                    _this.closeModal();
                }
                else {
                    if (res.msg) {
                        _this.errorMessage = res.msg;
                    }
                }
            });
        }
    };
    ContentTypeModalContent.prototype.closeModal = function () {
        this.activeModal.close();
    };
    return ContentTypeModalContent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* Input */])(),
    __metadata("design:type", Object)
], ContentTypeModalContent.prototype, "modalTitle", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* Input */])(),
    __metadata("design:type", Object)
], ContentTypeModalContent.prototype, "itemId", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* Input */])(),
    __metadata("design:type", Object)
], ContentTypeModalContent.prototype, "isItemCopy", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_9" /* ViewChild */])('addCollectionBlock'),
    __metadata("design:type", Object)
], ContentTypeModalContent.prototype, "elementAddCollectionBlock", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_9" /* ViewChild */])('addGroupBlock'),
    __metadata("design:type", Object)
], ContentTypeModalContent.prototype, "elementAddGroupBlock", void 0);
ContentTypeModalContent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Y" /* Component */])({
        selector: 'content-type-modal-content',
        template: __webpack_require__(231),
        providers: [__WEBPACK_IMPORTED_MODULE_2__services_content_types_service__["a" /* ContentTypesService */], __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["c" /* NgbTooltipConfig */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* FormBuilder */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* FormBuilder */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__services_content_types_service__["a" /* ContentTypesService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_content_types_service__["a" /* ContentTypesService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["b" /* NgbActiveModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["b" /* NgbActiveModal */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["c" /* NgbTooltipConfig */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["c" /* NgbTooltipConfig */]) === "function" && _d || Object])
], ContentTypeModalContent);

var ContentTypesComponent = (function () {
    function ContentTypesComponent(contentTypesService, modalService) {
        this.contentTypesService = contentTypesService;
        this.modalService = modalService;
        this.items = [];
        this.title = 'Типы товаров';
        this.loading = false;
    }
    ContentTypesComponent.prototype.ngOnInit = function () { this.getList(); };
    ContentTypesComponent.prototype.getList = function () {
        var _this = this;
        this.loading = true;
        this.contentTypesService.getList()
            .then(function (items) {
            _this.items = items;
            _this.loading = false;
        }, function (error) { return _this.errorMessage = error; });
    };
    ContentTypesComponent.prototype.modalOpen = function (itemId, isItemCopy) {
        var _this = this;
        this.modalRef = this.modalService.open(ContentTypeModalContent, { size: 'lg' });
        this.modalRef.componentInstance.modalTitle = itemId && !isItemCopy
            ? 'Edit content type'
            : 'Add content type';
        this.modalRef.componentInstance.itemId = itemId || 0;
        this.modalRef.componentInstance.isItemCopy = isItemCopy || false;
        this.modalRef.result.then(function (result) {
            _this.getList();
        }, function (reason) {
            //console.log( 'reason', reason );
        });
    };
    ContentTypesComponent.prototype.modalClose = function () {
        this.modalRef.close();
    };
    ContentTypesComponent.prototype.deleteItemConfirm = function (itemId) {
        var _this = this;
        this.modalRef = this.modalService.open(__WEBPACK_IMPORTED_MODULE_5__app_component__["b" /* ConfirmModalContent */]);
        this.modalRef.componentInstance.modalTitle = 'Confirm';
        this.modalRef.componentInstance.modalContent = 'Are you sure you want to remove this item?';
        this.modalRef.result.then(function (result) {
            if (result == 'accept') {
                _this.deleteItem(itemId);
            }
        }, function (reason) {
            //console.log( 'reason', reason );
        });
    };
    ContentTypesComponent.prototype.deleteItem = function (itemId) {
        var _this = this;
        this.contentTypesService.deleteItem(itemId)
            .then(function (res) {
            if (res.success) {
                _this.getList();
            }
            else {
                if (res.msg) {
                    //this.errorMessage = res.msg;
                }
            }
        });
    };
    return ContentTypesComponent;
}());
ContentTypesComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Y" /* Component */])({
        selector: 'shk-content-types',
        template: __webpack_require__(233)
    }),
    __metadata("design:paramtypes", [typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_2__services_content_types_service__["a" /* ContentTypesService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_content_types_service__["a" /* ContentTypesService */]) === "function" && _e || Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["d" /* NgbModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["d" /* NgbModal */]) === "function" && _f || Object])
], ContentTypesComponent);

var _a, _b, _c, _d, _e, _f;
//# sourceMappingURL=content_types.component.js.map

/***/ }),

/***/ 132:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrdersComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var OrdersComponent = (function () {
    function OrdersComponent() {
        this.title = 'Заказы';
    }
    return OrdersComponent;
}());
OrdersComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Y" /* Component */])({
        selector: 'shk-orders',
        template: __webpack_require__(234)
    })
], OrdersComponent);

//# sourceMappingURL=orders.component.js.map

/***/ }),

/***/ 133:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise__ = __webpack_require__(241);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContentTypesService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ContentTypesService = (function () {
    function ContentTypesService(http) {
        this.http = http;
        this.headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json' });
        this.listUrl = 'app/content_type_list';
        this.oneUrl = 'app/content_type';
    }
    ContentTypesService.prototype.getList = function () {
        return this.http.get(this.listUrl)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    ContentTypesService.prototype.getItem = function (id) {
        var url = this.oneUrl + "/" + id;
        return this.http.get(url)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .catch(this.handleError);
    };
    ContentTypesService.prototype.createItem = function (item) {
        return this.http
            .post(this.oneUrl, JSON.stringify(item), { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    ContentTypesService.prototype.editItem = function (id, item) {
        var url = this.oneUrl + "/" + id;
        return this.http
            .put(url, JSON.stringify(item), { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    ContentTypesService.prototype.deleteItem = function (id) {
        var url = this.oneUrl + "/" + id;
        return this.http.delete(url, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    ContentTypesService.prototype.extractData = function (res) {
        var body = res.json();
        return body.data || {};
    };
    ContentTypesService.prototype.handleError = function (error) {
        var errMsg;
        if (error instanceof __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Response */]) {
            var body = error.json() || '';
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Promise.reject(errMsg);
    };
    return ContentTypesService;
}());
ContentTypesService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */]) === "function" && _a || Object])
], ContentTypesService);

var _a;
//# sourceMappingURL=content_types.service.js.map

/***/ }),

/***/ 134:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SettingsComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var SettingsComponent = (function () {
    function SettingsComponent() {
        this.title = 'Настройки';
    }
    return SettingsComponent;
}());
SettingsComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Y" /* Component */])({
        selector: 'shk-settings',
        template: __webpack_require__(235)
    })
], SettingsComponent);

//# sourceMappingURL=settings.component.js.map

/***/ }),

/***/ 135:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StatisticsComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var StatisticsComponent = (function () {
    function StatisticsComponent() {
        this.title = 'Статистика';
    }
    return StatisticsComponent;
}());
StatisticsComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Y" /* Component */])({
        selector: 'shk-statistics',
        template: __webpack_require__(236)
    })
], StatisticsComponent);

//# sourceMappingURL=stat.component.js.map

/***/ }),

/***/ 159:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 159;


/***/ }),

/***/ 160:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(164);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__(170);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(172);




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 169:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(165);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__orders_component__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__catalog_component__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__content_types_component__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__stat_component__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__settings_component__ = __webpack_require__(134);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppRoutingModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var routes = [
    { path: '', redirectTo: '/orders', pathMatch: 'full' },
    { path: 'orders', component: __WEBPACK_IMPORTED_MODULE_2__orders_component__["a" /* OrdersComponent */] },
    { path: 'catalog', component: __WEBPACK_IMPORTED_MODULE_3__catalog_component__["a" /* CatalogComponent */] },
    { path: 'catalog/content_types', component: __WEBPACK_IMPORTED_MODULE_4__content_types_component__["a" /* ContentTypesComponent */] },
    { path: 'statistics', component: __WEBPACK_IMPORTED_MODULE_5__stat_component__["a" /* StatisticsComponent */] },
    { path: 'settings', component: __WEBPACK_IMPORTED_MODULE_6__settings_component__["a" /* SettingsComponent */] }
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    return AppRoutingModule;
}());
AppRoutingModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["b" /* NgModule */])({
        imports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* RouterModule */].forRoot(routes, { useHash: true })],
        exports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* RouterModule */]]
    })
], AppRoutingModule);

//# sourceMappingURL=app-routing.module.js.map

/***/ }),

/***/ 170:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__orders_component__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__catalog_component__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__content_types_component__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__stat_component__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__settings_component__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__services_content_types_service__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__app_routing_module__ = __webpack_require__(169);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ng_bootstrap_ng_bootstrap__ = __webpack_require__(31);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};













//enableProdMode();
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["b" /* ReactiveFormsModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_11__app_routing_module__["a" /* AppRoutingModule */],
            __WEBPACK_IMPORTED_MODULE_12__ng_bootstrap_ng_bootstrap__["a" /* NgbModule */].forRoot()
        ],
        declarations: [
            __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */],
            __WEBPACK_IMPORTED_MODULE_5__orders_component__["a" /* OrdersComponent */],
            __WEBPACK_IMPORTED_MODULE_6__catalog_component__["a" /* CatalogComponent */],
            __WEBPACK_IMPORTED_MODULE_7__content_types_component__["a" /* ContentTypesComponent */],
            __WEBPACK_IMPORTED_MODULE_8__stat_component__["a" /* StatisticsComponent */],
            __WEBPACK_IMPORTED_MODULE_9__settings_component__["a" /* SettingsComponent */],
            __WEBPACK_IMPORTED_MODULE_6__catalog_component__["b" /* NgbdModalContent */],
            __WEBPACK_IMPORTED_MODULE_7__content_types_component__["b" /* ContentTypeModalContent */],
            __WEBPACK_IMPORTED_MODULE_4__app_component__["b" /* ConfirmModalContent */]
        ],
        providers: [__WEBPACK_IMPORTED_MODULE_10__services_content_types_service__["a" /* ContentTypesService */]],
        entryComponents: [__WEBPACK_IMPORTED_MODULE_6__catalog_component__["b" /* NgbdModalContent */], __WEBPACK_IMPORTED_MODULE_7__content_types_component__["b" /* ContentTypeModalContent */], __WEBPACK_IMPORTED_MODULE_4__app_component__["b" /* ConfirmModalContent */]],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 171:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContentType; });
var ContentType = (function () {
    function ContentType(id, name, title, description, collection, fields, groups) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.description = description;
        this.collection = collection;
        this.fields = fields;
        this.groups = groups;
    }
    return ContentType;
}());

//# sourceMappingURL=content_type.model.js.map

/***/ }),

/***/ 172:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// The file contents for the current environment will overwrite these during build.
var environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ 226:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(73)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 229:
/***/ (function(module, exports) {

module.exports = "<div>\n\n    <div class=\"card-navbar\">\n        <div class=\"btn-group\" role=\"group\" aria-label=\"First group\">\n            <a class=\"btn btn-outline-primary\" [routerLink]=\"['/orders']\" routerLinkActive=\"active\">\n                <i class=\"icon-bag\"></i>\n                <span class=\"hidden-xs-down\">\n                    Заказы\n                </span>\n            </a>\n            <a class=\"btn btn-outline-primary\" [routerLink]=\"['/statistics']\" routerLinkActive=\"active\">\n                <i class=\"icon-bar-graph-2\"></i>\n                <span class=\"hidden-xs-down\">\n                    Статистика\n                </span>\n            </a>\n            <a class=\"btn btn-outline-primary\" [routerLink]=\"['/catalog']\" routerLinkActive=\"active\">\n                <i class=\"icon-layers\"></i>\n                <span class=\"hidden-xs-down\">\n                    Каталог\n                </span>\n            </a>\n            <a class=\"btn btn-outline-primary\" [routerLink]=\"['/settings']\" routerLinkActive=\"active\">\n                <i class=\"icon-cog\"></i>\n                <span class=\"hidden-xs-down\">\n                    Настройки\n                </span>\n            </a>\n        </div>\n    </div>\n\n    <router-outlet></router-outlet>\n\n</div>"

/***/ }),

/***/ 230:
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-block\">\n    <h4 class=\"modal-title\">{{modalTitle}}</h4>\n</div>\n<div class=\"modal-body\">\n    {{modalContent}}\n</div>\n<div class=\"modal-footer d-block\">\n    <button type=\"button\" class=\"btn btn-success btn-wide\" (click)=\"accept()\">\n        Yes\n    </button>\n    <button type=\"button\" class=\"btn btn-secondary btn-wide\" (click)=\"activeModal.close()\">\n        No\n    </button>\n</div>"

/***/ }),

/***/ 231:
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-block\">\n    <div class=\"d-block float-right\">\n        <button type=\"button\" class=\"btn btn-secondary\" (click)=\"activeModal.dismiss()\">\n            Close\n        </button>\n    </div>\n    <h4 class=\"modal-title\">{{modalTitle}}</h4>\n</div>\n\n<form (ngSubmit)=\"onSubmit()\" [class.loading]=\"loading\">\n\n    <div class=\"modal-body\">\n\n        <div class=\"row\">\n\n            <!-- ContentType form -->\n            <div class=\"col-lg-4\" [formGroup]=\"contentTypeForm\">\n\n                <div class=\"form-group\" [class.form-group-message]=\"formErrors.contentType.title\">\n                    <label class=\"label-filled\">\n                        Название\n                    </label>\n                    <input type=\"text\" class=\"form-control\" name=\"title\" formControlName=\"title\" [(ngModel)]=\"model.title\">\n                    <div *ngIf=\"formErrors.contentType.title\" class=\"alert alert-danger\">\n                        {{formErrors.contentType.title}}\n                    </div>\n                </div>\n\n                <div class=\"form-group\" [class.form-group-message]=\"formErrors.contentType.name\">\n                    <label class=\"label-filled\">\n                        Системное имя\n                    </label>\n                    <input type=\"text\" class=\"form-control\" name=\"name\" formControlName=\"name\" [(ngModel)]=\"model.name\">\n                    <div *ngIf=\"formErrors.contentType.name\" class=\"alert alert-danger\">\n                        {{formErrors.contentType.name}}\n                    </div>\n                </div>\n\n                <div class=\"form-group\">\n                    <label class=\"label-filled\">\n                        Описание\n                    </label>\n                    <textarea type=\"text\" class=\"form-control\" name=\"description\" formControlName=\"description\" [(ngModel)]=\"model.description\"></textarea>\n                </div>\n\n                <div class=\"form-group row\">\n                    <div class=\"col-12\">\n\n                        <div class=\"form-group\">\n                            <label class=\"label-filled\">Коллекция</label>\n                            <div class=\"input-group\">\n                                <select class=\"form-control\" name=\"collection\" formControlName=\"collection\" [(ngModel)]=\"model.collection\">\n                                    <option value=\"{{collection}}\" *ngFor=\"let collection of collections\">{{collection}}</option>\n                                </select>\n                                <div class=\"input-group-btn\">\n                                    <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Add collection\" (click)=\"displayToggle(addCollectionBlock); addCollectionField.value = ''; onValueChanged(); addCollectionField.focus()\">\n                                        <i class=\"icon-plus\"></i>\n                                    </button>\n                                </div>\n                                <div class=\"input-group-btn\">\n                                    <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Delete collection\" (click)=\"deleteCollection()\">\n                                        <i class=\"icon-cross\"></i>\n                                    </button>\n                                </div>\n                            </div>\n\n                            <div class=\"card p-1 mt-2\" #addCollectionBlock style=\"display: none;\" [class.form-group-message]=\"formErrors.contentType.new_collection\">\n                                <input type=\"text\" class=\"form-control form-control-sm\" formControlName=\"new_collection\" #addCollectionField>\n                                <div *ngIf=\"formErrors.contentType.new_collection\" class=\"alert alert-danger mb-1\">\n                                    {{formErrors.contentType.new_collection}}\n                                </div>\n\n                                <div class=\"text-right mt-1\">\n                                    <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"addCollection();\">\n                                        Add\n                                    </button>\n                                    <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"addCollectionBlock.style.display = 'none'; formErrors.contentType.new_collection = ''\">\n                                        Cancel\n                                    </button>\n                                </div>\n                            </div>\n                        </div>\n\n                    </div>\n                </div>\n\n            </div>\n            <!-- /ContentType form -->\n\n            <!-- Field form -->\n            <div class=\"col-lg-8\" [formGroup]=\"fieldForm\">\n\n                <label class=\"label-filled\" [hidden]=\"action != 'add_field'\">\n                    Добавить поле\n                </label>\n                <label class=\"label-filled\" [hidden]=\"action != 'edit_field'\">\n                    Редактировать поле\n                </label>\n\n                <div class=\"card\">\n                    <div class=\"card-block\">\n\n                        <div class=\"form-group row\" [class.form-group-message]=\"formErrors.field.title\">\n                            <div class=\"col-md-5\">\n                                <label class=\"small\">Название</label>\n                            </div>\n                            <div class=\"col-md-7\">\n                                <input type=\"text\" class=\"form-control form-control-sm\" name=\"field_title\" formControlName=\"title\">\n                                <div *ngIf=\"formErrors.field.title\" class=\"alert alert-danger\">\n                                    {{formErrors.field.title}}\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row\" [class.form-group-message]=\"formErrors.field.name\">\n                            <div class=\"col-md-5\">\n                                <label class=\"small\">Системное имя</label>\n                            </div>\n                            <div class=\"col-md-7\">\n                                <input type=\"text\" class=\"form-control form-control-sm\" name=\"field_name\" formControlName=\"name\">\n                                <div *ngIf=\"formErrors.field.name\" class=\"alert alert-danger\">\n                                    {{formErrors.field.name}}\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row\">\n                            <div class=\"col-md-5\">\n                                <label class=\"small\">Описание</label>\n                            </div>\n                            <div class=\"col-md-7\">\n                                <textarea type=\"text\" class=\"form-control form-control-sm\" name=\"field_description\" formControlName=\"description\"></textarea>\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row\" [class.form-group-message]=\"formErrors.field.input_type\">\n                            <div class=\"col-md-5\">\n                                <label class=\"small\">Тип ввода</label>\n                            </div>\n                            <div class=\"col-md-7\">\n\n                                <div class=\"input-group\">\n                                    <select class=\"form-control form-control-sm\" name=\"field_input_type\" formControlName=\"input_type\">\n                                        <option value=\"text\">Текстовое поле</option>\n                                        <option value=\"textarea\">Многострочный текст</option>\n                                        <option value=\"number\">Число</option>\n                                        <option value=\"select\">Выпадающий список</option>\n                                        <option value=\"checkbox\">Чекбокс</option>\n                                        <option value=\"radio\">Переключатель</option>\n                                        <option value=\"table\">Таблица</option>\n                                        <option value=\"file\">Файл</option>\n                                        <option value=\"image\">Картинка</option>\n                                    </select>\n                                    <div class=\"input-group-btn\">\n                                        <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Options\" (click)=\"displayToggle(inputTypeOptionsBlock)\">\n                                            <i class=\"icon-cog\"></i>\n                                        </button>\n                                    </div>\n                                </div>\n                                <div *ngIf=\"formErrors.field.input_type\" class=\"alert alert-danger\">\n                                    {{formErrors.field.input_type}}\n                                </div>\n\n                            </div>\n                        </div>\n\n                        <div class=\"card card-block mb-3\" #inputTypeOptionsBlock style=\"display: none;\">\n                            <div>\n                                Тут будут параметры\n                            </div>\n                            <div class=\"text-right mt-1\">\n                                <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"inputTypeOptionsBlock.style.display = 'none';\">\n                                    Close\n                                </button>\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row\" [class.form-group-message]=\"formErrors.field.output_type\">\n                            <div class=\"col-md-5\">\n                                <label class=\"small\">Тип вывода</label>\n                            </div>\n                            <div class=\"col-md-7\">\n\n                                <div class=\"input-group\">\n                                    <select class=\"form-control form-control-sm\" name=\"field_output_type\" formControlName=\"output_type\">\n                                        <option value=\"text\">Текст</option>\n                                        <option value=\"select\">Выпадающий список</option>\n                                        <option value=\"checkbox\">Чекбокс</option>\n                                        <option value=\"radio\">Переключатель</option>\n                                        <option value=\"tanle\">Таблица</option>\n                                        <option value=\"image\">Картинка</option>\n                                    </select>\n                                    <div class=\"input-group-btn\">\n                                        <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Options\" (click)=\"displayToggle(outputTypeOptionsBlock)\">\n                                            <i class=\"icon-cog\"></i>\n                                        </button>\n                                    </div>\n                                </div>\n                                <div *ngIf=\"formErrors.field.output_type\" class=\"alert alert-danger\">\n                                    {{formErrors.field.output_type}}\n                                </div>\n\n                            </div>\n                        </div>\n\n                        <div class=\"card card-block mb-3\" #outputTypeOptionsBlock style=\"display: none;\">\n                            <div>\n                                Тут будут параметры\n                            </div>\n                            <div class=\"text-right mt-1\">\n                                <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"outputTypeOptionsBlock.style.display = 'none'\">\n                                    Close\n                                </button>\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row\">\n                            <div class=\"col-md-5\">\n                                <label class=\"small\">Группа</label>\n                            </div>\n                            <div class=\"col-md-7\">\n\n                                <div class=\"form-group\" [class.form-group-message]=\"formErrors.field.group\">\n                                    <div class=\"input-group input-group-sm\">\n                                        <select class=\"form-control\" name=\"field_group\" formControlName=\"group\">\n                                            <option value=\"{{group}}\" *ngFor=\"let group of model.groups\">{{group}}</option>\n                                        </select>\n                                        <div class=\"input-group-btn\">\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Add group\" (click)=\"displayToggle(addGroupBlock); addGroupField.value = ''; addGroupField.focus()\">\n                                                <i class=\"icon-plus\"></i>\n                                            </button>\n                                        </div>\n                                        <div class=\"input-group-btn\">\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Delete group\" (click)=\"deleteGroup()\">\n                                                <i class=\"icon-cross\"></i>\n                                            </button>\n                                        </div>\n                                    </div>\n                                    <div *ngIf=\"formErrors.field.group\" class=\"alert alert-danger\">\n                                        {{formErrors.field.group}}\n                                    </div>\n\n                                    <div class=\"card p-1 mt-2\" #addGroupBlock style=\"display: none;\" [class.form-group-message]=\"formErrors.field.new_group\">\n                                        <input type=\"text\" class=\"form-control form-control-sm\" #addGroupField formControlName=\"new_group\">\n                                        <div *ngIf=\"formErrors.field.new_group\" class=\"alert alert-danger mb-1\">\n                                            {{formErrors.field.new_group}}\n                                        </div>\n                                        <div class=\"text-right mt-1\">\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"addGroup();\">\n                                                Add\n                                            </button>\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"addGroupBlock.style.display = 'none'; formErrors.field.new_group = ''\">\n                                                Cancel\n                                            </button>\n                                        </div>\n                                    </div>\n                                </div>\n\n                            </div>\n                        </div>\n\n                        <div>\n                            <button type=\"button\" class=\"btn btn-sm btn-info btn-wide\" (click)=\"submitField()\" [hidden]=\"action != 'add_field'\">\n                                <i class=\"icon-plus\"></i>\n                                Add field\n                            </button>\n                            <button type=\"button\" class=\"btn btn-sm btn-success btn-wide\" (click)=\"submitField()\" [hidden]=\"action != 'edit_field'\">\n                                <i class=\"icon-check\"></i>\n                                Save field\n                            </button>\n                            <button type=\"button\" class=\"btn btn-sm btn-secondary btn-wide\" (click)=\"editFieldCancel()\">\n                                Cancel\n                            </button>\n                        </div>\n\n                    </div>\n                </div>\n                <!-- /Field form -->\n\n            </div>\n        </div>\n\n        <div class=\"form-group row mt-3\">\n            <div class=\"col-12\">\n                <label class=\"label-filled\">\n                    Поля\n                </label>\n\n                <table class=\"table table-striped table-hover table-bordered mb-0\">\n                    <thead>\n                        <tr>\n                            <th>Название</th>\n                            <th>Системное имя</th>\n                            <th>Тип ввода</th>\n                            <th>Группа</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr class=\"show-on-hover-parent\" *ngFor=\"let item of model.fields\">\n                            <td>\n                                {{item.title}}\n                            </td>\n                            <td>\n                                {{item.name}}\n                            </td>\n                            <td>\n                                {{item.input_type}}\n                            </td>\n                            <td>\n                                <div class=\"relative\">\n                                    <div class=\"show-on-hover\">\n                                        <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"editField(item)\" ngbTooltip=\"Edit\">\n                                            <i class=\"icon-pencil\"></i>\n                                        </button>\n                                        <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"copyField(item)\" ngbTooltip=\"Copy\">\n                                            <i class=\"icon-stack\"></i>\n                                        </button>\n                                        <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"deleteField(item)\" ngbTooltip=\"Delete\">\n                                            <i class=\"icon-cross\"></i>\n                                        </button>\n                                    </div>\n                                </div>\n                                {{item.group}}\n                            </td>\n                        </tr>\n                        <tr [hidden]=\"model.fields.length > 0\" class=\"table-warning\">\n                            <td colspan=\"4\" class=\"text-center\">\n                                Empty\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>\n\n                <div class=\"alert alert-danger mt-3 mb-0\" [hidden]=\"!errorMessage\">\n                    <button type=\"button\" class=\"close\" (click)=\"errorMessage = ''\">\n                        <span aria-hidden=\"true\">&times;</span>\n                    </button>\n                    {{errorMessage}}\n                </div>\n\n            </div>\n        </div>\n\n    </div>\n    <div class=\"modal-footer d-block\">\n        <button type=\"submit\" class=\"btn btn-success btn-wide\">\n            Save\n        </button>\n        <button type=\"submit\" class=\"btn btn-secondary btn-wide\" (click)=\"activeModal.dismiss()\">\n            Cancel\n        </button>\n    </div>\n\n</form>"

/***/ }),

/***/ 232:
/***/ (function(module, exports) {

module.exports = "\n<div class=\"card\">\n\n    <div class=\"card-block\">\n\n        <div class=\"float-right\">\n            <a class=\"btn btn-primary\" [routerLink]=\"['/catalog/content_types']\">\n                <i class=\"icon-box\"></i>\n                Типы товаров\n            </a>\n        </div>\n        <h3>\n            <i class=\"icon-layers\"></i>\n            {{title}}\n        </h3>\n\n        <hr>\n\n        <div class=\"float-right\">\n            <button type=\"button\" class=\"btn btn-outline-success d-inline-block btn-wide\" (click)=\"modalOpen()\">\n                <i class=\"icon-plus\"></i>\n                Add\n            </button>\n        </div>\n        <div class=\"float-left\">\n            <select name=\"category\" class=\"form-control\">\n                <option value=\"1\">First</option>\n                <option value=\"2\">Second</option>\n            </select>\n        </div>\n    </div>\n\n    <div class=\"table-responsive\">\n        <table class=\"table table-hover mb-0\">\n            <thead>\n            <tr>\n                <th>\n                    <label class=\"custom-control custom-checkbox\">\n                        <input type=\"checkbox\" class=\"custom-control-input\">\n                        <span class=\"custom-control-indicator\"></span>\n                    </label>\n                </th>\n                <th>ID</th>\n                <th>Название</th>\n                <th>Цена</th>\n                <th>Статус</th>\n            </tr>\n            </thead>\n            <tbody>\n            <tr class=\"show-on-hover-parent\">\n                <td>\n                    <label class=\"custom-control custom-checkbox\">\n                        <input type=\"checkbox\" class=\"custom-control-input\">\n                        <span class=\"custom-control-indicator\"></span>\n                    </label>\n                </td>\n                <th>1</th>\n                <td>\n                    Первый\n                </td>\n                <td>\n                    2 200\n                </td>\n                <td>\n                    <div class=\"relative\">\n                        <div class=\"show-on-hover\">\n                            <button class=\"btn btn-secondary btn-sm\">\n                                <i class=\"icon-pencil\"></i>\n                            </button>\n                            <button class=\"btn btn-secondary btn-sm\">\n                                <i class=\"icon-cross\"></i>\n                            </button>\n                        </div>\n                    </div>\n                    Опуликован\n                </td>\n            </tr>\n            <tr class=\"show-on-hover-parent\">\n                <td>\n                    <label class=\"custom-control custom-checkbox\">\n                        <input type=\"checkbox\" class=\"custom-control-input\">\n                        <span class=\"custom-control-indicator\"></span>\n                    </label>\n                </td>\n                <th>1</th>\n                <td>\n                    Первый\n                </td>\n                <td>\n                    2 200\n                </td>\n                <td>\n                    <div class=\"relative\">\n                        <div class=\"show-on-hover\">\n                            <button class=\"btn btn-secondary btn-sm\">\n                                <i class=\"icon-pencil\"></i>\n                            </button>\n                            <button class=\"btn btn-secondary btn-sm\">\n                                <i class=\"icon-cross\"></i>\n                            </button>\n                        </div>\n                    </div>\n                    Опуликован\n                </td>\n            </tr>\n            <tr class=\"show-on-hover-parent\">\n                <td>\n                    <label class=\"custom-control custom-checkbox\">\n                        <input type=\"checkbox\" class=\"custom-control-input\">\n                        <span class=\"custom-control-indicator\"></span>\n                    </label>\n                </td>\n                <th>1</th>\n                <td>\n                    Первый\n                </td>\n                <td>\n                    2 200\n                </td>\n                <td>\n                    <div class=\"relative\">\n                        <div class=\"show-on-hover\">\n                            <button class=\"btn btn-secondary btn-sm\">\n                                <i class=\"icon-pencil\"></i>\n                            </button>\n                            <button class=\"btn btn-secondary btn-sm\">\n                                <i class=\"icon-cross\"></i>\n                            </button>\n                        </div>\n                    </div>\n                    Опуликован\n                </td>\n            </tr>\n            </tbody>\n        </table>\n    </div>\n\n    <div class=\"card-footer\">\n\n        <div class=\"float-right\">\n            <select class=\"form-control\">\n                <option value=\"10\">10</option>\n                <option value=\"50\">50</option>\n                <option value=\"100\">100</option>\n            </select>\n        </div>\n\n        <ngb-pagination [class]=\"'mb-0'\" [collectionSize]=\"120\" [page]=\"1\" [maxSize]=\"8\" [rotate]=\"true\" [boundaryLinks]=\"false\"></ngb-pagination>\n\n    </div>\n</div>\n"

/***/ }),

/***/ 233:
/***/ (function(module, exports) {

module.exports = "\n<div class=\"card\">\n    <div class=\"card-block\">\n\n        <h3>\n            <i class=\"icon-box\"></i>\n            {{title}}\n        </h3>\n\n        <hr>\n\n        <div class=\"float-right\">\n\n            <div ngbDropdown class=\"d-inline-block\">\n                <button class=\"btn btn-outline-primary\" id=\"dropdownBasic1\" ngbDropdownToggle>\n                    Массовые дейсвия\n                </button>\n                <div class=\"dropdown-menu\" aria-labelledby=\"dropdownBasic1\">\n                    <button class=\"dropdown-item\">Отключить</button>\n                    <button class=\"dropdown-item\">Удалить</button>\n                </div>\n            </div>\n\n            <button type=\"button\" class=\"btn btn-outline-success d-inline-block btn-wide\" (click)=\"modalOpen()\">\n                <i class=\"icon-plus\"></i>\n                Add\n            </button>\n        </div>\n        <div class=\"float-left\">\n            <a class=\"btn btn-secondary\" [routerLink]=\"['/catalog']\">\n                <i class=\"icon-arrow-left\"></i>\n                Каталог\n            </a>\n        </div>\n    </div>\n\n    <div [class.loading]=\"loading\">\n        <table class=\"table table-striped table-hover mb-0\">\n            <thead>\n                <tr>\n                    <th>\n                        <label class=\"custom-control custom-checkbox\">\n                            <input type=\"checkbox\" class=\"custom-control-input\">\n                            <span class=\"custom-control-indicator\"></span>\n                        </label>\n                    </th>\n                    <th>Название</th>\n                    <th>Системное имя</th>\n                    <th>Коллекция</th>\n                    <th>Описание</th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr class=\"show-on-hover-parent\" *ngFor=\"let item of items\">\n                    <td>\n                        <label class=\"custom-control custom-checkbox\">\n                            <input type=\"checkbox\" class=\"custom-control-input\">\n                            <span class=\"custom-control-indicator\"></span>\n                        </label>\n                    </td>\n                    <td>\n                        {{item.title}}\n                    </td>\n                    <td>\n                        {{item.name}}\n                    </td>\n                    <td>\n                        {{item.collection}}\n                    </td>\n                    <td>\n                        <div class=\"relative\">\n\n                            <div class=\"show-on-hover\">\n                                <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"modalOpen(item.id)\" ngbTooltip=\"Edit\">\n                                    <i class=\"icon-pencil\"></i>\n                                </button>\n                                <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"modalOpen(item.id, true)\" ngbTooltip=\"Copy\">\n                                    <i class=\"icon-stack\"></i>\n                                </button>\n                                <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"deleteItemConfirm(item.id)\" ngbTooltip=\"Delete\">\n                                    <i class=\"icon-cross\"></i>\n                                </button>\n                            </div>\n                        </div>\n                        <div class=\"small\">{{item.description}}</div>\n                    </td>\n                </tr>\n                <tr [hidden]=\"items.length > 0\" class=\"table-warning\">\n                    <td colspan=\"4\" class=\"text-center\">\n                        Empty\n                    </td>\n                </tr>\n            </tbody>\n        </table>\n    </div>\n\n    <div class=\"card-footer\">\n\n        <div class=\"float-right\">\n            <select class=\"form-control\">\n                <option value=\"10\">10</option>\n                <option value=\"50\">50</option>\n                <option value=\"100\">100</option>\n            </select>\n        </div>\n\n        <ngb-pagination [class]=\"'mb-0'\" [collectionSize]=\"120\" [page]=\"1\" [maxSize]=\"8\" [rotate]=\"true\" [boundaryLinks]=\"false\"></ngb-pagination>\n\n    </div>\n</div>\n"

/***/ }),

/***/ 234:
/***/ (function(module, exports) {

module.exports = "\n<div class=\"card\">\n\n    <div class=\"card-block\">\n\n        <h3>\n            <i class=\"icon-bag\"></i>\n            {{title}}\n        </h3>\n\n        <hr>\n\n        <div class=\"float-right\">\n\n            <div ngbDropdown class=\"d-inline-block\">\n                <button class=\"btn btn-outline-primary\" id=\"dropdownBasic1\" ngbDropdownToggle>\n                    Массовые дейсвия\n                </button>\n                <div class=\"dropdown-menu\" aria-labelledby=\"dropdownBasic1\">\n                    <button class=\"dropdown-item\">Изменить статус</button>\n                    <button class=\"dropdown-item\">Удалить</button>\n                </div>\n            </div>\n\n        </div>\n        <div class=\"float-left\">\n\n            <div class=\"input-group\">\n                <input class=\"form-control\" placeholder=\"yyyy-mm-dd\"\n                       name=\"dp\" [(ngModel)]=\"model\" ngbDatepicker #d=\"ngbDatepicker\">\n                <div class=\"input-group-addon\" (click)=\"d.toggle()\">\n                    <i class=\"icon-grid\"></i>\n                </div>\n            </div>\n\n        </div>\n\n    </div>\n\n    <div class=\"table-responsive\">\n        <table class=\"table table-striped table-hover mb-0\">\n            <thead>\n            <tr>\n                <th>\n                    <label class=\"custom-control custom-checkbox\">\n                        <input type=\"checkbox\" class=\"custom-control-input\">\n                        <span class=\"custom-control-indicator\"></span>\n                    </label>\n                </th>\n                <th>ID</th>\n                <th>Статус</th>\n                <th>Время</th>\n                <th>Кол-во товаров</th>\n                <th>Общая цена</th>\n                <th>Пользователь</th>\n            </tr>\n            </thead>\n            <tbody>\n                <tr class=\"show-on-hover-parent\">\n                    <td>\n                        <label class=\"custom-control custom-checkbox\">\n                            <input type=\"checkbox\" class=\"custom-control-input\">\n                            <span class=\"custom-control-indicator\"></span>\n                        </label>\n                    </td>\n                    <th>1</th>\n                    <td>\n                        <button type=\"button\" class=\"btn btn-sm btn-info min-width150\">\n                            Новый\n                        </button>\n                    </td>\n                    <td>\n                        01.03.2017\n                    </td>\n                    <td>\n                        2\n                    </td>\n                    <td>\n                        1 100\n                    </td>\n                    <td>\n                        <div class=\"relative\">\n                            <div class=\"show-on-hover\">\n                                <button class=\"btn btn-secondary btn-sm\">\n                                    <i class=\"icon-pencil\"></i>\n                                </button>\n                                <button class=\"btn btn-secondary btn-sm\">\n                                    <i class=\"icon-cross\"></i>\n                                </button>\n                            </div>\n                        </div>\n                        username@domain.com\n                    </td>\n                </tr>\n                <tr class=\"show-on-hover-parent\">\n                    <td>\n                        <label class=\"custom-control custom-checkbox\">\n                            <input type=\"checkbox\" class=\"custom-control-input\">\n                            <span class=\"custom-control-indicator\"></span>\n                        </label>\n                    </td>\n                    <th>2</th>\n                    <td>\n                        <button type=\"button\" class=\"btn btn-sm btn-success min-width150\">\n                            Выполнен\n                        </button>\n                    </td>\n                    <td>\n                        22.02.2017\n                    </td>\n                    <td>\n                        3\n                    </td>\n                    <td>\n                        2 300\n                    </td>\n                    <td>\n                        <div class=\"relative\">\n                            <div class=\"show-on-hover\">\n                                <button class=\"btn btn-secondary btn-sm\">\n                                    <i class=\"icon-pencil\"></i>\n                                </button>\n                                <button class=\"btn btn-secondary btn-sm\">\n                                    <i class=\"icon-cross\"></i>\n                                </button>\n                            </div>\n                        </div>\n                        username@domain.com\n                    </td>\n                </tr>\n                <tr class=\"show-on-hover-parent\">\n                    <td>\n                        <label class=\"custom-control custom-checkbox\">\n                            <input type=\"checkbox\" class=\"custom-control-input\">\n                            <span class=\"custom-control-indicator\"></span>\n                        </label>\n                    </td>\n                    <th>3</th>\n                    <td>\n                        <button type=\"button\" class=\"btn btn-sm btn-info min-width150\">\n                            Новый\n                        </button>\n                    </td>\n                    <td>\n                        20.02.2017\n                    </td>\n                    <td>\n                        5\n                    </td>\n                    <td>\n                        5 520\n                    </td>\n                    <td>\n                        <div class=\"relative\">\n                            <div class=\"show-on-hover\">\n                                <button class=\"btn btn-secondary btn-sm\">\n                                    <i class=\"icon-pencil\"></i>\n                                </button>\n                                <button class=\"btn btn-secondary btn-sm\">\n                                    <i class=\"icon-cross\"></i>\n                                </button>\n                            </div>\n                        </div>\n                        username@domain.com\n                    </td>\n                </tr>\n                <tr class=\"show-on-hover-parent\">\n                    <td>\n                        <label class=\"custom-control custom-checkbox\">\n                            <input type=\"checkbox\" class=\"custom-control-input\">\n                            <span class=\"custom-control-indicator\"></span>\n                        </label>\n                    </td>\n                    <th>3</th>\n                    <td>\n                        <button type=\"button\" class=\"btn btn-sm btn-info min-width150\">\n                            Новый\n                        </button>\n                    </td>\n                    <td>\n                        20.02.2017\n                    </td>\n                    <td>\n                        5\n                    </td>\n                    <td>\n                        5 520\n                    </td>\n                    <td>\n                        <div class=\"relative\">\n                            <div class=\"show-on-hover\">\n                                <button class=\"btn btn-secondary btn-sm\">\n                                    <i class=\"icon-pencil\"></i>\n                                </button>\n                                <button class=\"btn btn-secondary btn-sm\">\n                                    <i class=\"icon-cross\"></i>\n                                </button>\n                            </div>\n                        </div>\n                        username@domain.com\n                    </td>\n                </tr>\n            </tbody>\n        </table>\n    </div>\n\n    <div class=\"card-footer\">\n\n        <div class=\"float-right\">\n            <select class=\"form-control\">\n                <option value=\"10\">10</option>\n                <option value=\"50\">50</option>\n                <option value=\"100\">100</option>\n            </select>\n        </div>\n\n        <ngb-pagination [class]=\"'mb-0'\" [collectionSize]=\"120\" [page]=\"1\" [maxSize]=\"8\" [rotate]=\"true\" [boundaryLinks]=\"false\"></ngb-pagination>\n\n    </div>\n\n</div>"

/***/ }),

/***/ 235:
/***/ (function(module, exports) {

module.exports = "<div class=\"card\">\n    <div class=\"card-block\">\n\n        <h3>\n            <i class=\"icon-bar-graph-2\"></i>\n            {{title}}\n        </h3>\n\n        <hr>\n\n    </div>\n</div>"

/***/ }),

/***/ 236:
/***/ (function(module, exports) {

module.exports = "<div class=\"card\">\n    <div class=\"card-block\">\n\n        <h3>\n            <i class=\"icon-bar-graph-2\"></i>\n            {{title}}\n        </h3>\n\n        <hr>\n\n    </div>\n</div>"

/***/ }),

/***/ 273:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(160);


/***/ })

},[273]);
//# sourceMappingURL=main.bundle.js.map