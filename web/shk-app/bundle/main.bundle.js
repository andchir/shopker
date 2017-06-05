webpackJsonp([1,4],{

/***/ 131:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_categories_service__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_category_model__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_component__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__categories_component__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_lodash__ = __webpack_require__(150);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_lodash__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ProductModalContent; });
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









var ProductModalContent = (function () {
    function ProductModalContent(fb, activeModal) {
        this.fb = fb;
        this.activeModal = activeModal;
        this.submitted = false;
        this.loading = false;
    }
    /** On initialize */
    ProductModalContent.prototype.ngOnInit = function () {
        this.buildForm();
    };
    ProductModalContent.prototype.buildForm = function () {
        var _this = this;
        this.form = this.fb.group({
            title: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["e" /* Validators */].required]],
            name: ['', [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["e" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_3__angular_forms__["e" /* Validators */].pattern('[A-Za-z0-9_-]+')]],
            description: ['', []]
        });
        this.form.valueChanges
            .subscribe(function (data) { return _this.onValueChanged(data); });
    };
    /**
     * On form value changed
     * @param data
     */
    ProductModalContent.prototype.onValueChanged = function (data) {
        if (!this.form) {
            return;
        }
        console.log(data);
    };
    ProductModalContent.prototype.onSubmit = function () {
        this.submitted = true;
    };
    return ProductModalContent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["O" /* Input */])(),
    __metadata("design:type", Object)
], ProductModalContent.prototype, "modalTitle", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["O" /* Input */])(),
    __metadata("design:type", Object)
], ProductModalContent.prototype, "itemId", void 0);
ProductModalContent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_0" /* Component */])({
        selector: 'ngbd-modal-content',
        template: __webpack_require__(238)
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* FormBuilder */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* FormBuilder */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["b" /* NgbActiveModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["b" /* NgbActiveModal */]) === "function" && _b || Object])
], ProductModalContent);

var CatalogComponent = (function () {
    function CatalogComponent(modalService, categoriesService, titleService) {
        this.modalService = modalService;
        this.categoriesService = categoriesService;
        this.titleService = titleService;
        this.title = 'Каталог';
        this.errorMessage = '';
        this.loading = false;
        this.categories = [];
        this.items = [];
        this.selectedIds = [];
    }
    CatalogComponent.prototype.ngOnInit = function () {
        this.setTitle(this.title);
        this.openRootCategory();
        this.getCategories();
    };
    CatalogComponent.prototype.getCategories = function () {
        var _this = this;
        this.categoriesService.getList()
            .then(function (items) {
            _this.categories = items;
        }, function (error) { return _this.errorMessage = error; });
    };
    CatalogComponent.prototype.modalOpen = function (itemId) {
        this.modalRef = this.modalService.open(ProductModalContent, { size: 'lg' });
        this.modalRef.componentInstance.modalTitle = 'Add product';
        this.modalRef.componentInstance.itemId = itemId || 0;
    };
    CatalogComponent.prototype.openModalCategory = function (itemId, isItemCopy) {
        var _this = this;
        this.modalRef = this.modalService.open(__WEBPACK_IMPORTED_MODULE_7__categories_component__["a" /* CategoriesComponent */], { size: 'lg' });
        this.modalRef.componentInstance.modalTitle = 'Add category';
        this.modalRef.componentInstance.itemId = itemId || 0;
        this.modalRef.componentInstance.isItemCopy = isItemCopy || false;
        this.modalRef.result.then(function (result) {
            if (result.reason && result.reason == 'edit') {
                //Update category data
                _this.currentCategory = __WEBPACK_IMPORTED_MODULE_8_lodash__["clone"](result.data);
                var index = __WEBPACK_IMPORTED_MODULE_8_lodash__["findIndex"](_this.categories, { id: result.data.id });
                if (index > -1) {
                    _this.categories[index] = __WEBPACK_IMPORTED_MODULE_8_lodash__["clone"](result.data);
                }
            }
            else {
                _this.getCategories();
            }
        }, function (reason) {
        });
    };
    CatalogComponent.prototype.deleteCategoryItemConfirm = function (itemId) {
        var _this = this;
        var index = __WEBPACK_IMPORTED_MODULE_8_lodash__["findIndex"](this.categories, { id: itemId });
        if (index == -1) {
            return;
        }
        this.modalRef = this.modalService.open(__WEBPACK_IMPORTED_MODULE_6__app_component__["b" /* ConfirmModalContent */]);
        this.modalRef.componentInstance.modalTitle = 'Confirm';
        this.modalRef.componentInstance.modalContent = 'Are you sure you want to remove category "' + this.categories[index].title + '"?';
        this.modalRef.result.then(function (result) {
            if (result == 'accept') {
                _this.deleteCategoryItem(itemId);
            }
        }, function (reason) {
        });
    };
    CatalogComponent.prototype.deleteCategoryItem = function (itemId) {
        var _this = this;
        this.categoriesService.deleteItem(itemId)
            .then(function (res) {
            if (res.success) {
                _this.openRootCategory();
                _this.getCategories();
            }
            else {
                if (res.msg) {
                    //this.errorMessage = res.msg;
                }
            }
        });
    };
    CatalogComponent.prototype.openRootCategory = function () {
        this.currentCategory = new __WEBPACK_IMPORTED_MODULE_5__models_category_model__["a" /* Category */](0, 0, 'root', 'Категории', '');
        this.titleService.setTitle(this.title);
    };
    CatalogComponent.prototype.selectCategory = function (category) {
        this.currentCategory = __WEBPACK_IMPORTED_MODULE_8_lodash__["clone"](category);
        this.titleService.setTitle(this.title + ' / ' + this.currentCategory.title);
    };
    CatalogComponent.prototype.setTitle = function (newTitle) {
        this.titleService.setTitle(newTitle);
    };
    CatalogComponent.prototype.selectAll = function (event) {
        this.selectedIds = [];
        if (event.target.checked) {
            for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
                var item = _a[_i];
                this.selectedIds.push(item.id);
            }
        }
    };
    return CatalogComponent;
}());
CatalogComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_0" /* Component */])({
        selector: 'shk-catalog',
        template: __webpack_require__(239)
    }),
    __metadata("design:paramtypes", [typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["d" /* NgbModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["d" /* NgbModal */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__services_categories_service__["a" /* CategoriesService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__services_categories_service__["a" /* CategoriesService */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["c" /* Title */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["c" /* Title */]) === "function" && _e || Object])
], CatalogComponent);

var _a, _b, _c, _d, _e;
//# sourceMappingURL=catalog.component.js.map

/***/ }),

/***/ 132:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_categories_service__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_category_model__ = __webpack_require__(134);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CategoriesComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var CategoriesComponent = (function () {
    function CategoriesComponent(fb, categoriesService, activeModal) {
        this.fb = fb;
        this.categoriesService = categoriesService;
        this.activeModal = activeModal;
        this.submitted = false;
        this.loading = false;
        this.model = new __WEBPACK_IMPORTED_MODULE_4__models_category_model__["a" /* Category */](0, 0, '', '', '');
        this.formErrors = {
            name: '',
            title: ''
        };
        this.validationMessages = {
            title: {
                required: 'Title is required.'
            },
            name: {
                required: 'Name is required.',
                pattern: 'The name must contain only Latin letters.'
            }
        };
    }
    /** On initialize */
    CategoriesComponent.prototype.ngOnInit = function () {
        this.buildForm();
        if (this.itemId) {
            this.getModelData();
        }
    };
    CategoriesComponent.prototype.getModelData = function () {
        var _this = this;
        this.loading = true;
        this.categoriesService.getItem(this.itemId)
            .then(function (item) {
            if (_this.isItemCopy) {
                item.id = 0;
                item.name = '';
            }
            _this.model = item;
            _this.loading = false;
        });
    };
    CategoriesComponent.prototype.buildForm = function () {
        var _this = this;
        this.form = this.fb.group({
            title: [this.model.title, [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["e" /* Validators */].required]],
            name: [this.model.name, [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["e" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["e" /* Validators */].pattern('[A-Za-z0-9_-]+')]],
            description: [this.model.description, []]
        });
        this.form.valueChanges
            .subscribe(function (data) { return _this.onValueChanged(data); });
    };
    /**
     * On form value changed
     * @param data
     */
    CategoriesComponent.prototype.onValueChanged = function (data) {
        if (!this.form) {
            return;
        }
        for (var field in this.formErrors) {
            this.formErrors[field] = '';
            var control = this.form.get(field);
            if (control && (control.dirty || this.submitted) && !control.valid) {
                var messages = this.validationMessages[field];
                for (var key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    };
    CategoriesComponent.prototype.onSubmit = function () {
        var _this = this;
        this.submitted = true;
        if (!this.form.valid) {
            this.onValueChanged();
            return;
        }
        if (this.model.id) {
            this.categoriesService.editItem(this.model.id, this.model)
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
            this.categoriesService.createItem(this.model)
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
    CategoriesComponent.prototype.closeModal = function () {
        var reason = this.itemId ? 'edit' : 'create';
        this.activeModal.close({ reason: reason, data: this.model });
    };
    return CategoriesComponent;
}());
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["O" /* Input */])(),
    __metadata("design:type", Object)
], CategoriesComponent.prototype, "modalTitle", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["O" /* Input */])(),
    __metadata("design:type", Object)
], CategoriesComponent.prototype, "itemId", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["O" /* Input */])(),
    __metadata("design:type", Object)
], CategoriesComponent.prototype, "isItemCopy", void 0);
CategoriesComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_0" /* Component */])({
        selector: 'category-modal-content',
        template: __webpack_require__(235),
        providers: [__WEBPACK_IMPORTED_MODULE_3__services_categories_service__["a" /* CategoriesService */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* FormBuilder */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* FormBuilder */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__services_categories_service__["a" /* CategoriesService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__services_categories_service__["a" /* CategoriesService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["b" /* NgbActiveModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["b" /* NgbActiveModal */]) === "function" && _c || Object])
], CategoriesComponent);

var _a, _b, _c;
//# sourceMappingURL=categories.component.js.map

/***/ }),

/***/ 133:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_content_types_service__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_forms__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_content_type_model__ = __webpack_require__(178);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_component__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_lodash__ = __webpack_require__(150);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_lodash__);
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
        this.model = new __WEBPACK_IMPORTED_MODULE_5__models_content_type_model__["a" /* ContentType */]('', '', '', '', 'products', [], ['Содержание', 'Служебное'], true);
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
            title: [this.model.title, [__WEBPACK_IMPORTED_MODULE_4__angular_forms__["e" /* Validators */].required]],
            name: [this.model.name, [__WEBPACK_IMPORTED_MODULE_4__angular_forms__["e" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_4__angular_forms__["e" /* Validators */].pattern('[A-Za-z0-9_-]+')]],
            description: [this.model.description, []],
            collection: [this.model.collection, [__WEBPACK_IMPORTED_MODULE_4__angular_forms__["e" /* Validators */].required]],
            new_collection: ['', [__WEBPACK_IMPORTED_MODULE_4__angular_forms__["e" /* Validators */].pattern('[A-Za-z0-9_-]+')]]
        });
        this.contentTypeForm.valueChanges
            .subscribe(function (data) { return _this.onValueChanged('contentType', data); });
        this.fieldForm = this.fb.group({
            title: ['', [__WEBPACK_IMPORTED_MODULE_4__angular_forms__["e" /* Validators */].required]],
            name: ['', [__WEBPACK_IMPORTED_MODULE_4__angular_forms__["e" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_4__angular_forms__["e" /* Validators */].pattern('[A-Za-z0-9_-]+')]],
            description: ['', []],
            input_type: ['', [__WEBPACK_IMPORTED_MODULE_4__angular_forms__["e" /* Validators */].required]],
            output_type: ['', [__WEBPACK_IMPORTED_MODULE_4__angular_forms__["e" /* Validators */].required]],
            is_filter: ['', []],
            group: ['', [__WEBPACK_IMPORTED_MODULE_4__angular_forms__["e" /* Validators */].required]],
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
        this.fieldForm.setValue(__WEBPACK_IMPORTED_MODULE_7_lodash__["clone"](field));
        this.currentFieldName = field.name;
        this.fieldSubmitted = false;
        this.action = 'edit_field';
    };
    ContentTypeModalContent.prototype.copyField = function (field) {
        var data = __WEBPACK_IMPORTED_MODULE_7_lodash__["clone"](field);
        data.name = '';
        this.fieldForm.setValue(data);
        this.currentFieldName = '';
        this.fieldSubmitted = false;
        this.action = 'add_field';
    };
    ContentTypeModalContent.prototype.deleteField = function (field) {
        var index = __WEBPACK_IMPORTED_MODULE_7_lodash__["findIndex"](this.model.fields, { name: field.name });
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
        var index = __WEBPACK_IMPORTED_MODULE_7_lodash__["findIndex"](this.model.fields, { name: data.name });
        if (index > -1 && this.currentFieldName != data.name) {
            this.errorMessage = 'A field named "' + data.name + '" already exists.';
            return;
        }
        if (this.action == 'add_field') {
            this.model.fields.push(__WEBPACK_IMPORTED_MODULE_7_lodash__["clone"](data));
        }
        else if (this.action == 'edit_field') {
            index = __WEBPACK_IMPORTED_MODULE_7_lodash__["findIndex"](this.model.fields, { name: this.currentFieldName });
            if (index > -1) {
                this.model.fields[index] = __WEBPACK_IMPORTED_MODULE_7_lodash__["clone"](data);
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
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["O" /* Input */])(),
    __metadata("design:type", Object)
], ContentTypeModalContent.prototype, "modalTitle", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["O" /* Input */])(),
    __metadata("design:type", Object)
], ContentTypeModalContent.prototype, "itemId", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["O" /* Input */])(),
    __metadata("design:type", Object)
], ContentTypeModalContent.prototype, "isItemCopy", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])('addCollectionBlock'),
    __metadata("design:type", Object)
], ContentTypeModalContent.prototype, "elementAddCollectionBlock", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_11" /* ViewChild */])('addGroupBlock'),
    __metadata("design:type", Object)
], ContentTypeModalContent.prototype, "elementAddGroupBlock", void 0);
ContentTypeModalContent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_0" /* Component */])({
        selector: 'content-type-modal-content',
        template: __webpack_require__(237),
        providers: [__WEBPACK_IMPORTED_MODULE_3__services_content_types_service__["a" /* ContentTypesService */], __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["c" /* NgbTooltipConfig */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_4__angular_forms__["f" /* FormBuilder */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__angular_forms__["f" /* FormBuilder */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__services_content_types_service__["a" /* ContentTypesService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__services_content_types_service__["a" /* ContentTypesService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["b" /* NgbActiveModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["b" /* NgbActiveModal */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["c" /* NgbTooltipConfig */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["c" /* NgbTooltipConfig */]) === "function" && _d || Object])
], ContentTypeModalContent);

var ContentTypesComponent = (function () {
    function ContentTypesComponent(contentTypesService, modalService, titleService) {
        this.contentTypesService = contentTypesService;
        this.modalService = modalService;
        this.titleService = titleService;
        this.items = [];
        this.title = 'Типы товаров';
        this.loading = false;
        this.selectedIds = [];
    }
    ContentTypesComponent.prototype.ngOnInit = function () {
        this.setTitle(this.title);
        this.getList();
    };
    ContentTypesComponent.prototype.setTitle = function (newTitle) {
        this.titleService.setTitle(newTitle);
    };
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
        this.modalRef = this.modalService.open(__WEBPACK_IMPORTED_MODULE_6__app_component__["b" /* ConfirmModalContent */]);
        this.modalRef.componentInstance.modalTitle = 'Confirm';
        this.modalRef.componentInstance.modalContent = 'Are you sure you want to remove this item?';
        this.modalRef.result.then(function (result) {
            if (result == 'accept') {
                _this.deleteItem(itemId);
            }
        }, function (reason) {
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
    ContentTypesComponent.prototype.selectAll = function (event) {
        this.selectedIds = [];
        if (event.target.checked) {
            for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
                var item = _a[_i];
                this.selectedIds.push(item.id);
            }
        }
    };
    ContentTypesComponent.prototype.setSelected = function (event, itemId) {
        var index = this.selectedIds.indexOf(itemId);
        if (event.target.checked) {
            if (index == -1) {
                this.selectedIds.push(itemId);
            }
        }
        else if (index > -1) {
            this.selectedIds.splice(index, 1);
        }
    };
    ContentTypesComponent.prototype.getIsSelected = function (itemId) {
        return this.selectedIds.lastIndexOf(itemId) > -1;
    };
    return ContentTypesComponent;
}());
ContentTypesComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_0" /* Component */])({
        selector: 'shk-content-types',
        template: __webpack_require__(240)
    }),
    __metadata("design:paramtypes", [typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_3__services_content_types_service__["a" /* ContentTypesService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__services_content_types_service__["a" /* ContentTypesService */]) === "function" && _e || Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["d" /* NgbModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["d" /* NgbModal */]) === "function" && _f || Object, typeof (_g = typeof __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["c" /* Title */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["c" /* Title */]) === "function" && _g || Object])
], ContentTypesComponent);

var _a, _b, _c, _d, _e, _f, _g;
//# sourceMappingURL=content_types.component.js.map

/***/ }),

/***/ 134:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Category; });
var Category = (function () {
    function Category(id, parent_id, name, title, description) {
        this.id = id;
        this.parent_id = parent_id;
        this.name = name;
        this.title = title;
        this.description = description;
    }
    return Category;
}());

//# sourceMappingURL=category.model.js.map

/***/ }),

/***/ 135:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(10);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrdersComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var OrdersComponent = (function () {
    function OrdersComponent(titleService) {
        this.titleService = titleService;
        this.title = 'Заказы';
    }
    OrdersComponent.prototype.ngOnInit = function () {
        this.setTitle(this.title);
    };
    OrdersComponent.prototype.setTitle = function (newTitle) {
        this.titleService.setTitle(newTitle);
    };
    return OrdersComponent;
}());
OrdersComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_0" /* Component */])({
        selector: 'shk-settings',
        template: __webpack_require__(241)
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["c" /* Title */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["c" /* Title */]) === "function" && _a || Object])
], OrdersComponent);

var _a;
//# sourceMappingURL=orders.component.js.map

/***/ }),

/***/ 136:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise__ = __webpack_require__(152);
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

/***/ 137:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(10);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SettingsComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SettingsComponent = (function () {
    function SettingsComponent(titleService) {
        this.titleService = titleService;
        this.title = 'Настройки';
    }
    SettingsComponent.prototype.ngOnInit = function () {
        this.setTitle(this.title);
    };
    SettingsComponent.prototype.setTitle = function (newTitle) {
        this.titleService.setTitle(newTitle);
    };
    return SettingsComponent;
}());
SettingsComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_0" /* Component */])({
        selector: 'shk-settings',
        template: __webpack_require__(242)
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["c" /* Title */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["c" /* Title */]) === "function" && _a || Object])
], SettingsComponent);

var _a;
//# sourceMappingURL=settings.component.js.map

/***/ }),

/***/ 138:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(10);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StatisticsComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var StatisticsComponent = (function () {
    function StatisticsComponent(titleService) {
        this.titleService = titleService;
        this.title = 'Статистика';
    }
    StatisticsComponent.prototype.ngOnInit = function () {
        this.setTitle(this.title);
    };
    StatisticsComponent.prototype.setTitle = function (newTitle) {
        this.titleService.setTitle(newTitle);
    };
    return StatisticsComponent;
}());
StatisticsComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_0" /* Component */])({
        selector: 'shk-settings',
        template: __webpack_require__(243)
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["c" /* Title */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["c" /* Title */]) === "function" && _a || Object])
], StatisticsComponent);

var _a;
//# sourceMappingURL=stat.component.js.map

/***/ }),

/***/ 164:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 164;


/***/ }),

/***/ 165:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(169);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_i18n_providers__ = __webpack_require__(177);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_module__ = __webpack_require__(176);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__environments_environment__ = __webpack_require__(179);





if (__WEBPACK_IMPORTED_MODULE_4__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* enableProdMode */])();
}
//platformBrowserDynamic().bootstrapModule(AppModule);
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__app_i18n_providers__["a" /* getTranslationProviders */])().then(function (providers) {
    var options = { providers: providers };
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_3__app_app_module__["a" /* AppModule */], options);
});
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 174:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TRANSLATION_RU; });
var TRANSLATION_RU = "\n<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<xliff version=\"1.2\" xmlns=\"urn:oasis:names:tc:xliff:document:1.2\">\n    <file source-language=\"en\" datatype=\"plaintext\" original=\"ng2.template\">\n        <body>\n            <trans-unit id=\"4e7f5f07ae8e67878f35b34bcee10e39300ff41a\" datatype=\"html\">\n                <source>Orders</source>\n                <target>\u0417\u0430\u043A\u0430\u0437\u044B</target>\n            </trans-unit>\n            <trans-unit id=\"61e0f26d843eec0b33ff475e111b0c2f7a80b835\" datatype=\"html\">\n                <source>Statistics</source>\n                <target>\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430</target>\n            </trans-unit>\n            <trans-unit id=\"532152365f64d8738343423767f1130c1a451e78\" datatype=\"html\">\n                <source>Catalog</source>\n                <target>\u041A\u0430\u0442\u0430\u043B\u043E\u0433</target>\n            </trans-unit>\n            <trans-unit id=\"121cc5391cd2a5115bc2b3160379ee5b36cd7716\" datatype=\"html\">\n                <source>Settings</source>\n                <target>\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438</target>\n            </trans-unit>\n        </body>\n    </file>\n</xliff>\n";
//# sourceMappingURL=messages.ru.js.map

/***/ }),

/***/ 175:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(170);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__orders_component__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__catalog_component__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__content_types_component__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__stat_component__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__settings_component__ = __webpack_require__(137);
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

/***/ 176:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__orders_component__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__catalog_component__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__categories_component__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__content_types_component__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__stat_component__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__settings_component__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__services_content_types_service__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__services_categories_service__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__app_routing_module__ = __webpack_require__(175);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ng_bootstrap_ng_bootstrap__ = __webpack_require__(23);
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
            __WEBPACK_IMPORTED_MODULE_13__app_routing_module__["a" /* AppRoutingModule */],
            __WEBPACK_IMPORTED_MODULE_14__ng_bootstrap_ng_bootstrap__["a" /* NgbModule */].forRoot()
        ],
        declarations: [
            __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */],
            __WEBPACK_IMPORTED_MODULE_5__orders_component__["a" /* OrdersComponent */],
            __WEBPACK_IMPORTED_MODULE_6__catalog_component__["a" /* CatalogComponent */],
            __WEBPACK_IMPORTED_MODULE_8__content_types_component__["a" /* ContentTypesComponent */],
            __WEBPACK_IMPORTED_MODULE_9__stat_component__["a" /* StatisticsComponent */],
            __WEBPACK_IMPORTED_MODULE_10__settings_component__["a" /* SettingsComponent */],
            __WEBPACK_IMPORTED_MODULE_6__catalog_component__["b" /* ProductModalContent */],
            __WEBPACK_IMPORTED_MODULE_8__content_types_component__["b" /* ContentTypeModalContent */],
            __WEBPACK_IMPORTED_MODULE_7__categories_component__["a" /* CategoriesComponent */],
            __WEBPACK_IMPORTED_MODULE_4__app_component__["b" /* ConfirmModalContent */]
        ],
        providers: [__WEBPACK_IMPORTED_MODULE_11__services_content_types_service__["a" /* ContentTypesService */], __WEBPACK_IMPORTED_MODULE_12__services_categories_service__["a" /* CategoriesService */]],
        entryComponents: [__WEBPACK_IMPORTED_MODULE_4__app_component__["b" /* ConfirmModalContent */], __WEBPACK_IMPORTED_MODULE_6__catalog_component__["b" /* ProductModalContent */], __WEBPACK_IMPORTED_MODULE_8__content_types_component__["b" /* ContentTypeModalContent */], __WEBPACK_IMPORTED_MODULE_7__categories_component__["a" /* CategoriesComponent */]],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 177:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__locale_messages_ru__ = __webpack_require__(174);
/* harmony export (immutable) */ __webpack_exports__["a"] = getTranslationProviders;


function getTranslationProviders() {
    // Get the locale id from the global
    var locale = document['locale'];
    // return no providers if fail to get translation file for locale
    var noProviders = [];
    // No locale or U.S. English: no translation providers
    if (!locale || locale === 'en-US') {
        return Promise.resolve(noProviders);
    }
    return getTranslations(locale)
        .then(function (translations) { return [
        { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["_74" /* TRANSLATIONS */], useValue: translations },
        { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["_28" /* TRANSLATIONS_FORMAT */], useValue: 'xlf' },
        { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["G" /* LOCALE_ID */], useValue: locale }
    ]; })
        .catch(function () { return noProviders; }); // ignore if file not found
}
function getTranslations(locale) {
    var translation;
    switch (locale) {
        case 'ru':
        case 'ru-RU':
            translation = __WEBPACK_IMPORTED_MODULE_1__locale_messages_ru__["a" /* TRANSLATION_RU */];
            break;
    }
    return Promise.resolve(translation);
}
//# sourceMappingURL=i18n-providers.js.map

/***/ }),

/***/ 178:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContentType; });
var ContentType = (function () {
    function ContentType(id, name, title, description, collection, fields, groups, is_active) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.description = description;
        this.collection = collection;
        this.fields = fields;
        this.groups = groups;
        this.is_active = is_active;
    }
    return ContentType;
}());

//# sourceMappingURL=content_type.model.js.map

/***/ }),

/***/ 179:
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

/***/ 233:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(75)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 234:
/***/ (function(module, exports) {

module.exports = "<div>\n\n    <div class=\"card-navbar\">\n        <div class=\"btn-group\" role=\"group\" aria-label=\"First group\">\n            <a class=\"btn btn-outline-primary\" [routerLink]=\"['/orders']\" routerLinkActive=\"active\">\n                <i class=\"icon-bag\"></i>\n                <span class=\"hidden-xs-down\" i18n>Orders</span>\n            </a>\n            <a class=\"btn btn-outline-primary\" [routerLink]=\"['/statistics']\" routerLinkActive=\"active\">\n                <i class=\"icon-bar-graph-2\"></i>\n                <span class=\"hidden-xs-down\" i18n>Statistics</span>\n            </a>\n            <a class=\"btn btn-outline-primary\" [routerLink]=\"['/catalog']\" routerLinkActive=\"active\">\n                <i class=\"icon-layers\"></i>\n                <span class=\"hidden-xs-down\" i18n>Catalog</span>\n            </a>\n            <a class=\"btn btn-outline-primary\" [routerLink]=\"['/settings']\" routerLinkActive=\"active\">\n                <i class=\"icon-cog\"></i>\n                <span class=\"hidden-xs-down\" i18n>Settings</span>\n            </a>\n        </div>\n    </div>\n\n    <router-outlet></router-outlet>\n\n</div>"

/***/ }),

/***/ 235:
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-block\">\n    <div class=\"d-block float-right\">\n        <button type=\"button\" class=\"btn btn-secondary\" (click)=\"activeModal.dismiss()\">\n            Close\n        </button>\n    </div>\n    <h4 class=\"modal-title\">{{modalTitle}}</h4>\n</div>\n\n<form (ngSubmit)=\"onSubmit()\" [formGroup]=\"form\" [class.loading]=\"loading\">\n\n    <div class=\"modal-body\">\n        <div>\n\n            <div class=\"row form-group\" [class.form-group-message]=\"formErrors.name\">\n                <div class=\"col-md-5\">\n                    <label for=\"fieldName\">Системное имя</label>\n                </div>\n                <div class=\"col-md-7\">\n                    <input type=\"text\" id=\"fieldName\" class=\"form-control\" name=\"name\" formControlName=\"name\" [(ngModel)]=\"model.name\">\n                    <div *ngIf=\"formErrors.name\" class=\"alert alert-danger\">\n                        {{formErrors.name}}\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"row form-group\" [class.form-group-message]=\"formErrors.title\">\n                <div class=\"col-md-5\">\n                    <label for=\"fieldTitle\">Название</label>\n                </div>\n                <div class=\"col-md-7\">\n                    <input type=\"text\" id=\"fieldTitle\" class=\"form-control\" formControlName=\"title\" name=\"title\" [(ngModel)]=\"model.title\">\n                    <div *ngIf=\"formErrors.title\" class=\"alert alert-danger\">\n                        {{formErrors.title}}\n                    </div>\n                </div>\n            </div>\n\n            <div class=\"row form-group\">\n                <div class=\"col-md-5\">\n                    <label for=\"fieldDescription\">Описание</label>\n                </div>\n                <div class=\"col-md-7\">\n                    <textarea type=\"text\" id=\"fieldDescription\" rows=\"4\" class=\"form-control\" name=\"description\" formControlName=\"description\" [(ngModel)]=\"model.description\"></textarea>\n                </div>\n            </div>\n\n            <div class=\"row form-group\">\n                <div class=\"col-md-5\">\n                    <label for=\"fieldContentType\">Тип контента</label>\n                </div>\n                <div class=\"col-md-7\">\n                    <select id=\"fieldContentType\" class=\"form-control\">\n                        <option value=\"1\">Электроника</option>\n                        <option value=\"0\">Одежда</option>\n                    </select>\n                </div>\n            </div>\n\n        </div>\n\n    </div>\n    <div class=\"modal-footer d-block\">\n        <button type=\"submit\" class=\"btn btn-success btn-wide\">\n            Save\n        </button>\n        <button type=\"submit\" class=\"btn btn-secondary btn-wide\" (click)=\"activeModal.dismiss()\">\n            Cancel\n        </button>\n    </div>\n\n</form>\n"

/***/ }),

/***/ 236:
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-block\">\n    <h4 class=\"modal-title\">{{modalTitle}}</h4>\n</div>\n<div class=\"modal-body\">\n    {{modalContent}}\n</div>\n<div class=\"modal-footer d-block\">\n    <button type=\"button\" class=\"btn btn-success btn-wide\" (click)=\"accept()\">\n        Yes\n    </button>\n    <button type=\"button\" class=\"btn btn-secondary btn-wide\" (click)=\"activeModal.close()\">\n        No\n    </button>\n</div>"

/***/ }),

/***/ 237:
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-block\">\n    <div class=\"d-block float-right\">\n        <button type=\"button\" class=\"btn btn-secondary\" (click)=\"activeModal.dismiss()\">\n            Close\n        </button>\n    </div>\n    <h4 class=\"modal-title\">{{modalTitle}}</h4>\n</div>\n\n<form (ngSubmit)=\"onSubmit()\" [class.loading]=\"loading\">\n\n    <div class=\"modal-body\">\n\n        <div class=\"row\">\n\n            <!-- ContentType form -->\n            <div class=\"col-lg-4\" [formGroup]=\"contentTypeForm\">\n\n                <div class=\"form-group\" [class.form-group-message]=\"formErrors.contentType.title\">\n                    <label class=\"label-filled\">\n                        Название\n                    </label>\n                    <input type=\"text\" class=\"form-control\" name=\"title\" formControlName=\"title\" [(ngModel)]=\"model.title\">\n                    <div *ngIf=\"formErrors.contentType.title\" class=\"alert alert-danger\">\n                        {{formErrors.contentType.title}}\n                    </div>\n                </div>\n\n                <div class=\"form-group\" [class.form-group-message]=\"formErrors.contentType.name\">\n                    <label class=\"label-filled\">\n                        Системное имя\n                    </label>\n                    <input type=\"text\" class=\"form-control\" name=\"name\" formControlName=\"name\" [(ngModel)]=\"model.name\">\n                    <div *ngIf=\"formErrors.contentType.name\" class=\"alert alert-danger\">\n                        {{formErrors.contentType.name}}\n                    </div>\n                </div>\n\n                <div class=\"form-group\">\n                    <label class=\"label-filled\">\n                        Описание\n                    </label>\n                    <textarea type=\"text\" class=\"form-control\" name=\"description\" formControlName=\"description\" [(ngModel)]=\"model.description\"></textarea>\n                </div>\n\n                <div class=\"form-group row\">\n                    <div class=\"col-12\">\n\n                        <div class=\"form-group\">\n                            <label class=\"label-filled\">Коллекция</label>\n                            <div class=\"input-group\">\n                                <select class=\"form-control\" name=\"collection\" formControlName=\"collection\" [(ngModel)]=\"model.collection\">\n                                    <option value=\"{{collection}}\" *ngFor=\"let collection of collections\">{{collection}}</option>\n                                </select>\n                                <div class=\"input-group-btn\">\n                                    <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Add collection\" (click)=\"displayToggle(addCollectionBlock); addCollectionField.value = ''; onValueChanged(); addCollectionField.focus()\">\n                                        <i class=\"icon-plus\"></i>\n                                    </button>\n                                </div>\n                                <div class=\"input-group-btn\">\n                                    <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Delete collection\" (click)=\"deleteCollection()\">\n                                        <i class=\"icon-cross\"></i>\n                                    </button>\n                                </div>\n                            </div>\n\n                            <div class=\"card p-1 mt-2\" #addCollectionBlock style=\"display: none;\" [class.form-group-message]=\"formErrors.contentType.new_collection\">\n                                <input type=\"text\" class=\"form-control form-control-sm\" formControlName=\"new_collection\" #addCollectionField>\n                                <div *ngIf=\"formErrors.contentType.new_collection\" class=\"alert alert-danger mb-1\">\n                                    {{formErrors.contentType.new_collection}}\n                                </div>\n\n                                <div class=\"text-right mt-1\">\n                                    <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"addCollection();\">\n                                        Add\n                                    </button>\n                                    <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"addCollectionBlock.style.display = 'none'; formErrors.contentType.new_collection = ''\">\n                                        Cancel\n                                    </button>\n                                </div>\n                            </div>\n                        </div>\n\n                    </div>\n                </div>\n\n            </div>\n            <!-- /ContentType form -->\n\n            <!-- Field form -->\n            <div class=\"col-lg-8\" [formGroup]=\"fieldForm\">\n\n                <label class=\"label-filled\" [hidden]=\"action != 'add_field'\">\n                    Добавить поле\n                </label>\n                <label class=\"label-filled\" [hidden]=\"action != 'edit_field'\">\n                    Редактировать поле\n                </label>\n\n                <div class=\"card\">\n                    <div class=\"card-block\">\n\n                        <div class=\"form-group row\" [class.form-group-message]=\"formErrors.field.title\">\n                            <div class=\"col-md-5\">\n                                <label class=\"small\">Название</label>\n                            </div>\n                            <div class=\"col-md-7\">\n                                <input type=\"text\" class=\"form-control form-control-sm\" name=\"field_title\" formControlName=\"title\">\n                                <div *ngIf=\"formErrors.field.title\" class=\"alert alert-danger\">\n                                    {{formErrors.field.title}}\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row\" [class.form-group-message]=\"formErrors.field.name\">\n                            <div class=\"col-md-5\">\n                                <label class=\"small\">Системное имя</label>\n                            </div>\n                            <div class=\"col-md-7\">\n                                <input type=\"text\" class=\"form-control form-control-sm\" name=\"field_name\" formControlName=\"name\">\n                                <div *ngIf=\"formErrors.field.name\" class=\"alert alert-danger\">\n                                    {{formErrors.field.name}}\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row\">\n                            <div class=\"col-md-5\">\n                                <label class=\"small\">Описание</label>\n                            </div>\n                            <div class=\"col-md-7\">\n                                <textarea type=\"text\" class=\"form-control form-control-sm\" name=\"field_description\" formControlName=\"description\"></textarea>\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row\" [class.form-group-message]=\"formErrors.field.input_type\">\n                            <div class=\"col-md-5\">\n                                <label class=\"small\">Тип ввода</label>\n                            </div>\n                            <div class=\"col-md-7\">\n\n                                <div class=\"input-group\">\n                                    <select class=\"form-control form-control-sm\" name=\"field_input_type\" formControlName=\"input_type\">\n                                        <option value=\"text\">Текстовое поле</option>\n                                        <option value=\"textarea\">Многострочный текст</option>\n                                        <option value=\"richtext\">Текстовый редактор</option>\n                                        <option value=\"number\">Число</option>\n                                        <option value=\"select\">Выпадающий список</option>\n                                        <option value=\"checkbox\">Чекбокс</option>\n                                        <option value=\"radio\">Переключатель</option>\n                                        <option value=\"table\">Таблица</option>\n                                        <option value=\"date\">Дата</option>\n                                        <option value=\"file\">Файл</option>\n                                        <option value=\"image\">Картинка</option>\n                                    </select>\n                                    <div class=\"input-group-btn\">\n                                        <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Options\" (click)=\"displayToggle(inputTypeOptionsBlock)\">\n                                            <i class=\"icon-cog\"></i>\n                                        </button>\n                                    </div>\n                                </div>\n                                <div *ngIf=\"formErrors.field.input_type\" class=\"alert alert-danger\">\n                                    {{formErrors.field.input_type}}\n                                </div>\n\n                            </div>\n                        </div>\n\n                        <div class=\"card card-block mb-3\" #inputTypeOptionsBlock style=\"display: none;\">\n                            <div>\n                                Тут будут параметры\n                            </div>\n                            <div class=\"text-right mt-1\">\n                                <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"inputTypeOptionsBlock.style.display = 'none';\">\n                                    Close\n                                </button>\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row\" [class.form-group-message]=\"formErrors.field.output_type\">\n                            <div class=\"col-md-5\">\n                                <label class=\"small\">Тип вывода</label>\n                            </div>\n                            <div class=\"col-md-7\">\n\n                                <div class=\"input-group\">\n                                    <select class=\"form-control form-control-sm\" name=\"field_output_type\" formControlName=\"output_type\">\n                                        <option value=\"text\">Текст</option>\n                                        <option value=\"select\">Выпадающий список</option>\n                                        <option value=\"checkbox\">Чекбокс</option>\n                                        <option value=\"radio\">Переключатель</option>\n                                        <option value=\"table\">Таблица</option>\n                                        <option value=\"image\">Картинка</option>\n                                    </select>\n                                    <div class=\"input-group-btn\">\n                                        <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Options\" (click)=\"displayToggle(outputTypeOptionsBlock)\">\n                                            <i class=\"icon-cog\"></i>\n                                        </button>\n                                    </div>\n                                </div>\n                                <div *ngIf=\"formErrors.field.output_type\" class=\"alert alert-danger\">\n                                    {{formErrors.field.output_type}}\n                                </div>\n\n                            </div>\n                        </div>\n\n                        <div class=\"card card-block mb-3\" #outputTypeOptionsBlock style=\"display: none;\">\n                            <div>\n                                Тут будут параметры\n                            </div>\n                            <div class=\"text-right mt-1\">\n                                <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"outputTypeOptionsBlock.style.display = 'none'\">\n                                    Close\n                                </button>\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row\">\n                            <div class=\"col-md-5\">\n                                <label class=\"small\">Группа</label>\n                            </div>\n                            <div class=\"col-md-7\">\n\n                                <div [class.form-group-message]=\"formErrors.field.group\">\n                                    <div class=\"input-group input-group-sm\">\n                                        <select class=\"form-control\" name=\"field_group\" formControlName=\"group\">\n                                            <option value=\"{{group}}\" *ngFor=\"let group of model.groups\">{{group}}</option>\n                                        </select>\n                                        <div class=\"input-group-btn\">\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Add group\" (click)=\"displayToggle(addGroupBlock); addGroupField.value = ''; addGroupField.focus()\">\n                                                <i class=\"icon-plus\"></i>\n                                            </button>\n                                        </div>\n                                        <div class=\"input-group-btn\">\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Delete group\" (click)=\"deleteGroup()\">\n                                                <i class=\"icon-cross\"></i>\n                                            </button>\n                                        </div>\n                                    </div>\n                                    <div *ngIf=\"formErrors.field.group\" class=\"alert alert-danger\">\n                                        {{formErrors.field.group}}\n                                    </div>\n\n                                    <div class=\"card p-1 mt-2\" #addGroupBlock style=\"display: none;\" [class.form-group-message]=\"formErrors.field.new_group\">\n                                        <input type=\"text\" class=\"form-control form-control-sm\" #addGroupField formControlName=\"new_group\">\n                                        <div *ngIf=\"formErrors.field.new_group\" class=\"alert alert-danger mb-1\">\n                                            {{formErrors.field.new_group}}\n                                        </div>\n                                        <div class=\"text-right mt-1\">\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"addGroup();\">\n                                                Add\n                                            </button>\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"addGroupBlock.style.display = 'none'; formErrors.field.new_group = ''\">\n                                                Cancel\n                                            </button>\n                                        </div>\n                                    </div>\n                                </div>\n\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row\">\n                            <div class=\"col-md-7 offset-md-5\">\n\n                                <label class=\"custom-control custom-checkbox\">\n                                    <input type=\"checkbox\" class=\"custom-control-input\" value=\"1\" name=\"is_filter\" formControlName=\"is_filter\">\n                                    <span class=\"custom-control-indicator\"></span>\n                                    <span class=\"small\">Показывать в фильтре</span>\n                                </label>\n\n                            </div>\n                        </div>\n\n                        <div>\n                            <button type=\"button\" class=\"btn btn-sm btn-info btn-wide\" (click)=\"submitField()\" [hidden]=\"action != 'add_field'\">\n                                <i class=\"icon-plus\"></i>\n                                Add field\n                            </button>\n                            <button type=\"button\" class=\"btn btn-sm btn-success btn-wide\" (click)=\"submitField()\" [hidden]=\"action != 'edit_field'\">\n                                <i class=\"icon-check\"></i>\n                                Save field\n                            </button>\n                            <button type=\"button\" class=\"btn btn-sm btn-secondary btn-wide\" (click)=\"editFieldCancel()\">\n                                Cancel\n                            </button>\n                        </div>\n\n                    </div>\n                </div>\n                <!-- /Field form -->\n\n            </div>\n        </div>\n\n        <div class=\"form-group row mt-3\">\n            <div class=\"col-12\">\n                <label class=\"label-filled\">\n                    Поля\n                </label>\n\n                <table class=\"table table-striped table-hover table-bordered mb-0\">\n                    <thead>\n                        <tr>\n                            <th>Название</th>\n                            <th>Системное имя</th>\n                            <th>Тип ввода</th>\n                            <th>Группа</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr class=\"show-on-hover-parent\" *ngFor=\"let item of model.fields\">\n                            <td>\n                                {{item.title}}\n                            </td>\n                            <td>\n                                {{item.name}}\n                            </td>\n                            <td>\n                                {{item.input_type}}\n                            </td>\n                            <td>\n                                <div class=\"relative\">\n                                    <div class=\"show-on-hover\">\n                                        <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"editField(item)\" [hidden]=\"item.name == currentFieldName\" ngbTooltip=\"Edit\">\n                                            <i class=\"icon-pencil\"></i>\n                                        </button>\n                                        <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"copyField(item)\" ngbTooltip=\"Copy\">\n                                            <i class=\"icon-stack\"></i>\n                                        </button>\n                                        <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"deleteField(item)\" [hidden]=\"item.name == currentFieldName\" ngbTooltip=\"Delete\">\n                                            <i class=\"icon-cross\"></i>\n                                        </button>\n                                    </div>\n                                </div>\n                                {{item.group}}\n                            </td>\n                        </tr>\n                        <tr [hidden]=\"model.fields.length > 0\" class=\"table-warning\">\n                            <td colspan=\"4\" class=\"text-center\">\n                                Empty\n                            </td>\n                        </tr>\n                    </tbody>\n                </table>\n\n                <div class=\"alert alert-danger mt-3 mb-0\" [hidden]=\"!errorMessage\">\n                    <button type=\"button\" class=\"close\" (click)=\"errorMessage = ''\">\n                        <span aria-hidden=\"true\">&times;</span>\n                    </button>\n                    {{errorMessage}}\n                </div>\n\n            </div>\n        </div>\n\n    </div>\n    <div class=\"modal-footer d-block\">\n        <button type=\"submit\" class=\"btn btn-success btn-wide\">\n            Save\n        </button>\n        <button type=\"submit\" class=\"btn btn-secondary btn-wide\" (click)=\"activeModal.dismiss()\">\n            Cancel\n        </button>\n    </div>\n\n</form>"

/***/ }),

/***/ 238:
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-block\">\n    <div class=\"d-block float-right\">\n        <button type=\"button\" class=\"btn btn-secondary\" (click)=\"activeModal.dismiss()\">\n            Close\n        </button>\n    </div>\n    <h4 class=\"modal-title\">{{modalTitle}}</h4>\n</div>\n<div class=\"modal-body\">\n\n    <form (ngSubmit)=\"onSubmit()\" [class.loading]=\"loading\">\n\n        <div>\n\n            <div class=\"row form-group\">\n                <div class=\"col-md-5\">\n                    <label for=\"fieldContentType\">Тип контента</label>\n                </div>\n                <div class=\"col-md-7\">\n                    <select id=\"fieldContentType\" class=\"form-control\">\n                        <option value=\"1\">Электроника</option>\n                        <option value=\"0\">Одежда</option>\n                    </select>\n                </div>\n            </div>\n\n            <ngb-tabset>\n                <ngb-tab title=\"Tab 1\" id=\"1\">\n                    <ng-template ngbTabContent>\n\n                        <div class=\"pt-3\">\n\n                            <div class=\"row form-group\">\n                                <div class=\"col-md-5\">\n                                    <label for=\"fieldName\">Системное имя</label>\n                                </div>\n                                <div class=\"col-md-7\">\n                                    <input type=\"text\" id=\"fieldName\" class=\"form-control\">\n                                </div>\n                            </div>\n\n                            <div class=\"row form-group\">\n                                <div class=\"col-md-5\">\n                                    <label for=\"fieldTitle\">Название</label>\n                                </div>\n                                <div class=\"col-md-7\">\n                                    <input type=\"text\" id=\"fieldTitle\" class=\"form-control\">\n                                </div>\n                            </div>\n\n                            <div class=\"row form-group\">\n                                <div class=\"col-md-5\">\n                                    <label for=\"fieldDescription\">Описание</label>\n                                </div>\n                                <div class=\"col-md-7\">\n                                    <textarea type=\"text\" id=\"fieldDescription\" rows=\"4\" class=\"form-control\" name=\"description\"></textarea>\n                                </div>\n                            </div>\n\n                            <div class=\"row form-group\">\n                                <div class=\"col-md-5\">\n                                    <label for=\"fieldTitle\">Цена</label>\n                                </div>\n                                <div class=\"col-md-7\">\n                                    <input type=\"number\" id=\"fieldPrice\" class=\"form-control\">\n                                </div>\n                            </div>\n\n                        </div>\n\n                    </ng-template>\n                </ngb-tab>\n                <ngb-tab title=\"Tab 2\" id=\"2\">\n                    <ng-template ngbTabContent>\n                        <p class=\"pt-3\">Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table\n                            craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl\n                            cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit. Keytar helvetica VHS salvia\n                            yr, vero magna velit sapiente labore stumptown. Vegan fanny pack odio cillum wes anderson 8-bit, sustainable jean\n                            shorts beard ut DIY ethical culpa terry richardson biodiesel. Art party scenester stumptown, tumblr butcher vero\n                            sint qui sapiente accusamus tattooed echo park.</p>\n                    </ng-template>\n                </ngb-tab>\n                <ngb-tab title=\"Tab 3\" id=\"3\">\n                    <ng-template ngbTabContent>\n                        <p class=\"pt-3\">Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth\n                            master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh\n                            dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum\n                            iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui.</p>\n                    </ng-template>\n                </ngb-tab>\n            </ngb-tabset>\n\n\n\n\n        </div>\n\n    </form>\n\n</div>\n<div class=\"modal-footer d-block\">\n    <button type=\"submit\" class=\"btn btn-success btn-wide\">\n        Save\n    </button>\n    <button type=\"submit\" class=\"btn btn-secondary btn-wide\" (click)=\"activeModal.dismiss()\">\n        Cancel\n    </button>\n</div>"

/***/ }),

/***/ 239:
/***/ (function(module, exports) {

module.exports = "\n<div class=\"card\">\n\n    <div class=\"card-block\">\n\n        <div class=\"float-right\">\n            <a class=\"btn btn-primary\" [routerLink]=\"['/catalog/content_types']\">\n                <i class=\"icon-box\"></i>\n                Типы товаров\n            </a>\n        </div>\n        <h3>\n            <i class=\"icon-layers\"></i>\n            {{title}}\n        </h3>\n\n        <hr>\n\n        <div class=\"float-right\">\n\n            <div ngbDropdown class=\"d-inline-block\">\n                <button class=\"btn btn-outline-info\" id=\"dropdownBasic1\" ngbDropdownToggle>\n                    Массовые дейсвия\n                </button>\n                <div class=\"dropdown-menu\" aria-labelledby=\"dropdownBasic1\">\n                    <button class=\"dropdown-item\">Отключить / включить</button>\n                    <button class=\"dropdown-item\">Удалить</button>\n                </div>\n            </div>\n\n            <button type=\"button\" class=\"btn btn-outline-success\" (click)=\"modalOpen()\">\n                <i class=\"icon-plus\"></i>\n                Add product\n            </button>\n\n        </div>\n        <div class=\"float-left\">\n\n            <div class=\"d-inline-block dropdown\">\n                <button class=\"btn btn-info dropdown-toggle dropdown-toggle-hover\">\n                    <i class=\"icon-folder\"></i>\n                    {{currentCategory.title}}\n                </button>\n                <div class=\"dropdown-menu\" #categoriesDropdown>\n                    <div class=\"dropdown-header\">\n                        <button class=\"btn btn-sm btn-secondary\" ngbTooltip=\"Open root category\" (click)=\"openRootCategory()\" *ngIf=\"currentCategory.id > 0\">\n                            <i class=\"icon-folder\"></i>\n                        </button>\n                        <button type=\"button\" class=\"btn btn-sm btn-secondary\" ngbTooltip=\"Add new category\" (click)=\"openModalCategory()\">\n                            <i class=\"icon-plus\"></i>\n                        </button>\n                        <button type=\"button\" class=\"btn btn-sm btn-secondary\" ngbTooltip=\"Edit current category\" (click)=\"openModalCategory(currentCategory.id)\" [hidden]=\"currentCategory.id == 0\">\n                            <i class=\"icon-pencil\"></i>\n                        </button>\n                        <button type=\"button\" class=\"btn btn-sm btn-secondary\" ngbTooltip=\"Copy category\" [hidden]=\"currentCategory.id == 0\">\n                            <i class=\"icon-stack\"></i>\n                        </button>\n                        <button type=\"button\" class=\"btn btn-sm btn-secondary\" ngbTooltip=\"Move current category\" [hidden]=\"currentCategory.id == 0\">\n                            <i class=\"icon-arrow-right\"></i>\n                        </button>\n                        <button type=\"button\" class=\"btn btn-sm btn-secondary\" ngbTooltip=\"Delete current category\" (click)=\"deleteCategoryItemConfirm(currentCategory.id)\" [hidden]=\"currentCategory.id == 0\">\n                            <i class=\"icon-cross\"></i>\n                        </button>\n                    </div>\n                    <div class=\"dropdown-divider\"></div>\n                    <div class=\"dropdown-header\" *ngIf=\"categories.length == 0\">\n                        No categories.\n                    </div>\n\n                    <button class=\"dropdown-item\" *ngFor=\"let category of categories\" (click)=\"selectCategory(category)\" [class.active]=\"category.id == currentCategory.id\">\n                        <i class=\"icon-folder\"></i>\n                        {{category.title}}\n                    </button>\n\n                    <!--div ngbDropdown #secondDrop=\"ngbDropdown\" (mouseleave)=\"secondDrop.close()\">\n                        <button class=\"dropdown-item active\" ngbDropdownToggle (mouseenter)=\"secondDrop.open()\">Вторая категория</button>\n                        <div class=\"dropdown-menu\">\n                            <button class=\"dropdown-item\">Первая подкатегория</button>\n                            <button class=\"dropdown-item active\">Вторая подкатегория</button>\n                            <button class=\"dropdown-item\">Третья подкатегория</button>\n                        </div>\n                    </div>\n                    <button class=\"dropdown-item\">Третья категория</button>\n                    <div ngbDropdown #thirdDrop=\"ngbDropdown\" (mouseleave)=\"thirdDrop.close()\">\n                        <button class=\"dropdown-item\" ngbDropdownToggle (mouseenter)=\"thirdDrop.open()\">Четвертая категория</button>\n                        <div class=\"dropdown-menu\">\n                            <button class=\"dropdown-item\">Первая подкатегория</button>\n                            <button class=\"dropdown-item\">Вторая подкатегория</button>\n                            <button class=\"dropdown-item\">Третья подкатегория</button>\n                        </div>\n                    </div>\n                    <button class=\"dropdown-item\">Пятая категория</button-->\n                </div>\n            </div>\n\n        </div>\n    </div>\n\n    <div class=\"table-responsive\" [class.loading]=\"loading\">\n        <table class=\"table table-hover mb-0\">\n            <thead>\n            <tr>\n                <th>\n                    <label class=\"custom-control custom-checkbox\">\n                        <input type=\"checkbox\" class=\"custom-control-input\">\n                        <span class=\"custom-control-indicator\"></span>\n                    </label>\n                </th>\n                <th>ID</th>\n                <th>Название</th>\n                <th>Цена</th>\n                <th class=\"text-center\">Статус</th>\n            </tr>\n            </thead>\n            <tbody>\n            <tr class=\"show-on-hover-parent\">\n                <td>\n                    <label class=\"custom-control custom-checkbox\">\n                        <input type=\"checkbox\" class=\"custom-control-input\">\n                        <span class=\"custom-control-indicator\"></span>\n                    </label>\n                </td>\n                <th>1</th>\n                <td>\n                    Первый\n                </td>\n                <td>\n                    2 200\n                </td>\n                <td class=\"text-center\">\n                    <div class=\"relative\">\n                        <div class=\"show-on-hover\">\n                            <button class=\"btn btn-secondary btn-sm\">\n                                <i class=\"icon-pencil\"></i>\n                            </button>\n                            <button class=\"btn btn-secondary btn-sm\">\n                                <i class=\"icon-cross\"></i>\n                            </button>\n                        </div>\n                    </div>\n                    <i class=\"big text-success icon-circle-check\"></i>\n                </td>\n            </tr>\n            <tr class=\"show-on-hover-parent\">\n                <td>\n                    <label class=\"custom-control custom-checkbox\">\n                        <input type=\"checkbox\" class=\"custom-control-input\">\n                        <span class=\"custom-control-indicator\"></span>\n                    </label>\n                </td>\n                <th>1</th>\n                <td>\n                    Первый\n                </td>\n                <td>\n                    2 200\n                </td>\n                <td class=\"text-center\">\n                    <div class=\"relative\">\n                        <div class=\"show-on-hover\">\n                            <button class=\"btn btn-secondary btn-sm\">\n                                <i class=\"icon-pencil\"></i>\n                            </button>\n                            <button class=\"btn btn-secondary btn-sm\">\n                                <i class=\"icon-cross\"></i>\n                            </button>\n                        </div>\n                    </div>\n                    <i class=\"big text-success icon-circle-check\"></i>\n                </td>\n            </tr>\n            <tr class=\"show-on-hover-parent\">\n                <td>\n                    <label class=\"custom-control custom-checkbox\">\n                        <input type=\"checkbox\" class=\"custom-control-input\">\n                        <span class=\"custom-control-indicator\"></span>\n                    </label>\n                </td>\n                <th>1</th>\n                <td>\n                    Первый\n                </td>\n                <td>\n                    2 200\n                </td>\n                <td class=\"text-center\">\n                    <div class=\"relative\">\n                        <div class=\"show-on-hover\">\n                            <button class=\"btn btn-secondary btn-sm\">\n                                <i class=\"icon-pencil\"></i>\n                            </button>\n                            <button class=\"btn btn-secondary btn-sm\">\n                                <i class=\"icon-cross\"></i>\n                            </button>\n                        </div>\n                    </div>\n                    <i class=\"big text-success icon-circle-check\"></i>\n                </td>\n            </tr>\n            </tbody>\n        </table>\n    </div>\n\n    <div class=\"card-footer\">\n\n        <div class=\"float-right\">\n            <select class=\"form-control\">\n                <option value=\"10\">10</option>\n                <option value=\"50\">50</option>\n                <option value=\"100\">100</option>\n            </select>\n        </div>\n\n        <ngb-pagination [class]=\"'mb-0'\" [collectionSize]=\"120\" [page]=\"1\" [maxSize]=\"8\" [rotate]=\"true\" [boundaryLinks]=\"false\"></ngb-pagination>\n\n    </div>\n</div>\n"

/***/ }),

/***/ 240:
/***/ (function(module, exports) {

module.exports = "\n<div class=\"card\">\n    <div class=\"card-block\">\n\n        <h3>\n            <i class=\"icon-box\"></i>\n            {{title}}\n        </h3>\n\n        <hr>\n\n        <div class=\"float-right\">\n\n            <div ngbDropdown class=\"d-inline-block\">\n                <button class=\"btn btn-outline-info\" id=\"dropdownBasic1\" ngbDropdownToggle>\n                    Массовые дейсвия\n                </button>\n                <div class=\"dropdown-menu\" aria-labelledby=\"dropdownBasic1\">\n                    <button class=\"dropdown-item\">Отключить / включить</button>\n                    <button class=\"dropdown-item\">Удалить</button>\n                </div>\n            </div>\n\n            <button type=\"button\" class=\"btn btn-outline-success d-inline-block btn-wide\" (click)=\"modalOpen()\">\n                <i class=\"icon-plus\"></i>\n                Add\n            </button>\n        </div>\n        <div class=\"float-left\">\n            <a class=\"btn btn-secondary\" [routerLink]=\"['/catalog']\">\n                <i class=\"icon-arrow-left\"></i>\n                Каталог\n            </a>\n        </div>\n    </div>\n\n    <div class=\"table-responsive\" [class.loading]=\"loading\">\n        <table class=\"table table-striped table-hover mb-0\">\n            <thead>\n                <tr>\n                    <th>\n                        <label class=\"custom-control custom-checkbox\">\n                            <input type=\"checkbox\" class=\"custom-control-input\" (click)=\"selectAll($event)\">\n                            <span class=\"custom-control-indicator\"></span>\n                        </label>\n                    </th>\n                    <th>\n                        <a href=\"#\">\n                            Системное имя\n                            <i class=\"icon-arrow-down\"></i>\n                        </a>\n                    </th>\n                    <th>\n                        <a href=\"#\">\n                            Название\n                        </a>\n                    </th>\n                    <th>\n                        <a href=\"#\">\n                            Коллекция\n                        </a>\n                    </th>\n                    <th>\n                        <a href=\"#\">\n                            Описание\n                        </a>\n                    </th>\n                    <th class=\"text-center\">\n                        <a href=\"#\">\n                            Статус\n                        </a>\n                    </th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr class=\"show-on-hover-parent\" *ngFor=\"let item of items\" [class.text-muted]=\"!item.is_active\">\n                    <td>\n                        <label class=\"custom-control custom-checkbox\">\n                            <input type=\"checkbox\" class=\"custom-control-input\" [checked]=\"getIsSelected(item.id)\" (click)=\"setSelected($event, item.id)\">\n                            <span class=\"custom-control-indicator\"></span>\n                        </label>\n                    </td>\n                    <td>\n                        {{item.name}}\n                    </td>\n                    <td>\n                        {{item.title}}\n                    </td>\n                    <td>\n                        {{item.collection}}\n                    </td>\n                    <td>\n                        <div class=\"small\">{{item.description}}</div>\n                    </td>\n                    <td class=\"text-center\">\n                        <div class=\"relative\">\n                            <div class=\"show-on-hover\">\n                                <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"modalOpen(item.id)\" ngbTooltip=\"Edit\">\n                                    <i class=\"icon-pencil\"></i>\n                                </button>\n                                <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"modalOpen(item.id, true)\" ngbTooltip=\"Copy\">\n                                    <i class=\"icon-stack\"></i>\n                                </button>\n                                <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"deleteItemConfirm(item.id)\" ngbTooltip=\"Delete\">\n                                    <i class=\"icon-cross\"></i>\n                                </button>\n                            </div>\n                        </div>\n                        <i class=\"big text-success icon-circle-check\" [hidden]=\"!item.is_active\"></i>\n                        <i class=\"big text-muted icon-circle-cross\" [hidden]=\"item.is_active\"></i>\n                    </td>\n                </tr>\n                <tr [hidden]=\"items.length > 0\" class=\"table-warning\">\n                    <td colspan=\"5\" class=\"text-center\">\n                        Empty\n                    </td>\n                </tr>\n            </tbody>\n        </table>\n    </div>\n\n    <div class=\"card-footer\">\n\n        <div class=\"float-right\">\n            <select class=\"form-control\">\n                <option value=\"10\">10</option>\n                <option value=\"50\">50</option>\n                <option value=\"100\">100</option>\n            </select>\n        </div>\n\n        <ngb-pagination [class]=\"'mb-0'\" [collectionSize]=\"120\" [page]=\"1\" [maxSize]=\"8\" [rotate]=\"true\" [boundaryLinks]=\"false\"></ngb-pagination>\n\n    </div>\n</div>\n"

/***/ }),

/***/ 241:
/***/ (function(module, exports) {

module.exports = "\n<div class=\"card\">\n\n    <div class=\"card-block\">\n\n        <h3>\n            <i class=\"icon-bag\"></i>\n            {{title}}\n        </h3>\n\n        <hr>\n\n        <div class=\"float-right\">\n\n            <div ngbDropdown class=\"d-inline-block\">\n                <button class=\"btn btn-outline-primary\" id=\"dropdownBasic1\" ngbDropdownToggle>\n                    Массовые дейсвия\n                </button>\n                <div class=\"dropdown-menu\" aria-labelledby=\"dropdownBasic1\">\n                    <button class=\"dropdown-item\">Изменить статус</button>\n                    <button class=\"dropdown-item\">Удалить</button>\n                </div>\n            </div>\n\n        </div>\n        <div class=\"float-left\">\n\n            <div class=\"input-group\">\n                <input class=\"form-control\" placeholder=\"yyyy-mm-dd\"\n                       name=\"dp\" ngbDatepicker #d=\"ngbDatepicker\">\n                <div class=\"input-group-addon\" (click)=\"d.toggle()\">\n                    <i class=\"icon-grid\"></i>\n                </div>\n            </div>\n\n        </div>\n\n    </div>\n\n    <div class=\"table-responsive\">\n        <table class=\"table table-striped table-hover mb-0\">\n            <thead>\n            <tr>\n                <th>\n                    <label class=\"custom-control custom-checkbox\">\n                        <input type=\"checkbox\" class=\"custom-control-input\">\n                        <span class=\"custom-control-indicator\"></span>\n                    </label>\n                </th>\n                <th>ID</th>\n                <th>Статус</th>\n                <th>Дата и время</th>\n                <th>Кол-во товаров</th>\n                <th>Общая цена</th>\n                <th>Пользователь</th>\n            </tr>\n            </thead>\n            <tbody>\n                <tr class=\"show-on-hover-parent\">\n                    <td>\n                        <label class=\"custom-control custom-checkbox\">\n                            <input type=\"checkbox\" class=\"custom-control-input\">\n                            <span class=\"custom-control-indicator\"></span>\n                        </label>\n                    </td>\n                    <th>1</th>\n                    <td>\n                        <button type=\"button\" class=\"btn btn-sm btn-info min-width150\">\n                            Новый\n                        </button>\n                    </td>\n                    <td>\n                        01.03.2017\n                    </td>\n                    <td>\n                        2\n                    </td>\n                    <td>\n                        1 100\n                    </td>\n                    <td>\n                        <div class=\"relative\">\n                            <div class=\"show-on-hover\">\n                                <button class=\"btn btn-secondary btn-sm\">\n                                    <i class=\"icon-pencil\"></i>\n                                </button>\n                                <button class=\"btn btn-secondary btn-sm\">\n                                    <i class=\"icon-cross\"></i>\n                                </button>\n                            </div>\n                        </div>\n                        username@domain.com\n                    </td>\n                </tr>\n                <tr class=\"show-on-hover-parent\">\n                    <td>\n                        <label class=\"custom-control custom-checkbox\">\n                            <input type=\"checkbox\" class=\"custom-control-input\">\n                            <span class=\"custom-control-indicator\"></span>\n                        </label>\n                    </td>\n                    <th>2</th>\n                    <td>\n                        <button type=\"button\" class=\"btn btn-sm btn-success min-width150\">\n                            Выполнен\n                        </button>\n                    </td>\n                    <td>\n                        22.02.2017\n                    </td>\n                    <td>\n                        3\n                    </td>\n                    <td>\n                        2 300\n                    </td>\n                    <td>\n                        <div class=\"relative\">\n                            <div class=\"show-on-hover\">\n                                <button class=\"btn btn-secondary btn-sm\">\n                                    <i class=\"icon-pencil\"></i>\n                                </button>\n                                <button class=\"btn btn-secondary btn-sm\">\n                                    <i class=\"icon-cross\"></i>\n                                </button>\n                            </div>\n                        </div>\n                        username@domain.com\n                    </td>\n                </tr>\n                <tr class=\"show-on-hover-parent\">\n                    <td>\n                        <label class=\"custom-control custom-checkbox\">\n                            <input type=\"checkbox\" class=\"custom-control-input\">\n                            <span class=\"custom-control-indicator\"></span>\n                        </label>\n                    </td>\n                    <th>3</th>\n                    <td>\n                        <button type=\"button\" class=\"btn btn-sm btn-info min-width150\">\n                            Новый\n                        </button>\n                    </td>\n                    <td>\n                        20.02.2017\n                    </td>\n                    <td>\n                        5\n                    </td>\n                    <td>\n                        5 520\n                    </td>\n                    <td>\n                        <div class=\"relative\">\n                            <div class=\"show-on-hover\">\n                                <button class=\"btn btn-secondary btn-sm\">\n                                    <i class=\"icon-pencil\"></i>\n                                </button>\n                                <button class=\"btn btn-secondary btn-sm\">\n                                    <i class=\"icon-cross\"></i>\n                                </button>\n                            </div>\n                        </div>\n                        username@domain.com\n                    </td>\n                </tr>\n                <tr class=\"show-on-hover-parent\">\n                    <td>\n                        <label class=\"custom-control custom-checkbox\">\n                            <input type=\"checkbox\" class=\"custom-control-input\">\n                            <span class=\"custom-control-indicator\"></span>\n                        </label>\n                    </td>\n                    <th>3</th>\n                    <td>\n                        <button type=\"button\" class=\"btn btn-sm btn-info min-width150\">\n                            Новый\n                        </button>\n                    </td>\n                    <td>\n                        20.02.2017\n                    </td>\n                    <td>\n                        5\n                    </td>\n                    <td>\n                        5 520\n                    </td>\n                    <td>\n                        <div class=\"relative\">\n                            <div class=\"show-on-hover\">\n                                <button class=\"btn btn-secondary btn-sm\">\n                                    <i class=\"icon-pencil\"></i>\n                                </button>\n                                <button class=\"btn btn-secondary btn-sm\">\n                                    <i class=\"icon-cross\"></i>\n                                </button>\n                            </div>\n                        </div>\n                        username@domain.com\n                    </td>\n                </tr>\n            </tbody>\n        </table>\n    </div>\n\n    <div class=\"card-footer\">\n\n        <div class=\"float-right\">\n            <select class=\"form-control\">\n                <option value=\"10\">10</option>\n                <option value=\"50\">50</option>\n                <option value=\"100\">100</option>\n            </select>\n        </div>\n\n        <ngb-pagination [class]=\"'mb-0'\" [collectionSize]=\"120\" [page]=\"1\" [maxSize]=\"8\" [rotate]=\"true\" [boundaryLinks]=\"false\"></ngb-pagination>\n\n    </div>\n\n</div>"

/***/ }),

/***/ 242:
/***/ (function(module, exports) {

module.exports = "<div class=\"card\">\n    <div class=\"card-block\">\n\n        <div class=\"float-right\">\n            <!--a class=\"btn btn-primary\" [routerLink]=\"['/settings/input_types']\">\n                <i class=\"icon-upload\"></i>\n                Типы ввода\n            </a>\n            <a class=\"btn btn-primary\" [routerLink]=\"['/settings/output_types']\">\n                <i class=\"icon-download\"></i>\n                Типы вывода\n            </a-->\n        </div>\n\n        <h3>\n            <i class=\"icon-bar-graph-2\"></i>\n            {{title}}\n        </h3>\n\n        <hr>\n\n    </div>\n</div>"

/***/ }),

/***/ 243:
/***/ (function(module, exports) {

module.exports = "<div class=\"card\">\n    <div class=\"card-block\">\n\n        <h3>\n            <i class=\"icon-bar-graph-2\"></i>\n            {{title}}\n        </h3>\n\n        <hr>\n\n    </div>\n</div>"

/***/ }),

/***/ 279:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(165);


/***/ }),

/***/ 57:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__ = __webpack_require__(23);
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
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["O" /* Input */])(),
    __metadata("design:type", Object)
], ConfirmModalContent.prototype, "modalTitle", void 0);
__decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["O" /* Input */])(),
    __metadata("design:type", Object)
], ConfirmModalContent.prototype, "modalContent", void 0);
ConfirmModalContent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_0" /* Component */])({
        selector: 'modal_confirm',
        template: __webpack_require__(236),
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
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_0" /* Component */])({
        selector: 'app-root',
        template: __webpack_require__(234),
        styles: [__webpack_require__(233)],
        providers: [__WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["c" /* NgbTooltipConfig */]]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["c" /* NgbTooltipConfig */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["c" /* NgbTooltipConfig */]) === "function" && _b || Object])
], AppComponent);

var _a, _b;
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 58:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CategoriesService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var CategoriesService = (function () {
    function CategoriesService(http) {
        this.http = http;
        this.headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json' });
        this.listUrl = 'app/categories_list';
        this.oneUrl = 'app/category';
    }
    CategoriesService.prototype.createItem = function (item) {
        return this.http
            .post(this.oneUrl, JSON.stringify(item), { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    CategoriesService.prototype.editItem = function (id, item) {
        var url = this.oneUrl + "/" + id;
        return this.http
            .put(url, JSON.stringify(item), { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    CategoriesService.prototype.getItem = function (id) {
        var url = this.oneUrl + "/" + id;
        return this.http.get(url)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .catch(this.handleError);
    };
    CategoriesService.prototype.getList = function () {
        return this.http.get(this.listUrl)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    CategoriesService.prototype.deleteItem = function (id) {
        var url = this.oneUrl + "/" + id;
        return this.http.delete(url, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    CategoriesService.prototype.extractData = function (res) {
        var body = res.json();
        return body.data || {};
    };
    CategoriesService.prototype.handleError = function (error) {
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
    return CategoriesService;
}());
CategoriesService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */]) === "function" && _a || Object])
], CategoriesService);

var _a;
//# sourceMappingURL=categories.service.js.map

/***/ })

},[279]);
//# sourceMappingURL=main.bundle.js.map