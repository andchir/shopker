webpackJsonp(["main"],{

/***/ "../../../../../locale/messages.ru.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TRANSLATION_RU; });
var TRANSLATION_RU = "\n<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<xliff version=\"1.2\" xmlns=\"urn:oasis:names:tc:xliff:document:1.2\">\n    <file source-language=\"en\" datatype=\"plaintext\" original=\"ng2.template\">\n        <body>\n            <trans-unit id=\"4e7f5f07ae8e67878f35b34bcee10e39300ff41a\" datatype=\"html\">\n                <source>Orders</source>\n                <target>\u0417\u0430\u043A\u0430\u0437\u044B</target>\n            </trans-unit>\n            <trans-unit id=\"61e0f26d843eec0b33ff475e111b0c2f7a80b835\" datatype=\"html\">\n                <source>Statistics</source>\n                <target>\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430</target>\n            </trans-unit>\n            <trans-unit id=\"532152365f64d8738343423767f1130c1a451e78\" datatype=\"html\">\n                <source>Catalog</source>\n                <target>\u041A\u0430\u0442\u0430\u043B\u043E\u0433</target>\n            </trans-unit>\n            <trans-unit id=\"121cc5391cd2a5115bc2b3160379ee5b36cd7716\" datatype=\"html\">\n                <source>Settings</source>\n                <target>\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438</target>\n            </trans-unit>\n            <trans-unit id=\"1f332ec66f3bc8d943c248091be7f92772ba280f\" datatype=\"html\">\n                <source>Expand</source>\n                <target>\u0420\u0430\u0437\u0432\u0435\u0440\u043D\u0443\u0442\u044C</target>\n            </trans-unit>\n            <trans-unit id=\"e8bcb762b48cf52fbea66ce9c4f6b970b99a80fd\" datatype=\"html\">\n                <source>Collapse</source>\n                <target>\u0421\u0432\u0435\u0440\u043D\u0443\u0442\u044C</target>\n            </trans-unit>\n        </body>\n    </file>\n</xliff>\n";
//# sourceMappingURL=messages.ru.js.map

/***/ }),

/***/ "../../../../../src/$$_gendir lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "../../../../../src/$$_gendir lazy recursive";

/***/ }),

/***/ "../../../../../src/app/app-routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppRoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__not_found_component__ = __webpack_require__("../../../../../src/app/not-found.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__orders_component__ = __webpack_require__("../../../../../src/app/orders.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__catalog_component__ = __webpack_require__("../../../../../src/app/catalog.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__catalog_category_component__ = __webpack_require__("../../../../../src/app/catalog-category.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__content_types_component__ = __webpack_require__("../../../../../src/app/content-types.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__field_types_component__ = __webpack_require__("../../../../../src/app/field-types.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__stat_component__ = __webpack_require__("../../../../../src/app/stat.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__settings_component__ = __webpack_require__("../../../../../src/app/settings.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};










var routes = [
    {
        path: '',
        redirectTo: '/orders',
        pathMatch: 'full'
    },
    {
        path: 'orders',
        component: __WEBPACK_IMPORTED_MODULE_3__orders_component__["a" /* OrdersComponent */],
        data: { title: 'Orders' }
    },
    {
        path: 'catalog',
        component: __WEBPACK_IMPORTED_MODULE_4__catalog_component__["a" /* CatalogComponent */],
        data: { title: 'Catalog' },
        children: [
            {
                path: '',
                redirectTo: 'category/0',
                pathMatch: 'full'
            },
            {
                path: 'category/:categoryId',
                component: __WEBPACK_IMPORTED_MODULE_5__catalog_category_component__["a" /* CatalogCategoryComponent */],
                data: { title: 'Catalog' }
            },
            {
                path: 'content_types',
                component: __WEBPACK_IMPORTED_MODULE_6__content_types_component__["b" /* ContentTypesComponent */],
                data: { title: 'Content types' }
            },
            {
                path: 'field_types',
                component: __WEBPACK_IMPORTED_MODULE_7__field_types_component__["b" /* FieldTypesComponent */],
                data: { title: 'Field types' }
            },
        ]
    },
    {
        path: 'statistics',
        component: __WEBPACK_IMPORTED_MODULE_8__stat_component__["a" /* StatisticsComponent */],
        data: { title: 'Statistics' }
    },
    {
        path: 'settings',
        component: __WEBPACK_IMPORTED_MODULE_9__settings_component__["a" /* SettingsComponent */],
        data: { title: 'Settings' }
    },
    {
        path: '**',
        component: __WEBPACK_IMPORTED_MODULE_2__not_found_component__["a" /* NotFoundComponent */],
        data: { title: 'Page not found' }
    }
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    return AppRoutingModule;
}());
AppRoutingModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        imports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["RouterModule"].forRoot(routes, { useHash: true })],
        exports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["RouterModule"]]
    })
], AppRoutingModule);

//# sourceMappingURL=app-routing.module.js.map

/***/ }),

/***/ "../../../../../src/app/app.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return ConfirmModalContent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AlertModalContent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__ = __webpack_require__("../../../../@ng-bootstrap/ng-bootstrap/index.js");
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
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], ConfirmModalContent.prototype, "modalTitle", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], ConfirmModalContent.prototype, "modalContent", void 0);
ConfirmModalContent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'modal-confirm',
        template: __webpack_require__("../../../../../src/app/templates/modal-confirm.html"),
        providers: []
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */]) === "function" && _a || Object])
], ConfirmModalContent);

var AlertModalContent = (function () {
    function AlertModalContent(activeModal) {
        this.activeModal = activeModal;
    }
    return AlertModalContent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], AlertModalContent.prototype, "modalTitle", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], AlertModalContent.prototype, "modalContent", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], AlertModalContent.prototype, "messageType", void 0);
AlertModalContent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'modal-alert',
        template: __webpack_require__("../../../../../src/app/templates/modal-alert.html"),
        providers: []
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */]) === "function" && _b || Object])
], AlertModalContent);

var AppComponent = (function () {
    function AppComponent(tooltipConfig) {
        this.title = 'Shopkeeper';
        tooltipConfig.placement = 'bottom';
        tooltipConfig.container = 'body';
        tooltipConfig.triggers = 'hover click';
    }
    return AppComponent;
}());
AppComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-root',
        template: __webpack_require__("../../../../../src/app/templates/app.component.html"),
        styles: [__webpack_require__("../../../../../src/app/app.component.css")],
        providers: [__WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["e" /* NgbTooltipConfig */]]
    }),
    __metadata("design:paramtypes", [typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["e" /* NgbTooltipConfig */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["e" /* NgbTooltipConfig */]) === "function" && _c || Object])
], AppComponent);

var _a, _b, _c;
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ "../../../../../src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_animations__ = __webpack_require__("../../../platform-browser/@angular/platform-browser/animations.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ng_bootstrap_ng_bootstrap__ = __webpack_require__("../../../../@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_primeng_primeng__ = __webpack_require__("../../../../primeng/primeng.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_primeng_primeng___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_primeng_primeng__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__not_found_component__ = __webpack_require__("../../../../../src/app/not-found.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__orders_component__ = __webpack_require__("../../../../../src/app/orders.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__catalog_component__ = __webpack_require__("../../../../../src/app/catalog.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__catalog_category_component__ = __webpack_require__("../../../../../src/app/catalog-category.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__product_component__ = __webpack_require__("../../../../../src/app/product.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__categories_component__ = __webpack_require__("../../../../../src/app/categories.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__content_types_component__ = __webpack_require__("../../../../../src/app/content-types.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__field_types_component__ = __webpack_require__("../../../../../src/app/field-types.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__stat_component__ = __webpack_require__("../../../../../src/app/stat.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__settings_component__ = __webpack_require__("../../../../../src/app/settings.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__list_recursive_component__ = __webpack_require__("../../../../../src/app/list-recursive.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__table_component__ = __webpack_require__("../../../../../src/app/table.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__render_input_field__ = __webpack_require__("../../../../../src/app/render-input-field.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__render_output_field__ = __webpack_require__("../../../../../src/app/render-output-field.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pipes_filter_field_by_group_pipe__ = __webpack_require__("../../../../../src/app/pipes/filter-field-by-group.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pipes_orderby_pipe__ = __webpack_require__("../../../../../src/app/pipes/orderby.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__services_products_service__ = __webpack_require__("../../../../../src/app/services/products.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__services_content_types_service__ = __webpack_require__("../../../../../src/app/services/content_types.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__services_categories_service__ = __webpack_require__("../../../../../src/app/services/categories.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__app_routing_module__ = __webpack_require__("../../../../../src/app/app-routing.module.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




























var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["NgModule"])({
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["BrowserModule"],
            __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_forms__["FormsModule"],
            __WEBPACK_IMPORTED_MODULE_3__angular_forms__["ReactiveFormsModule"],
            __WEBPACK_IMPORTED_MODULE_4__angular_http__["c" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_27__app_routing_module__["a" /* AppRoutingModule */],
            __WEBPACK_IMPORTED_MODULE_5__ng_bootstrap_ng_bootstrap__["d" /* NgbModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_6_primeng_primeng__["EditorModule"],
            __WEBPACK_IMPORTED_MODULE_6_primeng_primeng__["CalendarModule"]
        ],
        declarations: [
            __WEBPACK_IMPORTED_MODULE_7__app_component__["b" /* AppComponent */],
            __WEBPACK_IMPORTED_MODULE_8__not_found_component__["a" /* NotFoundComponent */],
            __WEBPACK_IMPORTED_MODULE_9__orders_component__["a" /* OrdersComponent */],
            __WEBPACK_IMPORTED_MODULE_13__categories_component__["b" /* CategoriesMenuComponent */],
            __WEBPACK_IMPORTED_MODULE_10__catalog_component__["a" /* CatalogComponent */],
            __WEBPACK_IMPORTED_MODULE_11__catalog_category_component__["a" /* CatalogCategoryComponent */],
            __WEBPACK_IMPORTED_MODULE_14__content_types_component__["b" /* ContentTypesComponent */],
            __WEBPACK_IMPORTED_MODULE_15__field_types_component__["b" /* FieldTypesComponent */],
            __WEBPACK_IMPORTED_MODULE_16__stat_component__["a" /* StatisticsComponent */],
            __WEBPACK_IMPORTED_MODULE_17__settings_component__["a" /* SettingsComponent */],
            __WEBPACK_IMPORTED_MODULE_18__list_recursive_component__["a" /* ListRecursiveComponent */],
            __WEBPACK_IMPORTED_MODULE_19__table_component__["a" /* TableComponent */],
            __WEBPACK_IMPORTED_MODULE_13__categories_component__["a" /* CategoriesListComponent */],
            __WEBPACK_IMPORTED_MODULE_20__render_input_field__["a" /* InputFieldComponent */],
            __WEBPACK_IMPORTED_MODULE_21__render_output_field__["a" /* OutputFieldComponent */],
            __WEBPACK_IMPORTED_MODULE_22__pipes_filter_field_by_group_pipe__["a" /* FilterFieldByGroup */],
            __WEBPACK_IMPORTED_MODULE_23__pipes_orderby_pipe__["a" /* OrderByPipe */],
            __WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* AlertModalContent */],
            __WEBPACK_IMPORTED_MODULE_7__app_component__["c" /* ConfirmModalContent */],
            __WEBPACK_IMPORTED_MODULE_12__product_component__["a" /* ProductModalContent */],
            __WEBPACK_IMPORTED_MODULE_14__content_types_component__["a" /* ContentTypeModalContent */],
            __WEBPACK_IMPORTED_MODULE_13__categories_component__["c" /* CategoriesModalComponent */],
            __WEBPACK_IMPORTED_MODULE_15__field_types_component__["a" /* FieldTypeModalContent */]
        ],
        providers: [__WEBPACK_IMPORTED_MODULE_24__services_products_service__["a" /* ProductsService */], __WEBPACK_IMPORTED_MODULE_25__services_content_types_service__["a" /* ContentTypesService */], __WEBPACK_IMPORTED_MODULE_26__services_categories_service__["a" /* CategoriesService */], __WEBPACK_IMPORTED_MODULE_5__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */], __WEBPACK_IMPORTED_MODULE_5__ng_bootstrap_ng_bootstrap__["e" /* NgbTooltipConfig */]],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* AlertModalContent */],
            __WEBPACK_IMPORTED_MODULE_7__app_component__["c" /* ConfirmModalContent */],
            __WEBPACK_IMPORTED_MODULE_12__product_component__["a" /* ProductModalContent */],
            __WEBPACK_IMPORTED_MODULE_14__content_types_component__["a" /* ContentTypeModalContent */],
            __WEBPACK_IMPORTED_MODULE_13__categories_component__["c" /* CategoriesModalComponent */],
            __WEBPACK_IMPORTED_MODULE_15__field_types_component__["a" /* FieldTypeModalContent */]
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_7__app_component__["b" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ "../../../../../src/app/catalog-category.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CatalogCategoryComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__ = __webpack_require__("../../../../@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_category_model__ = __webpack_require__("../../../../../src/app/models/category.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_products_service__ = __webpack_require__("../../../../../src/app/services/products.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__page_table_abstract__ = __webpack_require__("../../../../../src/app/page-table.abstract.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__product_component__ = __webpack_require__("../../../../../src/app/product.component.ts");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var CatalogCategoryComponent = (function (_super) {
    __extends(CatalogCategoryComponent, _super);
    function CatalogCategoryComponent(dataService, activeModal, modalService, titleService) {
        var _this = _super.call(this, dataService, activeModal, modalService, titleService) || this;
        _this.title = 'Каталог';
        _this.categories = [];
        //TODO: get from settings
        _this.tableFields = [
            {
                name: 'id',
                title: 'ID',
                output_type: 'text',
                output_properties: {}
            },
            {
                name: 'name',
                title: 'Системное имя',
                output_type: 'text',
                output_properties: {}
            },
            {
                name: 'title',
                title: 'Название',
                output_type: 'text',
                output_properties: {}
            },
            {
                name: 'price',
                title: 'Цена',
                output_type: 'number',
                output_properties: {}
            },
            {
                name: 'is_active',
                title: 'Статус',
                output_type: 'boolean',
                output_properties: {}
            }
        ];
        return _this;
    }
    CatalogCategoryComponent.prototype.ngOnInit = function () {
        this.setTitle(this.title);
    };
    CatalogCategoryComponent.prototype.getModalContent = function () {
        return __WEBPACK_IMPORTED_MODULE_7__product_component__["a" /* ProductModalContent */];
    };
    CatalogCategoryComponent.prototype.openCategory = function (category) {
        this.currentCategory = __WEBPACK_IMPORTED_MODULE_3_lodash__["clone"](category);
        this.titleService.setTitle(this.title + ' / ' + this.currentCategory.title);
        this.dataService.setRequestUrl('admin/products/' + this.currentCategory.id);
        this.getList();
    };
    CatalogCategoryComponent.prototype.openRootCategory = function () {
        this.currentCategory = new __WEBPACK_IMPORTED_MODULE_4__models_category_model__["a" /* Category */](0, false, 0, 'root', '', '', '', true);
        this.titleService.setTitle(this.title);
        this.dataService.setRequestUrl('admin/products/' + this.currentCategory.id);
        this.getList();
    };
    CatalogCategoryComponent.prototype.setModalInputs = function (itemId, isItemCopy) {
        if (isItemCopy === void 0) { isItemCopy = false; }
        __WEBPACK_IMPORTED_MODULE_6__page_table_abstract__["b" /* PageTableAbstractComponent */].prototype.setModalInputs.call(this, itemId, isItemCopy);
        this.modalRef.componentInstance.category = this.currentCategory;
    };
    return CatalogCategoryComponent;
}(__WEBPACK_IMPORTED_MODULE_6__page_table_abstract__["b" /* PageTableAbstractComponent */]));
CatalogCategoryComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'catalog-category',
        template: __webpack_require__("../../../../../src/app/templates/catalog-category.html"),
        providers: [__WEBPACK_IMPORTED_MODULE_5__services_products_service__["a" /* ProductsService */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_5__services_products_service__["a" /* ProductsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__services_products_service__["a" /* ProductsService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["c" /* NgbModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["c" /* NgbModal */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["Title"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["Title"]) === "function" && _d || Object])
], CatalogCategoryComponent);

var _a, _b, _c, _d;
//# sourceMappingURL=catalog-category.component.js.map

/***/ }),

/***/ "../../../../../src/app/catalog.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CatalogComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var CatalogComponent = (function () {
    function CatalogComponent() {
    }
    CatalogComponent.prototype.ngOnInit = function () {
    };
    return CatalogComponent;
}());
CatalogComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'catalog',
        template: __webpack_require__("../../../../../src/app/templates/page-catalog.html"),
        providers: []
    }),
    __metadata("design:paramtypes", [])
], CatalogComponent);

//# sourceMappingURL=catalog.component.js.map

/***/ }),

/***/ "../../../../../src/app/categories.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return CategoriesModalComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CategoriesListComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return CategoriesMenuComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__ = __webpack_require__("../../../../@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_category_model__ = __webpack_require__("../../../../../src/app/models/category.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__list_recursive_component__ = __webpack_require__("../../../../../src/app/list-recursive.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__page_table_abstract__ = __webpack_require__("../../../../../src/app/page-table.abstract.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_switchMap__ = __webpack_require__("../../../../rxjs/add/operator/switchMap.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_switchMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_switchMap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__services_system_name_service__ = __webpack_require__("../../../../../src/app/services/system-name.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__services_categories_service__ = __webpack_require__("../../../../../src/app/services/categories.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__services_content_types_service__ = __webpack_require__("../../../../../src/app/services/content_types.service.ts");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};













/**
 * @class CategoriesModalComponent
 */
var CategoriesModalComponent = (function (_super) {
    __extends(CategoriesModalComponent, _super);
    function CategoriesModalComponent(fb, dataService, systemNameService, activeModal, tooltipConfig, contentTypesService) {
        var _this = _super.call(this, fb, dataService, systemNameService, activeModal, tooltipConfig) || this;
        _this.fb = fb;
        _this.dataService = dataService;
        _this.systemNameService = systemNameService;
        _this.activeModal = activeModal;
        _this.tooltipConfig = tooltipConfig;
        _this.contentTypesService = contentTypesService;
        _this.categories = [];
        _this.model = new __WEBPACK_IMPORTED_MODULE_4__models_category_model__["a" /* Category */](0, false, 0, '', '', '', '', true);
        _this.contentTypes = [];
        _this.formFields = {
            title: {
                value: '',
                validators: [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["Validators"].required],
                messages: {
                    required: 'Title is required.'
                }
            },
            name: {
                value: '',
                validators: [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["Validators"].required],
                messages: {
                    required: 'Name is required.'
                }
            },
            description: {
                value: '',
                validators: [],
                messages: {}
            },
            parent_id: {
                value: 0,
                validators: [],
                messages: {}
            },
            content_type_name: {
                value: '',
                validators: [__WEBPACK_IMPORTED_MODULE_3__angular_forms__["Validators"].required],
                messages: {
                    required: 'Content type is required.'
                }
            },
            is_active: {
                value: false,
                validators: [],
                messages: {}
            }
        };
        return _this;
    }
    /** On initialize */
    CategoriesModalComponent.prototype.ngOnInit = function () {
        this.model.parent_id = this.currentCategory.id;
        this.model.content_type_name = this.currentCategory.content_type_name;
        __WEBPACK_IMPORTED_MODULE_7__page_table_abstract__["a" /* ModalContentAbstractComponent */].prototype.ngOnInit.call(this);
        this.getContentTypes();
    };
    CategoriesModalComponent.prototype.getContentTypes = function () {
        var _this = this;
        this.contentTypesService.getList()
            .subscribe(function (res) {
            if (res.success) {
                _this.contentTypes = res.data;
            }
        }, function (error) { return _this.errorMessage = error; });
    };
    CategoriesModalComponent.prototype.save = function () {
        this.submitted = true;
        if (!this.form.valid) {
            this.onValueChanged('form');
            this.submitted = false;
            return;
        }
        var callback = function (res) {
            if (res.success) {
                this.closeModal();
            }
            else {
                if (res.msg) {
                    this.submitted = false;
                    this.errorMessage = res.msg;
                }
            }
        };
        if (this.model.id) {
            this.dataService.update(this.model).then(callback.bind(this));
        }
        else {
            this.dataService.create(this.model).then(callback.bind(this));
        }
    };
    return CategoriesModalComponent;
}(__WEBPACK_IMPORTED_MODULE_7__page_table_abstract__["a" /* ModalContentAbstractComponent */]));
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Array)
], CategoriesModalComponent.prototype, "categories", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_4__models_category_model__["a" /* Category */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__models_category_model__["a" /* Category */]) === "function" && _a || Object)
], CategoriesModalComponent.prototype, "currentCategory", void 0);
CategoriesModalComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'category-modal-content',
        template: __webpack_require__("../../../../../src/app/templates/modal-category.html"),
        providers: [__WEBPACK_IMPORTED_MODULE_11__services_categories_service__["a" /* CategoriesService */], __WEBPACK_IMPORTED_MODULE_10__services_system_name_service__["a" /* SystemNameService */], __WEBPACK_IMPORTED_MODULE_12__services_content_types_service__["a" /* ContentTypesService */]]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__angular_forms__["FormBuilder"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_forms__["FormBuilder"]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_11__services_categories_service__["a" /* CategoriesService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_11__services_categories_service__["a" /* CategoriesService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_10__services_system_name_service__["a" /* SystemNameService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_10__services_system_name_service__["a" /* SystemNameService */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */]) === "function" && _e || Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["e" /* NgbTooltipConfig */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["e" /* NgbTooltipConfig */]) === "function" && _f || Object, typeof (_g = typeof __WEBPACK_IMPORTED_MODULE_12__services_content_types_service__["a" /* ContentTypesService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_12__services_content_types_service__["a" /* ContentTypesService */]) === "function" && _g || Object])
], CategoriesModalComponent);

/**
 * @class CategoriesListComponent
 */
var CategoriesListComponent = (function (_super) {
    __extends(CategoriesListComponent, _super);
    function CategoriesListComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CategoriesListComponent;
}(__WEBPACK_IMPORTED_MODULE_6__list_recursive_component__["a" /* ListRecursiveComponent */]));
CategoriesListComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'categories-list',
        template: "\n        <ul class=\"dropdown-menu dropdown-menu-hover\" *ngIf=\"items.length > 0\" [class.shadow]=\"parentId != 0\">\n            <li class=\"dropdown-item active\" *ngFor=\"let item of items\" [class.active]=\"item.id == currentId\"\n                [class.current-level]=\"getIsActiveParent(item.id)\">\n                <i class=\"icon-keyboard_arrow_right float-right m-2 pt-1\" [hidden]=\"!item.is_folder\"></i>\n                <a href=\"\" [routerLink]=\"['/catalog/category/', item.id]\" [class.text-muted]=\"!item.is_active\">\n                    {{item.title}}\n                </a>\n                <categories-list [inputItems]=\"inputItems\" [parentId]=\"item.id\" [currentId]=\"currentId\"></categories-list>\n            </li>\n        </ul>\n    "
    })
], CategoriesListComponent);

/**
 * @class CategoriesMenuComponent
 */
var CategoriesMenuComponent = (function () {
    function CategoriesMenuComponent(router, route, modalService, categoriesService) {
        this.router = router;
        this.route = route;
        this.modalService = modalService;
        this.categoriesService = categoriesService;
        this.rootTitle = 'Категории';
        this.changeRequest = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.currentCategory = new __WEBPACK_IMPORTED_MODULE_4__models_category_model__["a" /* Category */](0, false, 0, 'root', this.rootTitle, '', '', true);
        this.categories = [];
        this.errorMessage = '';
        this.categoryId = 0;
    }
    /** On initialize component */
    CategoriesMenuComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getCategories();
        var categoryId = this.route.snapshot.params['categoryId']
            ? parseInt(this.route.snapshot.params['categoryId'])
            : 0;
        this.route.paramMap
            .subscribe(function (params) {
            _this.categoryId = params.get('categoryId')
                ? parseInt(params.get('categoryId'))
                : 0;
            _this.selectCurrent();
        });
        if (!categoryId) {
            this.openRootCategory();
        }
    };
    /** Select current category */
    CategoriesMenuComponent.prototype.selectCurrent = function () {
        if (this.currentCategory.id === this.categoryId) {
            return;
        }
        if (this.categoryId > 0) {
            for (var _i = 0, _a = this.categories; _i < _a.length; _i++) {
                var category = _a[_i];
                if (category.id == this.categoryId) {
                    this.currentCategory = category;
                    this.changeRequest.emit(this.currentCategory);
                    break;
                }
            }
        }
        else {
            this.openRootCategory();
        }
    };
    /** Get categories */
    CategoriesMenuComponent.prototype.getCategories = function () {
        var _this = this;
        this.categoriesService.getList()
            .subscribe(function (res) {
            if (res.success) {
                _this.categories = res.data;
            }
            _this.selectCurrent();
        }, function (error) { return _this.errorMessage = error; });
    };
    /**
     * Open modal category
     * @param itemId
     * @param isItemCopy
     */
    CategoriesMenuComponent.prototype.openModalCategory = function (itemId, isItemCopy) {
        var _this = this;
        this.modalRef = this.modalService.open(CategoriesModalComponent, { size: 'lg' });
        this.modalRef.componentInstance.modalTitle = itemId && !isItemCopy ? 'Edit category' : 'Add category';
        this.modalRef.componentInstance.itemId = itemId || 0;
        this.modalRef.componentInstance.isItemCopy = isItemCopy || false;
        this.modalRef.componentInstance.categories = this.categories;
        this.modalRef.componentInstance.currentCategory = this.currentCategory;
        this.modalRef.result.then(function (result) {
            _this.getCategories();
        }, function (reason) {
        });
    };
    /**
     * Update category data
     * @param itemId
     * @param data
     */
    CategoriesMenuComponent.prototype.updateCategoryData = function (itemId, data) {
        var index = __WEBPACK_IMPORTED_MODULE_9_lodash__["findIndex"](this.categories, { id: itemId });
        if (index === -1) {
            return;
        }
        var category = this.categories[index];
        if (category.parent_id == data.parent_id) {
            Object.keys(category).forEach(function (k, i) {
                if (data[k]) {
                    category[k] = data[k];
                }
            });
        }
        else {
            this.getCategories();
        }
    };
    /**
     * Confirm delete category
     * @param itemId
     */
    CategoriesMenuComponent.prototype.deleteCategoryItemConfirm = function (itemId) {
        var _this = this;
        var index = __WEBPACK_IMPORTED_MODULE_9_lodash__["findIndex"](this.categories, { id: itemId });
        if (index == -1) {
            return;
        }
        this.modalRef = this.modalService.open(__WEBPACK_IMPORTED_MODULE_5__app_component__["c" /* ConfirmModalContent */]);
        this.modalRef.componentInstance.modalTitle = 'Confirm';
        this.modalRef.componentInstance.modalContent = 'Are you sure you want to remove category "' + this.categories[index].title + '"?';
        this.modalRef.result.then(function (result) {
            if (result == 'accept') {
                _this.deleteCategoryItem(itemId);
            }
        }, function (reason) {
        });
    };
    /**
     * Delete category
     * @param itemId
     */
    CategoriesMenuComponent.prototype.deleteCategoryItem = function (itemId) {
        var _this = this;
        this.categoriesService.deleteItem(itemId)
            .then(function (res) {
            if (res.success) {
                _this.openRootCategory();
                _this.getCategories();
            }
            else {
                if (res.msg) {
                    _this.errorMessage = res.msg;
                }
            }
        });
    };
    /** Open root category */
    CategoriesMenuComponent.prototype.openRootCategory = function () {
        this.currentCategory = new __WEBPACK_IMPORTED_MODULE_4__models_category_model__["a" /* Category */](0, false, 0, 'root', this.rootTitle, '', '', true);
        this.changeRequest.emit(this.currentCategory);
    };
    /** Go to root category */
    CategoriesMenuComponent.prototype.goToRootCategory = function () {
        this.router.navigate(['/catalog/category/0']);
    };
    /**
     * Select category
     * @param category
     */
    CategoriesMenuComponent.prototype.selectCategory = function (category) {
        this.router.navigate(['/catalog/category', category.id]);
    };
    /** Copy category */
    CategoriesMenuComponent.prototype.copyCategory = function () {
        this.openModalCategory(this.currentCategory.id, true);
    };
    return CategoriesMenuComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", String)
], CategoriesMenuComponent.prototype, "rootTitle", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], CategoriesMenuComponent.prototype, "changeRequest", void 0);
CategoriesMenuComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'categories-menu',
        template: __webpack_require__("../../../../../src/app/templates/categories-menu.html"),
        providers: [__WEBPACK_IMPORTED_MODULE_11__services_categories_service__["a" /* CategoriesService */]]
    }),
    __metadata("design:paramtypes", [typeof (_h = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"]) === "function" && _h || Object, typeof (_j = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["ActivatedRoute"]) === "function" && _j || Object, typeof (_k = typeof __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["c" /* NgbModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["c" /* NgbModal */]) === "function" && _k || Object, typeof (_l = typeof __WEBPACK_IMPORTED_MODULE_11__services_categories_service__["a" /* CategoriesService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_11__services_categories_service__["a" /* CategoriesService */]) === "function" && _l || Object])
], CategoriesMenuComponent);

var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
//# sourceMappingURL=categories.component.js.map

/***/ }),

/***/ "../../../../../src/app/content-types.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContentTypeModalContent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ContentTypesComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__ = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__ = __webpack_require__("../../../../@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__field_types_component__ = __webpack_require__("../../../../../src/app/field-types.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_content_field_model__ = __webpack_require__("../../../../../src/app/models/content_field.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__models_content_type_model__ = __webpack_require__("../../../../../src/app/models/content_type.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__models_query_options__ = __webpack_require__("../../../../../src/app/models/query-options.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__page_table_abstract__ = __webpack_require__("../../../../../src/app/page-table.abstract.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__services_content_types_service__ = __webpack_require__("../../../../../src/app/services/content_types.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__services_collections_service__ = __webpack_require__("../../../../../src/app/services/collections.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__services_system_name_service__ = __webpack_require__("../../../../../src/app/services/system-name.service.ts");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};













var ContentTypeModalContent = (function (_super) {
    __extends(ContentTypeModalContent, _super);
    function ContentTypeModalContent(fb, dataService, systemNameService, activeModal, tooltipConfig, fieldTypesService, collectionsService, modalService) {
        var _this = _super.call(this, fb, dataService, systemNameService, activeModal, tooltipConfig) || this;
        _this.fb = fb;
        _this.dataService = dataService;
        _this.systemNameService = systemNameService;
        _this.activeModal = activeModal;
        _this.tooltipConfig = tooltipConfig;
        _this.fieldTypesService = fieldTypesService;
        _this.collectionsService = collectionsService;
        _this.modalService = modalService;
        _this.model = new __WEBPACK_IMPORTED_MODULE_7__models_content_type_model__["a" /* ContentType */](0, '', '', '', 'products', [], ['Основное', 'Служебное'], true);
        _this.fieldModel = new __WEBPACK_IMPORTED_MODULE_6__models_content_field_model__["a" /* ContentField */]('', '', '', '', '', {}, '', {}, '', false, false, false);
        _this.fld_submitted = false;
        _this.action = 'add_field';
        _this.currentFieldName = '';
        _this.collections = ['products'];
        _this.fieldTypeProperties = {
            input: [],
            output: []
        };
        _this.formFields = {
            name: {
                value: '',
                validators: [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].pattern('[A-Za-z0-9_-]+')],
                messages: {
                    required: 'Name is required.',
                    pattern: 'The name must contain only Latin letters and numbers.'
                }
            },
            title: {
                value: '',
                validators: [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                messages: {
                    required: 'Title is required.'
                }
            },
            description: {
                value: '',
                validators: [],
                messages: {}
            },
            collection: {
                value: '',
                validators: [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                messages: {
                    required: 'Title is required.'
                }
            },
            new_collection: {
                value: '',
                validators: [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].pattern('[A-Za-z0-9_-]+')],
                messages: {
                    pattern: 'The name must contain only Latin letters and numbers.',
                    exists: 'Collection with the same name already exists.'
                }
            },
            is_active: {
                value: '',
                validators: [],
                messages: {}
            }
        };
        _this.fieldsFormOptions = {
            title: {
                value: '',
                validators: [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                messages: {
                    required: 'Title is required.'
                }
            },
            name: {
                value: '',
                validators: [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].pattern('[A-Za-z0-9_-]+')],
                messages: {
                    required: 'Name is required.',
                    pattern: 'The name must contain only Latin letters.'
                }
            },
            description: {
                value: '',
                validators: [],
                messages: {}
            },
            input_type: {
                value: '',
                validators: [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                messages: {
                    required: 'Input type is required.'
                }
            },
            output_type: {
                value: '',
                validators: [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                messages: {
                    required: 'Output type is required.'
                }
            },
            group: {
                value: '',
                validators: [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required],
                messages: {
                    required: 'Group is required.'
                }
            },
            new_group: {
                value: '',
                validators: [],
                messages: {
                    exists: 'Group with the same name already exists.'
                }
            },
            required: {
                value: '',
                validators: [],
                messages: {}
            },
            show_in_table: {
                value: '',
                validators: [],
                messages: {}
            },
            is_filter: {
                value: '',
                validators: [],
                messages: {}
            }
        };
        return _this;
    }
    ContentTypeModalContent.prototype.buildForm = function () {
        var _this = this;
        __WEBPACK_IMPORTED_MODULE_9__page_table_abstract__["a" /* ModalContentAbstractComponent */].prototype.buildForm.call(this);
        var controls = this.buildControls(this.fieldsFormOptions, 'fieldModel', 'fld_');
        this.fieldForm = this.fb.group(controls);
        this.fieldForm.valueChanges
            .subscribe(function () { return _this.onValueChanged('fieldForm', 'fld_'); });
    };
    /** On initialize */
    ContentTypeModalContent.prototype.ngOnInit = function () {
        __WEBPACK_IMPORTED_MODULE_9__page_table_abstract__["a" /* ModalContentAbstractComponent */].prototype.ngOnInit.call(this);
        this.getFieldTypes();
        this.getCollectionsList();
    };
    /** Get field types */
    ContentTypeModalContent.prototype.getFieldTypes = function () {
        var _this = this;
        var options = new __WEBPACK_IMPORTED_MODULE_8__models_query_options__["a" /* QueryOptions */]('name', 'asc', 0, 0, 1);
        this.fieldTypesService.getList(options)
            .subscribe(function (res) {
            _this.fieldTypes = res.data;
        }, function (error) { return _this.errorMessage = error; });
    };
    /** Get collections list */
    ContentTypeModalContent.prototype.getCollectionsList = function () {
        var _this = this;
        this.collectionsService.getList()
            .subscribe(function (res) {
            if (res.data && res.data.length > 0) {
                _this.collections = res.data;
            }
        });
    };
    /**
     * Select field type properties
     * @param {string} type
     * @param {string} fieldTypeName
     */
    ContentTypeModalContent.prototype.selectFieldTypeProperties = function (type, fieldTypeName) {
        if (fieldTypeName) {
            this.fieldModel[type + '_type'] = fieldTypeName;
        }
        var fieldType = __WEBPACK_IMPORTED_MODULE_4_lodash__["find"](this.fieldTypes, { name: this.fieldModel[type + '_type'] });
        if (!fieldType) {
            this.fieldTypeProperties[type] = [];
            return;
        }
        this.fieldTypeProperties[type] = __WEBPACK_IMPORTED_MODULE_4_lodash__["clone"](fieldType[type + 'Properties']);
        var propNames = __WEBPACK_IMPORTED_MODULE_4_lodash__["map"](this.fieldTypeProperties[type], 'name');
        var modelField = type + '_properties';
        this.fieldModel[modelField] = __WEBPACK_IMPORTED_MODULE_4_lodash__["pick"](this.fieldModel[modelField], propNames);
        for (var i in this.fieldTypeProperties[type]) {
            if (this.fieldTypeProperties[type].hasOwnProperty(i)) {
                var fldName = this.fieldTypeProperties[type][i].name;
                if (typeof this.fieldModel[modelField][fldName] == 'undefined') {
                    this.fieldModel[modelField][fldName] = this.fieldTypeProperties[type][i].default_value;
                }
            }
        }
        if (type == 'input' && !this.fieldModel.output_type) {
            this.selectFieldTypeProperties('output', this.fieldModel['input_type']);
        }
    };
    /** Add collection */
    ContentTypeModalContent.prototype.addCollection = function () {
        var fieldName = 'new_collection';
        var control = this.form.get(fieldName);
        if (!control.valid) {
            return false;
        }
        this.formErrors[fieldName] = '';
        var value = control.value;
        if (this.collections.indexOf(value) > -1) {
            this.formErrors[fieldName] += this.validationMessages[fieldName].exists;
            return false;
        }
        this.collections.push(value);
        this.model.collection = value;
        this.elementAddCollectionBlock.nativeElement.style.display = 'none';
        return true;
    };
    /** Delete collection */
    ContentTypeModalContent.prototype.deleteCollection = function (popover) {
        if (!this.model.collection) {
            return;
        }
        if (popover.isOpen()) {
            popover.close();
            return;
        }
        var popoverContent;
        //popover.container = 'body';
        popover.placement = 'top';
        popover.popoverTitle = 'Confirm';
        var confirm = function () {
            var _this = this;
            this.loading = true;
            this.collectionsService.deleteItemByName(this.model.collection)
                .then(function (res) {
                if (res.success) {
                    var index = _this.collections.indexOf(_this.model.collection);
                    if (index > -1) {
                        _this.collections.splice(index, 1);
                        _this.model.collection = _this.collections[0];
                    }
                    popover.close();
                }
                else {
                    if (res.msg) {
                        popoverContent.message = res.msg;
                    }
                }
                _this.loading = false;
            });
        };
        popoverContent = {
            p: popover,
            confirm: confirm.bind(this),
            message: ''
        };
        popover.open(popoverContent);
    };
    /** Add group */
    ContentTypeModalContent.prototype.addGroup = function () {
        var fieldName = 'new_group';
        var control = this.fieldForm.get(fieldName);
        if (!control || !control.valid || !control.value) {
            return false;
        }
        this.formErrors['fld_' + fieldName] = '';
        var value = control.value;
        var index = this.model.groups.indexOf(value);
        if (index > -1) {
            this.formErrors['fld_' + fieldName] += this.validationMessages['fld_' + fieldName].exists;
            return false;
        }
        this.model.groups.push(value);
        this.fieldModel.group = value;
        this.elementAddGroupBlock.nativeElement.style.display = 'none';
        return true;
    };
    /** Delete group */
    ContentTypeModalContent.prototype.deleteGroup = function () {
        var currentGroupName = this.fieldForm.get('group').value;
        var index = __WEBPACK_IMPORTED_MODULE_4_lodash__["findIndex"](this.model.fields, { group: currentGroupName });
        this.errorFieldMessage = '';
        if (index > -1) {
            this.errorFieldMessage = 'You can\'t delete a group because it is not empty.';
            return;
        }
        index = this.model.groups.indexOf(currentGroupName);
        if (index > -1) {
            this.model.groups.splice(index, 1);
        }
    };
    /**
     * Edit field
     * @param field
     */
    ContentTypeModalContent.prototype.editField = function (field) {
        this.action = 'edit_field';
        this.fieldModel = __WEBPACK_IMPORTED_MODULE_4_lodash__["clone"](field);
        var newFormValue = {};
        for (var key in this.fieldsFormOptions) {
            if (!this.fieldsFormOptions.hasOwnProperty(key)) {
                continue;
            }
            newFormValue[key] = field[key] || '';
        }
        this.fieldForm.setValue(newFormValue);
        this.currentFieldName = this.fieldModel.name;
        this.fld_submitted = false;
    };
    /**
     * Copy field
     * @param field
     */
    ContentTypeModalContent.prototype.copyField = function (field) {
        this.action = 'add_field';
        this.fieldModel = __WEBPACK_IMPORTED_MODULE_4_lodash__["clone"](field);
        this.fieldModel.name = '';
        this.fieldForm.setValue(this.fieldModel);
        this.currentFieldName = '';
        this.fld_submitted = false;
    };
    /**
     * Delete field
     * @param field
     */
    ContentTypeModalContent.prototype.deleteField = function (field) {
        var index = __WEBPACK_IMPORTED_MODULE_4_lodash__["findIndex"](this.model.fields, { name: field.name });
        if (index == -1) {
            this.errorMessage = 'Field not found.';
            return;
        }
        this.model.fields.splice(index, 1);
    };
    /** Reset field form */
    ContentTypeModalContent.prototype.resetFieldForm = function () {
        this.action = 'add_field';
        this.errorMessage = '';
        this.errorFieldMessage = '';
        this.fld_submitted = false;
        this.currentFieldName = '';
        this.fieldForm.reset();
        this.fieldModel = new __WEBPACK_IMPORTED_MODULE_6__models_content_field_model__["a" /* ContentField */]('', '', '', '', '', {}, '', {}, '', false, false, false);
    };
    /** Cancel edit field */
    ContentTypeModalContent.prototype.editFieldCancel = function () {
        this.resetFieldForm();
        this.onValueChanged('fieldForm', 'fld_');
    };
    /** Change field order index */
    ContentTypeModalContent.prototype.fieldMove = function (index, direction) {
        if ((direction == 'up' && index === 0)
            || (direction == 'down' && index === this.model.fields.length - 1)) {
            return;
        }
        var newIndex = direction == 'up' ? index - 1 : index + 1;
        var field = this.model.fields[index];
        this.model.fields.splice(index, 1);
        this.model.fields.splice(newIndex, 0, field);
    };
    /** Submit field */
    ContentTypeModalContent.prototype.submitField = function () {
        this.fld_submitted = true;
        if (!this.fieldForm.valid) {
            this.onValueChanged('fieldForm', 'fld_');
            this.fld_submitted = false;
            return;
        }
        var data = __WEBPACK_IMPORTED_MODULE_4_lodash__["clone"](this.fieldModel);
        var index = __WEBPACK_IMPORTED_MODULE_4_lodash__["findIndex"](this.model.fields, { name: data.name });
        if (index > -1 && this.currentFieldName != data.name) {
            this.errorMessage = 'A field named "' + data.name + '" already exists.';
            return;
        }
        if (this.action == 'add_field') {
            this.model.fields.push(__WEBPACK_IMPORTED_MODULE_4_lodash__["clone"](data));
        }
        else if (this.action == 'edit_field') {
            index = __WEBPACK_IMPORTED_MODULE_4_lodash__["findIndex"](this.model.fields, { name: this.currentFieldName });
            if (index > -1) {
                this.model.fields[index] = __WEBPACK_IMPORTED_MODULE_4_lodash__["clone"](data);
            }
        }
        this.resetFieldForm();
    };
    ContentTypeModalContent.prototype.save = function () {
        this.submitted = true;
        if (!this.form.valid) {
            this.onValueChanged('form');
            this.submitted = false;
            return;
        }
        var callback = function (res) {
            if (res.success) {
                this.closeModal();
            }
            else {
                if (res.msg) {
                    this.submitted = false;
                    this.errorMessage = res.msg;
                }
            }
        };
        if (this.model.id) {
            this.dataService.update(this.model).then(callback.bind(this));
        }
        else {
            this.dataService.create(this.model).then(callback.bind(this));
        }
    };
    return ContentTypeModalContent;
}(__WEBPACK_IMPORTED_MODULE_9__page_table_abstract__["a" /* ModalContentAbstractComponent */]));
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('addCollectionBlock'),
    __metadata("design:type", Object)
], ContentTypeModalContent.prototype, "elementAddCollectionBlock", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('addGroupBlock'),
    __metadata("design:type", Object)
], ContentTypeModalContent.prototype, "elementAddGroupBlock", void 0);
ContentTypeModalContent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'content-type-modal-content',
        template: __webpack_require__("../../../../../src/app/templates/modal-content_types.html"),
        providers: [__WEBPACK_IMPORTED_MODULE_10__services_content_types_service__["a" /* ContentTypesService */], __WEBPACK_IMPORTED_MODULE_5__field_types_component__["c" /* FieldTypesService */], __WEBPACK_IMPORTED_MODULE_11__services_collections_service__["a" /* CollectionsService */], __WEBPACK_IMPORTED_MODULE_12__services_system_name_service__["a" /* SystemNameService */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormBuilder"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormBuilder"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_10__services_content_types_service__["a" /* ContentTypesService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_10__services_content_types_service__["a" /* ContentTypesService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_12__services_system_name_service__["a" /* SystemNameService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_12__services_system_name_service__["a" /* SystemNameService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__["e" /* NgbTooltipConfig */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__["e" /* NgbTooltipConfig */]) === "function" && _e || Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_5__field_types_component__["c" /* FieldTypesService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__field_types_component__["c" /* FieldTypesService */]) === "function" && _f || Object, typeof (_g = typeof __WEBPACK_IMPORTED_MODULE_11__services_collections_service__["a" /* CollectionsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_11__services_collections_service__["a" /* CollectionsService */]) === "function" && _g || Object, typeof (_h = typeof __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__["c" /* NgbModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__["c" /* NgbModal */]) === "function" && _h || Object])
], ContentTypeModalContent);

var ContentTypesComponent = (function (_super) {
    __extends(ContentTypesComponent, _super);
    function ContentTypesComponent(dataService, activeModal, modalService, titleService) {
        var _this = _super.call(this, dataService, activeModal, modalService, titleService) || this;
        _this.title = 'Типы контента';
        //TODO: get from settings
        _this.tableFields = [
            {
                name: 'name',
                title: 'Системное имя',
                output_type: 'text',
                output_properties: {}
            },
            {
                name: 'title',
                title: 'Название',
                output_type: 'text',
                output_properties: {}
            },
            {
                name: 'collection',
                title: 'Коллекция',
                output_type: 'text',
                output_properties: {}
            },
            {
                name: 'is_active',
                title: 'Статус',
                output_type: 'boolean',
                output_properties: {}
            }
        ];
        return _this;
    }
    ContentTypesComponent.prototype.getModalContent = function () {
        return ContentTypeModalContent;
    };
    return ContentTypesComponent;
}(__WEBPACK_IMPORTED_MODULE_9__page_table_abstract__["b" /* PageTableAbstractComponent */]));
ContentTypesComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'shk-content-types',
        template: __webpack_require__("../../../../../src/app/templates/catalog-content_types.html"),
        providers: [__WEBPACK_IMPORTED_MODULE_10__services_content_types_service__["a" /* ContentTypesService */]]
    }),
    __metadata("design:paramtypes", [typeof (_j = typeof __WEBPACK_IMPORTED_MODULE_10__services_content_types_service__["a" /* ContentTypesService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_10__services_content_types_service__["a" /* ContentTypesService */]) === "function" && _j || Object, typeof (_k = typeof __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */]) === "function" && _k || Object, typeof (_l = typeof __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__["c" /* NgbModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__["c" /* NgbModal */]) === "function" && _l || Object, typeof (_m = typeof __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["Title"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["Title"]) === "function" && _m || Object])
], ContentTypesComponent);

var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
//# sourceMappingURL=content-types.component.js.map

/***/ }),

/***/ "../../../../../src/app/field-types.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return FieldTypesService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FieldTypeModalContent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return FieldTypesComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__ = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__ = __webpack_require__("../../../../@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_field_type_model__ = __webpack_require__("../../../../../src/app/models/field-type.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_field_type_property_model__ = __webpack_require__("../../../../../src/app/models/field-type-property.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_data_service_abstract__ = __webpack_require__("../../../../../src/app/services/data-service.abstract.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_system_name_service__ = __webpack_require__("../../../../../src/app/services/system-name.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__page_table_abstract__ = __webpack_require__("../../../../../src/app/page-table.abstract.ts");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var FieldTypesService = (function (_super) {
    __extends(FieldTypesService, _super);
    function FieldTypesService(http) {
        var _this = _super.call(this, http) || this;
        _this.setRequestUrl('admin/field_types');
        return _this;
    }
    FieldTypesService.prototype.extractData = function (res) {
        var body = res.json();
        if (body.data) {
            if (Array.isArray(body.data)) {
                body.data = body.data;
            }
            else {
                body.data = body.data;
            }
        }
        return body;
    };
    return FieldTypesService;
}(__WEBPACK_IMPORTED_MODULE_7__services_data_service_abstract__["a" /* DataService */]));
FieldTypesService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]) === "function" && _a || Object])
], FieldTypesService);

var FieldTypeModalContent = (function (_super) {
    __extends(FieldTypeModalContent, _super);
    function FieldTypeModalContent(fb, dataService, systemNameService, activeModal, tooltipConfig) {
        var _this = _super.call(this, fb, dataService, systemNameService, activeModal, tooltipConfig) || this;
        _this.model = new __WEBPACK_IMPORTED_MODULE_5__models_field_type_model__["a" /* FieldType */](0, '', '', '', true, [], []);
        _this.formFields = {
            title: {
                value: '',
                validators: [__WEBPACK_IMPORTED_MODULE_4__angular_forms__["Validators"].required],
                messages: {
                    required: 'Title is required.'
                }
            },
            name: {
                value: '',
                validators: [__WEBPACK_IMPORTED_MODULE_4__angular_forms__["Validators"].required, __WEBPACK_IMPORTED_MODULE_4__angular_forms__["Validators"].pattern('[A-Za-z0-9_-]+')],
                messages: {
                    required: 'Name is required.',
                    pattern: 'The name must contain only Latin letters and numbers.'
                }
            },
            description: {
                value: '',
                validators: [],
                messages: {}
            },
            isActive: {
                value: true,
                validators: [],
                messages: {}
            }
        };
        return _this;
    }
    FieldTypeModalContent.prototype.addRow = function (type) {
        if (!this.model[type]) {
            this.model[type] = [];
        }
        this.model[type].push(new __WEBPACK_IMPORTED_MODULE_6__models_field_type_property_model__["a" /* FieldTypeProperty */]('', '', ''));
    };
    FieldTypeModalContent.prototype.deleteRow = function (index, type) {
        if (this.model[type].length < index + 1) {
            return;
        }
        this.model[type].splice(index, 1);
    };
    FieldTypeModalContent.prototype.save = function () {
        this.submitted = true;
        if (!this.form.valid) {
            this.onValueChanged('form');
            this.submitted = false;
            return;
        }
        var callback = function (res) {
            if (res.success) {
                this.closeModal();
            }
            else {
                if (res.msg) {
                    this.submitted = false;
                    this.errorMessage = res.msg;
                }
            }
        };
        if (this.model.id) {
            this.dataService.update(this.model).then(callback.bind(this));
        }
        else {
            this.dataService.create(this.model).then(callback.bind(this));
        }
    };
    return FieldTypeModalContent;
}(__WEBPACK_IMPORTED_MODULE_9__page_table_abstract__["a" /* ModalContentAbstractComponent */]));
FieldTypeModalContent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'field-type-modal-content',
        template: __webpack_require__("../../../../../src/app/templates/modal-field_type.html"),
        providers: [FieldTypesService, __WEBPACK_IMPORTED_MODULE_8__services_system_name_service__["a" /* SystemNameService */]]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormBuilder"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__angular_forms__["FormBuilder"]) === "function" && _b || Object, FieldTypesService, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_8__services_system_name_service__["a" /* SystemNameService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_8__services_system_name_service__["a" /* SystemNameService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__["e" /* NgbTooltipConfig */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__["e" /* NgbTooltipConfig */]) === "function" && _e || Object])
], FieldTypeModalContent);

var FieldTypesComponent = (function (_super) {
    __extends(FieldTypesComponent, _super);
    function FieldTypesComponent(dataService, activeModal, modalService, titleService) {
        var _this = _super.call(this, dataService, activeModal, modalService, titleService) || this;
        _this.title = 'Field types';
        _this.tableFields = [
            {
                name: 'name',
                title: 'Системное имя',
                output_type: 'text',
                output_properties: {}
            },
            {
                name: 'title',
                title: 'Название',
                output_type: 'text',
                output_properties: {}
            },
            {
                name: 'isActive',
                title: 'Статус',
                output_type: 'boolean',
                output_properties: {}
            }
        ];
        return _this;
    }
    FieldTypesComponent.prototype.getModalContent = function () {
        return FieldTypeModalContent;
    };
    return FieldTypesComponent;
}(__WEBPACK_IMPORTED_MODULE_9__page_table_abstract__["b" /* PageTableAbstractComponent */]));
FieldTypesComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'shk-field-types',
        template: __webpack_require__("../../../../../src/app/templates/catalog-field_types.html"),
        providers: [FieldTypesService]
    }),
    __metadata("design:paramtypes", [FieldTypesService, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */]) === "function" && _f || Object, typeof (_g = typeof __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__["c" /* NgbModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__ng_bootstrap_ng_bootstrap__["c" /* NgbModal */]) === "function" && _g || Object, typeof (_h = typeof __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["Title"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["Title"]) === "function" && _h || Object])
], FieldTypesComponent);

var _a, _b, _c, _d, _e, _f, _g, _h;
//# sourceMappingURL=field-types.component.js.map

/***/ }),

/***/ "../../../../../src/app/i18n-providers.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getTranslationProviders;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__locale_messages_ru__ = __webpack_require__("../../../../../locale/messages.ru.ts");


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
        { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["TRANSLATIONS"], useValue: translations },
        { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["TRANSLATIONS_FORMAT"], useValue: 'xlf' },
        { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["LOCALE_ID"], useValue: locale }
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

/***/ "../../../../../src/app/list-recursive.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListRecursiveComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ListRecursiveComponent = (function () {
    function ListRecursiveComponent() {
    }
    ListRecursiveComponent.prototype.ngOnInit = function () {
        this.filterInputItems();
    };
    ListRecursiveComponent.prototype.ngOnChanges = function (changes) {
        if (changes.inputItems) {
            this.filterInputItems();
        }
        if (changes.currentId) {
            this.updateParentsIds();
        }
    };
    ListRecursiveComponent.prototype.filterInputItems = function () {
        this.items = [];
        var items = this.items;
        var parentId = this.parentId;
        this.inputItems.forEach(function (item) {
            if (item.parent_id === parentId) {
                items.push(item);
            }
        });
        this.updateParentsIds();
    };
    /**
     * Update parents ids
     */
    ListRecursiveComponent.prototype.updateParentsIds = function () {
        var index = __WEBPACK_IMPORTED_MODULE_1_lodash__["findIndex"](this.inputItems, { id: this.currentId });
        this.currentParentsIds = [];
        if (index === -1) {
            return;
        }
        this.currentParentsIds = this.getParentIds(this.inputItems[index].parent_id);
    };
    /**
     *
     * @param parentId
     * @param parentIds
     * @returns {number[]}
     */
    ListRecursiveComponent.prototype.getParentIds = function (parentId, parentIds) {
        parentIds = parentIds || [];
        if (parentId > 0) {
            parentIds.push(parentId);
            var index = __WEBPACK_IMPORTED_MODULE_1_lodash__["findIndex"](this.inputItems, { id: parentId });
            if (index === -1) {
                return parentIds;
            }
            return this.getParentIds(this.inputItems[index].parent_id, parentIds);
        }
        else {
            return parentIds;
        }
    };
    /**
     * Check parent id
     * @param itemId
     * @returns {boolean}
     */
    ListRecursiveComponent.prototype.getIsActiveParent = function (itemId) {
        return this.currentParentsIds.indexOf(itemId) > -1;
    };
    return ListRecursiveComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Array)
], ListRecursiveComponent.prototype, "inputItems", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Array)
], ListRecursiveComponent.prototype, "items", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Number)
], ListRecursiveComponent.prototype, "parentId", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Number)
], ListRecursiveComponent.prototype, "currentId", void 0);
ListRecursiveComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'list-recursive',
        template: "\n        <ul>\n            <li *ngFor=\"let item of items\">\n                <a class=\"dropdown-item\">\n                    {{item.title}}\n                </a>\n                <list-recursive [inputItems]=\"inputItems\" [parentId]=\"item.id\" [currentId]=\"currentId\"></list-recursive>\n            </li>\n        </ul>\n    "
    })
], ListRecursiveComponent);

//# sourceMappingURL=list-recursive.component.js.map

/***/ }),

/***/ "../../../../../src/app/models/category.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Category; });
var Category = (function () {
    function Category(id, is_folder, parent_id, name, title, description, content_type_name, is_active) {
        this.id = id;
        this.is_folder = is_folder;
        this.parent_id = parent_id;
        this.name = name;
        this.title = title;
        this.description = description;
        this.content_type_name = content_type_name;
        this.is_active = is_active;
    }
    return Category;
}());

//# sourceMappingURL=category.model.js.map

/***/ }),

/***/ "../../../../../src/app/models/content_field.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContentField; });
var ContentField = (function () {
    function ContentField(id, name, title, description, input_type, input_properties, output_type, output_properties, group, required, is_filter, show_in_table) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.description = description;
        this.input_type = input_type;
        this.input_properties = input_properties;
        this.output_type = output_type;
        this.output_properties = output_properties;
        this.group = group;
        this.required = required;
        this.is_filter = is_filter;
        this.show_in_table = show_in_table;
    }
    return ContentField;
}());

//# sourceMappingURL=content_field.model.js.map

/***/ }),

/***/ "../../../../../src/app/models/content_type.model.ts":
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

/***/ "../../../../../src/app/models/field-type-property.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FieldTypeProperty; });
var FieldTypeProperty = (function () {
    function FieldTypeProperty(name, title, default_value) {
        this.name = name;
        this.title = title;
        this.default_value = default_value;
    }
    return FieldTypeProperty;
}());

//# sourceMappingURL=field-type-property.model.js.map

/***/ }),

/***/ "../../../../../src/app/models/field-type.model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FieldType; });
var FieldType = (function () {
    function FieldType(id, name, title, description, isActive, inputProperties, outputProperties) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.description = description;
        this.isActive = isActive;
        this.inputProperties = inputProperties;
        this.outputProperties = outputProperties;
    }
    return FieldType;
}());

//# sourceMappingURL=field-type.model.js.map

/***/ }),

/***/ "../../../../../src/app/models/query-options.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return QueryOptions; });
var QueryOptions = (function () {
    function QueryOptions(sort_by, sort_dir, page, limit, full, only_active) {
        this.sort_by = sort_by;
        this.sort_dir = sort_dir;
        this.page = page;
        this.limit = limit;
        this.full = full;
        this.only_active = only_active;
    }
    return QueryOptions;
}());

//# sourceMappingURL=query-options.js.map

/***/ }),

/***/ "../../../../../src/app/not-found.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NotFoundComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var NotFoundComponent = (function () {
    function NotFoundComponent() {
    }
    return NotFoundComponent;
}());
NotFoundComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'not-found-app',
        template: "<h3 class=\"mt-3\">Page not found.</h3>"
    })
], NotFoundComponent);

//# sourceMappingURL=not-found.component.js.map

/***/ }),

/***/ "../../../../../src/app/orders.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrdersComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
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
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'shk-settings',
        template: __webpack_require__("../../../../../src/app/templates/page-orders.html")
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["Title"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["Title"]) === "function" && _a || Object])
], OrdersComponent);

var _a;
//# sourceMappingURL=orders.component.js.map

/***/ }),

/***/ "../../../../../src/app/page-table.abstract.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ModalContentAbstractComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return PageTableAbstractComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_query_options__ = __webpack_require__("../../../../../src/app/models/query-options.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ModalContentAbstractComponent = (function () {
    function ModalContentAbstractComponent(fb, dataService, systemNameService, activeModal, tooltipConfig) {
        this.fb = fb;
        this.dataService = dataService;
        this.systemNameService = systemNameService;
        this.activeModal = activeModal;
        this.tooltipConfig = tooltipConfig;
        this.submitted = false;
        this.loading = false;
        this.formErrors = {};
        this.validationMessages = {};
        this.formFields = {};
        this.model = {};
        tooltipConfig.placement = 'bottom';
        tooltipConfig.container = 'body';
        tooltipConfig.triggers = 'hover click';
    }
    ModalContentAbstractComponent.prototype.ngOnInit = function () {
        this.buildForm();
        if (this.itemId) {
            this.getModelData();
        }
    };
    ModalContentAbstractComponent.prototype.getModelData = function () {
        var _this = this;
        this.loading = true;
        this.dataService.getItem(this.itemId)
            .then(function (res) {
            if (_this.isItemCopy) {
                res.data.id = '';
                res.data.name = '';
            }
            _this.model = res.data;
            _this.loading = false;
        });
    };
    /** Build form groups */
    ModalContentAbstractComponent.prototype.buildForm = function () {
        var _this = this;
        var controls = this.buildControls(this.formFields, 'model');
        this.form = this.fb.group(controls);
        this.form.valueChanges
            .subscribe(function () { return _this.onValueChanged('form'); });
    };
    /** Build controls */
    ModalContentAbstractComponent.prototype.buildControls = function (options, modelName, keyPrefix) {
        if (keyPrefix === void 0) { keyPrefix = ''; }
        var controls = {};
        for (var key in options) {
            if (!options.hasOwnProperty(key)) {
                continue;
            }
            var opts = options[key];
            if (!this[modelName][key]) {
                this[modelName][key] = opts.value;
            }
            controls[key] = new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"](this[modelName][key] || '', opts.validators);
            this.formErrors[keyPrefix + key] = '';
            this.validationMessages[keyPrefix + key] = opts.messages;
        }
        return controls;
    };
    /** Callback on form value changed */
    ModalContentAbstractComponent.prototype.onValueChanged = function (formName, keyPrefix) {
        if (keyPrefix === void 0) { keyPrefix = ''; }
        if (!this[formName]) {
            return;
        }
        var data = this[formName].value;
        for (var fieldName in data) {
            if (!data.hasOwnProperty(fieldName)) {
                continue;
            }
            this.formErrors[keyPrefix + fieldName] = '';
            var control = this[formName].get(fieldName);
            if (control && (control.dirty || this[keyPrefix + 'submitted']) && !control.valid) {
                for (var key in control.errors) {
                    if (this.validationMessages[keyPrefix + fieldName][key]) {
                        this.formErrors[keyPrefix + fieldName] += this.validationMessages[keyPrefix + fieldName][key] + ' ';
                    }
                }
            }
        }
    };
    /** Element display toggle */
    ModalContentAbstractComponent.prototype.displayToggle = function (element, display) {
        display = display || element.style.display == 'none';
        element.style.display = display ? 'block' : 'none';
    };
    ModalContentAbstractComponent.prototype.generateName = function (model) {
        var title = model.title || '';
        model.name = this.systemNameService.generateName(title);
    };
    /** Close modal */
    ModalContentAbstractComponent.prototype.closeModal = function () {
        var reason = this.itemId ? 'edit' : 'create';
        this.activeModal.close({ reason: reason, data: this.model });
    };
    /** Submit form */
    ModalContentAbstractComponent.prototype.onSubmit = function () {
        this.submitted = true;
        this.closeModal();
    };
    return ModalContentAbstractComponent;
}());

__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], ModalContentAbstractComponent.prototype, "modalTitle", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], ModalContentAbstractComponent.prototype, "itemId", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], ModalContentAbstractComponent.prototype, "isItemCopy", void 0);
var PageTableAbstractComponent = (function () {
    function PageTableAbstractComponent(dataService, activeModal, modalService, titleService) {
        this.dataService = dataService;
        this.activeModal = activeModal;
        this.modalService = modalService;
        this.titleService = titleService;
        this.items = [];
        this.title = 'Page with data table';
        this.loading = false;
        this.selectedIds = [];
        this.collectionSize = 0;
        this.queryOptions = new __WEBPACK_IMPORTED_MODULE_2__models_query_options__["a" /* QueryOptions */]('name', 'asc', 1, 10, 0, 0);
    }
    PageTableAbstractComponent.prototype.ngOnInit = function () {
        this.setTitle(this.title);
        this.getList();
    };
    PageTableAbstractComponent.prototype.setTitle = function (newTitle) {
        this.titleService.setTitle(newTitle);
    };
    PageTableAbstractComponent.prototype.modalOpen = function (itemId, isItemCopy) {
        var _this = this;
        if (isItemCopy === void 0) { isItemCopy = false; }
        this.modalRef = this.modalService.open(this.getModalContent(), { size: 'lg' });
        this.setModalInputs(itemId, isItemCopy);
        this.modalRef.result.then(function (result) {
            _this.getList();
        }, function (reason) {
            //console.log( 'reason', reason );
        });
    };
    PageTableAbstractComponent.prototype.setModalInputs = function (itemId, isItemCopy) {
        if (isItemCopy === void 0) { isItemCopy = false; }
        this.modalRef.componentInstance.modalTitle = itemId && !isItemCopy
            ? 'Edit'
            : 'Add';
        this.modalRef.componentInstance.itemId = itemId || 0;
        this.modalRef.componentInstance.isItemCopy = isItemCopy || false;
    };
    PageTableAbstractComponent.prototype.deleteItemConfirm = function (itemId) {
        var _this = this;
        this.modalRef = this.modalService.open(__WEBPACK_IMPORTED_MODULE_3__app_component__["c" /* ConfirmModalContent */]);
        this.modalRef.componentInstance.modalTitle = 'Confirm';
        this.modalRef.componentInstance.modalContent = 'Are you sure you want to remove this item?';
        this.modalRef.result.then(function (result) {
            if (result == 'accept') {
                _this.deleteItem(itemId);
            }
        }, function (reason) {
        });
    };
    PageTableAbstractComponent.prototype.deleteItem = function (itemId) {
        var _this = this;
        this.dataService.deleteItem(itemId)
            .then(function (res) {
            if (res.success) {
                _this.getList();
            }
            else {
                if (res.msg) {
                    _this.modalRef = _this.modalService.open(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* AlertModalContent */]);
                    _this.modalRef.componentInstance.modalContent = res.msg;
                    _this.modalRef.componentInstance.modalTitle = 'Error';
                    _this.modalRef.componentInstance.messageType = 'error';
                }
            }
        });
    };
    PageTableAbstractComponent.prototype.actionRequest = function (actionValue) {
        switch (actionValue[0]) {
            case 'edit':
                this.modalOpen(actionValue[1]);
                break;
            case 'copy':
                this.modalOpen(actionValue[1], true);
                break;
            case 'delete':
                this.deleteItemConfirm(actionValue[1]);
                break;
            case 'changeQuery':
                this.getList();
                break;
        }
    };
    PageTableAbstractComponent.prototype.getList = function () {
        var _this = this;
        this.loading = true;
        this.dataService.getList(this.queryOptions)
            .subscribe(function (res) {
            if (res.success) {
                _this.items = res.data;
                _this.collectionSize = res.total;
            }
            else {
                _this.items = [];
            }
            _this.loading = false;
        }, function (error) { return _this.errorMessage = error; });
    };
    return PageTableAbstractComponent;
}());

//# sourceMappingURL=page-table.abstract.js.map

/***/ }),

/***/ "../../../../../src/app/pipes/filter-field-by-group.pipe.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FilterFieldByGroup; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var FilterFieldByGroup = (function () {
    function FilterFieldByGroup() {
    }
    FilterFieldByGroup.prototype.transform = function (allFields, groupName) {
        return allFields.filter(function (field) { return field.group == groupName; });
    };
    return FilterFieldByGroup;
}());
FilterFieldByGroup = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Pipe"])({ name: 'filterFieldByGroup' })
], FilterFieldByGroup);

//# sourceMappingURL=filter-field-by-group.pipe.js.map

/***/ }),

/***/ "../../../../../src/app/pipes/orderby.pipe.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderByPipe; });
/* unused harmony export ORDERBY_PROVIDERS */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/*
 * https://github.com/FuelInteractive/fuel-ui
 * Example use
 *		Basic Array of single type: *ngFor="let todo of todoService.todos | orderBy : '-'"
 *		Multidimensional Array Sort on single column: *ngFor="let todo of todoService.todos | orderBy : ['-status']"
 *		Multidimensional Array Sort on multiple columns: *ngFor="let todo of todoService.todos | orderBy : ['status', '-title']"
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var OrderByPipe = OrderByPipe_1 = (function () {
    function OrderByPipe() {
        this.value = [];
    }
    OrderByPipe._orderByComparator = function (a, b) {
        if (a === null || typeof a === 'undefined')
            a = 0;
        if (b === null || typeof b === 'undefined')
            b = 0;
        if ((isNaN(parseFloat(a)) || !isFinite(a)) || (isNaN(parseFloat(b)) || !isFinite(b))) {
            //Isn't a number so lowercase the string to properly compare
            if (a.toLowerCase() < b.toLowerCase())
                return -1;
            if (a.toLowerCase() > b.toLowerCase())
                return 1;
        }
        else {
            //Parse strings as numbers to compare properly
            if (parseFloat(a) < parseFloat(b))
                return -1;
            if (parseFloat(a) > parseFloat(b))
                return 1;
        }
        return 0; //equal each other
    };
    OrderByPipe.prototype.transform = function (input, config) {
        if (config === void 0) { config = '+'; }
        //invalid input given
        if (!input)
            return input;
        //make a copy of the input's reference
        this.value = input.slice();
        var value = this.value;
        if (!Array.isArray(value))
            return value;
        if (!Array.isArray(config) || (Array.isArray(config) && config.length == 1)) {
            var propertyToCheck = !Array.isArray(config) ? config : config[0];
            var desc_1 = propertyToCheck.substr(0, 1) == '-';
            //Basic array
            if (!propertyToCheck || propertyToCheck == '-' || propertyToCheck == '+') {
                return !desc_1 ? value.sort() : value.sort().reverse();
            }
            else {
                var property_1 = propertyToCheck.substr(0, 1) == '+' || propertyToCheck.substr(0, 1) == '-'
                    ? propertyToCheck.substr(1)
                    : propertyToCheck;
                return value.sort(function (a, b) {
                    var aValue = a[property_1];
                    var bValue = b[property_1];
                    var propertySplit = property_1.split('.');
                    if (typeof aValue === 'undefined' && typeof bValue === 'undefined' && propertySplit.length > 1) {
                        aValue = a;
                        bValue = b;
                        for (var j = 0; j < propertySplit.length; j++) {
                            aValue = aValue[propertySplit[j]];
                            bValue = bValue[propertySplit[j]];
                        }
                    }
                    return !desc_1
                        ? OrderByPipe_1._orderByComparator(aValue, bValue)
                        : -OrderByPipe_1._orderByComparator(aValue, bValue);
                });
            }
        }
        else {
            //Loop over property of the array in order and sort
            return value.sort(function (a, b) {
                for (var i = 0; i < config.length; i++) {
                    var desc = config[i].substr(0, 1) == '-';
                    var property = config[i].substr(0, 1) == '+' || config[i].substr(0, 1) == '-'
                        ? config[i].substr(1)
                        : config[i];
                    var aValue = a[property];
                    var bValue = b[property];
                    var propertySplit = property.split('.');
                    if (typeof aValue === 'undefined' && typeof bValue === 'undefined' && propertySplit.length > 1) {
                        aValue = a;
                        bValue = b;
                        for (var j = 0; j < propertySplit.length; j++) {
                            aValue = aValue[propertySplit[j]];
                            bValue = bValue[propertySplit[j]];
                        }
                    }
                    var comparison = !desc
                        ? OrderByPipe_1._orderByComparator(aValue, bValue)
                        : -OrderByPipe_1._orderByComparator(aValue, bValue);
                    //Don't return 0 yet in case of needing to sort by next property
                    if (comparison != 0)
                        return comparison;
                }
                return 0; //equal each other
            });
        }
    };
    return OrderByPipe;
}());
OrderByPipe = OrderByPipe_1 = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Pipe"])({ name: 'orderBy', pure: false })
], OrderByPipe);

var ORDERBY_PROVIDERS = [
    OrderByPipe
];
var OrderByPipe_1;
//# sourceMappingURL=orderby.pipe.js.map

/***/ }),

/***/ "../../../../../src/app/product.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProductModalContent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__ = __webpack_require__("../../../../@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_content_type_model__ = __webpack_require__("../../../../../src/app/models/content_type.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_category_model__ = __webpack_require__("../../../../../src/app/models/category.model.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_query_options__ = __webpack_require__("../../../../../src/app/models/query-options.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_lodash__ = __webpack_require__("../../../../lodash/lodash.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_lodash___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_lodash__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__page_table_abstract__ = __webpack_require__("../../../../../src/app/page-table.abstract.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_content_types_service__ = __webpack_require__("../../../../../src/app/services/content_types.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__services_products_service__ = __webpack_require__("../../../../../src/app/services/products.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__services_system_name_service__ = __webpack_require__("../../../../../src/app/services/system-name.service.ts");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var ProductModalContent = (function (_super) {
    __extends(ProductModalContent, _super);
    function ProductModalContent(fb, dataService, systemNameService, activeModal, tooltipConfig, contentTypesService) {
        var _this = _super.call(this, fb, dataService, systemNameService, activeModal, tooltipConfig) || this;
        _this.contentTypesService = contentTypesService;
        _this.contentTypes = [];
        _this.currentContentType = new __WEBPACK_IMPORTED_MODULE_3__models_content_type_model__["a" /* ContentType */](0, '', '', '', '', [], [], true);
        _this.model = {
            id: 0,
            parent_id: 0
        };
        _this.formFields = {
            content_type: {
                value: '',
                validators: [],
                messages: {}
            },
            is_active: {
                value: true,
                validators: [],
                messages: {}
            }
        };
        return _this;
    }
    /** On initialize */
    ProductModalContent.prototype.ngOnInit = function () {
        var _this = this;
        this.dataService.setRequestUrl('admin/products/' + this.category.id);
        this.buildForm();
        if (this.itemId) {
            this.getModelData();
        }
        else {
            this.getContentTypes()
                .subscribe(function (res) {
                if (res.success) {
                    _this.contentTypes = res.data;
                    _this.selectCurrentContentType();
                }
                else {
                    if (res.msg) {
                        _this.errorMessage = res.msg;
                    }
                }
            }, function (error) { return _this.errorMessage = error; });
        }
    };
    /** Build form */
    ProductModalContent.prototype.updateForm = function (data) {
        var _this = this;
        if (!data) {
            data = this.model;
        }
        var newKeys = __WEBPACK_IMPORTED_MODULE_6_lodash__["map"](this.currentContentType.fields, function (field) {
            return field.name;
        });
        newKeys.push('content_type', 'is_active');
        //Remove keys
        for (var key in this.form.controls) {
            if (this.form.controls.hasOwnProperty(key)) {
                if (newKeys.indexOf(key) === -1) {
                    this.form.removeControl(key);
                }
            }
        }
        //Add new controls
        this.currentContentType.fields.forEach(function (field) {
            if (!_this.form.controls[field.name]) {
                _this.model[field.name] = data[field.name] || '';
                var validators = [];
                if (field.required) {
                    validators.push(__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required);
                }
                var control = new __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormControl"](_this.model[field.name], validators);
                _this.form.addControl(field.name, control);
            }
        });
    };
    ProductModalContent.prototype.getModelData = function () {
        var _this = this;
        this.loading = true;
        this.dataService.getItem(this.itemId)
            .then(function (res) {
            return new Promise(function (resolve, reject) {
                _this.getContentTypes()
                    .subscribe(function (resp) {
                    if (resp.success) {
                        _this.contentTypes = resp.data;
                        if (res.success) {
                            resolve(res.data);
                        }
                        else {
                            reject(res);
                        }
                    }
                });
            });
        })
            .then(function (data) {
            if (_this.isItemCopy) {
                data.id = 0;
            }
            _this.model = data;
            _this.selectCurrentContentType(data.content_type);
            _this.loading = false;
        });
    };
    /** Select current content type */
    ProductModalContent.prototype.selectCurrentContentType = function (contentTypeName) {
        contentTypeName = contentTypeName || this.form.get('content_type').value;
        var index = __WEBPACK_IMPORTED_MODULE_6_lodash__["findIndex"](this.contentTypes, { name: contentTypeName });
        if (index == -1) {
            index = 0;
        }
        if (this.contentTypes[index]) {
            this.currentContentType = __WEBPACK_IMPORTED_MODULE_6_lodash__["clone"](this.contentTypes[index]);
            this.form.get('content_type').setValue(this.currentContentType.name);
            this.updateForm();
        }
    };
    /** On change content type */
    ProductModalContent.prototype.onChangeContentType = function () {
        this.selectCurrentContentType();
    };
    /** Get content types */
    ProductModalContent.prototype.getContentTypes = function () {
        var queryOptions = new __WEBPACK_IMPORTED_MODULE_5__models_query_options__["a" /* QueryOptions */]('name', 'asc', 1, 0, 1, 1);
        return this.contentTypesService.getList(queryOptions);
    };
    ProductModalContent.prototype.save = function () {
        this.submitted = true;
        if (!this.form.valid) {
            this.onValueChanged('form');
            this.submitted = false;
            return;
        }
        var callback = function (res) {
            if (res.success) {
                this.closeModal();
            }
            else {
                if (res.msg) {
                    this.submitted = false;
                    this.errorMessage = res.msg;
                }
            }
        };
        this.model.parent_id = this.category.id;
        if (this.model.id) {
            this.dataService.update(this.model).then(callback.bind(this));
        }
        else {
            this.dataService.create(this.model).then(callback.bind(this));
        }
    };
    return ProductModalContent;
}(__WEBPACK_IMPORTED_MODULE_7__page_table_abstract__["a" /* ModalContentAbstractComponent */]));
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_4__models_category_model__["a" /* Category */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__models_category_model__["a" /* Category */]) === "function" && _a || Object)
], ProductModalContent.prototype, "category", void 0);
ProductModalContent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'product-modal-content',
        template: __webpack_require__("../../../../../src/app/templates/modal-product.html"),
        providers: [__WEBPACK_IMPORTED_MODULE_10__services_system_name_service__["a" /* SystemNameService */]]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormBuilder"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormBuilder"]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_9__services_products_service__["a" /* ProductsService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_9__services_products_service__["a" /* ProductsService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_10__services_system_name_service__["a" /* SystemNameService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_10__services_system_name_service__["a" /* SystemNameService */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */]) === "function" && _e || Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["e" /* NgbTooltipConfig */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["e" /* NgbTooltipConfig */]) === "function" && _f || Object, typeof (_g = typeof __WEBPACK_IMPORTED_MODULE_8__services_content_types_service__["a" /* ContentTypesService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_8__services_content_types_service__["a" /* ContentTypesService */]) === "function" && _g || Object])
], ProductModalContent);

var _a, _b, _c, _d, _e, _f, _g;
//# sourceMappingURL=product.component.js.map

/***/ }),

/***/ "../../../../../src/app/render-input-field.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InputFieldComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__ = __webpack_require__("../../../../@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_system_name_service__ = __webpack_require__("../../../../../src/app/services/system-name.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var InputFieldComponent = (function () {
    function InputFieldComponent(systemNameService, dateParserFormatter) {
        this.systemNameService = systemNameService;
        this.dateParserFormatter = dateParserFormatter;
    }
    InputFieldComponent.prototype.ngOnInit = function () {
        var controls = {};
        this.fields.forEach(function (field, index) {
            if (!this.model[field.name]) {
                this.model[field.name] = '';
            }
            controls[field.name] = new __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormControl"](this.model[field.name], this.getValidators(field));
            this.setDefaultValue(field.input_type, field.name);
            this.formErrors[field.name] = '';
            this.validationMessages[field.name] = this.getValidationMessages(field);
        }.bind(this));
    };
    InputFieldComponent.prototype.setDefaultValue = function (fieldType, fieldName) {
        switch (fieldType) {
            case 'date':
                if (!this.model[fieldName]) {
                    var now = new Date();
                    // this.model[fieldName] = {
                    //     year: now.getFullYear(),
                    //     month: now.getMonth() + 1,
                    //     day: now.getDate()
                    // };
                    this.model[fieldName] = new Date();
                }
                break;
        }
    };
    InputFieldComponent.prototype.getValidators = function (field) {
        var validators = [];
        if (field.required) {
            validators.push(__WEBPACK_IMPORTED_MODULE_1__angular_forms__["Validators"].required);
        }
        return validators;
    };
    InputFieldComponent.prototype.getValidationMessages = function (field) {
        var messages = {};
        if (field.required) {
            messages.required = 'This field is required.';
        }
        return messages;
    };
    InputFieldComponent.prototype.generateName = function (model) {
        var title = model.title || '';
        model.name = this.systemNameService.generateName(title);
    };
    return InputFieldComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Array)
], InputFieldComponent.prototype, "fields", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], InputFieldComponent.prototype, "model", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormGroup"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_forms__["FormGroup"]) === "function" && _a || Object)
], InputFieldComponent.prototype, "form", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Boolean)
], InputFieldComponent.prototype, "submitted", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], InputFieldComponent.prototype, "formErrors", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], InputFieldComponent.prototype, "validationMessages", void 0);
InputFieldComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'input-field',
        template: __webpack_require__("../../../../../src/app/templates/render-input-field.html"),
        providers: [__WEBPACK_IMPORTED_MODULE_3__services_system_name_service__["a" /* SystemNameService */]]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__services_system_name_service__["a" /* SystemNameService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__services_system_name_service__["a" /* SystemNameService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["b" /* NgbDateParserFormatter */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__ng_bootstrap_ng_bootstrap__["b" /* NgbDateParserFormatter */]) === "function" && _c || Object])
], InputFieldComponent);

var _a, _b, _c;
//# sourceMappingURL=render-input-field.js.map

/***/ }),

/***/ "../../../../../src/app/render-output-field.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OutputFieldComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var OutputFieldComponent = (function () {
    function OutputFieldComponent() {
    }
    OutputFieldComponent.prototype.ngOnInit = function () {
        //console.log(this.options);
    };
    return OutputFieldComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], OutputFieldComponent.prototype, "value", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", String)
], OutputFieldComponent.prototype, "outputType", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], OutputFieldComponent.prototype, "options", void 0);
OutputFieldComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'output-field',
        template: __webpack_require__("../../../../../src/app/templates/render-output-field.html"),
        providers: []
    }),
    __metadata("design:paramtypes", [])
], OutputFieldComponent);

//# sourceMappingURL=render-output-field.js.map

/***/ }),

/***/ "../../../../../src/app/services/categories.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CategoriesService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data_service_abstract__ = __webpack_require__("../../../../../src/app/services/data-service.abstract.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__("../../../../rxjs/add/operator/toPromise.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch__ = __webpack_require__("../../../../rxjs/add/operator/catch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__ = __webpack_require__("../../../../rxjs/add/operator/map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var CategoriesService = (function (_super) {
    __extends(CategoriesService, _super);
    function CategoriesService(http) {
        var _this = _super.call(this, http) || this;
        _this.setRequestUrl('admin/categories');
        return _this;
    }
    CategoriesService.prototype.extractData = function (res) {
        var body = res.json();
        if (body.data) {
            if (Array.isArray(body.data)) {
                body.data = body.data;
            }
            else {
                body.data = body.data;
            }
        }
        return body;
    };
    return CategoriesService;
}(__WEBPACK_IMPORTED_MODULE_2__data_service_abstract__["a" /* DataService */]));
CategoriesService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]) === "function" && _a || Object])
], CategoriesService);

var _a;
//# sourceMappingURL=categories.service.js.map

/***/ }),

/***/ "../../../../../src/app/services/collections.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CollectionsService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data_service_abstract__ = __webpack_require__("../../../../../src/app/services/data-service.abstract.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__("../../../../rxjs/add/operator/toPromise.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var CollectionsService = (function (_super) {
    __extends(CollectionsService, _super);
    function CollectionsService(http) {
        var _this = _super.call(this, http) || this;
        _this.http = http;
        _this.setRequestUrl('admin/collections');
        return _this;
    }
    CollectionsService.prototype.deleteItemByName = function (itemName) {
        var url = this.getRequestUrl() + "/" + itemName;
        return this.http.delete(url, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    CollectionsService.prototype.extractData = function (res) {
        return res.json();
    };
    return CollectionsService;
}(__WEBPACK_IMPORTED_MODULE_2__data_service_abstract__["a" /* DataService */]));
CollectionsService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]) === "function" && _a || Object])
], CollectionsService);

var _a;
//# sourceMappingURL=collections.service.js.map

/***/ }),

/***/ "../../../../../src/app/services/content_types.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContentTypesService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data_service_abstract__ = __webpack_require__("../../../../../src/app/services/data-service.abstract.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__("../../../../rxjs/add/operator/toPromise.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ContentTypesService = (function (_super) {
    __extends(ContentTypesService, _super);
    function ContentTypesService(http) {
        var _this = _super.call(this, http) || this;
        _this.setRequestUrl('admin/content_types');
        return _this;
    }
    ContentTypesService.prototype.extractData = function (res) {
        var body = res.json();
        if (body.data) {
            if (Array.isArray(body.data)) {
                body.data = body.data;
            }
            else {
                body.data = body.data;
            }
        }
        return body;
    };
    return ContentTypesService;
}(__WEBPACK_IMPORTED_MODULE_2__data_service_abstract__["a" /* DataService */]));
ContentTypesService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]) === "function" && _a || Object])
], ContentTypesService);

var _a;
//# sourceMappingURL=content_types.service.js.map

/***/ }),

/***/ "../../../../../src/app/services/data-service.abstract.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DataService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise__ = __webpack_require__("../../../../rxjs/add/operator/toPromise.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_catch__ = __webpack_require__("../../../../rxjs/add/operator/catch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_catch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__("../../../../rxjs/add/operator/map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var DataService = (function () {
    function DataService(http) {
        this.http = http;
        this.headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Headers */]({ 'Content-Type': 'application/json' });
        this.requestUrl = '';
        this.http = http;
        this.requestUrl = 'app/data_list';
    }
    DataService.prototype.setRequestUrl = function (url) {
        this.requestUrl = url;
    };
    DataService.prototype.getRequestUrl = function () {
        return this.requestUrl;
    };
    DataService.prototype.getItem = function (id) {
        var url = this.getRequestUrl() + ("/" + id);
        return this.http.get(url)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.getList = function (options) {
        var params = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* URLSearchParams */]();
        for (var name in options) {
            if (!options.hasOwnProperty(name)) {
                continue;
            }
            params.set(name, options[name]);
        }
        return this.http.get(this.getRequestUrl(), { search: params })
            .map(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.deleteItem = function (id) {
        var url = this.getRequestUrl() + ("/" + id);
        return this.http.delete(url, { headers: this.headers })
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.create = function (item) {
        return this.http
            .post(this.getRequestUrl(), JSON.stringify(item), { headers: this.headers })
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.update = function (item) {
        var url = this.getRequestUrl() + ("/" + item.id);
        return this.http
            .put(url, JSON.stringify(item), { headers: this.headers })
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    };
    DataService.prototype.handleError = function (error) {
        var errMsg;
        if (error instanceof __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Response */]) {
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
    return DataService;
}());
DataService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]) === "function" && _a || Object])
], DataService);

var _a;
//# sourceMappingURL=data-service.abstract.js.map

/***/ }),

/***/ "../../../../../src/app/services/products.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProductsService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data_service_abstract__ = __webpack_require__("../../../../../src/app/services/data-service.abstract.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__("../../../../rxjs/add/operator/toPromise.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch__ = __webpack_require__("../../../../rxjs/add/operator/catch.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__ = __webpack_require__("../../../../rxjs/add/operator/map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var ProductsService = (function (_super) {
    __extends(ProductsService, _super);
    function ProductsService(http) {
        var _this = _super.call(this, http) || this;
        _this.setRequestUrl('admin/products');
        return _this;
    }
    ProductsService.prototype.extractData = function (res) {
        var body = res.json();
        if (body.data) {
            if (Array.isArray(body.data)) {
                body.data = body.data;
            }
            else {
                body.data = body.data;
            }
        }
        return body;
    };
    return ProductsService;
}(__WEBPACK_IMPORTED_MODULE_2__data_service_abstract__["a" /* DataService */]));
ProductsService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]) === "function" && _a || Object])
], ProductsService);

var _a;
//# sourceMappingURL=products.service.js.map

/***/ }),

/***/ "../../../../../src/app/services/system-name.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SystemNameService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var SystemNameService = (function () {
    function SystemNameService() {
        this.transitMap = {
            ru: {
                'А': 'A', 'а': 'a', 'Б': 'B', 'б': 'b', 'В': 'V', 'в': 'v', 'Г': 'G', 'г': 'g',
                'Д': 'D', 'д': 'd', 'Е': 'E', 'е': 'e', 'Ё': 'E', 'ё': 'e', 'Ж': 'Zh', 'ж': 'zh',
                'З': 'Z', 'з': 'z', 'И': 'I', 'и': 'i', 'Й': 'Y', 'й': 'y', 'К': 'K', 'к': 'k',
                'Л': 'L', 'л': 'l', 'М': 'M', 'м': 'm', 'Н': 'N', 'н': 'n', 'О': 'O', 'о': 'o',
                'П': 'P', 'п': 'p', 'Р': 'R', 'р': 'r', 'С': 'S', 'с': 's', 'Т': 'T', 'т': 't',
                'У': 'U', 'у': 'u', 'Ф': 'F', 'ф': 'f', 'Х': 'Kh', 'х': 'kh', 'Ц': 'Ts', 'ц': 'ts',
                'Ч': 'Ch', 'ч': 'ch', 'Ш': 'Sh', 'ш': 'sh', 'Щ': 'Sch', 'щ': 'sch', 'ь': '', 'Ы': 'Y',
                'ы': 'y', 'ъ': '', 'Э': 'E', 'э': 'e', 'Ю': 'Yu', 'ю': 'yu', 'Я': 'Ya', 'я': 'ya',
                ' ': '-', '\\': '', '/': '', '\'': '', '"': '', '[': '', ']': '', '{': '', '}': '',
                '(': '', ')': ''
            }
        };
    }
    SystemNameService.prototype.mapWords = function (char, lang) {
        return Object.prototype.hasOwnProperty.call(this.transitMap[lang], char)
            ? this.transitMap[lang][char]
            : char;
    };
    SystemNameService.prototype.transliterate = function (word) {
        var _this = this;
        return word.split('')
            .map(function (char) { return _this.mapWords(char, 'ru'); })
            .join('');
    };
    SystemNameService.prototype.generateName = function (title) {
        title = this.transliterate(title);
        return title.toLowerCase();
    };
    return SystemNameService;
}());
SystemNameService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])()
], SystemNameService);

//# sourceMappingURL=system-name.service.js.map

/***/ }),

/***/ "../../../../../src/app/settings.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SettingsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
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
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'shk-settings',
        template: __webpack_require__("../../../../../src/app/templates/page-settings.html")
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["Title"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["Title"]) === "function" && _a || Object])
], SettingsComponent);

var _a;
//# sourceMappingURL=settings.component.js.map

/***/ }),

/***/ "../../../../../src/app/stat.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StatisticsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
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
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'shk-settings',
        template: __webpack_require__("../../../../../src/app/templates/page-statistics.html")
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["Title"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["Title"]) === "function" && _a || Object])
], StatisticsComponent);

var _a;
//# sourceMappingURL=stat.component.js.map

/***/ }),

/***/ "../../../../../src/app/table.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TableComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("../../../router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_query_options__ = __webpack_require__("../../../../../src/app/models/query-options.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var TableComponent = (function () {
    function TableComponent(router) {
        this.router = router;
        this.actionRequest = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.selectedIds = [];
    }
    TableComponent.prototype.ngOnInit = function () {
        this.queryOptions.sort_by = this.tableFields[0].name;
    };
    TableComponent.prototype.selectSortBy = function (fieldName) {
        if (this.queryOptions.sort_by == fieldName) {
            this.queryOptions.sort_dir = this.queryOptions.sort_dir == 'asc' ? 'desc' : 'asc';
        }
        else {
            this.queryOptions.sort_by = fieldName;
        }
        this.actionRequest.emit(['changeQuery', this.queryOptions]);
    };
    TableComponent.prototype.selectAll = function (event) {
        this.selectedIds = [];
        if (event.target.checked) {
            for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
                var item = _a[_i];
                this.selectedIds.push(item.id);
            }
        }
    };
    TableComponent.prototype.setSelected = function (event, itemId) {
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
    TableComponent.prototype.pageChange = function () {
        this.actionRequest.emit(['changeQuery', this.queryOptions]);
    };
    TableComponent.prototype.action = function (actionName, actionValue) {
        this.actionRequest.emit([actionName, actionValue]);
    };
    TableComponent.prototype.getIsSelected = function (itemId) {
        return this.selectedIds.lastIndexOf(itemId) > -1;
    };
    return TableComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Array)
], TableComponent.prototype, "items", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Array)
], TableComponent.prototype, "tableFields", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Number)
], TableComponent.prototype, "collectionSize", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Number)
], TableComponent.prototype, "currentPage", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__models_query_options__["a" /* QueryOptions */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__models_query_options__["a" /* QueryOptions */]) === "function" && _a || Object)
], TableComponent.prototype, "queryOptions", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Boolean)
], TableComponent.prototype, "loading", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Output"])(),
    __metadata("design:type", Object)
], TableComponent.prototype, "actionRequest", void 0);
TableComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'cmp-table',
        template: __webpack_require__("../../../../../src/app/templates/cmp-table.html")
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["Router"]) === "function" && _b || Object])
], TableComponent);

var _a, _b;
//# sourceMappingURL=table.component.js.map

/***/ }),

/***/ "../../../../../src/app/templates/app.component.html":
/***/ (function(module, exports) {

module.exports = "<div>\n\n    <div class=\"card-navbar\">\n        <div class=\"btn-group\" role=\"group\" aria-label=\"First group\">\n            <a class=\"btn btn-outline-primary\" [routerLink]=\"['/orders']\" routerLinkActive=\"active\">\n                <i class=\"icon-bag\"></i>\n                <span class=\"hidden-xs-down\" i18n>Orders</span>\n            </a>\n            <a class=\"btn btn-outline-primary\" [routerLink]=\"['/statistics']\" routerLinkActive=\"active\">\n                <i class=\"icon-bar-graph-2\"></i>\n                <span class=\"hidden-xs-down\" i18n>Statistics</span>\n            </a>\n            <a class=\"btn btn-outline-primary\" [routerLink]=\"['/catalog']\" routerLinkActive=\"active\">\n                <i class=\"icon-layers\"></i>\n                <span class=\"hidden-xs-down\" i18n>Catalog</span>\n            </a>\n            <a class=\"btn btn-outline-primary\" [routerLink]=\"['/settings']\" routerLinkActive=\"active\">\n                <i class=\"icon-cog\"></i>\n                <span class=\"hidden-xs-down\" i18n>Settings</span>\n            </a>\n        </div>\n    </div>\n\n    <router-outlet></router-outlet>\n\n</div>"

/***/ }),

/***/ "../../../../../src/app/templates/catalog-category.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"mb-3\">\n    <div class=\"float-right\">\n\n        <div ngbDropdown class=\"d-inline-block mr-1\">\n            <button class=\"btn btn-info\" ngbDropdownToggle>\n                Массовые дейсвия\n            </button>\n            <div ngbDropdownMenu>\n                <button class=\"dropdown-item\">Отключить / включить</button>\n                <button class=\"dropdown-item\">Удалить</button>\n            </div>\n        </div>\n\n        <button type=\"button\" class=\"btn btn-success d-inline-block btn-wide\" (click)=\"modalOpen()\">\n            <i class=\"icon-plus\"></i>\n            Add\n        </button>\n\n    </div>\n    <div class=\"float-left\">\n\n        <categories-menu (changeRequest)=\"openCategory($event)\"></categories-menu>\n\n    </div>\n    <div class=\"clearfix\"></div>\n</div>\n\n<cmp-table [items]=\"items\" [collectionSize]=\"collectionSize\" [queryOptions]=\"queryOptions\" [tableFields]=\"tableFields\" [(loading)]=\"loading\" (actionRequest)=\"actionRequest($event)\"></cmp-table>\n"

/***/ }),

/***/ "../../../../../src/app/templates/catalog-content_types.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"mb-3\">\n    <div class=\"float-right\">\n\n        <div ngbDropdown class=\"d-inline-block mr-1\">\n            <button class=\"btn btn-info\" ngbDropdownToggle>\n                Массовые дейсвия\n            </button>\n            <div ngbDropdownMenu>\n                <button class=\"dropdown-item\">Отключить / включить</button>\n                <button class=\"dropdown-item\">Удалить</button>\n            </div>\n        </div>\n\n        <button type=\"button\" class=\"btn btn-success d-inline-block btn-wide\" (click)=\"modalOpen()\">\n            <i class=\"icon-plus\"></i>\n            Add\n        </button>\n\n    </div>\n    <div class=\"float-left\">\n        <a class=\"btn btn-outline-secondary\" [routerLink]=\"['/catalog']\">\n            <i class=\"icon-arrow-left\"></i>\n            Каталог\n        </a>\n    </div>\n    <div class=\"clearfix\"></div>\n</div>\n\n<cmp-table [items]=\"items\" [collectionSize]=\"collectionSize\" [queryOptions]=\"queryOptions\" [tableFields]=\"tableFields\" [(loading)]=\"loading\" (actionRequest)=\"actionRequest($event)\"></cmp-table>\n"

/***/ }),

/***/ "../../../../../src/app/templates/catalog-field_types.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"mb-3\">\n    <div class=\"float-right\">\n\n        <div ngbDropdown class=\"d-inline-block mr-1\">\n            <button class=\"btn btn-info\" ngbDropdownToggle>\n                Массовые дейсвия\n            </button>\n            <div ngbDropdownMenu>\n                <button class=\"dropdown-item\">Отключить / включить</button>\n                <button class=\"dropdown-item\">Удалить</button>\n            </div>\n        </div>\n\n        <button type=\"button\" class=\"btn btn-success d-inline-block btn-wide\" (click)=\"modalOpen()\">\n            <i class=\"icon-plus\"></i>\n            Add\n        </button>\n\n    </div>\n\n    <div class=\"float-left\">\n        <a class=\"btn btn-outline-secondary\" [routerLink]=\"['/catalog']\">\n            <i class=\"icon-arrow-left\"></i>\n            Каталог\n        </a>\n    </div>\n    <div class=\"clearfix\"></div>\n</div>\n\n<cmp-table [items]=\"items\" [collectionSize]=\"collectionSize\" [queryOptions]=\"queryOptions\" [tableFields]=\"tableFields\" [(loading)]=\"loading\" (actionRequest)=\"actionRequest($event)\"></cmp-table>\n"

/***/ }),

/***/ "../../../../../src/app/templates/categories-menu.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"d-inline-block dropdown\">\n    <button class=\"btn btn-secondary dropdown-toggle dropdown-toggle-hover\">\n        <i class=\"icon-folder\"></i>\n        {{currentCategory.title}}\n    </button>\n    <div class=\"dropdown-menu shadow\" #categoriesDropdown>\n        <div class=\"dropdown-header\">\n            <button class=\"btn btn-sm btn-secondary\" ngbTooltip=\"Open root category\" (click)=\"goToRootCategory()\" *ngIf=\"currentCategory.id > 0\">\n                <i class=\"icon-home\"></i>\n            </button>\n            <button type=\"button\" class=\"btn btn-sm btn-secondary\" ngbTooltip=\"Add new category\" (click)=\"openModalCategory()\">\n                <i class=\"icon-plus\"></i>\n            </button>\n            <button type=\"button\" class=\"btn btn-sm btn-secondary\" ngbTooltip=\"Edit current category\" (click)=\"openModalCategory(currentCategory.id)\" [hidden]=\"currentCategory.id == 0\">\n                <i class=\"icon-pencil\"></i>\n            </button>\n            <button type=\"button\" class=\"btn btn-sm btn-secondary\" ngbTooltip=\"Copy category\" (click)=\"copyCategory()\" [hidden]=\"currentCategory.id == 0\">\n                <i class=\"icon-stack\"></i>\n            </button>\n            <button type=\"button\" class=\"btn btn-sm btn-secondary\" ngbTooltip=\"Delete current category\" (click)=\"deleteCategoryItemConfirm(currentCategory.id)\" [hidden]=\"currentCategory.id == 0\">\n                <i class=\"icon-cross\"></i>\n            </button>\n        </div>\n        <div class=\"dropdown-divider\"></div>\n        <div class=\"dropdown-header\" *ngIf=\"categories.length == 0\">\n            No categories.\n        </div>\n\n        <categories-list [inputItems]=\"categories\" [parentId]=\"0\" [currentId]=\"currentCategory.id\"></categories-list>\n\n    </div>\n</div>"

/***/ }),

/***/ "../../../../../src/app/templates/cmp-table.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"table-responsive\" [class.loading]=\"loading\">\n    <table class=\"table table-striped table-divided mb-0\">\n        <thead>\n            <tr>\n                <th class=\"text-left\">\n                    <label class=\"custom-control custom-checkbox\">\n                        <input type=\"checkbox\" class=\"custom-control-input\" (click)=\"selectAll($event)\">\n                        <span class=\"custom-control-indicator\"></span>\n                    </label>\n                </th>\n                <th *ngFor=\"let tableField of tableFields; let index=index\">\n                    <button type=\"button\" class=\"btn btn-block btn-link\" (click)=\"selectSortBy(tableField.name)\">\n                        {{tableField.title}}\n                        <i [class.icon-arrow-down]=\"queryOptions.sort_dir == 'asc'\" [class.icon-arrow-up]=\"queryOptions.sort_dir == 'desc'\" [style.visibility]=\"tableField.name == queryOptions.sort_by ? 'visible' : 'hidden'\"></i>\n                    </button>\n                </th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr class=\"show-on-hover-parent\" *ngFor=\"let item of items\">\n                <td>\n                    <label class=\"custom-control custom-checkbox\">\n                        <input type=\"checkbox\" class=\"custom-control-input\" [checked]=\"getIsSelected(item.id)\" (click)=\"setSelected($event, item.id)\">\n                        <span class=\"custom-control-indicator\"></span>\n                    </label>\n                </td>\n                <td *ngFor=\"let tableField of tableFields; let index=index\">\n                    <div class=\"relative\" *ngIf=\"index == tableFields.length - 1\">\n                        <div class=\"show-on-hover no-wrap\">\n                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Edit\" (click)=\"action('edit', item.id)\">\n                                <i class=\"icon-pencil\"></i>\n                            </button>\n                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Copy\" (click)=\"action('copy', item.id)\">\n                                <i class=\"icon-stack\"></i>\n                            </button>\n                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Delete\" (click)=\"action('delete', item.id)\">\n                                <i class=\"icon-cross\"></i>\n                            </button>\n                        </div>\n                    </div>\n\n                    <output-field [value]=\"item[tableField.name]\" [outputType]=\"tableField.output_type\" [options]=\"tableField.output_properties\"></output-field>\n\n                </td>\n            </tr>\n        <tr [hidden]=\"items.length > 0\" class=\"table-active\">\n            <td [attr.colspan]=\"tableFields.length + 1\" class=\"text-center p-4\">\n                Empty.\n            </td>\n        </tr>\n        </tbody>\n    </table>\n    <div class=\"pt-3\">\n\n        <div class=\"float-right\">\n            <select class=\"form-control\" [(ngModel)]=\"queryOptions.limit\" (change)=\"pageChange()\">\n                <option value=\"10\">10</option>\n                <option value=\"20\">20</option>\n                <option value=\"50\">50</option>\n                <option value=\"100\">100</option>\n            </select>\n        </div>\n\n        <ngb-pagination *ngIf=\"collectionSize > queryOptions.limit\" [class]=\"'mb-0'\" [collectionSize]=\"collectionSize\" [(page)]=\"queryOptions.page\" [maxSize]=\"queryOptions.limit\" (pageChange)=\"pageChange()\" [rotate]=\"true\" [boundaryLinks]=\"false\"></ngb-pagination>\n\n        <div class=\"clearfix\"></div>\n    </div>\n</div>"

/***/ }),

/***/ "../../../../../src/app/templates/modal-alert.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-block\">\n    <h4 class=\"modal-title\">{{modalTitle}}</h4>\n</div>\n<div class=\"modal-body\">\n    {{modalContent}}\n</div>\n<div class=\"modal-footer d-block\">\n    <button type=\"button\" class=\"btn btn-info btn-wide\" (click)=\"activeModal.close()\">\n        Ok\n    </button>\n</div>"

/***/ }),

/***/ "../../../../../src/app/templates/modal-category.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-block\">\n    <div class=\"d-block float-right\">\n        <button type=\"button\" class=\"btn btn-secondary\" (click)=\"activeModal.dismiss()\">\n            Close\n        </button>\n    </div>\n    <h4 class=\"modal-title\">{{modalTitle}}</h4>\n</div>\n\n<form [formGroup]=\"form\" [class.loading]=\"loading\">\n\n    <div class=\"modal-body\">\n\n        <div class=\"row form-group\" [class.form-group-message]=\"formErrors.parent_id\">\n            <div class=\"col-md-5\">\n                <label for=\"fieldContentType\">Родительская папка</label>\n            </div>\n            <div class=\"col-md-7\">\n                <select id=\"fieldParent\" class=\"form-control\" name=\"parent_id\" formControlName=\"parent_id\" [(ngModel)]=\"model.parent_id\">\n                    <option value=\"0\">Корневая категория</option>\n                    <option value=\"{{category.id}}\" *ngFor=\"let category of categories | orderBy: 'title'\">{{category.title}}</option>\n                </select>\n                <div *ngIf=\"formErrors.parent_id\" class=\"alert alert-danger\">\n                    {{formErrors.parent_id}}\n                </div>\n            </div>\n        </div>\n\n        <div class=\"row form-group\" [class.form-group-message]=\"formErrors.title\">\n            <div class=\"col-md-5\">\n                <label for=\"fieldTitle\">Название</label>\n            </div>\n            <div class=\"col-md-7\">\n                <input type=\"text\" id=\"fieldTitle\" class=\"form-control\" formControlName=\"title\" name=\"title\" [(ngModel)]=\"model.title\">\n                <div *ngIf=\"formErrors.title\" class=\"alert alert-danger\">\n                    {{formErrors.title}}\n                </div>\n            </div>\n        </div>\n\n        <div class=\"row form-group\" [class.form-group-message]=\"formErrors.name\">\n            <div class=\"col-md-5\">\n                <label for=\"fieldName\">Системное имя</label>\n            </div>\n            <div class=\"col-md-7\">\n                <div class=\"input-group\">\n                    <input type=\"text\" class=\"form-control\" name=\"name\" formControlName=\"name\" id=\"fieldName\" [(ngModel)]=\"model.name\">\n                    <div class=\"input-group-btn\">\n                        <button type=\"button\" class=\"btn btn-secondary\" ngbTooltip=\"Generate\" (click)=\"generateName(model)\">\n                            <i class=\"icon-reload\"></i>\n                        </button>\n                    </div>\n                </div>\n                <div *ngIf=\"formErrors.name\" class=\"alert alert-danger\">\n                    {{formErrors.name}}\n                </div>\n            </div>\n        </div>\n\n        <div class=\"row form-group\">\n            <div class=\"col-md-5\">\n                <label for=\"fieldDescription\">Описание</label>\n            </div>\n            <div class=\"col-md-7\">\n                <textarea type=\"text\" id=\"fieldDescription\" rows=\"4\" class=\"form-control\" name=\"description\" formControlName=\"description\" [(ngModel)]=\"model.description\"></textarea>\n            </div>\n        </div>\n\n        <div class=\"row form-group\" [class.form-group-message]=\"formErrors.content_type_name\">\n            <div class=\"col-md-5\">\n                <label for=\"fieldContentType\">Тип контента</label>\n            </div>\n            <div class=\"col-md-7\">\n                <select id=\"fieldContentType\" class=\"form-control\" name=\"content_type_name\" formControlName=\"content_type_name\" [(ngModel)]=\"model.content_type_name\">\n                    <option value=\"1\" *ngFor=\"let contentType of contentTypes\" [value]=\"contentType.name\">{{contentType.title}}</option>\n                </select>\n                <div *ngIf=\"formErrors.content_type_name\" class=\"alert alert-danger\">\n                    {{formErrors.content_type_name}}\n                </div>\n            </div>\n        </div>\n\n        <div class=\"row form-group\">\n            <div class=\"col-md-7 ml-md-auto\">\n\n                <div class=\"card card-body p-2 pl-3\">\n\n                    <label class=\"custom-control custom-checkbox m-0\">\n                        <input type=\"checkbox\" class=\"custom-control-input\" value=\"1\" name=\"is_active\" formControlName=\"is_active\" [(ngModel)]=\"model.is_active\">\n                        <span class=\"custom-control-indicator\"></span>\n                        <span>Активный</span>\n                    </label>\n\n                </div>\n\n            </div>\n        </div>\n\n        <div class=\"alert alert-danger mt-3 mb-0\" [hidden]=\"!errorMessage\">\n            <button type=\"button\" class=\"close\" (click)=\"errorMessage = ''\">\n                <span aria-hidden=\"true\">&times;</span>\n            </button>\n            {{errorMessage}}\n        </div>\n\n    </div>\n\n    <div class=\"modal-footer d-block\">\n        <button type=\"submit\" class=\"btn btn-success btn-wide\" [disabled]=\"submitted\" (click)=\"save()\">\n            Save\n        </button>\n        <button type=\"submit\" class=\"btn btn-secondary btn-wide\" (click)=\"activeModal.dismiss()\">\n            Cancel\n        </button>\n    </div>\n\n</form>\n"

/***/ }),

/***/ "../../../../../src/app/templates/modal-confirm.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-block\">\n    <h4 class=\"modal-title\">{{modalTitle}}</h4>\n</div>\n<div class=\"modal-body\">\n    {{modalContent}}\n</div>\n<div class=\"modal-footer d-block\">\n    <button type=\"button\" class=\"btn btn-success btn-wide\" (click)=\"accept()\">\n        Yes\n    </button>\n    <button type=\"button\" class=\"btn btn-secondary btn-wide\" (click)=\"activeModal.close()\">\n        No\n    </button>\n</div>"

/***/ }),

/***/ "../../../../../src/app/templates/modal-content_types.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-block\">\n    <div class=\"d-block float-right\">\n        <button type=\"button\" class=\"btn btn-secondary\" (click)=\"activeModal.dismiss()\">\n            Close\n        </button>\n    </div>\n    <h4 class=\"modal-title\">{{modalTitle}}</h4>\n</div>\n\n<ng-template #confirmPopover let-confirm=\"confirm\" let-p=\"p\" let-msg=\"message\">\n    <p class=\"text-center\">Delete this item?</p>\n    <div class=\"alert alert-danger p-2\" *ngIf=\"msg\">{{msg}}</div>\n    <div class=\"text-center\">\n        <button type=\"button\" class=\"btn btn-success btn-sm\" (click)=\"confirm()\">Yes</button>\n        <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"p.close()\">No</button>\n    </div>\n</ng-template>\n\n<form [class.loading]=\"loading\">\n\n    <div class=\"modal-body\">\n\n        <div class=\"row\">\n\n            <!-- ContentType form -->\n            <div class=\"col-lg-4\" [formGroup]=\"form\">\n\n                <div class=\"form-group\" [class.form-group-message]=\"formErrors.title\">\n                    <label class=\"label-filled\">\n                        Название\n                    </label>\n                    <input type=\"text\" class=\"form-control\" name=\"title\" formControlName=\"title\" [(ngModel)]=\"model.title\">\n                    <div *ngIf=\"formErrors.title\" class=\"alert alert-danger\">\n                        {{formErrors.title}}\n                    </div>\n                </div>\n\n                <div class=\"form-group\" [class.form-group-message]=\"formErrors.name\">\n                    <label for=\"fieldName\" class=\"label-filled\">Системное имя</label>\n                    <div class=\"input-group\">\n                        <input type=\"text\" class=\"form-control\" name=\"name\" formControlName=\"name\" id=\"fieldName\" [(ngModel)]=\"model.name\">\n                        <div class=\"input-group-btn\">\n                            <button type=\"button\" class=\"btn btn-secondary\" ngbTooltip=\"Generate\" (click)=\"generateName(model)\">\n                                <i class=\"icon-reload\"></i>\n                            </button>\n                        </div>\n                    </div>\n                    <div *ngIf=\"formErrors.name\" class=\"alert alert-danger\">\n                        {{formErrors.name}}\n                    </div>\n                </div>\n\n                <div class=\"form-group\">\n                    <label class=\"label-filled\">\n                        Описание\n                    </label>\n                    <textarea type=\"text\" class=\"form-control\" rows=\"3\" name=\"description\" formControlName=\"description\" [(ngModel)]=\"model.description\"></textarea>\n                </div>\n\n                <div class=\"form-group row\" [class.form-group-message]=\"formErrors.collection\">\n                    <div class=\"col-12\">\n\n                        <div class=\"form-group mb-0\">\n                            <label class=\"label-filled\">Коллекция</label>\n\n                            <div class=\"input-group\">\n                                <select class=\"form-control form-control-sm\" name=\"collection\" formControlName=\"collection\" [(ngModel)]=\"model.collection\">\n                                    <option value=\"{{collection}}\" *ngFor=\"let collection of collections\">{{collection}}</option>\n                                </select>\n                                <div class=\"input-group-btn\">\n                                    <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Add collection\" (click)=\"displayToggle(addCollectionBlock); addCollectionField.value = ''; onValueChanged(); addCollectionField.focus()\">\n                                        <i class=\"icon-plus\"></i>\n                                    </button>\n                                </div>\n                                <div class=\"input-group-btn\" [ngbPopover]=\"confirmPopover\" #buttonDeleteCollection=\"ngbPopover\" triggers=\"manual\">\n                                    <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Delete\" (click)=\"deleteCollection(buttonDeleteCollection)\">\n                                        <i class=\"icon-cross\"></i>\n                                    </button>\n                                </div>\n                            </div>\n\n                            <div class=\"card p-1 mt-2\" #addCollectionBlock style=\"display: none;\" [class.form-group-message]=\"formErrors.new_collection\">\n                                <input type=\"text\" class=\"form-control form-control-sm\" formControlName=\"new_collection\" #addCollectionField>\n                                <div *ngIf=\"formErrors.new_collection\" class=\"alert alert-danger mb-1\">\n                                    {{formErrors.new_collection}}\n                                </div>\n\n                                <div class=\"text-right mt-1\">\n                                    <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"addCollection()\">\n                                        Add\n                                    </button>\n                                    <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"addCollectionBlock.style.display = 'none'; formErrors.new_collection = ''\">\n                                        Cancel\n                                    </button>\n                                </div>\n                            </div>\n\n                        </div>\n\n                    </div>\n                </div>\n\n                <div class=\"form-group row\">\n                    <div class=\"col-12\">\n\n                        <div class=\"card card-body p-2 pl-3\">\n\n                            <label class=\"custom-control custom-checkbox m-0\">\n                                <input type=\"checkbox\" class=\"custom-control-input\" value=\"1\" name=\"is_active\" formControlName=\"is_active\" [(ngModel)]=\"model.is_active\">\n                                <span class=\"custom-control-indicator\"></span>\n                                <span>Активный</span>\n                            </label>\n\n                        </div>\n\n                    </div>\n                </div>\n\n            </div>\n            <!-- /ContentType form -->\n\n            <!-- Field form -->\n            <div class=\"col-lg-8\" [formGroup]=\"fieldForm\">\n\n                <label class=\"label-filled\" [hidden]=\"action != 'add_field'\">\n                    Добавить поле\n                </label>\n                <label class=\"label-filled\" [hidden]=\"action != 'edit_field'\">\n                    Редактировать поле\n                </label>\n\n                <div class=\"card\">\n                    <div class=\"card-body\">\n\n                        <div class=\"form-group row\" [class.form-group-message]=\"formErrors.fld_title\">\n                            <div class=\"col-md-5\">\n                                <label>Название</label>\n                            </div>\n                            <div class=\"col-md-7\">\n                                <input type=\"text\" class=\"form-control form-control-sm\" name=\"field_title\" formControlName=\"title\" [(ngModel)]=\"fieldModel.title\">\n                                <div *ngIf=\"formErrors.fld_title\" class=\"alert alert-danger\">\n                                    {{formErrors.fld_title}}\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row\" [class.form-group-message]=\"formErrors.fld_name\">\n                            <div class=\"col-md-5\">\n                                <label>Системное имя</label>\n                            </div>\n                            <div class=\"col-md-7\">\n\n                                <div class=\"input-group\">\n                                    <input type=\"text\" class=\"form-control form-control-sm\" name=\"field_name\" formControlName=\"name\" [(ngModel)]=\"fieldModel.name\">\n                                    <div class=\"input-group-btn\">\n                                        <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Generate\" (click)=\"generateName(fieldModel)\">\n                                            <i class=\"icon-reload\"></i>\n                                        </button>\n                                    </div>\n                                </div>\n                                <div *ngIf=\"formErrors.fld_name\" class=\"alert alert-danger\">\n                                    {{formErrors.fld_name}}\n                                </div>\n\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row\">\n                            <div class=\"col-md-5\">\n                                <label>Описание</label>\n                            </div>\n                            <div class=\"col-md-7\">\n                                <textarea type=\"text\" class=\"form-control form-control-sm\" rows=\"3\" name=\"field_description\" formControlName=\"description\" [(ngModel)]=\"fieldModel.description\"></textarea>\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row\" [class.form-group-message]=\"formErrors.fld_input_type\">\n                            <div class=\"col-md-5\">\n                                <label>Тип ввода</label>\n                            </div>\n                            <div class=\"col-md-7\">\n\n                                <div class=\"input-group\">\n                                    <select class=\"form-control form-control-sm\" name=\"field_input_type\" formControlName=\"input_type\" [(ngModel)]=\"fieldModel.input_type\" (ngModelChange)=\"selectFieldTypeProperties('input')\">\n                                        <option value=\"\"></option>\n                                        <option value=\"{{fieldType.name}}\" *ngFor=\"let fieldType of fieldTypes\">{{fieldType.title}}</option>\n                                    </select>\n                                    <div class=\"input-group-btn\">\n                                        <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Options\" (click)=\"displayToggle(inputTypeOptionsBlock)\">\n                                            <i class=\"icon-cog\"></i>\n                                        </button>\n                                    </div>\n                                </div>\n                                <div *ngIf=\"formErrors.fld_input_type\" class=\"alert alert-danger\">\n                                    {{formErrors.fld_input_type}}\n                                </div>\n\n                            </div>\n                        </div>\n\n                        <div class=\"card card-body bg-light mb-3\" #inputTypeOptionsBlock style=\"display: none;\">\n                            <div>\n                                <div class=\"alert alert-secondary small\" [hidden]=\"fieldTypeProperties.input.length > 0\">\n                                    There are no parameters.\n                                </div>\n                                <div class=\"row form-group\" *ngFor=\"let property of fieldTypeProperties.input\">\n                                    <div class=\"col-md-5\">\n                                        {{property.title}}\n                                    </div>\n                                    <div class=\"col-md-7\">\n                                        <input type=\"text\" class=\"form-control form-control-sm\" [(ngModel)]=\"fieldModel.input_properties[property.name]\" [ngModelOptions]=\"{standalone: true}\">\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"text-right mt-1\">\n                                <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"inputTypeOptionsBlock.style.display = 'none';\">\n                                    Close\n                                </button>\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row\" [class.form-group-message]=\"formErrors.fld_output_type\">\n                            <div class=\"col-md-5\">\n                                <label>Тип вывода</label>\n                            </div>\n                            <div class=\"col-md-7\">\n\n                                <div class=\"input-group\">\n                                    <select class=\"form-control form-control-sm\" name=\"field_output_type\" formControlName=\"output_type\" [(ngModel)]=\"fieldModel.output_type\" (ngModelChange)=\"selectFieldTypeProperties('output')\">\n                                        <option value=\"\"></option>\n                                        <option value=\"{{fieldType.name}}\" *ngFor=\"let fieldType of fieldTypes\">{{fieldType.title}}</option>\n                                    </select>\n                                    <div class=\"input-group-btn\">\n                                        <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Options\" (click)=\"displayToggle(outputTypeOptionsBlock)\">\n                                            <i class=\"icon-cog\"></i>\n                                        </button>\n                                    </div>\n                                </div>\n                                <div *ngIf=\"formErrors.fld_output_type\" class=\"alert alert-danger\">\n                                    {{formErrors.fld_output_type}}\n                                </div>\n\n                            </div>\n                        </div>\n\n                        <div class=\"card card-body bg-light mb-3\" #outputTypeOptionsBlock style=\"display: none;\">\n                            <div class=\"alert alert-secondary small\" [hidden]=\"fieldTypeProperties.output.length > 0\">\n                                There are no parameters.\n                            </div>\n                            <div class=\"row form-group\" *ngFor=\"let property of fieldTypeProperties.output\">\n                                <div class=\"col-md-5\">\n                                    {{property.title}}\n                                </div>\n                                <div class=\"col-md-7\">\n                                    <input type=\"text\" class=\"form-control form-control-sm\" [(ngModel)]=\"fieldModel.output_properties[property.name]\" [ngModelOptions]=\"{standalone: true}\">\n                                </div>\n                            </div>\n                            <div class=\"text-right mt-1\">\n                                <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"outputTypeOptionsBlock.style.display = 'none'\">\n                                    Close\n                                </button>\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row\">\n                            <div class=\"col-md-5\">\n                                <label>Группа</label>\n                            </div>\n                            <div class=\"col-md-7\">\n\n                                <div [class.form-group-message]=\"formErrors.fld_group\">\n                                    <div class=\"input-group input-group-sm\">\n                                        <select class=\"form-control\" name=\"field_group\" formControlName=\"group\" [(ngModel)]=\"fieldModel.group\">\n                                            <option value=\"{{group}}\" *ngFor=\"let group of model.groups\">{{group}}</option>\n                                        </select>\n                                        <div class=\"input-group-btn\">\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Add group\" (click)=\"displayToggle(addGroupBlock); addGroupField.value = ''; addGroupField.focus()\">\n                                                <i class=\"icon-plus\"></i>\n                                            </button>\n                                        </div>\n                                        <div class=\"input-group-btn\">\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Delete group\" (click)=\"deleteGroup()\">\n                                                <i class=\"icon-cross\"></i>\n                                            </button>\n                                        </div>\n                                    </div>\n                                    <div *ngIf=\"formErrors.fld_group\" class=\"alert alert-danger\">\n                                        {{formErrors.fld_group}}\n                                    </div>\n\n                                    <div class=\"card p-1 mt-2\" #addGroupBlock style=\"display: none;\" [class.form-group-message]=\"formErrors.fld_new_group\">\n                                        <input type=\"text\" class=\"form-control form-control-sm\" #addGroupField formControlName=\"new_group\">\n                                        <div *ngIf=\"formErrors.fld_new_group\" class=\"alert alert-danger mb-1\">\n                                            {{formErrors.fld_new_group}}\n                                        </div>\n                                        <div class=\"text-right mt-1\">\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"addGroup();\">\n                                                Add\n                                            </button>\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"addGroupBlock.style.display = 'none'; formErrors.fld_new_group = ''\">\n                                                Cancel\n                                            </button>\n                                        </div>\n                                    </div>\n                                </div>\n\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row mb-0\">\n                            <div class=\"col-md-7 offset-md-5\">\n\n                                <label class=\"custom-control custom-checkbox\">\n                                    <input type=\"checkbox\" class=\"custom-control-input\" value=\"1\" name=\"required\" formControlName=\"required\" [(ngModel)]=\"fieldModel.required\">\n                                    <span class=\"custom-control-indicator\"></span>\n                                    <span>Обязательное</span>\n                                </label>\n\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row mb-0\">\n                            <div class=\"col-md-7 offset-md-5\">\n\n                                <label class=\"custom-control custom-checkbox\">\n                                    <input type=\"checkbox\" class=\"custom-control-input\" value=\"1\" name=\"show_in_table\" formControlName=\"show_in_table\" [(ngModel)]=\"fieldModel.show_in_table\">\n                                    <span class=\"custom-control-indicator\"></span>\n                                    <span>Показывать в таблице</span>\n                                </label>\n\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row mb-0\">\n                            <div class=\"col-md-7 offset-md-5\">\n\n                                <label class=\"custom-control custom-checkbox\">\n                                    <input type=\"checkbox\" class=\"custom-control-input\" value=\"1\" name=\"is_filter\" formControlName=\"is_filter\" [(ngModel)]=\"fieldModel.is_filter\">\n                                    <span class=\"custom-control-indicator\"></span>\n                                    <span>Показывать в фильтре</span>\n                                </label>\n\n                            </div>\n                        </div>\n\n                        <div class=\"alert alert-danger mt-3 mb-3\" [hidden]=\"!errorFieldMessage\">\n                            <button type=\"button\" class=\"close\" (click)=\"errorFieldMessage = ''\">\n                                <span aria-hidden=\"true\">&times;</span>\n                            </button>\n                            {{errorFieldMessage}}\n                        </div>\n\n                        <div class=\"mt-3\">\n                            <button type=\"button\" class=\"btn btn-sm btn-info btn-wide\" (click)=\"submitField()\" [hidden]=\"action != 'add_field'\">\n                                <i class=\"icon-plus\"></i>\n                                Add field\n                            </button>\n                            <button type=\"button\" class=\"btn btn-sm btn-success btn-wide\" (click)=\"displayToggle(fieldsBlock, true); submitField()\" [hidden]=\"action != 'edit_field'\">\n                                <i class=\"icon-check\"></i>\n                                Save field\n                            </button>\n                            <button type=\"button\" class=\"btn btn-sm btn-secondary btn-wide\" (click)=\"displayToggle(fieldsBlock, true); editFieldCancel()\">\n                                Cancel\n                            </button>\n                        </div>\n\n                    </div>\n                </div>\n\n            </div>\n            <!-- /Field form -->\n\n        </div>\n\n        <div class=\"form-group row mt-3\">\n            <div class=\"col-12\">\n\n                <label class=\"label-filled\">\n                    Поля\n                </label>\n\n                <hr class=\"mt-0 mb-0\">\n                <div class=\"text-center mb-2\" style=\"margin-top: -0.8rem;\">\n                    <button type=\"button\" class=\"btn btn-outline-secondary bg-white text-secondary btn-xs\" [ngSwitch]=\"fieldsBlock.style.display\" (click)=\"displayToggle(fieldsBlock)\">\n                        <span *ngSwitchCase=\"'none'\">\n                            <i class=\"icon-plus\"></i>\n                            <span i18n>Expand</span>\n                        </span>\n                                    <span *ngSwitchCase=\"'block'\">\n                            <i class=\"icon-minus\"></i>\n                            <span i18n>Collapse</span>\n                        </span>\n                    </button>\n                </div>\n\n                <div #fieldsBlock style=\"display: block;\">\n                    <table class=\"table table-striped table-divided mb-0\">\n                        <thead>\n                            <tr>\n                                <th>Название</th>\n                                <th>Тип ввода</th>\n                                <th>Группа</th>\n                                <th>Обязательное?</th>\n                            </tr>\n                        </thead>\n                        <tbody>\n                            <tr class=\"show-on-hover-parent\" *ngFor=\"let field of model.fields; let index=index\">\n                                <td>\n                                    {{field.title}}\n                                    <span class=\"text-muted\">({{field.name}})</span>\n                                </td>\n                                <td>\n                                    {{field.input_type}}\n                                </td>\n                                <td>\n                                    {{field.group}}\n                                </td>\n                                <td>\n                                    <div class=\"relative\">\n                                        <div class=\"show-on-hover\">\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"fieldMove(index, 'up')\" ngbTooltip=\"Move up\" *ngIf=\"index > 0\">\n                                                <i class=\"icon-arrow-up\"></i>\n                                            </button>\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"fieldMove(index, 'down')\" ngbTooltip=\"Move down\" *ngIf=\"index < model.fields.length - 1\">\n                                                <i class=\"icon-arrow-down\"></i>\n                                            </button>\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"displayToggle(fieldsBlock); editField(field)\" [hidden]=\"field.name == currentFieldName\" ngbTooltip=\"Edit\">\n                                                <i class=\"icon-pencil\"></i>\n                                            </button>\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"displayToggle(fieldsBlock); copyField(field)\" ngbTooltip=\"Copy\">\n                                                <i class=\"icon-stack\"></i>\n                                            </button>\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"deleteField(field)\" [hidden]=\"field.name == currentFieldName\" ngbTooltip=\"Delete\">\n                                                <i class=\"icon-cross\"></i>\n                                            </button>\n                                        </div>\n                                    </div>\n\n                                    <output-field [value]=\"field.required\" outputType=\"boolean\"></output-field>\n                                </td>\n                            </tr>\n                            <tr [hidden]=\"model.fields.length > 0\" class=\"table-active\">\n                                <td colspan=\"4\" class=\"text-center p-3\">\n                                    Empty\n                                </td>\n                            </tr>\n                        </tbody>\n                    </table>\n                </div>\n\n                <div class=\"alert alert-danger mt-3 mb-0\" [hidden]=\"!errorMessage\">\n                    <button type=\"button\" class=\"close\" (click)=\"errorMessage = ''\">\n                        <span aria-hidden=\"true\">&times;</span>\n                    </button>\n                    {{errorMessage}}\n                </div>\n\n            </div>\n        </div>\n\n    </div>\n\n    <div class=\"modal-footer d-block\">\n        <button type=\"button\" class=\"btn btn-success btn-wide\" [disabled]=\"submitted && form.valid\" (click)=\"save()\">\n            Save\n        </button>\n        <button type=\"button\" class=\"btn btn-secondary btn-wide\" (click)=\"activeModal.dismiss()\">\n            Cancel\n        </button>\n    </div>\n\n</form>"

/***/ }),

/***/ "../../../../../src/app/templates/modal-field_type.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-block\">\n    <div class=\"d-block float-right\">\n        <button type=\"button\" class=\"btn btn-secondary\" (click)=\"activeModal.dismiss()\">\n            Close\n        </button>\n    </div>\n    <h4 class=\"modal-title\">{{modalTitle}}</h4>\n</div>\n\n<div class=\"modal-body\" [class.loading]=\"loading\">\n\n    <form #formElement=\"ngForm\" [formGroup]=\"form\">\n        <div class=\"row\">\n            <div class=\"col-md-6\">\n\n                <div class=\"form-group form-group-message\" [class.form-group-message]=\"formErrors.title\">\n                    <label for=\"fieldTitle\" class=\"label-filled\">Название</label>\n                    <input type=\"text\" class=\"form-control\" name=\"title\" formControlName=\"title\" id=\"fieldTitle\" [(ngModel)]=\"model.title\">\n                    <div *ngIf=\"formErrors.title\" class=\"alert alert-danger\">\n                        {{formErrors.title}}\n                    </div>\n                </div>\n\n                <div class=\"form-group\" [class.form-group-message]=\"formErrors.name\">\n                    <label for=\"fieldName\" class=\"label-filled\">Системное имя</label>\n                    <div class=\"input-group\">\n                        <input type=\"text\" class=\"form-control\" name=\"name\" formControlName=\"name\" id=\"fieldName\" [(ngModel)]=\"model.name\">\n                        <div class=\"input-group-btn\">\n                            <button type=\"button\" class=\"btn btn-secondary\" ngbTooltip=\"Generate\" (click)=\"generateName(model)\">\n                                <i class=\"icon-reload\"></i>\n                            </button>\n                        </div>\n                    </div>\n                    <div *ngIf=\"formErrors.name\" class=\"alert alert-danger\">\n                        {{formErrors.name}}\n                    </div>\n                </div>\n\n                <div class=\"form-group row\">\n                    <div class=\"col-12\">\n\n                        <div class=\"card card-body p-2 pl-3\">\n\n                            <label class=\"custom-control custom-checkbox m-0\">\n                                <input type=\"checkbox\" class=\"custom-control-input\" value=\"1\" name=\"isActive\" formControlName=\"isActive\" [(ngModel)]=\"model.isActive\">\n                                <span class=\"custom-control-indicator\"></span>\n                                <span>Активный</span>\n                            </label>\n\n                        </div>\n\n                    </div>\n                </div>\n\n            </div>\n            <div class=\"col-md-6\">\n                <div class=\"form-group\">\n                    <label for=\"fieldDescription\" class=\"label-filled\">Описание</label>\n                    <textarea class=\"form-control\" rows=\"5\" name=\"description\" formControlName=\"description\" id=\"fieldDescription\" [(ngModel)]=\"model.description\"></textarea>\n                </div>\n            </div>\n        </div>\n    </form>\n\n    <!-- Input -->\n    <label class=\"label-filled\">Параметры ввода</label>\n\n    <hr class=\"mt-0 mb-0\">\n    <div class=\"text-center mb-2\" style=\"margin-top: -0.8rem;\">\n        <button type=\"button\" class=\"btn btn-outline-secondary bg-white text-secondary btn-xs\" [ngSwitch]=\"collapseContainer1.style.display\" (click)=\"displayToggle(collapseContainer1)\">\n            <span *ngSwitchCase=\"'none'\">\n                <i class=\"icon-plus\"></i>\n                <span i18n>Expand</span>\n            </span>\n            <span *ngSwitchCase=\"'block'\">\n                <i class=\"icon-minus\"></i>\n                <span i18n>Collapse</span>\n            </span>\n        </button>\n    </div>\n\n    <div #collapseContainer1 class=\"mb-3\" style=\"display: block;\">\n        <table class=\"table table-bordered table-divided mb-0\">\n            <thead>\n            <tr>\n                <th>\n                    Системное имя\n                </th>\n                <th>\n                    Название\n                </th>\n                <th>\n                    По умолчанию\n                </th>\n                <th></th>\n            </tr>\n            </thead>\n            <tbody>\n                <tr *ngFor=\"let item of model.inputProperties; let index=index\">\n                    <td>\n                        <input type=\"text\" class=\"form-control\" [(ngModel)]=\"item.name\" name=\"name\">\n                    </td>\n                    <td class=\"text-center\">\n                        <input type=\"text\" class=\"form-control\" [(ngModel)]=\"item.title\" name=\"title\">\n                    </td>\n                    <td class=\"text-center\">\n                        <input type=\"text\" class=\"form-control\" [(ngModel)]=\"item.default_value\" name=\"default_value\">\n                    </td>\n                    <td class=\"text-center\">\n                        <button type=\"button\" class=\"btn btn-secondary\" (click)=\"deleteRow(index, 'inputProperties')\" ngbTooltip=\"Remove\">\n                            <i class=\"icon-cross\"></i>\n                        </button>\n                    </td>\n                </tr>\n            </tbody>\n            <tfoot>\n            <tr class=\"bg-faded\">\n                <td colspan=\"4\" class=\"text-center\">\n                    <button type=\"button\" class=\"btn btn-secondary\" (click)=\"addRow('inputProperties')\">\n                        <i class=\"icon-plus\"></i>\n                        Добавить\n                    </button>\n                </td>\n            </tr>\n            </tfoot>\n        </table>\n    </div>\n    <!-- /Input -->\n\n    <!-- Output -->\n    <label class=\"label-filled\">Параметры вывода</label>\n\n    <hr class=\"mt-0 mb-0\">\n    <div class=\"text-center mb-2\" style=\"margin-top: -0.8rem;\">\n        <button type=\"button\" class=\"btn btn-outline-secondary bg-white text-secondary btn-xs\" [ngSwitch]=\"collapseContainer2.style.display\" (click)=\"displayToggle(collapseContainer2)\">\n            <span *ngSwitchCase=\"'none'\">\n                <i class=\"icon-plus\"></i>\n                <span i18n>Expand</span>\n            </span>\n            <span *ngSwitchCase=\"'block'\">\n                <i class=\"icon-minus\"></i>\n                <span i18n>Collapse</span>\n            </span>\n        </button>\n    </div>\n\n    <div #collapseContainer2 style=\"display: none;\">\n        <table class=\"table table-bordered table-divided mb-0\">\n            <thead>\n                <tr>\n                    <th>\n                        Системное имя\n                    </th>\n                    <th>\n                        Название\n                    </th>\n                    <th>\n                        По умолчанию\n                    </th>\n                    <th></th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr *ngFor=\"let item of model.outputProperties; let index=index\">\n                    <td>\n                        <input type=\"text\" class=\"form-control\" [(ngModel)]=\"item.name\" name=\"name\">\n                    </td>\n                    <td class=\"text-center\">\n                        <input type=\"text\" class=\"form-control\" [(ngModel)]=\"item.title\" name=\"title\">\n                    </td>\n                    <td class=\"text-center\">\n                        <input type=\"text\" class=\"form-control\" [(ngModel)]=\"item.default_value\" name=\"default_value\">\n                    </td>\n                    <td class=\"text-center\">\n                        <button type=\"button\" class=\"btn btn-secondary\" (click)=\"deleteRow(index, 'outputProperties')\" ngbTooltip=\"Remove\">\n                            <i class=\"icon-cross\"></i>\n                        </button>\n                    </td>\n                </tr>\n            </tbody>\n            <tfoot>\n                <tr class=\"bg-faded\">\n                    <td colspan=\"4\" class=\"text-center\">\n                        <button type=\"button\" class=\"btn btn-secondary\" (click)=\"addRow('outputProperties')\">\n                            <i class=\"icon-plus\"></i>\n                            Добавить\n                        </button>\n                    </td>\n                </tr>\n            </tfoot>\n        </table>\n    </div>\n    <!-- /Output -->\n\n    <div class=\"alert alert-danger mt-3 mb-0\" [hidden]=\"!errorMessage\">\n        <button type=\"button\" class=\"close\" (click)=\"errorMessage = ''\">\n            <span aria-hidden=\"true\">&times;</span>\n        </button>\n        {{errorMessage}}\n    </div>\n\n</div>\n<div class=\"modal-footer d-block\">\n    <button type=\"button\" class=\"btn btn-success btn-wide\" [disabled]=\"submitted\" (click)=\"save()\">\n        Save\n    </button>\n    <button type=\"button\" class=\"btn btn-secondary btn-wide\" (click)=\"activeModal.dismiss()\">\n        Cancel\n    </button>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/templates/modal-product.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-block\">\n    <div class=\"d-block float-right\">\n        <button type=\"button\" class=\"btn btn-secondary\" (click)=\"activeModal.dismiss()\">\n            Close\n        </button>\n    </div>\n    <h4 class=\"modal-title\">{{modalTitle}}</h4>\n</div>\n\n<form [formGroup]=\"form\" [class.loading]=\"loading\">\n    <div class=\"modal-body\">\n\n        <div class=\"row form-group\" [class.form-group-message]=\"formErrors.content_type\">\n            <div class=\"col-md-5\">\n                <label for=\"fieldContentType\">Тип контента</label>\n            </div>\n            <div class=\"col-md-7\">\n                <select id=\"fieldContentType\" class=\"form-control\" name=\"content_type\" formControlName=\"content_type\" [(ngModel)]=\"model.content_type\" (change)=\"onChangeContentType()\">\n                    <option value=\"1\" *ngFor=\"let contentType of contentTypes\" [value]=\"contentType.name\">{{contentType.title}}</option>\n                </select>\n                <div *ngIf=\"formErrors.content_type\" class=\"alert alert-danger\">\n                    {{formErrors.content_type}}\n                </div>\n            </div>\n        </div>\n\n        <div class=\"row form-group\" [class.form-group-message]=\"formErrors.is_active\">\n            <div class=\"col-md-7 ml-md-auto\">\n                <div class=\"card card-body p-2 pl-3\">\n\n                    <label class=\"custom-control custom-checkbox m-0\">\n                        <input type=\"checkbox\" class=\"custom-control-input\" value=\"1\" name=\"is_active\" formControlName=\"is_active\" [(ngModel)]=\"model.is_active\">\n                        <span class=\"custom-control-indicator\"></span>\n                        <span>Активный</span>\n                    </label>\n\n                </div>\n            </div>\n        </div>\n\n        <ngb-tabset justify=\"fill\">\n            <ngb-tab title=\"{{groupName}}\" id=\"{{i + 1}}\" *ngFor=\"let groupName of currentContentType.groups; let i=index\">\n                <ng-template ngbTabContent>\n                    <div class=\"pt-3\">\n\n                        <input-field [fields]=\"currentContentType.fields | filterFieldByGroup: groupName\" [(formErrors)]=\"formErrors\" [(validationMessages)]=\"validationMessages\" [(model)]=\"model\" [(form)]=\"form\"></input-field>\n\n                    </div>\n                </ng-template>\n            </ngb-tab>\n        </ngb-tabset>\n\n        <div class=\"alert alert-danger mt-3 mb-0\" [hidden]=\"!errorMessage\">\n            <button type=\"button\" class=\"close\" (click)=\"errorMessage = ''\">\n                <span aria-hidden=\"true\">&times;</span>\n            </button>\n            {{errorMessage}}\n        </div>\n\n    </div>\n\n    <div class=\"modal-footer d-block\">\n        <button type=\"button\" class=\"btn btn-success btn-wide\" [disabled]=\"submitted\" (click)=\"save()\">\n            Save\n        </button>\n        <button type=\"button\" class=\"btn btn-secondary btn-wide\" (click)=\"activeModal.dismiss()\">\n            Cancel\n        </button>\n    </div>\n\n</form>"

/***/ }),

/***/ "../../../../../src/app/templates/page-catalog.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"card\">\n\n    <div class=\"card-body\">\n\n        <div class=\"float-right\">\n            <a class=\"btn btn-outline-primary mr-1\" href=\"\" [routerLink]=\"['content_types']\" routerLinkActive=\"active\">\n                <i class=\"icon-box\"></i>\n                Типы контента\n            </a>\n            <a class=\"btn btn-outline-primary\" href=\"\" [routerLink]=\"['field_types']\" routerLinkActive=\"active\">\n                <i class=\"icon-toggle\"></i>\n                Типы полей\n            </a>\n        </div>\n        <h3>\n            <i class=\"icon-layers\"></i>\n            <span i18n>Catalog</span>\n        </h3>\n\n        <hr>\n\n        <router-outlet></router-outlet>\n\n    </div>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/templates/page-orders.html":
/***/ (function(module, exports) {

module.exports = "\n<div class=\"card\">\n\n    <div class=\"card-body\">\n\n        <h3>\n            <i class=\"icon-bag\"></i>\n            {{title}}\n        </h3>\n\n        <hr>\n\n        <div class=\"float-right\">\n\n            <div ngbDropdown class=\"d-inline-block\">\n                <button class=\"btn btn-outline-primary\" id=\"dropdownBasic1\" ngbDropdownToggle>\n                    Массовые дейсвия\n                </button>\n                <div class=\"dropdown-menu\" aria-labelledby=\"dropdownBasic1\">\n                    <button class=\"dropdown-item\">Изменить статус</button>\n                    <button class=\"dropdown-item\">Удалить</button>\n                </div>\n            </div>\n\n        </div>\n        <div class=\"float-left\">\n\n            <div class=\"input-group\">\n                <input type=\"text\" class=\"form-control\" name=\"dp\" ngbDatepicker #d=\"ngbDatepicker\">\n                <div class=\"input-group-btn\">\n                    <button class=\"btn btn-secondary\" (click)=\"d.toggle()\" type=\"button\">\n                        <i class=\"icon-date_range\"></i>\n                    </button>\n                </div>\n            </div>\n\n        </div>\n\n    </div>\n\n    <div class=\"table-responsive\">\n        <table class=\"table table-striped table-divided mb-0\">\n            <thead>\n            <tr>\n                <th>\n                    <label class=\"custom-control custom-checkbox\">\n                        <input type=\"checkbox\" class=\"custom-control-input\">\n                        <span class=\"custom-control-indicator\"></span>\n                    </label>\n                </th>\n                <th>\n                    <button type=\"button\" class=\"btn btn-block btn-link\">\n                        ID\n                        <i class=\"icon-arrow-down\"></i>\n                    </button>\n                </th>\n                <th>\n                    <button type=\"button\" class=\"btn btn-block btn-link\">\n                        Статус\n                    </button>\n                </th>\n                <th>\n                    <button type=\"button\" class=\"btn btn-block btn-link\">\n                        Дата и время\n                    </button>\n                </th>\n                <th>\n                    <button type=\"button\" class=\"btn btn-block btn-link\">\n                        Кол-во товаров\n                    </button>\n                </th>\n                <th>\n                    <button type=\"button\" class=\"btn btn-block btn-link\">\n                        Общая цена\n                    </button>\n                </th>\n                <th>\n                    <button type=\"button\" class=\"btn btn-block btn-link\">\n                        Пользователь\n                    </button>\n                </th>\n            </tr>\n            </thead>\n            <tbody>\n                <tr class=\"show-on-hover-parent\">\n                    <td>\n                        <label class=\"custom-control custom-checkbox\">\n                            <input type=\"checkbox\" class=\"custom-control-input\">\n                            <span class=\"custom-control-indicator\"></span>\n                        </label>\n                    </td>\n                    <th>1</th>\n                    <td>\n                        <button type=\"button\" class=\"btn btn-sm btn-info min-width150\">\n                            Новый\n                        </button>\n                    </td>\n                    <td>\n                        01.03.2017\n                    </td>\n                    <td>\n                        2\n                    </td>\n                    <td>\n                        1 100\n                    </td>\n                    <td>\n                        <div class=\"relative\">\n                            <div class=\"show-on-hover\">\n                                <button class=\"btn btn-secondary btn-sm\">\n                                    <i class=\"icon-pencil\"></i>\n                                </button>\n                                <button class=\"btn btn-secondary btn-sm\">\n                                    <i class=\"icon-cross\"></i>\n                                </button>\n                            </div>\n                        </div>\n                        username@domain.com\n                    </td>\n                </tr>\n                <tr class=\"show-on-hover-parent\">\n                    <td>\n                        <label class=\"custom-control custom-checkbox\">\n                            <input type=\"checkbox\" class=\"custom-control-input\">\n                            <span class=\"custom-control-indicator\"></span>\n                        </label>\n                    </td>\n                    <th>2</th>\n                    <td>\n                        <button type=\"button\" class=\"btn btn-sm btn-success min-width150\">\n                            Выполнен\n                        </button>\n                    </td>\n                    <td>\n                        22.02.2017\n                    </td>\n                    <td>\n                        3\n                    </td>\n                    <td>\n                        2 300\n                    </td>\n                    <td>\n                        <div class=\"relative\">\n                            <div class=\"show-on-hover\">\n                                <button class=\"btn btn-secondary btn-sm\">\n                                    <i class=\"icon-pencil\"></i>\n                                </button>\n                                <button class=\"btn btn-secondary btn-sm\">\n                                    <i class=\"icon-cross\"></i>\n                                </button>\n                            </div>\n                        </div>\n                        username@domain.com\n                    </td>\n                </tr>\n                <tr class=\"show-on-hover-parent\">\n                    <td>\n                        <label class=\"custom-control custom-checkbox\">\n                            <input type=\"checkbox\" class=\"custom-control-input\">\n                            <span class=\"custom-control-indicator\"></span>\n                        </label>\n                    </td>\n                    <th>3</th>\n                    <td>\n                        <button type=\"button\" class=\"btn btn-sm btn-info min-width150\">\n                            Новый\n                        </button>\n                    </td>\n                    <td>\n                        20.02.2017\n                    </td>\n                    <td>\n                        5\n                    </td>\n                    <td>\n                        5 520\n                    </td>\n                    <td>\n                        <div class=\"relative\">\n                            <div class=\"show-on-hover\">\n                                <button class=\"btn btn-secondary btn-sm\">\n                                    <i class=\"icon-pencil\"></i>\n                                </button>\n                                <button class=\"btn btn-secondary btn-sm\">\n                                    <i class=\"icon-cross\"></i>\n                                </button>\n                            </div>\n                        </div>\n                        username@domain.com\n                    </td>\n                </tr>\n                <tr class=\"show-on-hover-parent\">\n                    <td>\n                        <label class=\"custom-control custom-checkbox\">\n                            <input type=\"checkbox\" class=\"custom-control-input\">\n                            <span class=\"custom-control-indicator\"></span>\n                        </label>\n                    </td>\n                    <th>3</th>\n                    <td>\n                        <button type=\"button\" class=\"btn btn-sm btn-info min-width150\">\n                            Новый\n                        </button>\n                    </td>\n                    <td>\n                        20.02.2017\n                    </td>\n                    <td>\n                        5\n                    </td>\n                    <td>\n                        5 520\n                    </td>\n                    <td>\n                        <div class=\"relative\">\n                            <div class=\"show-on-hover\">\n                                <button class=\"btn btn-secondary btn-sm\">\n                                    <i class=\"icon-pencil\"></i>\n                                </button>\n                                <button class=\"btn btn-secondary btn-sm\">\n                                    <i class=\"icon-cross\"></i>\n                                </button>\n                            </div>\n                        </div>\n                        username@domain.com\n                    </td>\n                </tr>\n            </tbody>\n        </table>\n    </div>\n\n    <div class=\"card-footer\">\n\n        <div class=\"float-right\">\n            <select class=\"form-control\">\n                <option value=\"10\">10</option>\n                <option value=\"50\">50</option>\n                <option value=\"100\">100</option>\n            </select>\n        </div>\n\n        <ngb-pagination [class]=\"'mb-0'\" [collectionSize]=\"120\" [page]=\"1\" [maxSize]=\"8\" [rotate]=\"true\" [boundaryLinks]=\"false\"></ngb-pagination>\n\n    </div>\n\n</div>"

/***/ }),

/***/ "../../../../../src/app/templates/page-settings.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"card\">\n    <div class=\"card-body\">\n\n        <div class=\"float-right\">\n            <!--a class=\"btn btn-primary\" [routerLink]=\"['/settings/input_types']\">\n                <i class=\"icon-upload\"></i>\n                Типы ввода\n            </a>\n            <a class=\"btn btn-primary\" [routerLink]=\"['/settings/output_types']\">\n                <i class=\"icon-download\"></i>\n                Типы вывода\n            </a-->\n        </div>\n\n        <h3>\n            <i class=\"icon-bar-graph-2\"></i>\n            {{title}}\n        </h3>\n\n        <hr>\n\n        <div class=\"row\">\n            <div class=\"col-md-6\">\n\n                <!-- statuses -->\n                <label class=\"label-filled\">\n                    Статусы\n                </label>\n\n                <div class=\"card\">\n                    <div class=\"card-body text-muted\">\n                        Названия статусов заказов и цвет для вывода на странице заказов в административной части.\n                    </div>\n                    <div class=\"table-responsive\">\n\n                        <table class=\"table table-divided mb-0\">\n                            <thead>\n                            <tr>\n                                <th>\n                                    Название\n                                </th>\n                                <th>\n                                    Шаблон письма\n                                </th>\n                                <th>\n                                    Цвет\n                                </th>\n                                <th></th>\n                            </tr>\n                            </thead>\n                            <tbody>\n                            <tr>\n                                <td>\n                                    <input type=\"text\" class=\"form-control form-control-sm\" name=\"\" value=\"Новый\">\n                                </td>\n                                <td>\n                                    <input type=\"text\" class=\"form-control form-control-sm\" name=\"\" value=\"userEmailStatus\">\n                                </td>\n                                <td class=\"text-center\">\n                                    <button class=\"btn btn-secondary btn-sm bg-info\" style=\"width: 30px;\">\n                                        &nbsp;\n                                    </button>\n                                </td>\n                                <td class=\"text-center\">\n                                    <button class=\"btn btn-secondary btn-sm\">\n                                        <i class=\"icon-cross\"></i>\n                                    </button>\n                                </td>\n                            </tr>\n                            <tr>\n                                <td>\n                                    <input type=\"text\" class=\"form-control form-control-sm\" name=\"\" value=\"Принят к оплате\">\n                                </td>\n                                <td>\n                                    <input type=\"text\" class=\"form-control form-control-sm\" name=\"\" value=\"userEmailStatus\">\n                                </td>\n                                <td class=\"text-center\">\n                                    <button class=\"btn btn-secondary btn-sm bg-success\" style=\"width: 30px;\">\n                                        &nbsp;\n                                    </button>\n                                </td>\n                                <td class=\"text-center\">\n                                    <button class=\"btn btn-secondary btn-sm\">\n                                        <i class=\"icon-cross\"></i>\n                                    </button>\n                                </td>\n                            </tr>\n                            <tr>\n                                <td>\n                                    <input type=\"text\" class=\"form-control form-control-sm\" name=\"\" value=\"Отправлен\">\n                                </td>\n                                <td>\n                                    <input type=\"text\" class=\"form-control form-control-sm\" name=\"\" value=\"userEmailStatus\">\n                                </td>\n                                <td class=\"text-center\">\n                                    <button class=\"btn btn-secondary btn-sm bg-warning\" style=\"width: 30px;\">\n                                        &nbsp;\n                                    </button>\n                                </td>\n                                <td class=\"text-center\">\n                                    <button class=\"btn btn-secondary btn-sm\">\n                                        <i class=\"icon-cross\"></i>\n                                    </button>\n                                </td>\n                            </tr>\n                            <tr>\n                                <td>\n                                    <input type=\"text\" class=\"form-control form-control-sm\" name=\"\" value=\"Отменен\">\n                                </td>\n                                <td>\n                                    <input type=\"text\" class=\"form-control form-control-sm\" name=\"\" value=\"userEmailStatus\">\n                                </td>\n                                <td class=\"text-center\">\n                                    <button class=\"btn btn-secondary btn-sm bg-danger\" style=\"width: 30px;\">\n                                        &nbsp;\n                                    </button>\n                                </td>\n                                <td class=\"text-center\">\n                                    <button class=\"btn btn-secondary btn-sm\">\n                                        <i class=\"icon-cross\"></i>\n                                    </button>\n                                </td>\n                            </tr>\n                            </tbody>\n                            <tfoot>\n                            <tr class=\"bg-faded\">\n                                <td colspan=\"4\" class=\"text-center\">\n                                    <button class=\"btn btn-secondary btn-sm\">\n                                        <i class=\"icon-plus\"></i>\n                                        Добавить\n                                    </button>\n                                </td>\n                            </tr>\n                            </tfoot>\n                        </table>\n\n                    </div>\n                </div>\n                <!-- /statuses -->\n\n            </div>\n            <div class=\"col-md-6\">\n\n                <!-- delivery -->\n                <label class=\"label-filled\">\n                    Методы доставки\n                </label>\n\n                <div class=\"card mb-3\">\n                    <div class=\"card-body text-muted\">\n                        Список методов доставки для вывода в форме заказа во внешней части сайта.\n                    </div>\n                    <div class=\"table-responsive\">\n\n                        <table class=\"table table-divided mb-0\">\n                            <thead>\n                                <tr>\n                                    <th>\n                                        Название\n                                    </th>\n                                    <th>\n                                        Цена\n                                    </th>\n                                    <th>\n                                        Макс. цена\n                                    </th>\n                                    <th></th>\n                                </tr>\n                            </thead>\n                            <tbody>\n                                <tr>\n                                    <td>\n                                        <input type=\"text\" class=\"form-control form-control-sm\" name=\"\" value=\"Самовывоз\">\n                                    </td>\n                                    <td class=\"text-center\">\n                                        <input type=\"number\" class=\"form-control form-control-sm mwidth-80 m-auto\" name=\"\" value=\"0\">\n                                    </td>\n                                    <td class=\"text-center\">\n                                        <input type=\"number\" class=\"form-control form-control-sm mwidth-80 m-auto\" name=\"\" value=\"\">\n                                    </td>\n                                    <td class=\"text-center\">\n                                        <button class=\"btn btn-secondary btn-sm\">\n                                            <i class=\"icon-cross\"></i>\n                                        </button>\n                                    </td>\n                                </tr>\n                                <tr>\n                                    <td>\n                                        <input type=\"text\" class=\"form-control form-control-sm\" name=\"\" value=\"Доставка по городу\">\n                                    </td>\n                                    <td class=\"text-center\">\n                                        <input type=\"number\" class=\"form-control form-control-sm mwidth-80 m-auto\" name=\"\" value=\"0\">\n                                    </td>\n                                    <td class=\"text-center\">\n                                        <input type=\"number\" class=\"form-control form-control-sm mwidth-80 m-auto\" name=\"\" value=\"\">\n                                    </td>\n                                    <td class=\"text-center\">\n                                        <button class=\"btn btn-secondary btn-sm\">\n                                            <i class=\"icon-cross\"></i>\n                                        </button>\n                                    </td>\n                                </tr>\n                                <tr>\n                                    <td>\n                                        <input type=\"text\" class=\"form-control form-control-sm\" name=\"\" value=\"Доставка по городу\">\n                                    </td>\n                                    <td class=\"text-center\">\n                                        <input type=\"number\" class=\"form-control form-control-sm mwidth-80 m-auto\" name=\"\" value=\"0\">\n                                    </td>\n                                    <td class=\"text-center\">\n                                        <input type=\"number\" class=\"form-control form-control-sm mwidth-80 m-auto\" name=\"\" value=\"\">\n                                    </td>\n                                    <td class=\"text-center\">\n                                        <button class=\"btn btn-secondary btn-sm\">\n                                            <i class=\"icon-cross\"></i>\n                                        </button>\n                                    </td>\n                                </tr>\n                            </tbody>\n                            <tfoot>\n                                <tr class=\"bg-faded\">\n                                    <td colspan=\"4\" class=\"text-center\">\n                                        <button class=\"btn btn-secondary btn-sm\">\n                                            <i class=\"icon-plus\"></i>\n                                            Добавить\n                                        </button>\n                                    </td>\n                                </tr>\n                            </tfoot>\n                        </table>\n\n                    </div>\n                </div>\n                <!-- /delivery -->\n\n            </div>\n        </div>\n\n    </div>\n</div>"

/***/ }),

/***/ "../../../../../src/app/templates/page-statistics.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"card\">\n    <div class=\"card-body\">\n\n        <h3>\n            <i class=\"icon-bar-graph-2\"></i>\n            {{title}}\n        </h3>\n\n        <hr>\n\n        <div class=\"float-left\">\n\n            <div class=\"input-group\">\n                <input type=\"text\" class=\"form-control\" name=\"dp\" ngbDatepicker #d=\"ngbDatepicker\">\n                <div class=\"input-group-btn\">\n                    <button class=\"btn btn-secondary\" (click)=\"d.toggle()\" type=\"button\">\n                        <i class=\"icon-date_range\"></i>\n                    </button>\n                </div>\n            </div>\n\n        </div>\n\n        <div class=\"clearfix\"></div>\n\n    </div>\n    <div class=\"card-body border-t\">\n\n        <br>\n        <br>\n        <br>\n\n    </div>\n</div>"

/***/ }),

/***/ "../../../../../src/app/templates/render-input-field.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"form-group\" [class.form-group-message]=\"formErrors[field.name]\" [formGroup]=\"form\" *ngFor=\"let field of fields\">\n\n    <div [ngSwitch]=\"field.input_type\">\n\n        <div class=\"row\" *ngSwitchCase=\"'system_name'\">\n            <div class=\"col-md-5\">\n                <label for=\"field_{{field.name}}\">\n                    {{field.title}}\n                    <span class=\"text-danger\" *ngIf=\"field.required\">*</span>\n                </label>\n            </div>\n            <div class=\"col-md-7\">\n                <div class=\"input-group\">\n                    <input type=\"text\" class=\"form-control form-control-sm\" id=\"field_{{field.name}}\" [name]=\"field.name\" [formControlName]=\"field.name\" [(ngModel)]=\"model[field.name]\" class=\"form-control\">\n                    <div class=\"input-group-btn\">\n                        <button type=\"button\" class=\"btn btn-secondary\" ngbTooltip=\"Generate\" (click)=\"generateName(model)\">\n                            <i class=\"icon-reload\"></i>\n                        </button>\n                    </div>\n                </div>\n                <div *ngIf=\"formErrors[field.name]\" class=\"alert alert-danger\">\n                    {{formErrors[field.name]}}\n                </div>\n            </div>\n        </div>\n\n        <div class=\"row\" *ngSwitchCase=\"'text'\">\n            <div class=\"col-md-5\">\n                <label for=\"field_{{field.name}}\">\n                    {{field.title}}\n                    <span class=\"text-danger\" *ngIf=\"field.required\">*</span>\n                </label>\n            </div>\n            <div class=\"col-md-7\">\n                <input type=\"text\" id=\"field_{{field.name}}\" [name]=\"field.name\" [formControlName]=\"field.name\" [(ngModel)]=\"model[field.name]\" class=\"form-control\">\n                <div *ngIf=\"formErrors[field.name]\" class=\"alert alert-danger\">\n                    {{formErrors[field.name]}}\n                </div>\n            </div>\n        </div>\n\n        <div class=\"row\" *ngSwitchCase=\"'name'\">\n            <div class=\"col-md-5\">\n                <label for=\"field_{{field.name}}\">\n                    {{field.title}}\n                    <span class=\"text-danger\" *ngIf=\"field.required\">*</span>\n                </label>\n            </div>\n            <div class=\"col-md-7\">\n                <input type=\"text\" id=\"field_{{field.name}}\" [name]=\"field.name\" [formControlName]=\"field.name\" [(ngModel)]=\"model[field.name]\" class=\"form-control\">\n                <div *ngIf=\"formErrors[field.name]\" class=\"alert alert-danger\">\n                    {{formErrors[field.name]}}\n                </div>\n            </div>\n        </div>\n\n        <div class=\"row\" *ngSwitchCase=\"'number'\">\n            <div class=\"col-md-5\">\n                <label for=\"field_{{field.name}}\">\n                    {{field.title}}\n                    <span class=\"text-danger\" *ngIf=\"field.required\">*</span>\n                </label>\n            </div>\n            <div class=\"col-md-7\">\n                <input type=\"number\" id=\"field_{{field.name}}\" [name]=\"field.name\" [formControlName]=\"field.name\" [(ngModel)]=\"model[field.name]\" min=\"0\" class=\"form-control\">\n                <div *ngIf=\"formErrors[field.name]\" class=\"alert alert-danger\">\n                    {{formErrors[field.name]}}\n                </div>\n            </div>\n        </div>\n\n        <div class=\"row\" *ngSwitchCase=\"'textarea'\">\n            <div class=\"col-md-5\">\n                <label for=\"field_{{field.name}}\">\n                    {{field.title}}\n                    <span class=\"text-danger\" *ngIf=\"field.required\">*</span>\n                </label>\n            </div>\n            <div class=\"col-md-7\">\n                <textarea rows=\"6\" id=\"field_{{field.name}}\" [name]=\"field.name\" [formControlName]=\"field.name\" [(ngModel)]=\"model[field.name]\" class=\"form-control\"></textarea>\n                <div *ngIf=\"formErrors[field.name]\" class=\"alert alert-danger\">\n                    {{formErrors[field.name]}}\n                </div>\n            </div>\n        </div>\n\n        <div class=\"row\" *ngSwitchCase=\"'image'\">\n            <div class=\"col-md-5\">\n                <label for=\"field_{{field.name}}\">\n                    {{field.title}}\n                    <span class=\"text-danger\" *ngIf=\"field.required\">*</span>\n                </label>\n            </div>\n            <div class=\"col-md-7\">\n                <input type=\"file\" id=\"field_{{field.name}}\" [name]=\"field.name\" [formControlName]=\"field.name\" [(ngModel)]=\"model[field.name]\" class=\"form-control\">\n                <div *ngIf=\"formErrors[field.name]\" class=\"alert alert-danger\">\n                    {{formErrors[field.name]}}\n                </div>\n            </div>\n        </div>\n\n        <div class=\"row\" *ngSwitchCase=\"'color'\">\n            <div class=\"col-md-5\">\n                <label for=\"field_{{field.name}}\">\n                    {{field.title}}\n                    <span class=\"text-danger\" *ngIf=\"field.required\">*</span>\n                </label>\n            </div>\n            <div class=\"col-md-7\">\n                <input type=\"color\" id=\"field_{{field.name}}\" [name]=\"field.name\" [formControlName]=\"field.name\" [(ngModel)]=\"model[field.name]\" class=\"form-control\">\n                <div *ngIf=\"formErrors[field.name]\" class=\"alert alert-danger\">\n                    {{formErrors[field.name]}}\n                </div>\n            </div>\n        </div>\n\n        <div class=\"row\" *ngSwitchCase=\"'rich_text'\">\n            <div class=\"col-12\">\n                <label for=\"field_{{field.name}}\">\n                    {{field.title}}\n                    <span class=\"text-danger\" *ngIf=\"field.required\">*</span>\n                </label>\n                <p-editor [formControlName]=\"field.name\" [(ngModel)]=\"model[field.name]\" [style]=\"{'height':'320px'}\"></p-editor>\n                <div *ngIf=\"formErrors[field.name]\" class=\"alert alert-danger\">\n                    {{formErrors[field.name]}}\n                </div>\n            </div>\n        </div>\n\n        <div class=\"row\" *ngSwitchCase=\"'date'\">\n            <div class=\"col-md-5\">\n                <label for=\"field_{{field.name}}\">\n                    {{field.title}}\n                    <span class=\"text-danger\" *ngIf=\"field.required\">*</span>\n                </label>\n            </div>\n            <div class=\"col-md-7\">\n                <!--<div class=\"input-group\">-->\n                    <!--<input type=\"text\" class=\"form-control\" id=\"field_{{field.name}}\" [name]=\"field.name\" [formControlName]=\"field.name\" [(ngModel)]=\"model[field.name]\" ngbDatepicker #d=\"ngbDatepicker\">-->\n                    <!--<div class=\"input-group-btn\">-->\n                        <!--<button class=\"btn btn-secondary\" (click)=\"d.toggle()\" type=\"button\">-->\n                            <!--<i class=\"icon-date_range\"></i>-->\n                        <!--</button>-->\n                    <!--</div>-->\n                <!--</div>-->\n\n                <p-calendar [formControlName]=\"field.name\" [(ngModel)]=\"model[field.name]\" showTime=\"true\" [showIcon]=\"true\" dateFormat=\"dd.mm.yy\" icon=\"icon-date_range\"></p-calendar>\n\n                <div *ngIf=\"formErrors[field.name]\" class=\"alert alert-danger\">\n                    {{formErrors[field.name]}}\n                </div>\n            </div>\n        </div>\n\n    </div>\n\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/templates/render-output-field.html":
/***/ (function(module, exports) {

module.exports = "<div [ngSwitch]=\"outputType\">\n    <div *ngSwitchCase=\"'boolean'\" class=\"text-center\">\n        <i class=\"big text-success icon-circle-check\" [hidden]=\"!value\"></i>\n        <i class=\"big text-muted icon-circle-cross\" [hidden]=\"value\"></i>\n    </div>\n    <div *ngSwitchDefault>{{value}}</div>\n</div>"

/***/ }),

/***/ "../../../../../src/environments/environment.ts":
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

/***/ "../../../../../src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("../../../platform-browser-dynamic/@angular/platform-browser-dynamic.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_i18n_providers__ = __webpack_require__("../../../../../src/app/i18n-providers.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_module__ = __webpack_require__("../../../../../src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");





if (__WEBPACK_IMPORTED_MODULE_4__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["enableProdMode"])();
}
//platformBrowserDynamic().bootstrapModule(AppModule);
Object(__WEBPACK_IMPORTED_MODULE_2__app_i18n_providers__["a" /* getTranslationProviders */])().then(function (providers) {
    var options = { providers: providers };
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_3__app_app_module__["a" /* AppModule */], options);
});
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map