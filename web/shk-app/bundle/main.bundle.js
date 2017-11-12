webpackJsonp(["main"],{

/***/ "../../../../../locale/messages.ru.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TRANSLATION_RU = "\n<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<xliff version=\"1.2\" xmlns=\"urn:oasis:names:tc:xliff:document:1.2\">\n    <file source-language=\"en\" datatype=\"plaintext\" original=\"ng2.template\">\n        <body>\n            <trans-unit id=\"4e7f5f07ae8e67878f35b34bcee10e39300ff41a\" datatype=\"html\">\n                <source>Orders</source>\n                <target>\u0417\u0430\u043A\u0430\u0437\u044B</target>\n            </trans-unit>\n            <trans-unit id=\"61e0f26d843eec0b33ff475e111b0c2f7a80b835\" datatype=\"html\">\n                <source>Statistics</source>\n                <target>\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430</target>\n            </trans-unit>\n            <trans-unit id=\"532152365f64d8738343423767f1130c1a451e78\" datatype=\"html\">\n                <source>Catalog</source>\n                <target>\u041A\u0430\u0442\u0430\u043B\u043E\u0433</target>\n            </trans-unit>\n            <trans-unit id=\"121cc5391cd2a5115bc2b3160379ee5b36cd7716\" datatype=\"html\">\n                <source>Settings</source>\n                <target>\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438</target>\n            </trans-unit>\n            <trans-unit id=\"1f332ec66f3bc8d943c248091be7f92772ba280f\" datatype=\"html\">\n                <source>Expand</source>\n                <target>\u0420\u0430\u0437\u0432\u0435\u0440\u043D\u0443\u0442\u044C</target>\n            </trans-unit>\n            <trans-unit id=\"e8bcb762b48cf52fbea66ce9c4f6b970b99a80fd\" datatype=\"html\">\n                <source>Collapse</source>\n                <target>\u0421\u0432\u0435\u0440\u043D\u0443\u0442\u044C</target>\n            </trans-unit>\n        </body>\n    </file>\n</xliff>\n";
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
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var router_1 = __webpack_require__("../../../router/@angular/router.es5.js");
var not_found_component_1 = __webpack_require__("../../../../../src/app/not-found.component.ts");
var orders_component_1 = __webpack_require__("../../../../../src/app/orders.component.ts");
var catalog_component_1 = __webpack_require__("../../../../../src/app/catalog.component.ts");
var catalog_category_component_1 = __webpack_require__("../../../../../src/app/catalog-category.component.ts");
var content_types_component_1 = __webpack_require__("../../../../../src/app/content-types.component.ts");
var field_types_component_1 = __webpack_require__("../../../../../src/app/field-types.component.ts");
var stat_component_1 = __webpack_require__("../../../../../src/app/stat.component.ts");
var settings_component_1 = __webpack_require__("../../../../../src/app/settings.component.ts");
var routes = [
    {
        path: '',
        redirectTo: '/orders',
        pathMatch: 'full'
    },
    {
        path: 'orders',
        component: orders_component_1.OrdersComponent,
        data: { title: 'Orders' }
    },
    {
        path: 'catalog',
        component: catalog_component_1.CatalogComponent,
        data: { title: 'Catalog' },
        children: [
            {
                path: '',
                redirectTo: 'category/0',
                pathMatch: 'full'
            },
            {
                path: 'category/:categoryId',
                component: catalog_category_component_1.CatalogCategoryComponent,
                data: { title: 'Catalog' }
            },
            {
                path: 'content_types',
                component: content_types_component_1.ContentTypesComponent,
                data: { title: 'Content types' }
            },
            {
                path: 'field_types',
                component: field_types_component_1.FieldTypesComponent,
                data: { title: 'Field types' }
            },
        ]
    },
    {
        path: 'statistics',
        component: stat_component_1.StatisticsComponent,
        data: { title: 'Statistics' }
    },
    {
        path: 'settings',
        component: settings_component_1.SettingsComponent,
        data: { title: 'Settings' }
    },
    {
        path: '**',
        component: not_found_component_1.NotFoundComponent,
        data: { title: 'Page not found' }
    }
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    return AppRoutingModule;
}());
AppRoutingModule = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forRoot(routes, { useHash: true })],
        exports: [router_1.RouterModule]
    })
], AppRoutingModule);
exports.AppRoutingModule = AppRoutingModule;
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
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var ng_bootstrap_1 = __webpack_require__("../../../../@ng-bootstrap/ng-bootstrap/index.js");
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
    core_1.Input(),
    __metadata("design:type", Object)
], ConfirmModalContent.prototype, "modalTitle", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ConfirmModalContent.prototype, "modalContent", void 0);
ConfirmModalContent = __decorate([
    core_1.Component({
        selector: 'modal-confirm',
        template: __webpack_require__("../../../../../src/app/templates/modal-confirm.html"),
        providers: []
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ng_bootstrap_1.NgbActiveModal !== "undefined" && ng_bootstrap_1.NgbActiveModal) === "function" && _a || Object])
], ConfirmModalContent);
exports.ConfirmModalContent = ConfirmModalContent;
var AlertModalContent = (function () {
    function AlertModalContent(activeModal) {
        this.activeModal = activeModal;
    }
    return AlertModalContent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], AlertModalContent.prototype, "modalTitle", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], AlertModalContent.prototype, "modalContent", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], AlertModalContent.prototype, "messageType", void 0);
AlertModalContent = __decorate([
    core_1.Component({
        selector: 'modal-alert',
        template: __webpack_require__("../../../../../src/app/templates/modal-alert.html"),
        providers: []
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof ng_bootstrap_1.NgbActiveModal !== "undefined" && ng_bootstrap_1.NgbActiveModal) === "function" && _b || Object])
], AlertModalContent);
exports.AlertModalContent = AlertModalContent;
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
    core_1.Component({
        selector: 'app-root',
        template: __webpack_require__("../../../../../src/app/templates/app.component.html"),
        styles: [__webpack_require__("../../../../../src/app/app.component.css")],
        providers: [ng_bootstrap_1.NgbTooltipConfig]
    }),
    __metadata("design:paramtypes", [typeof (_c = typeof ng_bootstrap_1.NgbTooltipConfig !== "undefined" && ng_bootstrap_1.NgbTooltipConfig) === "function" && _c || Object])
], AppComponent);
exports.AppComponent = AppComponent;
var _a, _b, _c;
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ "../../../../../src/app/app.module.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
var animations_1 = __webpack_require__("../../../platform-browser/@angular/platform-browser/animations.es5.js");
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var forms_1 = __webpack_require__("../../../forms/@angular/forms.es5.js");
var http_1 = __webpack_require__("../../../http/@angular/http.es5.js");
var http_2 = __webpack_require__("../../../common/@angular/common/http.es5.js");
var ng_bootstrap_1 = __webpack_require__("../../../../@ng-bootstrap/ng-bootstrap/index.js");
var primeng_1 = __webpack_require__("../../../../primeng/primeng.js");
var app_component_1 = __webpack_require__("../../../../../src/app/app.component.ts");
var not_found_component_1 = __webpack_require__("../../../../../src/app/not-found.component.ts");
var orders_component_1 = __webpack_require__("../../../../../src/app/orders.component.ts");
var catalog_component_1 = __webpack_require__("../../../../../src/app/catalog.component.ts");
var catalog_category_component_1 = __webpack_require__("../../../../../src/app/catalog-category.component.ts");
var product_component_1 = __webpack_require__("../../../../../src/app/product.component.ts");
var categories_component_1 = __webpack_require__("../../../../../src/app/categories.component.ts");
var content_types_component_1 = __webpack_require__("../../../../../src/app/content-types.component.ts");
var field_types_component_1 = __webpack_require__("../../../../../src/app/field-types.component.ts");
var stat_component_1 = __webpack_require__("../../../../../src/app/stat.component.ts");
var settings_component_1 = __webpack_require__("../../../../../src/app/settings.component.ts");
var list_recursive_component_1 = __webpack_require__("../../../../../src/app/list-recursive.component.ts");
var table_component_1 = __webpack_require__("../../../../../src/app/table.component.ts");
var render_input_field_1 = __webpack_require__("../../../../../src/app/render-input-field.ts");
var render_output_field_1 = __webpack_require__("../../../../../src/app/render-output-field.ts");
var filter_field_by_group_pipe_1 = __webpack_require__("../../../../../src/app/pipes/filter-field-by-group.pipe.ts");
var orderby_pipe_1 = __webpack_require__("../../../../../src/app/pipes/orderby.pipe.ts");
var filter_array_pipe_1 = __webpack_require__("../../../../../src/app/pipes/filter-array-pipe.ts");
var products_service_1 = __webpack_require__("../../../../../src/app/services/products.service.ts");
var content_types_service_1 = __webpack_require__("../../../../../src/app/services/content_types.service.ts");
var categories_service_1 = __webpack_require__("../../../../../src/app/services/categories.service.ts");
var app_routing_module_1 = __webpack_require__("../../../../../src/app/app-routing.module.ts");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            animations_1.BrowserAnimationsModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule,
            http_1.HttpModule,
            http_2.HttpClientModule,
            app_routing_module_1.AppRoutingModule,
            ng_bootstrap_1.NgbModule.forRoot(),
            primeng_1.EditorModule,
            primeng_1.CalendarModule,
            primeng_1.ChipsModule
        ],
        declarations: [
            app_component_1.AppComponent,
            not_found_component_1.NotFoundComponent,
            orders_component_1.OrdersComponent,
            categories_component_1.CategoriesMenuComponent,
            catalog_component_1.CatalogComponent,
            catalog_category_component_1.CatalogCategoryComponent,
            content_types_component_1.ContentTypesComponent,
            field_types_component_1.FieldTypesComponent,
            stat_component_1.StatisticsComponent,
            settings_component_1.SettingsComponent,
            list_recursive_component_1.ListRecursiveComponent,
            table_component_1.TableComponent,
            categories_component_1.CategoriesListComponent,
            render_input_field_1.InputFieldRenderComponent,
            render_output_field_1.OutputFieldComponent,
            filter_field_by_group_pipe_1.FilterFieldByGroup,
            orderby_pipe_1.OrderByPipe,
            filter_array_pipe_1.FilterArrayPipe,
            app_component_1.AlertModalContent,
            app_component_1.ConfirmModalContent,
            product_component_1.ProductModalContent,
            content_types_component_1.ContentTypeModalContent,
            categories_component_1.CategoriesModalComponent,
            field_types_component_1.FieldTypeModalContent
        ],
        providers: [products_service_1.ProductsService, content_types_service_1.ContentTypesService, categories_service_1.CategoriesService, ng_bootstrap_1.NgbActiveModal, ng_bootstrap_1.NgbTooltipConfig],
        entryComponents: [
            app_component_1.AlertModalContent,
            app_component_1.ConfirmModalContent,
            product_component_1.ProductModalContent,
            content_types_component_1.ContentTypeModalContent,
            categories_component_1.CategoriesModalComponent,
            field_types_component_1.FieldTypeModalContent
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ "../../../../../src/app/catalog-category.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var platform_browser_1 = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
var ng_bootstrap_1 = __webpack_require__("../../../../@ng-bootstrap/ng-bootstrap/index.js");
var _ = __webpack_require__("../../../../lodash/lodash.js");
var category_model_1 = __webpack_require__("../../../../../src/app/models/category.model.ts");
var products_service_1 = __webpack_require__("../../../../../src/app/services/products.service.ts");
var page_table_abstract_1 = __webpack_require__("../../../../../src/app/page-table.abstract.ts");
var product_component_1 = __webpack_require__("../../../../../src/app/product.component.ts");
var content_types_service_1 = __webpack_require__("../../../../../src/app/services/content_types.service.ts");
var CatalogCategoryComponent = (function (_super) {
    __extends(CatalogCategoryComponent, _super);
    function CatalogCategoryComponent(dataService, activeModal, modalService, titleService, contentTypesService) {
        var _this = _super.call(this, dataService, activeModal, modalService, titleService) || this;
        _this.dataService = dataService;
        _this.activeModal = activeModal;
        _this.modalService = modalService;
        _this.titleService = titleService;
        _this.contentTypesService = contentTypesService;
        _this.title = 'Каталог';
        _this.tableFields = [];
        return _this;
    }
    CatalogCategoryComponent.prototype.ngOnInit = function () {
        this.setTitle(this.title);
    };
    CatalogCategoryComponent.prototype.updateTableConfig = function () {
        var _this = this;
        if (!this.currentContentType) {
            return;
        }
        this.tableFields = [
            {
                name: 'id',
                title: 'ID',
                outputType: 'number',
                outputProperties: {}
            }
        ];
        this.currentContentType.fields.forEach(function (field) {
            if (field.showInTable) {
                _this.tableFields.push({
                    name: field.name,
                    title: field.title,
                    outputType: field.outputType,
                    outputProperties: field.outputProperties
                });
            }
        });
    };
    CatalogCategoryComponent.prototype.getModalContent = function () {
        return product_component_1.ProductModalContent;
    };
    CatalogCategoryComponent.prototype.getContentType = function () {
        return this.contentTypesService
            .getItemByName(this.currentCategory.contentTypeName);
    };
    CatalogCategoryComponent.prototype.openCategory = function (category) {
        var _this = this;
        this.currentCategory = _.clone(category);
        if (!this.currentCategory.contentTypeName) {
            this.items = [];
            this.tableFields = [];
            this.currentCategory.id = 0;
            return;
        }
        this.dataService.setRequestUrl('admin/products/' + this.currentCategory.id);
        this.loading = true;
        this.titleService.setTitle(this.title + ' / ' + this.currentCategory.title);
        this.getContentType()
            .subscribe(function (data) {
            _this.currentContentType = data;
            _this.loading = false;
            _this.updateTableConfig();
            _this.getList();
        }, function () {
            _this.items = [];
            _this.tableFields = [];
            _this.currentCategory.id = 0;
        });
    };
    CatalogCategoryComponent.prototype.openRootCategory = function () {
        this.currentCategory = new category_model_1.Category(0, false, 0, 'root', '', '', '', true);
        this.titleService.setTitle(this.title);
        this.dataService.setRequestUrl('admin/products/' + this.currentCategory.id);
        this.getList();
    };
    CatalogCategoryComponent.prototype.setModalInputs = function (itemId, isItemCopy) {
        if (isItemCopy === void 0) { isItemCopy = false; }
        page_table_abstract_1.PageTableAbstractComponent.prototype.setModalInputs.call(this, itemId, isItemCopy);
        this.modalRef.componentInstance.category = this.currentCategory;
    };
    return CatalogCategoryComponent;
}(page_table_abstract_1.PageTableAbstractComponent));
CatalogCategoryComponent = __decorate([
    core_1.Component({
        selector: 'catalog-category',
        template: __webpack_require__("../../../../../src/app/templates/catalog-category.html"),
        providers: [products_service_1.ProductsService]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof products_service_1.ProductsService !== "undefined" && products_service_1.ProductsService) === "function" && _a || Object, typeof (_b = typeof ng_bootstrap_1.NgbActiveModal !== "undefined" && ng_bootstrap_1.NgbActiveModal) === "function" && _b || Object, typeof (_c = typeof ng_bootstrap_1.NgbModal !== "undefined" && ng_bootstrap_1.NgbModal) === "function" && _c || Object, typeof (_d = typeof platform_browser_1.Title !== "undefined" && platform_browser_1.Title) === "function" && _d || Object, typeof (_e = typeof content_types_service_1.ContentTypesService !== "undefined" && content_types_service_1.ContentTypesService) === "function" && _e || Object])
], CatalogCategoryComponent);
exports.CatalogCategoryComponent = CatalogCategoryComponent;
var _a, _b, _c, _d, _e;
//# sourceMappingURL=catalog-category.component.js.map

/***/ }),

/***/ "../../../../../src/app/catalog.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var CatalogComponent = (function () {
    function CatalogComponent() {
    }
    CatalogComponent.prototype.ngOnInit = function () {
    };
    return CatalogComponent;
}());
CatalogComponent = __decorate([
    core_1.Component({
        selector: 'catalog',
        template: __webpack_require__("../../../../../src/app/templates/page-catalog.html"),
        providers: []
    }),
    __metadata("design:paramtypes", [])
], CatalogComponent);
exports.CatalogComponent = CatalogComponent;
//# sourceMappingURL=catalog.component.js.map

/***/ }),

/***/ "../../../../../src/app/categories.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var router_1 = __webpack_require__("../../../router/@angular/router.es5.js");
var ng_bootstrap_1 = __webpack_require__("../../../../@ng-bootstrap/ng-bootstrap/index.js");
var forms_1 = __webpack_require__("../../../forms/@angular/forms.es5.js");
var category_model_1 = __webpack_require__("../../../../../src/app/models/category.model.ts");
var app_component_1 = __webpack_require__("../../../../../src/app/app.component.ts");
var list_recursive_component_1 = __webpack_require__("../../../../../src/app/list-recursive.component.ts");
var modal_abstract_1 = __webpack_require__("../../../../../src/app/modal.abstract.ts");
__webpack_require__("../../../../rxjs/_esm5/add/operator/switchMap.js");
var _ = __webpack_require__("../../../../lodash/lodash.js");
var system_name_service_1 = __webpack_require__("../../../../../src/app/services/system-name.service.ts");
var categories_service_1 = __webpack_require__("../../../../../src/app/services/categories.service.ts");
var content_types_service_1 = __webpack_require__("../../../../../src/app/services/content_types.service.ts");
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
        _this.isRoot = false;
        _this.model = new category_model_1.Category(null, false, 0, '', '', '', '', true);
        _this.contentTypes = [];
        _this.formFields = {
            title: {
                value: '',
                disabled: false,
                validators: [forms_1.Validators.required],
                messages: {
                    required: 'Title is required.'
                }
            },
            name: {
                value: '',
                disabled: false,
                validators: [forms_1.Validators.required],
                messages: {
                    required: 'Name is required.'
                }
            },
            description: {
                value: '',
                disabled: false,
                validators: [],
                messages: {}
            },
            parentId: {
                value: 0,
                disabled: false,
                validators: [],
                messages: {}
            },
            contentTypeName: {
                value: '',
                disabled: false,
                validators: [forms_1.Validators.required],
                messages: {
                    required: 'Content type is required.'
                }
            },
            isActive: {
                value: false,
                disabled: false,
                validators: [],
                messages: {}
            }
        };
        return _this;
    }
    /** On initialize */
    CategoriesModalComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Filter root category and self
        this.categories = _.filter(this.categories, function (category) {
            if (_this.isEditMode) {
                return category.name != 'root'
                    && category.id != _this.currentCategory.id;
            }
            else {
                return category.name != 'root';
            }
        });
        this.model.parentId = this.currentCategory.id;
        this.model.contentTypeName = this.currentCategory.contentTypeName;
        if (this.isRoot) {
            this.model.id = 0;
            this.model.title = 'Корневая категория';
            this.model.name = 'root';
            this.formFields.title.disabled = true;
            this.formFields.name.disabled = true;
            this.formFields.isActive.disabled = true;
        }
        modal_abstract_1.ModalContentAbstractComponent.prototype.ngOnInit.call(this);
        this.getContentTypes();
    };
    CategoriesModalComponent.prototype.getContentTypes = function () {
        var _this = this;
        this.contentTypesService.getListPage()
            .subscribe(function (data) {
            _this.contentTypes = data.items;
        }, function (error) { return _this.errorMessage = error; });
    };
    CategoriesModalComponent.prototype.saveRequest = function () {
        if (this.isEditMode) {
            return this.dataService.update(this.model);
        }
        else {
            return this.dataService.create(this.model);
        }
    };
    CategoriesModalComponent.prototype.save = function () {
        var _this = this;
        this.submitted = true;
        if (!this.form.valid) {
            this.onValueChanged('form');
            this.submitted = false;
            return;
        }
        this.saveRequest()
            .subscribe(function () { return _this.closeModal(); }, function (err) {
            _this.errorMessage = err.error;
            _this.submitted = false;
        });
    };
    return CategoriesModalComponent;
}(modal_abstract_1.ModalContentAbstractComponent));
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], CategoriesModalComponent.prototype, "categories", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", typeof (_a = typeof category_model_1.Category !== "undefined" && category_model_1.Category) === "function" && _a || Object)
], CategoriesModalComponent.prototype, "currentCategory", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], CategoriesModalComponent.prototype, "isRoot", void 0);
CategoriesModalComponent = __decorate([
    core_1.Component({
        selector: 'category-modal-content',
        template: __webpack_require__("../../../../../src/app/templates/modal-category.html"),
        providers: [categories_service_1.CategoriesService, system_name_service_1.SystemNameService, content_types_service_1.ContentTypesService]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof forms_1.FormBuilder !== "undefined" && forms_1.FormBuilder) === "function" && _b || Object, typeof (_c = typeof categories_service_1.CategoriesService !== "undefined" && categories_service_1.CategoriesService) === "function" && _c || Object, typeof (_d = typeof system_name_service_1.SystemNameService !== "undefined" && system_name_service_1.SystemNameService) === "function" && _d || Object, typeof (_e = typeof ng_bootstrap_1.NgbActiveModal !== "undefined" && ng_bootstrap_1.NgbActiveModal) === "function" && _e || Object, typeof (_f = typeof ng_bootstrap_1.NgbTooltipConfig !== "undefined" && ng_bootstrap_1.NgbTooltipConfig) === "function" && _f || Object, typeof (_g = typeof content_types_service_1.ContentTypesService !== "undefined" && content_types_service_1.ContentTypesService) === "function" && _g || Object])
], CategoriesModalComponent);
exports.CategoriesModalComponent = CategoriesModalComponent;
/**
 * @class CategoriesListComponent
 */
var CategoriesListComponent = (function (_super) {
    __extends(CategoriesListComponent, _super);
    function CategoriesListComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CategoriesListComponent;
}(list_recursive_component_1.ListRecursiveComponent));
CategoriesListComponent = __decorate([
    core_1.Component({
        selector: 'categories-list',
        template: "\n        <ul class=\"dropdown-menu dropdown-menu-hover\" *ngIf=\"items.length > 0\" [class.shadow]=\"parentId != 0\">\n            <li class=\"dropdown-item active\" *ngFor=\"let item of items\" [class.active]=\"item.id == currentId\"\n                [class.current-level]=\"getIsActiveParent(item.id)\">\n                <i class=\"icon-keyboard_arrow_right float-right m-2 pt-1\" [hidden]=\"!item.isFolder\"></i>\n                <a href=\"\" [routerLink]=\"['/catalog/category/', item.id]\" [class.text-muted]=\"!item.isActive\">\n                    {{item.title}}\n                </a>\n                <categories-list [inputItems]=\"inputItems\" [parentId]=\"item.id\" [currentId]=\"currentId\"></categories-list>\n            </li>\n        </ul>\n    "
    })
], CategoriesListComponent);
exports.CategoriesListComponent = CategoriesListComponent;
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
        this.changeRequest = new core_1.EventEmitter();
        this.currentCategory = new category_model_1.Category(null, false, 0, 'root', this.rootTitle, '', '', true);
        this.categories = [];
        this.errorMessage = '';
        this.categoryId = 0;
    }
    /** On initialize component */
    CategoriesMenuComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getCategoriesRequest()
            .subscribe(function (data) {
            _this.categories = data.items;
            _this.route.paramMap
                .subscribe(function (params) {
                _this.categoryId = params.get('categoryId')
                    ? parseInt(params.get('categoryId'))
                    : 0;
                _this.selectCurrent();
            });
        }, function (error) { return _this.errorMessage = error; });
    };
    /** Select current category */
    CategoriesMenuComponent.prototype.selectCurrent = function () {
        if (this.currentCategory.id === this.categoryId) {
            return;
        }
        var index = _.findIndex(this.categories, { id: this.categoryId });
        if (index > -1) {
            this.currentCategory = _.clone(this.categories[index]);
            this.changeRequest.emit(this.currentCategory);
        }
        else {
            this.openRootCategory();
        }
    };
    /** Get categories */
    CategoriesMenuComponent.prototype.getCategoriesRequest = function () {
        return this.categoriesService.getListPage();
    };
    /** Get categories */
    CategoriesMenuComponent.prototype.getCategories = function () {
        var _this = this;
        this.getCategoriesRequest()
            .subscribe(function (data) {
            _this.categories = data.items;
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
        if (isItemCopy === void 0) { isItemCopy = false; }
        var isRoot = itemId === 0 || itemId === null;
        var isEditMode = typeof itemId !== 'undefined' && !isItemCopy;
        this.modalRef = this.modalService.open(CategoriesModalComponent, { size: 'lg' });
        this.modalRef.componentInstance.modalTitle = isEditMode ? 'Edit category' : 'Add category';
        this.modalRef.componentInstance.itemId = itemId || 0;
        this.modalRef.componentInstance.isItemCopy = isItemCopy || false;
        this.modalRef.componentInstance.categories = _.cloneDeep(this.categories);
        this.modalRef.componentInstance.currentCategory = this.currentCategory;
        this.modalRef.componentInstance.isRoot = isRoot;
        this.modalRef.componentInstance.isEditMode = isEditMode;
        this.modalRef.result.then(function (result) {
            _this.currentCategory.id = null; // For update current category data
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
        var index = _.findIndex(this.categories, { id: itemId });
        if (index === -1) {
            return;
        }
        var category = this.categories[index];
        if (category.parentId == data.parentId) {
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
        var index = _.findIndex(this.categories, { id: itemId });
        if (index == -1) {
            return;
        }
        this.modalRef = this.modalService.open(app_component_1.ConfirmModalContent);
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
            .subscribe(function (data) {
            _this.categoryId = 0;
            _this.selectCurrent();
            _this.getCategories();
        }, function (err) { return _this.errorMessage = err; });
    };
    /** Open root category */
    CategoriesMenuComponent.prototype.openRootCategory = function () {
        this.currentCategory = new category_model_1.Category(null, false, 0, 'root', this.rootTitle, '', '', true);
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
    core_1.Input(),
    __metadata("design:type", String)
], CategoriesMenuComponent.prototype, "rootTitle", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], CategoriesMenuComponent.prototype, "changeRequest", void 0);
CategoriesMenuComponent = __decorate([
    core_1.Component({
        selector: 'categories-menu',
        template: __webpack_require__("../../../../../src/app/templates/categories-menu.html"),
        providers: [categories_service_1.CategoriesService]
    }),
    __metadata("design:paramtypes", [typeof (_h = typeof router_1.Router !== "undefined" && router_1.Router) === "function" && _h || Object, typeof (_j = typeof router_1.ActivatedRoute !== "undefined" && router_1.ActivatedRoute) === "function" && _j || Object, typeof (_k = typeof ng_bootstrap_1.NgbModal !== "undefined" && ng_bootstrap_1.NgbModal) === "function" && _k || Object, typeof (_l = typeof categories_service_1.CategoriesService !== "undefined" && categories_service_1.CategoriesService) === "function" && _l || Object])
], CategoriesMenuComponent);
exports.CategoriesMenuComponent = CategoriesMenuComponent;
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
//# sourceMappingURL=categories.component.js.map

/***/ }),

/***/ "../../../../../src/app/content-types.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var forms_1 = __webpack_require__("../../../forms/@angular/forms.es5.js");
var platform_browser_1 = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
var ng_bootstrap_1 = __webpack_require__("../../../../@ng-bootstrap/ng-bootstrap/index.js");
var _ = __webpack_require__("../../../../lodash/lodash.js");
var field_types_component_1 = __webpack_require__("../../../../../src/app/field-types.component.ts");
var content_field_model_1 = __webpack_require__("../../../../../src/app/models/content_field.model.ts");
var content_type_model_1 = __webpack_require__("../../../../../src/app/models/content_type.model.ts");
var query_options_1 = __webpack_require__("../../../../../src/app/models/query-options.ts");
var page_table_abstract_1 = __webpack_require__("../../../../../src/app/page-table.abstract.ts");
var modal_abstract_1 = __webpack_require__("../../../../../src/app/modal.abstract.ts");
var content_types_service_1 = __webpack_require__("../../../../../src/app/services/content_types.service.ts");
var collections_service_1 = __webpack_require__("../../../../../src/app/services/collections.service.ts");
var system_name_service_1 = __webpack_require__("../../../../../src/app/services/system-name.service.ts");
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
        _this.model = new content_type_model_1.ContentType(0, '', '', '', 'products', [], ['Основное', 'Служебное'], true);
        _this.fieldModel = new content_field_model_1.ContentField(0, '', '', '', '', {}, '', {}, '', false, false, false);
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
                validators: [forms_1.Validators.required, forms_1.Validators.pattern('[A-Za-z0-9_-]+')],
                messages: {
                    required: 'Name is required.',
                    pattern: 'The name must contain only Latin letters and numbers.'
                }
            },
            title: {
                value: '',
                validators: [forms_1.Validators.required],
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
                validators: [forms_1.Validators.required],
                messages: {
                    required: 'Title is required.'
                }
            },
            newCollection: {
                value: '',
                validators: [forms_1.Validators.pattern('[A-Za-z0-9_-]+')],
                messages: {
                    pattern: 'The name must contain only Latin letters and numbers.',
                    exists: 'Collection with the same name already exists.'
                }
            },
            isActive: {
                value: '',
                validators: [],
                messages: {}
            }
        };
        _this.fieldsFormOptions = {
            title: {
                value: '',
                validators: [forms_1.Validators.required],
                messages: {
                    required: 'Title is required.'
                }
            },
            name: {
                value: '',
                validators: [forms_1.Validators.required, forms_1.Validators.pattern('[A-Za-z0-9_-]+')],
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
            inputType: {
                value: '',
                validators: [forms_1.Validators.required],
                messages: {
                    required: 'Input type is required.'
                }
            },
            outputType: {
                value: '',
                validators: [forms_1.Validators.required],
                messages: {
                    required: 'Output type is required.'
                }
            },
            group: {
                value: '',
                validators: [forms_1.Validators.required],
                messages: {
                    required: 'Group is required.'
                }
            },
            newGroup: {
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
            showInTable: {
                value: '',
                validators: [],
                messages: {}
            },
            isFilter: {
                value: '',
                validators: [],
                messages: {}
            }
        };
        return _this;
    }
    ContentTypeModalContent.prototype.buildForm = function () {
        var _this = this;
        modal_abstract_1.ModalContentAbstractComponent.prototype.buildForm.call(this);
        var controls = this.buildControls(this.fieldsFormOptions, 'fieldModel', 'fld_');
        this.fieldForm = this.fb.group(controls);
        this.fieldForm.valueChanges
            .subscribe(function () { return _this.onValueChanged('fieldForm', 'fld_'); });
    };
    /** On initialize */
    ContentTypeModalContent.prototype.ngOnInit = function () {
        modal_abstract_1.ModalContentAbstractComponent.prototype.ngOnInit.call(this);
        this.getFieldTypes();
        this.getCollectionsList();
    };
    /** Get field types */
    ContentTypeModalContent.prototype.getFieldTypes = function () {
        var _this = this;
        var options = new query_options_1.QueryOptions('title', 'asc', 0, 0, 1);
        this.fieldTypesService.getList(options)
            .subscribe(function (data) {
            _this.fieldTypes = data;
        }, function (error) { return _this.errorMessage = error; });
    };
    /** Get collections list */
    ContentTypeModalContent.prototype.getCollectionsList = function () {
        var _this = this;
        this.collectionsService.getList()
            .subscribe(function (data) {
            if (data.length > 0) {
                _this.collections = data;
            }
        });
    };
    /**
     * Select field type properties
     * @param {string} type
     * @param {string} fieldTypeName
     */
    ContentTypeModalContent.prototype.selectFieldTypeProperties = function (type, fieldTypeName) {
        var _this = this;
        if (fieldTypeName) {
            this.fieldModel[type + 'Type'] = fieldTypeName;
        }
        var fieldType = _.find(this.fieldTypes, { name: this.fieldModel[type + 'Type'] });
        if (!fieldType) {
            this.fieldTypeProperties[type] = [];
            return;
        }
        var modelPropertiesField = type + 'Properties';
        var propNames = _.map(fieldType[type + 'Properties'], 'name');
        this.fieldTypeProperties[type].splice(0);
        fieldType[type + 'Properties'].forEach(function (v, i) {
            _this.fieldTypeProperties[type].push(v);
        });
        for (var prop in this.fieldModel[modelPropertiesField]) {
            if (this.fieldModel[modelPropertiesField].hasOwnProperty(prop)) {
                if (propNames.indexOf(prop) === -1) {
                    delete this.fieldModel[modelPropertiesField][prop];
                }
            }
        }
        for (var i in this.fieldTypeProperties[type]) {
            if (this.fieldTypeProperties[type].hasOwnProperty(i)) {
                var fldName = this.fieldTypeProperties[type][i].name;
                if (typeof this.fieldModel[modelPropertiesField][fldName] == 'undefined') {
                    this.fieldModel[modelPropertiesField][fldName] = this.fieldTypeProperties[type][i].default_value;
                }
            }
        }
        if (type == 'input' && !this.fieldModel.outputType) {
            this.selectFieldTypeProperties('output', this.fieldModel.inputType);
        }
    };
    /** Add collection */
    ContentTypeModalContent.prototype.addCollection = function () {
        var fieldName = 'newCollection';
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
            this.loading = true;
            console.log('deleteItemByName', this.model.collection);
            // this.collectionsService.deleteItemByName(this.model.collection)
            //     .then((res) => {
            //         if(res.success){
            //
            //             let index = this.collections.indexOf(this.model.collection);
            //             if(index > -1){
            //                 this.collections.splice(index, 1);
            //                 this.model.collection = this.collections[0];
            //             }
            //             popover.close();
            //
            //         } else {
            //             if(res.msg){
            //                 popoverContent.message = res.msg;
            //             }
            //         }
            //         this.loading = false;
            //     });
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
        var fieldName = 'newGroup';
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
        var index = _.findIndex(this.model.fields, { group: currentGroupName });
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
        this.fieldModel = _.clone(field);
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
        this.fieldModel = _.clone(field);
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
        var index = _.findIndex(this.model.fields, { name: field.name });
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
        this.fieldModel = new content_field_model_1.ContentField(0, '', '', '', '', {}, '', {}, '', false, false, false);
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
        var data = _.clone(this.fieldModel);
        var index = _.findIndex(this.model.fields, { name: data.name });
        if (index > -1 && this.currentFieldName != data.name) {
            this.errorMessage = 'A field named "' + data.name + '" already exists.';
            return;
        }
        if (this.action == 'add_field') {
            this.model.fields.push(_.clone(data));
        }
        else if (this.action == 'edit_field') {
            index = _.findIndex(this.model.fields, { name: this.currentFieldName });
            if (index > -1) {
                this.model.fields[index] = _.clone(data);
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
            console.log(res);
            // if(res.success){
            //     this.closeModal();
            // } else {
            //     if(res.msg){
            //         this.submitted = false;
            //         this.errorMessage = res.msg;
            //     }
            // }
        };
        if (this.model.id) {
            this.dataService.update(this.model).subscribe(callback.bind(this));
        }
        else {
            this.dataService.create(this.model).subscribe(callback.bind(this));
        }
    };
    return ContentTypeModalContent;
}(modal_abstract_1.ModalContentAbstractComponent));
__decorate([
    core_1.ViewChild('addCollectionBlock'),
    __metadata("design:type", Object)
], ContentTypeModalContent.prototype, "elementAddCollectionBlock", void 0);
__decorate([
    core_1.ViewChild('addGroupBlock'),
    __metadata("design:type", Object)
], ContentTypeModalContent.prototype, "elementAddGroupBlock", void 0);
ContentTypeModalContent = __decorate([
    core_1.Component({
        selector: 'content-type-modal-content',
        template: __webpack_require__("../../../../../src/app/templates/modal-content_types.html"),
        providers: [content_types_service_1.ContentTypesService, field_types_component_1.FieldTypesService, collections_service_1.CollectionsService, system_name_service_1.SystemNameService]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof forms_1.FormBuilder !== "undefined" && forms_1.FormBuilder) === "function" && _a || Object, typeof (_b = typeof content_types_service_1.ContentTypesService !== "undefined" && content_types_service_1.ContentTypesService) === "function" && _b || Object, typeof (_c = typeof system_name_service_1.SystemNameService !== "undefined" && system_name_service_1.SystemNameService) === "function" && _c || Object, typeof (_d = typeof ng_bootstrap_1.NgbActiveModal !== "undefined" && ng_bootstrap_1.NgbActiveModal) === "function" && _d || Object, typeof (_e = typeof ng_bootstrap_1.NgbTooltipConfig !== "undefined" && ng_bootstrap_1.NgbTooltipConfig) === "function" && _e || Object, typeof (_f = typeof field_types_component_1.FieldTypesService !== "undefined" && field_types_component_1.FieldTypesService) === "function" && _f || Object, typeof (_g = typeof collections_service_1.CollectionsService !== "undefined" && collections_service_1.CollectionsService) === "function" && _g || Object, typeof (_h = typeof ng_bootstrap_1.NgbModal !== "undefined" && ng_bootstrap_1.NgbModal) === "function" && _h || Object])
], ContentTypeModalContent);
exports.ContentTypeModalContent = ContentTypeModalContent;
var ContentTypesComponent = (function (_super) {
    __extends(ContentTypesComponent, _super);
    function ContentTypesComponent(dataService, activeModal, modalService, titleService) {
        var _this = _super.call(this, dataService, activeModal, modalService, titleService) || this;
        _this.title = 'Типы контента';
        //TODO: get from settings
        _this.tableFields = [
            {
                name: 'id',
                title: 'ID',
                outputType: 'text',
                outputProperties: {}
            },
            {
                name: 'title',
                title: 'Название',
                outputType: 'text',
                outputProperties: {}
            },
            {
                name: 'name',
                title: 'Системное имя',
                outputType: 'text',
                outputProperties: {}
            },
            {
                name: 'collection',
                title: 'Коллекция',
                outputType: 'text',
                outputProperties: {}
            },
            {
                name: 'isActive',
                title: 'Статус',
                outputType: 'boolean',
                outputProperties: {}
            }
        ];
        return _this;
    }
    ContentTypesComponent.prototype.getModalContent = function () {
        return ContentTypeModalContent;
    };
    return ContentTypesComponent;
}(page_table_abstract_1.PageTableAbstractComponent));
ContentTypesComponent = __decorate([
    core_1.Component({
        selector: 'shk-content-types',
        template: __webpack_require__("../../../../../src/app/templates/catalog-content_types.html"),
        providers: [content_types_service_1.ContentTypesService]
    }),
    __metadata("design:paramtypes", [typeof (_j = typeof content_types_service_1.ContentTypesService !== "undefined" && content_types_service_1.ContentTypesService) === "function" && _j || Object, typeof (_k = typeof ng_bootstrap_1.NgbActiveModal !== "undefined" && ng_bootstrap_1.NgbActiveModal) === "function" && _k || Object, typeof (_l = typeof ng_bootstrap_1.NgbModal !== "undefined" && ng_bootstrap_1.NgbModal) === "function" && _l || Object, typeof (_m = typeof platform_browser_1.Title !== "undefined" && platform_browser_1.Title) === "function" && _m || Object])
], ContentTypesComponent);
exports.ContentTypesComponent = ContentTypesComponent;
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
//# sourceMappingURL=content-types.component.js.map

/***/ }),

/***/ "../../../../../src/app/field-types.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var http_1 = __webpack_require__("../../../common/@angular/common/http.es5.js");
var platform_browser_1 = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
var ng_bootstrap_1 = __webpack_require__("../../../../@ng-bootstrap/ng-bootstrap/index.js");
var forms_1 = __webpack_require__("../../../forms/@angular/forms.es5.js");
var field_type_model_1 = __webpack_require__("../../../../../src/app/models/field-type.model.ts");
var field_type_property_model_1 = __webpack_require__("../../../../../src/app/models/field-type-property.model.ts");
var data_service_abstract_1 = __webpack_require__("../../../../../src/app/services/data-service.abstract.ts");
var system_name_service_1 = __webpack_require__("../../../../../src/app/services/system-name.service.ts");
var page_table_abstract_1 = __webpack_require__("../../../../../src/app/page-table.abstract.ts");
var modal_abstract_1 = __webpack_require__("../../../../../src/app/modal.abstract.ts");
var FieldTypesService = (function (_super) {
    __extends(FieldTypesService, _super);
    function FieldTypesService(http) {
        var _this = _super.call(this, http) || this;
        _this.setRequestUrl('admin/field_types');
        return _this;
    }
    return FieldTypesService;
}(data_service_abstract_1.DataService));
FieldTypesService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof http_1.HttpClient !== "undefined" && http_1.HttpClient) === "function" && _a || Object])
], FieldTypesService);
exports.FieldTypesService = FieldTypesService;
var FieldTypeModalContent = (function (_super) {
    __extends(FieldTypeModalContent, _super);
    function FieldTypeModalContent(fb, dataService, systemNameService, activeModal, tooltipConfig) {
        var _this = _super.call(this, fb, dataService, systemNameService, activeModal, tooltipConfig) || this;
        _this.model = new field_type_model_1.FieldType(0, '', '', '', true, [], []);
        _this.formFields = {
            title: {
                value: '',
                validators: [forms_1.Validators.required],
                messages: {
                    required: 'Title is required.'
                }
            },
            name: {
                value: '',
                validators: [forms_1.Validators.required, forms_1.Validators.pattern('[A-Za-z0-9_-]+')],
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
        this.model[type].push(new field_type_property_model_1.FieldTypeProperty('', '', ''));
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
            console.log(res);
            // if(res.success){
            //     this.closeModal();
            // } else {
            //     if(res.msg){
            //         this.submitted = false;
            //         this.errorMessage = res.msg;
            //     }
            // }
        };
        //observer: PartialObserver
        if (this.model.id) {
            this.dataService.update(this.model).subscribe(callback.bind(this));
        }
        else {
            this.dataService.create(this.model).subscribe(callback.bind(this));
        }
    };
    return FieldTypeModalContent;
}(modal_abstract_1.ModalContentAbstractComponent));
FieldTypeModalContent = __decorate([
    core_1.Component({
        selector: 'field-type-modal-content',
        template: __webpack_require__("../../../../../src/app/templates/modal-field_type.html"),
        providers: [FieldTypesService, system_name_service_1.SystemNameService]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof forms_1.FormBuilder !== "undefined" && forms_1.FormBuilder) === "function" && _b || Object, FieldTypesService, typeof (_c = typeof system_name_service_1.SystemNameService !== "undefined" && system_name_service_1.SystemNameService) === "function" && _c || Object, typeof (_d = typeof ng_bootstrap_1.NgbActiveModal !== "undefined" && ng_bootstrap_1.NgbActiveModal) === "function" && _d || Object, typeof (_e = typeof ng_bootstrap_1.NgbTooltipConfig !== "undefined" && ng_bootstrap_1.NgbTooltipConfig) === "function" && _e || Object])
], FieldTypeModalContent);
exports.FieldTypeModalContent = FieldTypeModalContent;
var FieldTypesComponent = (function (_super) {
    __extends(FieldTypesComponent, _super);
    function FieldTypesComponent(dataService, activeModal, modalService, titleService) {
        var _this = _super.call(this, dataService, activeModal, modalService, titleService) || this;
        _this.title = 'Field types';
        _this.tableFields = [
            {
                name: 'id',
                title: 'ID',
                outputType: 'text',
                outputProperties: {}
            },
            {
                name: 'title',
                title: 'Название',
                outputType: 'text',
                outputProperties: {}
            },
            {
                name: 'name',
                title: 'Системное имя',
                outputType: 'text',
                outputProperties: {}
            },
            {
                name: 'isActive',
                title: 'Статус',
                outputType: 'boolean',
                outputProperties: {}
            }
        ];
        return _this;
    }
    FieldTypesComponent.prototype.getModalContent = function () {
        return FieldTypeModalContent;
    };
    return FieldTypesComponent;
}(page_table_abstract_1.PageTableAbstractComponent));
FieldTypesComponent = __decorate([
    core_1.Component({
        selector: 'shk-field-types',
        template: __webpack_require__("../../../../../src/app/templates/catalog-field_types.html"),
        providers: [FieldTypesService]
    }),
    __metadata("design:paramtypes", [FieldTypesService, typeof (_f = typeof ng_bootstrap_1.NgbActiveModal !== "undefined" && ng_bootstrap_1.NgbActiveModal) === "function" && _f || Object, typeof (_g = typeof ng_bootstrap_1.NgbModal !== "undefined" && ng_bootstrap_1.NgbModal) === "function" && _g || Object, typeof (_h = typeof platform_browser_1.Title !== "undefined" && platform_browser_1.Title) === "function" && _h || Object])
], FieldTypesComponent);
exports.FieldTypesComponent = FieldTypesComponent;
var _a, _b, _c, _d, _e, _f, _g, _h;
//# sourceMappingURL=field-types.component.js.map

/***/ }),

/***/ "../../../../../src/app/i18n-providers.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var messages_ru_1 = __webpack_require__("../../../../../locale/messages.ru.ts");
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
        { provide: core_1.TRANSLATIONS, useValue: translations },
        { provide: core_1.TRANSLATIONS_FORMAT, useValue: 'xlf' },
        { provide: core_1.LOCALE_ID, useValue: locale }
    ]; })
        .catch(function () { return noProviders; }); // ignore if file not found
}
exports.getTranslationProviders = getTranslationProviders;
function getTranslations(locale) {
    var translation;
    switch (locale) {
        case 'ru':
        case 'ru-RU':
            translation = messages_ru_1.TRANSLATION_RU;
            break;
    }
    return Promise.resolve(translation);
}
//# sourceMappingURL=i18n-providers.js.map

/***/ }),

/***/ "../../../../../src/app/list-recursive.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var _ = __webpack_require__("../../../../lodash/lodash.js");
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
            if (item.id !== item.parentId && item.parentId === parentId) {
                items.push(item);
            }
        });
        this.updateParentsIds();
    };
    /**
     * Update parents ids
     */
    ListRecursiveComponent.prototype.updateParentsIds = function () {
        var index = _.findIndex(this.inputItems, { id: this.currentId });
        this.currentParentsIds = [];
        if (index === -1) {
            return;
        }
        this.currentParentsIds = this.getParentIds(this.inputItems[index].parentId);
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
            var index = _.findIndex(this.inputItems, { id: parentId });
            if (index === -1) {
                return parentIds;
            }
            return this.getParentIds(this.inputItems[index].parentId, parentIds);
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
    core_1.Input(),
    __metadata("design:type", Array)
], ListRecursiveComponent.prototype, "inputItems", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], ListRecursiveComponent.prototype, "items", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], ListRecursiveComponent.prototype, "parentId", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], ListRecursiveComponent.prototype, "currentId", void 0);
ListRecursiveComponent = __decorate([
    core_1.Component({
        selector: 'list-recursive',
        template: "\n        <ul>\n            <li *ngFor=\"let item of items\">\n                <a class=\"dropdown-item\">\n                    {{item.title}}\n                </a>\n                <list-recursive [inputItems]=\"inputItems\" [parentId]=\"item.id\" [currentId]=\"currentId\"></list-recursive>\n            </li>\n        </ul>\n    "
    })
], ListRecursiveComponent);
exports.ListRecursiveComponent = ListRecursiveComponent;
//# sourceMappingURL=list-recursive.component.js.map

/***/ }),

/***/ "../../../../../src/app/modal.abstract.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var forms_1 = __webpack_require__("../../../forms/@angular/forms.es5.js");
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
        this.files = {};
        tooltipConfig.placement = 'bottom';
        tooltipConfig.container = 'body';
        tooltipConfig.triggers = 'hover click';
    }
    ModalContentAbstractComponent.prototype.ngOnInit = function () {
        this.buildForm();
        if (this.isEditMode || this.isItemCopy) {
            this.getModelData();
        }
    };
    ModalContentAbstractComponent.prototype.getSystemFieldName = function () {
        return 'name';
    };
    ModalContentAbstractComponent.prototype.getModelData = function () {
        var _this = this;
        this.loading = true;
        this.dataService.getItem(this.itemId)
            .subscribe(function (data) {
            if (_this.isItemCopy) {
                data.id = null;
                data[_this.getSystemFieldName()] = '';
            }
            _this.model = data;
            _this.loading = false;
        }, function (err) {
            _this.errorMessage = err;
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
            controls[key] = new forms_1.FormControl({
                value: this[modelName][key] || '',
                disabled: opts.disabled || false
            }, opts.validators);
            this.formErrors[keyPrefix + key] = '';
            this.validationMessages[keyPrefix + key] = opts.messages;
        }
        return controls;
    };
    ModalContentAbstractComponent.prototype.getControl = function (name) {
        return this.form.controls['name'];
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
                    else {
                        this.formErrors[keyPrefix + fieldName] += 'Error. ';
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
    ModalContentAbstractComponent.prototype.close = function (e) {
        e.preventDefault();
        this.activeModal.dismiss('canceled');
    };
    /** Submit form */
    ModalContentAbstractComponent.prototype.onSubmit = function () {
        this.submitted = true;
        this.closeModal();
    };
    return ModalContentAbstractComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ModalContentAbstractComponent.prototype, "modalTitle", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], ModalContentAbstractComponent.prototype, "itemId", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], ModalContentAbstractComponent.prototype, "isItemCopy", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], ModalContentAbstractComponent.prototype, "isEditMode", void 0);
exports.ModalContentAbstractComponent = ModalContentAbstractComponent;
//# sourceMappingURL=modal.abstract.js.map

/***/ }),

/***/ "../../../../../src/app/models/category.model.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Category = (function () {
    function Category(id, isFolder, parentId, name, title, description, contentTypeName, isActive) {
        this.id = id;
        this.isFolder = isFolder;
        this.parentId = parentId;
        this.name = name;
        this.title = title;
        this.description = description;
        this.contentTypeName = contentTypeName;
        this.isActive = isActive;
    }
    return Category;
}());
exports.Category = Category;
//# sourceMappingURL=category.model.js.map

/***/ }),

/***/ "../../../../../src/app/models/content_field.model.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ContentField = (function () {
    function ContentField(id, name, title, description, inputType, inputProperties, outputType, outputProperties, group, required, isFilter, showInTable, options) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.description = description;
        this.inputType = inputType;
        this.inputProperties = inputProperties;
        this.outputType = outputType;
        this.outputProperties = outputProperties;
        this.group = group;
        this.required = required;
        this.isFilter = isFilter;
        this.showInTable = showInTable;
        this.options = options;
    }
    return ContentField;
}());
exports.ContentField = ContentField;
//# sourceMappingURL=content_field.model.js.map

/***/ }),

/***/ "../../../../../src/app/models/content_type.model.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ContentType = (function () {
    function ContentType(id, name, title, description, collection, fields, groups, isActive) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.description = description;
        this.collection = collection;
        this.fields = fields;
        this.groups = groups;
        this.isActive = isActive;
    }
    return ContentType;
}());
exports.ContentType = ContentType;
//# sourceMappingURL=content_type.model.js.map

/***/ }),

/***/ "../../../../../src/app/models/field-type-property.model.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var FieldTypeProperty = (function () {
    function FieldTypeProperty(name, title, default_value) {
        this.name = name;
        this.title = title;
        this.default_value = default_value;
    }
    return FieldTypeProperty;
}());
exports.FieldTypeProperty = FieldTypeProperty;
//# sourceMappingURL=field-type-property.model.js.map

/***/ }),

/***/ "../../../../../src/app/models/field-type.model.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
exports.FieldType = FieldType;
//# sourceMappingURL=field-type.model.js.map

/***/ }),

/***/ "../../../../../src/app/models/multivalues.model.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MultiValues = (function () {
    function MultiValues(values, checked) {
        this.values = values;
        this.checked = checked;
    }
    return MultiValues;
}());
exports.MultiValues = MultiValues;
//# sourceMappingURL=multivalues.model.js.map

/***/ }),

/***/ "../../../../../src/app/models/query-options.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
exports.QueryOptions = QueryOptions;
//# sourceMappingURL=query-options.js.map

/***/ }),

/***/ "../../../../../src/app/not-found.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var NotFoundComponent = (function () {
    function NotFoundComponent() {
    }
    return NotFoundComponent;
}());
NotFoundComponent = __decorate([
    core_1.Component({
        selector: 'not-found-app',
        template: "<h3 class=\"mt-3\">Page not found.</h3>"
    })
], NotFoundComponent);
exports.NotFoundComponent = NotFoundComponent;
//# sourceMappingURL=not-found.component.js.map

/***/ }),

/***/ "../../../../../src/app/orders.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var platform_browser_1 = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
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
    core_1.Component({
        selector: 'shk-settings',
        template: __webpack_require__("../../../../../src/app/templates/page-orders.html")
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof platform_browser_1.Title !== "undefined" && platform_browser_1.Title) === "function" && _a || Object])
], OrdersComponent);
exports.OrdersComponent = OrdersComponent;
var _a;
//# sourceMappingURL=orders.component.js.map

/***/ }),

/***/ "../../../../../src/app/page-table.abstract.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var query_options_1 = __webpack_require__("../../../../../src/app/models/query-options.ts");
var app_component_1 = __webpack_require__("../../../../../src/app/app.component.ts");
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
        this.queryOptions = new query_options_1.QueryOptions('name', 'asc', 1, 10, 0, 0);
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
        this.modalRef = this.modalService.open(this.getModalContent(), { size: 'lg', backdrop: 'static' });
        this.setModalInputs(itemId, isItemCopy);
        this.modalRef.result.then(function (result) {
            _this.getList();
        }, function (reason) {
            //console.log( 'reason', reason );
        });
    };
    PageTableAbstractComponent.prototype.setModalInputs = function (itemId, isItemCopy) {
        if (isItemCopy === void 0) { isItemCopy = false; }
        var isEditMode = typeof itemId !== 'undefined' && !isItemCopy;
        this.modalRef.componentInstance.modalTitle = isEditMode ? 'Edit' : 'Add';
        this.modalRef.componentInstance.itemId = itemId || 0;
        this.modalRef.componentInstance.isItemCopy = isItemCopy || false;
        this.modalRef.componentInstance.isEditMode = isEditMode;
    };
    PageTableAbstractComponent.prototype.deleteItemConfirm = function (itemId) {
        var _this = this;
        this.modalRef = this.modalService.open(app_component_1.ConfirmModalContent);
        this.modalRef.componentInstance.modalTitle = 'Confirm';
        this.modalRef.componentInstance.modalContent = 'Are you sure you want to remove this item?';
        this.modalRef.result.then(function (result) {
            if (result == 'accept') {
                _this.deleteItem(itemId);
            }
        });
    };
    PageTableAbstractComponent.prototype.confirmAction = function (message) {
        this.modalRef = this.modalService.open(app_component_1.ConfirmModalContent);
        this.modalRef.componentInstance.modalTitle = 'Confirm';
        this.modalRef.componentInstance.modalContent = message;
        return this.modalRef.result;
    };
    PageTableAbstractComponent.prototype.blockSelected = function () {
        if (this.selectedIds.length === 0) {
            this.showAlert('Nothing is selected.');
            return;
        }
        console.log('blockSelected', this.selectedIds);
    };
    PageTableAbstractComponent.prototype.deleteSelected = function () {
        var _this = this;
        if (this.selectedIds.length === 0) {
            this.showAlert('Nothing is selected.');
            return;
        }
        this.confirmAction('Are you sure you want to delete all selected items?')
            .then(function (result) {
            if (result == 'accept') {
                _this.dataService.deleteByArray(_this.selectedIds)
                    .subscribe(function (res) {
                    _this.getList();
                }, function (err) { return _this.showAlert(err); });
            }
        });
    };
    PageTableAbstractComponent.prototype.showAlert = function (message) {
        this.modalRef = this.modalService.open(app_component_1.AlertModalContent);
        this.modalRef.componentInstance.modalContent = message;
        this.modalRef.componentInstance.modalTitle = 'Error';
        this.modalRef.componentInstance.messageType = 'error';
    };
    PageTableAbstractComponent.prototype.deleteItem = function (itemId) {
        var _this = this;
        this.confirmAction('Are you sure you want to remove this item?')
            .then(function (result) {
            if (result == 'accept') {
                _this.dataService.deleteItem(itemId)
                    .subscribe(function (res) {
                    _this.getList();
                }, function (err) {
                    _this.showAlert(err);
                });
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
                this.deleteItem(actionValue[1]);
                break;
            case 'changeQuery':
                this.getList();
                break;
        }
    };
    PageTableAbstractComponent.prototype.getList = function () {
        var _this = this;
        this.loading = true;
        this.dataService.getListPage(this.queryOptions)
            .subscribe(function (data) {
            _this.items = data.items;
            _this.collectionSize = data.total;
            _this.loading = false;
        }, function (error) { return _this.errorMessage = error; });
    };
    return PageTableAbstractComponent;
}());
exports.PageTableAbstractComponent = PageTableAbstractComponent;
//# sourceMappingURL=page-table.abstract.js.map

/***/ }),

/***/ "../../../../../src/app/pipes/filter-array-pipe.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
// Filter Array of Objects
var FilterArrayPipe = (function () {
    function FilterArrayPipe() {
    }
    FilterArrayPipe.prototype.transform = function (value, filter) {
        if (filter && Array.isArray(value)) {
            var filterKeys_1 = Object.keys(filter);
            return value.filter(function (item) {
                return filterKeys_1.reduce(function (memo, keyName) {
                    return memo && item[keyName] === filter[keyName];
                }, true);
            });
        }
        else {
            return value;
        }
    };
    return FilterArrayPipe;
}());
FilterArrayPipe = __decorate([
    core_1.Pipe({
        name: 'filter',
        pure: false
    })
], FilterArrayPipe);
exports.FilterArrayPipe = FilterArrayPipe;
//# sourceMappingURL=filter-array-pipe.js.map

/***/ }),

/***/ "../../../../../src/app/pipes/filter-field-by-group.pipe.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var FilterFieldByGroup = (function () {
    function FilterFieldByGroup() {
    }
    FilterFieldByGroup.prototype.transform = function (allFields, groupName) {
        return allFields.filter(function (field) { return field.group == groupName; });
    };
    return FilterFieldByGroup;
}());
FilterFieldByGroup = __decorate([
    core_1.Pipe({ name: 'filterFieldByGroup' })
], FilterFieldByGroup);
exports.FilterFieldByGroup = FilterFieldByGroup;
//# sourceMappingURL=filter-field-by-group.pipe.js.map

/***/ }),

/***/ "../../../../../src/app/pipes/orderby.pipe.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
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
    core_1.Pipe({ name: 'orderBy', pure: false })
], OrderByPipe);
exports.OrderByPipe = OrderByPipe;
exports.ORDERBY_PROVIDERS = [
    OrderByPipe
];
var OrderByPipe_1;
//# sourceMappingURL=orderby.pipe.js.map

/***/ }),

/***/ "../../../../../src/app/product.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var ng_bootstrap_1 = __webpack_require__("../../../../@ng-bootstrap/ng-bootstrap/index.js");
var forms_1 = __webpack_require__("../../../forms/@angular/forms.es5.js");
var _ = __webpack_require__("../../../../lodash/lodash.js");
var content_type_model_1 = __webpack_require__("../../../../../src/app/models/content_type.model.ts");
var category_model_1 = __webpack_require__("../../../../../src/app/models/category.model.ts");
var modal_abstract_1 = __webpack_require__("../../../../../src/app/modal.abstract.ts");
var categories_service_1 = __webpack_require__("../../../../../src/app/services/categories.service.ts");
var content_types_service_1 = __webpack_require__("../../../../../src/app/services/content_types.service.ts");
var products_service_1 = __webpack_require__("../../../../../src/app/services/products.service.ts");
var system_name_service_1 = __webpack_require__("../../../../../src/app/services/system-name.service.ts");
var ProductModalContent = (function (_super) {
    __extends(ProductModalContent, _super);
    function ProductModalContent(fb, dataService, systemNameService, activeModal, tooltipConfig, contentTypesService, categoriesService) {
        var _this = _super.call(this, fb, dataService, systemNameService, activeModal, tooltipConfig) || this;
        _this.fb = fb;
        _this.dataService = dataService;
        _this.systemNameService = systemNameService;
        _this.activeModal = activeModal;
        _this.tooltipConfig = tooltipConfig;
        _this.contentTypesService = contentTypesService;
        _this.categoriesService = categoriesService;
        _this.categories = [];
        _this.contentTypes = [];
        _this.currentContentType = new content_type_model_1.ContentType(0, '', '', '', '', [], [], true);
        _this.model = {};
        _this.formFields = {
            parentId: {
                value: 0,
                validators: [forms_1.Validators.required],
                messages: {
                    required: 'Category is required.'
                }
            },
            isActive: {
                value: true,
                validators: [],
                messages: {}
            }
        };
        _this.model.id = 0;
        _this.model.parentId = 0;
        return _this;
    }
    ProductModalContent.prototype.ngOnInit = function () {
        var _this = this;
        this.model.parentId = this.category.id;
        this.dataService.setRequestUrl('admin/products/' + this.category.id);
        this.buildForm();
        this.getCategories();
        this.getContentType()
            .subscribe(function () {
            if (_this.itemId) {
                _this.getModelData();
            }
        }, function (msg) {
            _this.errorMessage = msg;
        });
    };
    ProductModalContent.prototype.getSystemFieldName = function () {
        var index = _.findIndex(this.currentContentType.fields, { inputType: 'system_name' });
        return index > -1 ? this.currentContentType.fields[index].name : 'name';
    };
    ProductModalContent.prototype.getCategories = function () {
        var _this = this;
        this.loading = true;
        this.categoriesService.getList()
            .subscribe(function (data) {
            _this.categories = data;
            _this.loading = false;
        }, function (err) {
            _this.errorMessage = err;
        });
    };
    ProductModalContent.prototype.getContentType = function () {
        if (!this.category.contentTypeName) {
            // return Promise.reject('Content type name not found.');
        }
        this.loading = true;
        return this.contentTypesService.getItemByName(this.category.contentTypeName);
        // .subscribe((data) => {
        //     this.currentContentType = data as ContentType;
        //     this.errorMessage = '';
        //     this.updateForm();
        //     this.loading = false;
        // }, (err) => {
        //     this.errorMessage = err;
        // });
    };
    ProductModalContent.prototype.updateForm = function (data) {
        if (!data) {
            data = _.clone(this.model);
        }
        var newKeys = _.map(this.currentContentType.fields, function (field) {
            return field.name;
        });
        newKeys.push('parentId', 'isActive');
        //Remove keys
        for (var key in this.form.controls) {
            if (this.form.controls.hasOwnProperty(key)) {
                if (newKeys.indexOf(key) === -1) {
                    this.form.removeControl(key);
                }
            }
        }
        this.model = _.pick(data, newKeys);
    };
    ProductModalContent.prototype.onChangeContentType = function () {
        var parentId = parseInt(String(this.model.parentId));
        var index = _.findIndex(this.categories, { id: parentId });
        if (index == -1) {
            return;
        }
        this.category = _.clone(this.categories[index]);
        this.getContentType();
    };
    ProductModalContent.prototype.saveFiles = function (itemId) {
        console.log('SAVE FILES', this.files, itemId);
        var formData = new FormData();
        for (var key in this.files) {
            if (this.files.hasOwnProperty(key) && this.files[key] instanceof File) {
                formData.append(key, this.files[key], this.files[key].name);
            }
        }
        // TODO: Save files
    };
    ProductModalContent.prototype.save = function () {
        this.submitted = true;
        if (!this.form.valid) {
            this.onValueChanged('form');
            this.submitted = false;
            return;
        }
        this.dataService.setRequestUrl('admin/products/' + this.category.id);
        var callback = function (res) {
            if (res.success) {
                if (!_.isEmpty(this.files) && res.data._id) {
                    this.saveFiles(res.data._id);
                }
                else {
                    this.closeModal();
                }
            }
            else {
                if (res.msg) {
                    this.submitted = false;
                    this.errorMessage = res.msg;
                }
            }
        };
        if (this.model.id) {
            // this.dataService.update(this.model).then(callback.bind(this));
        }
        else {
            // this.dataService.create(this.model).then(callback.bind(this));
        }
    };
    return ProductModalContent;
}(modal_abstract_1.ModalContentAbstractComponent));
__decorate([
    core_1.Input(),
    __metadata("design:type", typeof (_a = typeof category_model_1.Category !== "undefined" && category_model_1.Category) === "function" && _a || Object)
], ProductModalContent.prototype, "category", void 0);
ProductModalContent = __decorate([
    core_1.Component({
        selector: 'product-modal-content',
        template: __webpack_require__("../../../../../src/app/templates/modal-product.html"),
        providers: [system_name_service_1.SystemNameService]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof forms_1.FormBuilder !== "undefined" && forms_1.FormBuilder) === "function" && _b || Object, typeof (_c = typeof products_service_1.ProductsService !== "undefined" && products_service_1.ProductsService) === "function" && _c || Object, typeof (_d = typeof system_name_service_1.SystemNameService !== "undefined" && system_name_service_1.SystemNameService) === "function" && _d || Object, typeof (_e = typeof ng_bootstrap_1.NgbActiveModal !== "undefined" && ng_bootstrap_1.NgbActiveModal) === "function" && _e || Object, typeof (_f = typeof ng_bootstrap_1.NgbTooltipConfig !== "undefined" && ng_bootstrap_1.NgbTooltipConfig) === "function" && _f || Object, typeof (_g = typeof content_types_service_1.ContentTypesService !== "undefined" && content_types_service_1.ContentTypesService) === "function" && _g || Object, typeof (_h = typeof categories_service_1.CategoriesService !== "undefined" && categories_service_1.CategoriesService) === "function" && _h || Object])
], ProductModalContent);
exports.ProductModalContent = ProductModalContent;
var _a, _b, _c, _d, _e, _f, _g, _h;
//# sourceMappingURL=product.component.js.map

/***/ }),

/***/ "../../../../../src/app/render-input-field.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var forms_1 = __webpack_require__("../../../forms/@angular/forms.es5.js");
var _ = __webpack_require__("../../../../lodash/lodash.js");
var isNumeric_1 = __webpack_require__("../../../../rxjs/_esm5/util/isNumeric.js");
var system_name_service_1 = __webpack_require__("../../../../../src/app/services/system-name.service.ts");
var multivalues_model_1 = __webpack_require__("../../../../../src/app/models/multivalues.model.ts");
var InputFieldRenderComponent = (function () {
    function InputFieldRenderComponent(changeDetectionRef, systemNameService) {
        this.changeDetectionRef = changeDetectionRef;
        this.systemNameService = systemNameService;
        this.selectedItems = {};
        this.files = {};
        this.fieldsMultivalues = {};
        this.submitted = false;
        this.calendarLocale = {
            en: {
                firstDayOfWeek: 0,
                dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                today: 'Today',
                clear: 'Clear'
            },
            ru: {
                firstDayOfWeek: 1,
                dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
                dayNamesShort: ['Вос', 'Пон', 'Втор', 'Среда', 'Чет', 'Пятн', 'Суб'],
                dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                monthNamesShort: ['Янв', 'Февр', 'Мар', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
                today: 'Сегодня',
                clear: 'Сбросить'
            }
        };
    }
    InputFieldRenderComponent.prototype.ngOnInit = function () {
        this.buildControls();
    };
    InputFieldRenderComponent.prototype.ngOnChanges = function (changes) {
        this.buildControls();
    };
    InputFieldRenderComponent.prototype.buildControls = function () {
        this.fields.forEach(function (field) {
            this.setFieldProperties(field);
            this.setFieldOptions(field);
            this.setValue(field);
            this.formErrors[field.name] = '';
            if (!this.validationMessages[field.name]) {
                this.validationMessages[field.name] = {};
            }
            if (!this.form.controls[field.name]) {
                var validators = this.getValidators(field);
                var control = new forms_1.FormControl(this.model[field.name], validators);
                this.form.addControl(field.name, control);
            }
        }.bind(this));
        this.changeDetectionRef.detectChanges();
    };
    InputFieldRenderComponent.prototype.setFieldProperties = function (field) {
        var propertiesDefault;
        switch (field.inputType) {
            case 'number':
                propertiesDefault = {
                    handler: '',
                    min: null,
                    max: null,
                    step: 1
                };
                field.inputProperties = this.extendProperties(field.inputProperties, propertiesDefault);
                break;
            case 'date':
                propertiesDefault = {
                    handler: '',
                    format: 'mm/dd/yy',
                    show_time: 0,
                    hour_format: 24,
                    locale: 'en'
                };
                field.inputProperties = this.extendProperties(field.inputProperties, propertiesDefault);
                break;
            case 'rich_text':
                propertiesDefault = {
                    handler: '',
                    formats: 'background,bold,color,font,code,italic,link,strike,script,underline,blockquote,header,indent,list,align,direction,code-block,formula,image,video,clean'
                };
                field.inputProperties = this.extendProperties(field.inputProperties, propertiesDefault);
                field.inputProperties.formats = String(field.inputProperties.formats).split(',');
                break;
            default:
                break;
        }
    };
    InputFieldRenderComponent.prototype.setFieldOptions = function (field) {
        var _this = this;
        field.options = [];
        var valueArr;
        switch (field.inputType) {
            case 'radio':
            case 'select':
                valueArr = field.inputProperties.values_list
                    ? String(field.inputProperties.values_list).split('||')
                    : [];
                valueArr.forEach(function (optStr, index) {
                    var opts = optStr.split('==');
                    if (!opts[1]) {
                        opts[1] = opts[0];
                    }
                    field.options.push(_.zipObject(['title', 'value'], opts));
                });
                break;
            case 'checkbox':
                valueArr = field.inputProperties.values_list
                    ? String(field.inputProperties.values_list).split('||')
                    : [];
                if (!_.isArray(this.model[field.name])) {
                    this.model[field.name] = [];
                }
                this.fieldsMultivalues[field.name] = new multivalues_model_1.MultiValues([], []);
                valueArr.forEach(function (optStr, index) {
                    var opts = optStr.split('==');
                    if (!opts[1]) {
                        opts[1] = opts[0];
                    }
                    field.options.push(_.zipObject(['title', 'value'], opts));
                    _this.fieldsMultivalues[field.name].values.push(opts[1]);
                    _this.fieldsMultivalues[field.name].checked.push(_this.model[field.name].indexOf(opts[1]) > -1);
                });
                break;
        }
    };
    InputFieldRenderComponent.prototype.setValue = function (field) {
        var defaultValue = null, modelValue = this.model[field.name] || null;
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
                defaultValue = parseInt(String(defaultValue));
                break;
            case 'tags':
            case 'checkbox':
                defaultValue = defaultValue ? defaultValue.split('||') : [];
                break;
        }
        this.model[field.name] = modelValue || defaultValue;
    };
    InputFieldRenderComponent.prototype.selectValue = function (e, fieldName, value) {
        if (!_.isArray(this.model[fieldName])) {
            this.model[fieldName] = [];
        }
        var valIndex = this.fieldsMultivalues[fieldName].values.indexOf(value);
        if (valIndex === -1) {
            return;
        }
        if (e.target.checked) {
            this.model[fieldName].push(value);
            this.fieldsMultivalues[fieldName].checked[valIndex] = true;
        }
        else {
            this.model[fieldName].splice(this.model[fieldName].indexOf(value), 1);
            this.fieldsMultivalues[fieldName].checked[valIndex] = false;
        }
    };
    InputFieldRenderComponent.prototype.getValidators = function (field) {
        var validators = [];
        if (field.required) {
            validators.push(forms_1.Validators.required);
            this.validationMessages[field.name].required = field.title + ' is required.';
        }
        return validators;
    };
    InputFieldRenderComponent.prototype.extendProperties = function (object1, object2) {
        object1 = _.extend({}, object2, object1);
        for (var key in object1) {
            if (object1.hasOwnProperty(key)) {
                if (isNumeric_1.isNumeric(object1[key])) {
                    object1[key] = parseInt(String(object1[key]));
                }
            }
        }
        return object1;
    };
    InputFieldRenderComponent.prototype.generateName = function (field) {
        var sourceFieldName = field.inputProperties.source_field
            ? String(field.inputProperties.source_field)
            : 'title';
        var title = this.model[sourceFieldName] || '';
        this.model[field.name] = this.systemNameService.generateName(title);
        this.changeDetectionRef.detectChanges();
    };
    InputFieldRenderComponent.prototype.fileChange = function (event, fieldName, imgPreviewEl) {
        var fileList = event.target.files;
        if (fileList.length > 0) {
            this.form.controls[fieldName].setValue(fileList[0].name);
            this.selectedItems[fieldName] = fileList[0].name;
            this.files[fieldName] = fileList[0];
            if (imgPreviewEl) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var fr = e.target;
                    imgPreviewEl.src = fr.result;
                    imgPreviewEl.style.display = 'block';
                };
                reader.readAsDataURL(fileList[0]);
            }
        }
    };
    InputFieldRenderComponent.prototype.fileClear = function (fieldName, imgPreviewEl) {
        this.model[fieldName] = null;
        this.form.controls[fieldName].reset(null);
        delete this.selectedItems[fieldName];
        delete this.files[fieldName];
        if (imgPreviewEl) {
            imgPreviewEl.src = '';
            imgPreviewEl.style.display = 'none';
        }
    };
    return InputFieldRenderComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], InputFieldRenderComponent.prototype, "fields", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], InputFieldRenderComponent.prototype, "groups", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], InputFieldRenderComponent.prototype, "model", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", typeof (_a = typeof forms_1.FormGroup !== "undefined" && forms_1.FormGroup) === "function" && _a || Object)
], InputFieldRenderComponent.prototype, "form", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], InputFieldRenderComponent.prototype, "formErrors", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], InputFieldRenderComponent.prototype, "validationMessages", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], InputFieldRenderComponent.prototype, "selectedItems", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], InputFieldRenderComponent.prototype, "files", void 0);
InputFieldRenderComponent = __decorate([
    core_1.Component({
        selector: 'input-field-renderer',
        template: __webpack_require__("../../../../../src/app/templates/render-input-field.html"),
        providers: [system_name_service_1.SystemNameService]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof core_1.ChangeDetectorRef !== "undefined" && core_1.ChangeDetectorRef) === "function" && _b || Object, typeof (_c = typeof system_name_service_1.SystemNameService !== "undefined" && system_name_service_1.SystemNameService) === "function" && _c || Object])
], InputFieldRenderComponent);
exports.InputFieldRenderComponent = InputFieldRenderComponent;
var _a, _b, _c;
//# sourceMappingURL=render-input-field.js.map

/***/ }),

/***/ "../../../../../src/app/render-output-field.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var OutputFieldComponent = (function () {
    function OutputFieldComponent() {
    }
    OutputFieldComponent.prototype.ngOnInit = function () {
        //console.log(this.options);
    };
    return OutputFieldComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], OutputFieldComponent.prototype, "value", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], OutputFieldComponent.prototype, "outputType", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], OutputFieldComponent.prototype, "options", void 0);
OutputFieldComponent = __decorate([
    core_1.Component({
        selector: 'output-field',
        template: __webpack_require__("../../../../../src/app/templates/render-output-field.html"),
        providers: []
    }),
    __metadata("design:paramtypes", [])
], OutputFieldComponent);
exports.OutputFieldComponent = OutputFieldComponent;
//# sourceMappingURL=render-output-field.js.map

/***/ }),

/***/ "../../../../../src/app/services/categories.service.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var http_1 = __webpack_require__("../../../common/@angular/common/http.es5.js");
var data_service_abstract_1 = __webpack_require__("../../../../../src/app/services/data-service.abstract.ts");
__webpack_require__("../../../../rxjs/_esm5/add/operator/toPromise.js");
__webpack_require__("../../../../rxjs/_esm5/add/operator/catch.js");
__webpack_require__("../../../../rxjs/_esm5/add/operator/map.js");
var CategoriesService = (function (_super) {
    __extends(CategoriesService, _super);
    function CategoriesService(http) {
        var _this = _super.call(this, http) || this;
        _this.setRequestUrl('admin/categories');
        return _this;
    }
    return CategoriesService;
}(data_service_abstract_1.DataService));
CategoriesService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof http_1.HttpClient !== "undefined" && http_1.HttpClient) === "function" && _a || Object])
], CategoriesService);
exports.CategoriesService = CategoriesService;
var _a;
//# sourceMappingURL=categories.service.js.map

/***/ }),

/***/ "../../../../../src/app/services/collections.service.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var http_1 = __webpack_require__("../../../common/@angular/common/http.es5.js");
var data_service_abstract_1 = __webpack_require__("../../../../../src/app/services/data-service.abstract.ts");
var operators_1 = __webpack_require__("../../../../rxjs/_esm5/operators/index.js");
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
            .pipe(operators_1.catchError(this.handleError()));
    };
    return CollectionsService;
}(data_service_abstract_1.DataService));
CollectionsService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof http_1.HttpClient !== "undefined" && http_1.HttpClient) === "function" && _a || Object])
], CollectionsService);
exports.CollectionsService = CollectionsService;
var _a;
//# sourceMappingURL=collections.service.js.map

/***/ }),

/***/ "../../../../../src/app/services/content_types.service.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var http_1 = __webpack_require__("../../../common/@angular/common/http.es5.js");
var operators_1 = __webpack_require__("../../../../rxjs/_esm5/operators/index.js");
var data_service_abstract_1 = __webpack_require__("../../../../../src/app/services/data-service.abstract.ts");
var ContentTypesService = (function (_super) {
    __extends(ContentTypesService, _super);
    function ContentTypesService(http) {
        var _this = _super.call(this, http) || this;
        _this.setRequestUrl('admin/content_types');
        return _this;
    }
    ContentTypesService.prototype.getItemByName = function (name) {
        var url = this.getRequestUrl() + ("/by_name/" + name);
        return this.http.get(url).pipe(operators_1.catchError(this.handleError()));
    };
    return ContentTypesService;
}(data_service_abstract_1.DataService));
ContentTypesService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof http_1.HttpClient !== "undefined" && http_1.HttpClient) === "function" && _a || Object])
], ContentTypesService);
exports.ContentTypesService = ContentTypesService;
var _a;
//# sourceMappingURL=content_types.service.js.map

/***/ }),

/***/ "../../../../../src/app/services/data-service.abstract.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __webpack_require__("../../../common/@angular/common/http.es5.js");
var of_1 = __webpack_require__("../../../../rxjs/_esm5/observable/of.js");
var operators_1 = __webpack_require__("../../../../rxjs/_esm5/operators/index.js");
var DataService = (function () {
    function DataService(http) {
        this.http = http;
        this.headers = new http_1.HttpHeaders({ 'Content-Type': 'application/json' });
        this.requestUrl = '';
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
        return this.http.get(url).pipe(operators_1.catchError(this.handleError()));
    };
    DataService.prototype.getList = function (options) {
        var params = new http_1.HttpParams();
        for (var name in options) {
            if (!options.hasOwnProperty(name)) {
                continue;
            }
            params.set(name, options[name]);
        }
        return this.http.get(this.getRequestUrl(), { params: params })
            .pipe(operators_1.catchError(this.handleError()));
    };
    DataService.prototype.getListPage = function (options) {
        var params = new http_1.HttpParams();
        for (var name in options) {
            if (!options.hasOwnProperty(name)) {
                continue;
            }
            params.set(name, options[name]);
        }
        return this.http.get(this.getRequestUrl(), { params: params })
            .pipe(operators_1.catchError(this.handleError()));
    };
    DataService.prototype.deleteItem = function (id) {
        var url = this.getRequestUrl() + ("/" + id);
        return this.http.delete(url, { headers: this.headers }).pipe(operators_1.catchError(this.handleError()));
    };
    DataService.prototype.deleteByArray = function (idsArray) {
        var url = this.getRequestUrl() + '/batch';
        var params = new http_1.HttpParams();
        params.set('ids', JSON.stringify(idsArray));
        return this.http.delete(url, {
            headers: this.headers,
            params: params
        })
            .pipe(operators_1.catchError(this.handleError()));
    };
    DataService.prototype.create = function (item) {
        return this.http.post(this.getRequestUrl(), item, { headers: this.headers }).pipe(operators_1.catchError(this.handleError()));
    };
    // update(item: any): Promise<any> {
    //     const url = this.getRequestUrl() + `/${item.id}`;
    //     return this.http
    //         .put(url, JSON.stringify(item), {headers: this.headers})
    //         .toPromise()
    //         .then(this.extractData)
    //         .catch(this.handleError);
    // }
    DataService.prototype.update = function (item) {
        var url = this.getRequestUrl() + ("/" + item.id);
        return this.http.put(url, item, { headers: this.headers }).pipe(operators_1.catchError(this.handleError()));
    };
    DataService.prototype.handleError = function (operation, result) {
        if (operation === void 0) { operation = 'operation'; }
        return function (err) {
            if (err.error) {
                throw err.error;
            }
            return of_1.of(result);
        };
    };
    return DataService;
}());
exports.DataService = DataService;
//# sourceMappingURL=data-service.abstract.js.map

/***/ }),

/***/ "../../../../../src/app/services/products.service.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var http_1 = __webpack_require__("../../../common/@angular/common/http.es5.js");
var data_service_abstract_1 = __webpack_require__("../../../../../src/app/services/data-service.abstract.ts");
var ProductsService = (function (_super) {
    __extends(ProductsService, _super);
    function ProductsService(http) {
        var _this = _super.call(this, http) || this;
        _this.setRequestUrl('admin/products');
        return _this;
    }
    return ProductsService;
}(data_service_abstract_1.DataService));
ProductsService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof http_1.HttpClient !== "undefined" && http_1.HttpClient) === "function" && _a || Object])
], ProductsService);
exports.ProductsService = ProductsService;
var _a;
//# sourceMappingURL=products.service.js.map

/***/ }),

/***/ "../../../../../src/app/services/system-name.service.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
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
    core_1.Injectable()
], SystemNameService);
exports.SystemNameService = SystemNameService;
//# sourceMappingURL=system-name.service.js.map

/***/ }),

/***/ "../../../../../src/app/settings.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var platform_browser_1 = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
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
    core_1.Component({
        selector: 'shk-settings',
        template: __webpack_require__("../../../../../src/app/templates/page-settings.html")
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof platform_browser_1.Title !== "undefined" && platform_browser_1.Title) === "function" && _a || Object])
], SettingsComponent);
exports.SettingsComponent = SettingsComponent;
var _a;
//# sourceMappingURL=settings.component.js.map

/***/ }),

/***/ "../../../../../src/app/stat.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var platform_browser_1 = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
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
    core_1.Component({
        selector: 'shk-settings',
        template: __webpack_require__("../../../../../src/app/templates/page-statistics.html")
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof platform_browser_1.Title !== "undefined" && platform_browser_1.Title) === "function" && _a || Object])
], StatisticsComponent);
exports.StatisticsComponent = StatisticsComponent;
var _a;
//# sourceMappingURL=stat.component.js.map

/***/ }),

/***/ "../../../../../src/app/table.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var router_1 = __webpack_require__("../../../router/@angular/router.es5.js");
var query_options_1 = __webpack_require__("../../../../../src/app/models/query-options.ts");
var TableComponent = (function () {
    function TableComponent(router) {
        this.router = router;
        this.selectedIds = [];
        this.actionRequest = new core_1.EventEmitter();
    }
    TableComponent.prototype.ngOnInit = function () {
        this.queryOptions.sort_by = this.tableFields.length > 0
            ? this.tableFields[0].name
            : 'id';
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
        if (event.target.checked) {
            for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
                var item = _a[_i];
                this.selectedIds.push(item.id);
            }
        }
        else {
            this.selectedIds.splice(0);
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
    core_1.Input(),
    __metadata("design:type", Array)
], TableComponent.prototype, "items", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], TableComponent.prototype, "tableFields", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], TableComponent.prototype, "collectionSize", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], TableComponent.prototype, "currentPage", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", typeof (_a = typeof query_options_1.QueryOptions !== "undefined" && query_options_1.QueryOptions) === "function" && _a || Object)
], TableComponent.prototype, "queryOptions", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], TableComponent.prototype, "loading", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], TableComponent.prototype, "selectedIds", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], TableComponent.prototype, "actionRequest", void 0);
TableComponent = __decorate([
    core_1.Component({
        selector: 'cmp-table',
        template: __webpack_require__("../../../../../src/app/templates/cmp-table.html")
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof router_1.Router !== "undefined" && router_1.Router) === "function" && _b || Object])
], TableComponent);
exports.TableComponent = TableComponent;
var _a, _b;
//# sourceMappingURL=table.component.js.map

/***/ }),

/***/ "../../../../../src/app/templates/app.component.html":
/***/ (function(module, exports) {

module.exports = "<div>\n\n    <div class=\"card-navbar\">\n        <div class=\"btn-group\" role=\"group\" aria-label=\"First group\">\n            <a class=\"btn btn-outline-primary\" [routerLink]=\"['/orders']\" routerLinkActive=\"active\">\n                <i class=\"icon-bag\"></i>\n                <span class=\"hidden-xs-down\" i18n>Orders</span>\n            </a>\n            <a class=\"btn btn-outline-primary\" [routerLink]=\"['/statistics']\" routerLinkActive=\"active\">\n                <i class=\"icon-bar-graph-2\"></i>\n                <span class=\"hidden-xs-down\" i18n>Statistics</span>\n            </a>\n            <a class=\"btn btn-outline-primary\" [routerLink]=\"['/catalog']\" routerLinkActive=\"active\">\n                <i class=\"icon-layers\"></i>\n                <span class=\"hidden-xs-down\" i18n>Catalog</span>\n            </a>\n            <a class=\"btn btn-outline-primary\" [routerLink]=\"['/settings']\" routerLinkActive=\"active\">\n                <i class=\"icon-cog\"></i>\n                <span class=\"hidden-xs-down\" i18n>Settings</span>\n            </a>\n        </div>\n    </div>\n\n    <router-outlet></router-outlet>\n\n</div>"

/***/ }),

/***/ "../../../../../src/app/templates/catalog-category.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"mb-3\">\n    <div class=\"float-right\">\n\n        <div ngbDropdown class=\"d-inline-block mr-1\">\n            <button class=\"btn btn-info\" ngbDropdownToggle>\n                Массовые дейсвия\n            </button>\n            <div ngbDropdownMenu>\n                <button class=\"dropdown-item\" (click)=\"blockSelected()\">Отключить / включить</button>\n                <button class=\"dropdown-item\" (click)=\"deleteSelected()\">Удалить</button>\n            </div>\n        </div>\n\n        <button type=\"button\" class=\"btn btn-success d-inline-block btn-wide\" (click)=\"modalOpen()\">\n            <i class=\"icon-plus\"></i>\n            Add\n        </button>\n\n    </div>\n    <div class=\"float-left\">\n\n        <categories-menu (changeRequest)=\"openCategory($event)\"></categories-menu>\n\n    </div>\n    <div class=\"clearfix\"></div>\n</div>\n\n<cmp-table [items]=\"items\" [(selectedIds)]=\"selectedIds\" [collectionSize]=\"collectionSize\" [queryOptions]=\"queryOptions\" [tableFields]=\"tableFields\" [(loading)]=\"loading\" (actionRequest)=\"actionRequest($event)\"></cmp-table>\n"

/***/ }),

/***/ "../../../../../src/app/templates/catalog-content_types.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"mb-3\">\n    <div class=\"float-right\">\n\n        <div ngbDropdown class=\"d-inline-block mr-1\">\n            <button class=\"btn btn-info\" ngbDropdownToggle>\n                Массовые дейсвия\n            </button>\n            <div ngbDropdownMenu>\n                <button class=\"dropdown-item\" (click)=\"blockSelected()\">Отключить / включить</button>\n                <button class=\"dropdown-item\" (click)=\"deleteSelected()\">Удалить</button>\n            </div>\n        </div>\n\n        <button type=\"button\" class=\"btn btn-success d-inline-block btn-wide\" (click)=\"modalOpen()\">\n            <i class=\"icon-plus\"></i>\n            Add\n        </button>\n\n    </div>\n    <div class=\"float-left\">\n        <a class=\"btn btn-outline-secondary\" [routerLink]=\"['/catalog']\">\n            <i class=\"icon-arrow-left\"></i>\n            Каталог\n        </a>\n    </div>\n    <div class=\"clearfix\"></div>\n</div>\n\n<cmp-table [items]=\"items\" [(selectedIds)]=\"selectedIds\" [collectionSize]=\"collectionSize\" [queryOptions]=\"queryOptions\" [tableFields]=\"tableFields\" [(loading)]=\"loading\" (actionRequest)=\"actionRequest($event)\"></cmp-table>\n"

/***/ }),

/***/ "../../../../../src/app/templates/catalog-field_types.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"mb-3\">\n    <div class=\"float-right\">\n\n        <div ngbDropdown class=\"d-inline-block mr-1\">\n            <button class=\"btn btn-info\" ngbDropdownToggle>\n                Массовые дейсвия\n            </button>\n            <div ngbDropdownMenu>\n                <button class=\"dropdown-item\" (click)=\"blockSelected()\">Отключить / включить</button>\n                <button class=\"dropdown-item\" (click)=\"deleteSelected()\">Удалить</button>\n            </div>\n        </div>\n\n        <button type=\"button\" class=\"btn btn-success d-inline-block btn-wide\" (click)=\"modalOpen()\">\n            <i class=\"icon-plus\"></i>\n            Add\n        </button>\n\n    </div>\n\n    <div class=\"float-left\">\n        <a class=\"btn btn-outline-secondary\" [routerLink]=\"['/catalog']\">\n            <i class=\"icon-arrow-left\"></i>\n            Каталог\n        </a>\n    </div>\n    <div class=\"clearfix\"></div>\n</div>\n\n<cmp-table [items]=\"items\" [(selectedIds)]=\"selectedIds\" [collectionSize]=\"collectionSize\" [queryOptions]=\"queryOptions\" [tableFields]=\"tableFields\" [(loading)]=\"loading\" (actionRequest)=\"actionRequest($event)\"></cmp-table>\n"

/***/ }),

/***/ "../../../../../src/app/templates/categories-menu.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"d-inline-block dropdown\">\n    <button class=\"btn btn-secondary dropdown-toggle dropdown-toggle-hover\">\n        <i class=\"icon-folder\"></i>\n        {{currentCategory.title}}\n    </button>\n    <div class=\"dropdown-menu shadow\" #categoriesDropdown>\n        <div class=\"dropdown-header\">\n            <button class=\"btn btn-sm btn-secondary\" ngbTooltip=\"Open root category\" (click)=\"goToRootCategory()\" *ngIf=\"currentCategory.id > 0\">\n                <i class=\"icon-home\"></i>\n            </button>\n            <button type=\"button\" class=\"btn btn-sm btn-secondary\" ngbTooltip=\"Add new category\" (click)=\"openModalCategory()\">\n                <i class=\"icon-plus\"></i>\n            </button>\n            <button type=\"button\" class=\"btn btn-sm btn-secondary\" ngbTooltip=\"Edit current category\" (click)=\"openModalCategory(currentCategory.id)\">\n                <i class=\"icon-pencil\"></i>\n            </button>\n            <button type=\"button\" class=\"btn btn-sm btn-secondary\" ngbTooltip=\"Copy category\" (click)=\"copyCategory()\" [hidden]=\"!currentCategory.id\">\n                <i class=\"icon-stack\"></i>\n            </button>\n            <button type=\"button\" class=\"btn btn-sm btn-secondary\" ngbTooltip=\"Delete current category\" (click)=\"deleteCategoryItemConfirm(currentCategory.id)\" [hidden]=\"!currentCategory.id\">\n                <i class=\"icon-cross\"></i>\n            </button>\n        </div>\n        <div class=\"dropdown-divider\"></div>\n        <div class=\"dropdown-header\" *ngIf=\"categories.length == 0\">\n            No categories.\n        </div>\n\n        <categories-list [inputItems]=\"categories\" [parentId]=\"0\" [currentId]=\"currentCategory.id\"></categories-list>\n\n    </div>\n</div>"

/***/ }),

/***/ "../../../../../src/app/templates/cmp-table.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"table-responsive\" [class.loading]=\"loading\">\n    <table class=\"table table-striped table-divided mb-0\">\n        <thead>\n            <tr>\n                <th class=\"text-left\">\n                    <label class=\"custom-control custom-checkbox\" [hidden]=\"items.length === 0\">\n                        <input type=\"checkbox\" class=\"custom-control-input\" (click)=\"selectAll($event)\">\n                        <span class=\"custom-control-indicator\"></span>\n                    </label>\n                </th>\n                <th *ngFor=\"let tableField of tableFields; let index=index\">\n                    <button type=\"button\" class=\"btn btn-block btn-link\" (click)=\"selectSortBy(tableField.name)\">\n                        {{tableField.title}}\n                        <i [class.icon-arrow-down]=\"queryOptions.sort_dir == 'asc'\" [class.icon-arrow-up]=\"queryOptions.sort_dir == 'desc'\" [style.visibility]=\"tableField.name == queryOptions.sort_by ? 'visible' : 'hidden'\"></i>\n                    </button>\n                </th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr class=\"show-on-hover-parent\" *ngFor=\"let item of items\">\n                <td>\n                    <label class=\"custom-control custom-checkbox\">\n                        <input type=\"checkbox\" class=\"custom-control-input\" [checked]=\"getIsSelected(item.id)\" (click)=\"setSelected($event, item.id)\">\n                        <span class=\"custom-control-indicator\"></span>\n                    </label>\n                </td>\n                <td *ngFor=\"let tableField of tableFields; let index=index\">\n                    <div class=\"relative\" *ngIf=\"index == tableFields.length - 1\">\n                        <div class=\"show-on-hover no-wrap\">\n                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Edit\" (click)=\"action('edit', item.id)\">\n                                <i class=\"icon-pencil\"></i>\n                            </button>\n                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Copy\" (click)=\"action('copy', item.id)\">\n                                <i class=\"icon-stack\"></i>\n                            </button>\n                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Delete\" (click)=\"action('delete', item.id)\">\n                                <i class=\"icon-cross\"></i>\n                            </button>\n                        </div>\n                    </div>\n\n                    <output-field [value]=\"item[tableField.name]\" [outputType]=\"tableField.outputType\" [options]=\"tableField.outputProperties\"></output-field>\n\n                </td>\n            </tr>\n            <tr [hidden]=\"items.length > 0\" class=\"table-active\">\n                <td [attr.colspan]=\"tableFields.length + 1\" class=\"text-center p-4\">\n                    Empty.\n                </td>\n            </tr>\n        </tbody>\n    </table>\n    <div class=\"pt-3\" [hidden]=\"items.length === 0\">\n\n        <div class=\"float-right\">\n            <select class=\"form-control\" [(ngModel)]=\"queryOptions.limit\" (change)=\"pageChange()\">\n                <option value=\"10\">10</option>\n                <option value=\"20\">20</option>\n                <option value=\"50\">50</option>\n                <option value=\"100\">100</option>\n            </select>\n        </div>\n\n        <ngb-pagination *ngIf=\"collectionSize > queryOptions.limit\" [class]=\"'mb-0'\" [collectionSize]=\"collectionSize\" [(page)]=\"queryOptions.page\" [maxSize]=\"queryOptions.limit\" (pageChange)=\"pageChange()\" [rotate]=\"true\" [boundaryLinks]=\"false\"></ngb-pagination>\n\n        <div class=\"clearfix\"></div>\n    </div>\n</div>"

/***/ }),

/***/ "../../../../../src/app/templates/modal-alert.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-block\">\n    <h4 class=\"modal-title\">{{modalTitle}}</h4>\n</div>\n<div class=\"modal-body\">\n    {{modalContent}}\n</div>\n<div class=\"modal-footer d-block\">\n    <button type=\"button\" class=\"btn btn-info btn-wide\" (click)=\"activeModal.close()\">\n        Ok\n    </button>\n</div>"

/***/ }),

/***/ "../../../../../src/app/templates/modal-category.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-block\">\n    <div class=\"d-block float-right\">\n        <button type=\"button\" class=\"btn btn-secondary\" (click)=\"activeModal.dismiss()\">\n            Close\n        </button>\n    </div>\n    <h4 class=\"modal-title\">{{modalTitle}}</h4>\n</div>\n\n<form [formGroup]=\"form\" [class.loading]=\"loading\">\n\n    <div class=\"modal-body\">\n\n        <div class=\"row form-group\" [class.form-group-message]=\"formErrors.parentId\" *ngIf=\"!isRoot\">\n            <div class=\"col-md-5\">\n                <label for=\"fieldContentType\">Родительская папка</label>\n            </div>\n            <div class=\"col-md-7\">\n                <select id=\"fieldParent\" class=\"form-control\" name=\"parentId\" formControlName=\"parentId\" [(ngModel)]=\"model.parentId\">\n                    <option value=\"0\">Корневая категория</option>\n                    <option value=\"{{category.id}}\" *ngFor=\"let category of categories | orderBy: 'title'\">{{category.title}}</option>\n                </select>\n                <div *ngIf=\"formErrors.parentId\" class=\"alert alert-danger\">\n                    {{formErrors.parentId}}\n                </div>\n            </div>\n        </div>\n\n        <div class=\"row form-group\" [class.form-group-message]=\"formErrors.title\">\n            <div class=\"col-md-5\">\n                <label for=\"fieldTitle\">Название</label>\n            </div>\n            <div class=\"col-md-7\">\n                <input type=\"text\" id=\"fieldTitle\" class=\"form-control\" formControlName=\"title\" name=\"title\" [(ngModel)]=\"model.title\">\n                <div *ngIf=\"formErrors.title\" class=\"alert alert-danger\">\n                    {{formErrors.title}}\n                </div>\n            </div>\n        </div>\n\n        <div class=\"row form-group\" [class.form-group-message]=\"formErrors.name\">\n            <div class=\"col-md-5\">\n                <label for=\"fieldName\">Системное имя</label>\n            </div>\n            <div class=\"col-md-7\">\n                <div class=\"input-group\">\n                    <input type=\"text\" class=\"form-control\" name=\"name\" formControlName=\"name\" id=\"fieldName\" [(ngModel)]=\"model.name\">\n                    <div class=\"input-group-btn\">\n                        <button type=\"button\" class=\"btn btn-secondary\" ngbTooltip=\"Generate\" (click)=\"generateName(model)\" [disabled]=\"getControl('name').disabled\">\n                            <i class=\"icon-reload\"></i>\n                        </button>\n                    </div>\n                </div>\n                <div *ngIf=\"formErrors.name\" class=\"alert alert-danger\">\n                    {{formErrors.name}}\n                </div>\n            </div>\n        </div>\n\n        <div class=\"row form-group\">\n            <div class=\"col-md-5\">\n                <label for=\"fieldDescription\">Описание</label>\n            </div>\n            <div class=\"col-md-7\">\n                <textarea type=\"text\" id=\"fieldDescription\" rows=\"4\" class=\"form-control\" name=\"description\" formControlName=\"description\" [(ngModel)]=\"model.description\"></textarea>\n            </div>\n        </div>\n\n        <div class=\"row form-group\" [class.form-group-message]=\"formErrors.contentTypeName\">\n            <div class=\"col-md-5\">\n                <label for=\"fieldContentType\">Тип контента</label>\n            </div>\n            <div class=\"col-md-7\">\n                <select id=\"fieldContentType\" class=\"form-control\" name=\"contentTypeName\" formControlName=\"contentTypeName\" [(ngModel)]=\"model.contentTypeName\">\n                    <option value=\"1\" *ngFor=\"let contentType of contentTypes\" [value]=\"contentType.name\">{{contentType.title}}</option>\n                </select>\n                <div *ngIf=\"formErrors.contentTypeName\" class=\"alert alert-danger\">\n                    {{formErrors.contentTypeName}}\n                </div>\n            </div>\n        </div>\n\n        <div class=\"row form-group\">\n            <div class=\"col-md-7 ml-md-auto\">\n\n                <div class=\"card card-body p-2 pl-3\">\n\n                    <label class=\"custom-control custom-checkbox m-0\">\n                        <input type=\"checkbox\" class=\"custom-control-input\" value=\"1\" name=\"isActive\" formControlName=\"isActive\" [(ngModel)]=\"model.isActive\">\n                        <span class=\"custom-control-indicator\"></span>\n                        <span>Активный</span>\n                    </label>\n\n                </div>\n\n            </div>\n        </div>\n\n        <div class=\"alert alert-danger mt-3 mb-0\" [hidden]=\"!errorMessage\">\n            <button type=\"button\" class=\"close\" (click)=\"errorMessage = ''\">\n                <span aria-hidden=\"true\">&times;</span>\n            </button>\n            {{errorMessage}}\n        </div>\n\n    </div>\n\n    <div class=\"modal-footer d-block\">\n        <button type=\"submit\" class=\"btn btn-success btn-wide\" [disabled]=\"submitted\" (click)=\"save()\">\n            Save\n        </button>\n        <button type=\"button\" class=\"btn btn-secondary btn-wide\" (click)=\"close($event)\">\n            Cancel\n        </button>\n    </div>\n\n</form>\n"

/***/ }),

/***/ "../../../../../src/app/templates/modal-confirm.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-block\">\n    <h4 class=\"modal-title\">{{modalTitle}}</h4>\n</div>\n<div class=\"modal-body\">\n    {{modalContent}}\n</div>\n<div class=\"modal-footer d-block\">\n    <button type=\"button\" class=\"btn btn-success btn-wide\" (click)=\"accept()\">\n        Yes\n    </button>\n    <button type=\"button\" class=\"btn btn-secondary btn-wide\" (click)=\"activeModal.close()\">\n        No\n    </button>\n</div>"

/***/ }),

/***/ "../../../../../src/app/templates/modal-content_types.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-block\">\n    <div class=\"d-block float-right\">\n        <button type=\"button\" class=\"btn btn-secondary\" (click)=\"activeModal.dismiss()\">\n            Close\n        </button>\n    </div>\n    <h4 class=\"modal-title\">{{modalTitle}}</h4>\n</div>\n\n<ng-template #confirmPopover let-confirm=\"confirm\" let-p=\"p\" let-msg=\"message\">\n    <p class=\"text-center\">Delete this item?</p>\n    <div class=\"alert alert-danger p-2\" *ngIf=\"msg\">{{msg}}</div>\n    <div class=\"text-center\">\n        <button type=\"button\" class=\"btn btn-success btn-sm\" (click)=\"confirm()\">Yes</button>\n        <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"p.close()\">No</button>\n    </div>\n</ng-template>\n\n<form [class.loading]=\"loading\">\n\n    <div class=\"modal-body\">\n\n        <div class=\"row\">\n\n            <!-- ContentType form -->\n            <div class=\"col-lg-4\" [formGroup]=\"form\">\n\n                <div class=\"form-group\" [class.form-group-message]=\"formErrors.title\">\n                    <label class=\"label-filled\">\n                        Название\n                    </label>\n                    <input type=\"text\" class=\"form-control\" name=\"title\" formControlName=\"title\" [(ngModel)]=\"model.title\">\n                    <div *ngIf=\"formErrors.title\" class=\"alert alert-danger\">\n                        {{formErrors.title}}\n                    </div>\n                </div>\n\n                <div class=\"form-group\" [class.form-group-message]=\"formErrors.name\">\n                    <label for=\"fieldName\" class=\"label-filled\">Системное имя</label>\n                    <div class=\"input-group\">\n                        <input type=\"text\" class=\"form-control\" name=\"name\" formControlName=\"name\" id=\"fieldName\" [(ngModel)]=\"model.name\">\n                        <div class=\"input-group-btn\">\n                            <button type=\"button\" class=\"btn btn-secondary\" ngbTooltip=\"Generate\" (click)=\"generateName(model)\">\n                                <i class=\"icon-reload\"></i>\n                            </button>\n                        </div>\n                    </div>\n                    <div *ngIf=\"formErrors.name\" class=\"alert alert-danger\">\n                        {{formErrors.name}}\n                    </div>\n                </div>\n\n                <div class=\"form-group\">\n                    <label class=\"label-filled\">\n                        Описание\n                    </label>\n                    <textarea type=\"text\" class=\"form-control\" rows=\"3\" name=\"description\" formControlName=\"description\" [(ngModel)]=\"model.description\"></textarea>\n                </div>\n\n                <div class=\"form-group row\" [class.form-group-message]=\"formErrors.collection\">\n                    <div class=\"col-12\">\n\n                        <div class=\"form-group mb-0\">\n                            <label class=\"label-filled\">Коллекция</label>\n\n                            <div class=\"input-group\">\n                                <select class=\"form-control form-control-sm\" name=\"collection\" formControlName=\"collection\" [(ngModel)]=\"model.collection\">\n                                    <option value=\"{{collection}}\" *ngFor=\"let collection of collections\">{{collection}}</option>\n                                </select>\n                                <div class=\"input-group-btn\">\n                                    <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Add collection\" (click)=\"displayToggle(addCollectionBlock); addCollectionField.value = ''; onValueChanged(); addCollectionField.focus()\">\n                                        <i class=\"icon-plus\"></i>\n                                    </button>\n                                </div>\n                                <div class=\"input-group-btn\" [ngbPopover]=\"confirmPopover\" #buttonDeleteCollection=\"ngbPopover\" triggers=\"manual\">\n                                    <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Delete\" (click)=\"deleteCollection(buttonDeleteCollection)\">\n                                        <i class=\"icon-cross\"></i>\n                                    </button>\n                                </div>\n                            </div>\n\n                            <div class=\"card p-1 mt-2\" #addCollectionBlock style=\"display: none;\" [class.form-group-message]=\"formErrors.newCollection\">\n                                <input type=\"text\" class=\"form-control form-control-sm\" formControlName=\"newCollection\" #addCollectionField>\n                                <div *ngIf=\"formErrors.newCollection\" class=\"alert alert-danger mb-1\">\n                                    {{formErrors.newCollection}}\n                                </div>\n\n                                <div class=\"text-right mt-1\">\n                                    <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"addCollection()\">\n                                        Add\n                                    </button>\n                                    <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"addCollectionBlock.style.display = 'none'; formErrors.newCollection = ''\">\n                                        Cancel\n                                    </button>\n                                </div>\n                            </div>\n\n                        </div>\n\n                    </div>\n                </div>\n\n                <div class=\"form-group row\">\n                    <div class=\"col-12\">\n\n                        <div class=\"card card-body p-2 pl-3\">\n\n                            <label class=\"custom-control custom-checkbox m-0\">\n                                <input type=\"checkbox\" class=\"custom-control-input\" value=\"1\" name=\"isActive\" formControlName=\"isActive\" [(ngModel)]=\"model.isActive\">\n                                <span class=\"custom-control-indicator\"></span>\n                                <span>Активный</span>\n                            </label>\n\n                        </div>\n\n                    </div>\n                </div>\n\n            </div>\n            <!-- /ContentType form -->\n\n            <!-- Field form -->\n            <div class=\"col-lg-8\" [formGroup]=\"fieldForm\">\n\n                <label class=\"label-filled\" [hidden]=\"action != 'add_field'\">\n                    Добавить поле\n                </label>\n                <label class=\"label-filled\" [hidden]=\"action != 'edit_field'\">\n                    Редактировать поле\n                </label>\n\n                <div class=\"card\">\n                    <div class=\"card-body\">\n\n                        <div class=\"form-group row\" [class.form-group-message]=\"formErrors.fld_title\">\n                            <div class=\"col-md-5\">\n                                <label>Название</label>\n                            </div>\n                            <div class=\"col-md-7\">\n                                <input type=\"text\" class=\"form-control form-control-sm\" name=\"field_title\" formControlName=\"title\" [(ngModel)]=\"fieldModel.title\">\n                                <div *ngIf=\"formErrors.fld_title\" class=\"alert alert-danger\">\n                                    {{formErrors.fld_title}}\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row\" [class.form-group-message]=\"formErrors.fld_name\">\n                            <div class=\"col-md-5\">\n                                <label>Системное имя</label>\n                            </div>\n                            <div class=\"col-md-7\">\n\n                                <div class=\"input-group\">\n                                    <input type=\"text\" class=\"form-control form-control-sm\" name=\"field_name\" formControlName=\"name\" [(ngModel)]=\"fieldModel.name\">\n                                    <div class=\"input-group-btn\">\n                                        <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Generate\" (click)=\"generateName(fieldModel)\">\n                                            <i class=\"icon-reload\"></i>\n                                        </button>\n                                    </div>\n                                </div>\n                                <div *ngIf=\"formErrors.fld_name\" class=\"alert alert-danger\">\n                                    {{formErrors.fld_name}}\n                                </div>\n\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row\">\n                            <div class=\"col-md-5\">\n                                <label>Описание</label>\n                            </div>\n                            <div class=\"col-md-7\">\n                                <textarea type=\"text\" class=\"form-control form-control-sm\" rows=\"3\" name=\"field_description\" formControlName=\"description\" [(ngModel)]=\"fieldModel.description\"></textarea>\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row\" [class.form-group-message]=\"formErrors.fld_inputType\">\n                            <div class=\"col-md-5\">\n                                <label>Тип ввода</label>\n                            </div>\n                            <div class=\"col-md-7\">\n\n                                <div class=\"input-group\">\n                                    <select class=\"form-control form-control-sm\" name=\"field_inputType\" formControlName=\"inputType\" [(ngModel)]=\"fieldModel.inputType\" (ngModelChange)=\"selectFieldTypeProperties('input')\">\n                                        <option value=\"\"></option>\n                                        <option value=\"{{fieldType.name}}\" *ngFor=\"let fieldType of fieldTypes\">{{fieldType.title}}</option>\n                                    </select>\n                                    <div class=\"input-group-btn\">\n                                        <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Options\" (click)=\"displayToggle(inputTypeOptionsBlock)\">\n                                            <i class=\"icon-cog\"></i>\n                                        </button>\n                                    </div>\n                                </div>\n                                <div *ngIf=\"formErrors.fld_inputType\" class=\"alert alert-danger\">\n                                    {{formErrors.fld_inputType}}\n                                </div>\n\n                            </div>\n                        </div>\n\n                        <div class=\"card card-body bg-light mb-3\" #inputTypeOptionsBlock style=\"display: none;\" [hidden]=\"!fieldModel.inputType\">\n                            <div>\n                                <div class=\"alert alert-secondary small\" [hidden]=\"fieldTypeProperties.input.length > 0\">\n                                    There are no parameters.\n                                </div>\n                                <div class=\"row form-group\" *ngFor=\"let property of fieldTypeProperties.input\">\n                                    <div class=\"col-md-5\">\n                                        {{property.title}}\n                                    </div>\n                                    <div class=\"col-md-7\">\n                                        <input type=\"text\" class=\"form-control form-control-sm\" [(ngModel)]=\"fieldModel.inputProperties[property.name]\" [ngModelOptions]=\"{standalone: true}\">\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"text-right mt-1\">\n                                <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"inputTypeOptionsBlock.style.display = 'none';\">\n                                    Close\n                                </button>\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row\" [class.form-group-message]=\"formErrors.fld_outputType\">\n                            <div class=\"col-md-5\">\n                                <label>Тип вывода</label>\n                            </div>\n                            <div class=\"col-md-7\">\n\n                                <div class=\"input-group\">\n                                    <select class=\"form-control form-control-sm\" name=\"field_outputType\" formControlName=\"outputType\" [(ngModel)]=\"fieldModel.outputType\" (ngModelChange)=\"selectFieldTypeProperties('output')\">\n                                        <option value=\"\"></option>\n                                        <option value=\"{{fieldType.name}}\" *ngFor=\"let fieldType of fieldTypes\">{{fieldType.title}}</option>\n                                    </select>\n                                    <div class=\"input-group-btn\">\n                                        <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Options\" (click)=\"displayToggle(outputTypeOptionsBlock)\">\n                                            <i class=\"icon-cog\"></i>\n                                        </button>\n                                    </div>\n                                </div>\n                                <div *ngIf=\"formErrors.fld_outputType\" class=\"alert alert-danger\">\n                                    {{formErrors.fld_outputType}}\n                                </div>\n\n                            </div>\n                        </div>\n\n                        <div class=\"card card-body bg-light mb-3\" #outputTypeOptionsBlock style=\"display: none;\" [hidden]=\"!fieldModel.outputType\">\n                            <div class=\"alert alert-secondary small\" [hidden]=\"fieldTypeProperties.output.length > 0\">\n                                There are no parameters.\n                            </div>\n                            <div class=\"row form-group\" *ngFor=\"let property of fieldTypeProperties.output\">\n                                <div class=\"col-md-5\">\n                                    {{property.title}}\n                                </div>\n                                <div class=\"col-md-7\">\n                                    <input type=\"text\" class=\"form-control form-control-sm\" [(ngModel)]=\"fieldModel.outputProperties[property.name]\" [ngModelOptions]=\"{standalone: true}\">\n                                </div>\n                            </div>\n                            <div class=\"text-right mt-1\">\n                                <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"outputTypeOptionsBlock.style.display = 'none'\">\n                                    Close\n                                </button>\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row\">\n                            <div class=\"col-md-5\">\n                                <label>Группа</label>\n                            </div>\n                            <div class=\"col-md-7\">\n\n                                <div [class.form-group-message]=\"formErrors.fld_group\">\n                                    <div class=\"input-group input-group-sm\">\n                                        <select class=\"form-control\" name=\"field_group\" formControlName=\"group\" [(ngModel)]=\"fieldModel.group\">\n                                            <option value=\"\"></option>\n                                            <option [value]=\"groupName\" *ngFor=\"let groupName of model.groups\">{{groupName}}</option>\n                                        </select>\n                                        <div class=\"input-group-btn\">\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Add group\" (click)=\"displayToggle(addGroupBlock); addGroupField.value = ''; addGroupField.focus()\">\n                                                <i class=\"icon-plus\"></i>\n                                            </button>\n                                        </div>\n                                        <div class=\"input-group-btn\">\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" ngbTooltip=\"Delete group\" (click)=\"deleteGroup()\">\n                                                <i class=\"icon-cross\"></i>\n                                            </button>\n                                        </div>\n                                    </div>\n                                    <div *ngIf=\"formErrors.fld_group\" class=\"alert alert-danger\">\n                                        {{formErrors.fld_group}}\n                                    </div>\n\n                                    <div class=\"card p-1 mt-2\" #addGroupBlock style=\"display: none;\" [class.form-group-message]=\"formErrors.fld_newGroup\">\n                                        <input type=\"text\" class=\"form-control form-control-sm\" #addGroupField formControlName=\"newGroup\">\n                                        <div *ngIf=\"formErrors.fld_newGroup\" class=\"alert alert-danger mb-1\">\n                                            {{formErrors.fld_newGroup}}\n                                        </div>\n                                        <div class=\"text-right mt-1\">\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"addGroup();\">\n                                                Add\n                                            </button>\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"addGroupBlock.style.display = 'none'; formErrors.fld_newGroup = ''\">\n                                                Cancel\n                                            </button>\n                                        </div>\n                                    </div>\n                                </div>\n\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row mb-0\">\n                            <div class=\"col-md-7 offset-md-5\">\n\n                                <label class=\"custom-control custom-checkbox\">\n                                    <input type=\"checkbox\" class=\"custom-control-input\" value=\"1\" name=\"required\" formControlName=\"required\" [(ngModel)]=\"fieldModel.required\">\n                                    <span class=\"custom-control-indicator\"></span>\n                                    <span>Обязательное</span>\n                                </label>\n\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row mb-0\">\n                            <div class=\"col-md-7 offset-md-5\">\n\n                                <label class=\"custom-control custom-checkbox\">\n                                    <input type=\"checkbox\" class=\"custom-control-input\" value=\"1\" name=\"showInTable\" formControlName=\"showInTable\" [(ngModel)]=\"fieldModel.showInTable\">\n                                    <span class=\"custom-control-indicator\"></span>\n                                    <span>Показывать в таблице</span>\n                                </label>\n\n                            </div>\n                        </div>\n\n                        <div class=\"form-group row mb-0\">\n                            <div class=\"col-md-7 offset-md-5\">\n\n                                <label class=\"custom-control custom-checkbox\">\n                                    <input type=\"checkbox\" class=\"custom-control-input\" value=\"1\" name=\"isFilter\" formControlName=\"isFilter\" [(ngModel)]=\"fieldModel.isFilter\">\n                                    <span class=\"custom-control-indicator\"></span>\n                                    <span>Показывать в фильтре</span>\n                                </label>\n\n                            </div>\n                        </div>\n\n                        <div class=\"alert alert-danger mt-3 mb-3\" [hidden]=\"!errorFieldMessage\">\n                            <button type=\"button\" class=\"close\" (click)=\"errorFieldMessage = ''\">\n                                <span aria-hidden=\"true\">&times;</span>\n                            </button>\n                            {{errorFieldMessage}}\n                        </div>\n\n                        <div class=\"mt-3\">\n                            <button type=\"button\" class=\"btn btn-sm btn-info btn-wide\" (click)=\"submitField()\" [hidden]=\"action != 'add_field'\">\n                                <i class=\"icon-plus\"></i>\n                                Add field\n                            </button>\n                            <button type=\"button\" class=\"btn btn-sm btn-success btn-wide\" (click)=\"displayToggle(fieldsBlock, true); submitField()\" [hidden]=\"action != 'edit_field'\">\n                                <i class=\"icon-check\"></i>\n                                Save field\n                            </button>\n                            <button type=\"button\" class=\"btn btn-sm btn-secondary btn-wide\" (click)=\"displayToggle(fieldsBlock, true); editFieldCancel()\">\n                                Cancel\n                            </button>\n                        </div>\n\n                    </div>\n                </div>\n\n            </div>\n            <!-- /Field form -->\n\n        </div>\n\n        <div class=\"form-group row mt-3\">\n            <div class=\"col-12\">\n\n                <label class=\"label-filled\">\n                    Поля\n                </label>\n\n                <hr class=\"mt-0 mb-0\">\n                <div class=\"text-center mb-2\" style=\"margin-top: -0.8rem;\">\n                    <button type=\"button\" class=\"btn btn-outline-secondary bg-white text-secondary btn-xs\" [ngSwitch]=\"fieldsBlock.style.display\" (click)=\"displayToggle(fieldsBlock)\">\n                        <span *ngSwitchCase=\"'none'\">\n                            <i class=\"icon-plus\"></i>\n                            <span i18n>Expand</span>\n                        </span>\n                            <span *ngSwitchCase=\"'block'\">\n                            <i class=\"icon-minus\"></i>\n                            <span i18n>Collapse</span>\n                        </span>\n                    </button>\n                </div>\n\n                <div #fieldsBlock class=\"table-responsive\" style=\"display: block;\">\n                    <table class=\"table table-striped table-divided mb-0\">\n                        <thead>\n                            <tr>\n                                <th>Название</th>\n                                <th>Тип ввода</th>\n                                <th>Группа</th>\n                                <th>Обязательное?</th>\n                                <th>В таблице?</th>\n                            </tr>\n                        </thead>\n                        <tbody>\n                            <tr class=\"show-on-hover-parent\" *ngFor=\"let field of model.fields; let index=index\">\n                                <td>\n                                    {{field.title}}\n                                    <span class=\"text-muted\">({{field.name}})</span>\n                                </td>\n                                <td>\n                                    {{field.inputType}}\n                                </td>\n                                <td>\n                                    {{field.group}}\n                                </td>\n                                <td>\n                                    <output-field [value]=\"field.required\" outputType=\"boolean\"></output-field>\n                                </td>\n                                <td>\n                                    <div class=\"relative\">\n                                        <div class=\"show-on-hover\">\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"fieldMove(index, 'up')\" ngbTooltip=\"Move up\" *ngIf=\"index > 0\">\n                                                <i class=\"icon-arrow-up\"></i>\n                                            </button>\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"fieldMove(index, 'down')\" ngbTooltip=\"Move down\" *ngIf=\"index < model.fields.length - 1\">\n                                                <i class=\"icon-arrow-down\"></i>\n                                            </button>\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"displayToggle(fieldsBlock); editField(field)\" [hidden]=\"field.name == currentFieldName\" ngbTooltip=\"Edit\">\n                                                <i class=\"icon-pencil\"></i>\n                                            </button>\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"displayToggle(fieldsBlock); copyField(field)\" ngbTooltip=\"Copy\">\n                                                <i class=\"icon-stack\"></i>\n                                            </button>\n                                            <button type=\"button\" class=\"btn btn-secondary btn-sm\" (click)=\"deleteField(field)\" [hidden]=\"field.name == currentFieldName\" ngbTooltip=\"Delete\">\n                                                <i class=\"icon-cross\"></i>\n                                            </button>\n                                        </div>\n                                    </div>\n\n                                    <output-field [value]=\"field.showInTable\" outputType=\"boolean\"></output-field>\n                                </td>\n                            </tr>\n                            <tr [hidden]=\"model.fields.length > 0\" class=\"table-active\">\n                                <td colspan=\"5\" class=\"text-center p-3\">\n                                    Empty\n                                </td>\n                            </tr>\n                        </tbody>\n                    </table>\n                </div>\n\n                <div class=\"alert alert-danger mt-3 mb-0\" [hidden]=\"!errorMessage\">\n                    <button type=\"button\" class=\"close\" (click)=\"errorMessage = ''\">\n                        <span aria-hidden=\"true\">&times;</span>\n                    </button>\n                    {{errorMessage}}\n                </div>\n\n            </div>\n        </div>\n\n    </div>\n\n    <div class=\"modal-footer d-block\">\n        <button type=\"button\" class=\"btn btn-success btn-wide\" [disabled]=\"submitted && form.valid\" (click)=\"save()\">\n            Save\n        </button>\n        <button type=\"button\" class=\"btn btn-secondary btn-wide\" (click)=\"activeModal.dismiss()\">\n            Cancel\n        </button>\n    </div>\n\n</form>"

/***/ }),

/***/ "../../../../../src/app/templates/modal-field_type.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-block\">\n    <div class=\"d-block float-right\">\n        <button type=\"button\" class=\"btn btn-secondary\" (click)=\"activeModal.dismiss()\">\n            Close\n        </button>\n    </div>\n    <h4 class=\"modal-title\">{{modalTitle}}</h4>\n</div>\n\n<div class=\"modal-body\" [class.loading]=\"loading\">\n\n    <form #formElement=\"ngForm\" [formGroup]=\"form\">\n        <div class=\"row\">\n            <div class=\"col-md-6\">\n\n                <div class=\"form-group form-group-message\" [class.form-group-message]=\"formErrors.title\">\n                    <label for=\"fieldTitle\" class=\"label-filled\">Название</label>\n                    <input type=\"text\" class=\"form-control\" name=\"title\" formControlName=\"title\" id=\"fieldTitle\" [(ngModel)]=\"model.title\">\n                    <div *ngIf=\"formErrors.title\" class=\"alert alert-danger\">\n                        {{formErrors.title}}\n                    </div>\n                </div>\n\n                <div class=\"form-group\" [class.form-group-message]=\"formErrors.name\">\n                    <label for=\"fieldName\" class=\"label-filled\">Системное имя</label>\n                    <div class=\"input-group\">\n                        <input type=\"text\" class=\"form-control\" name=\"name\" formControlName=\"name\" id=\"fieldName\" [(ngModel)]=\"model.name\">\n                        <div class=\"input-group-btn\">\n                            <button type=\"button\" class=\"btn btn-secondary\" ngbTooltip=\"Generate\" (click)=\"generateName(model)\">\n                                <i class=\"icon-reload\"></i>\n                            </button>\n                        </div>\n                    </div>\n                    <div *ngIf=\"formErrors.name\" class=\"alert alert-danger\">\n                        {{formErrors.name}}\n                    </div>\n                </div>\n\n                <div class=\"form-group row\">\n                    <div class=\"col-12\">\n\n                        <div class=\"card card-body p-2 pl-3\">\n\n                            <label class=\"custom-control custom-checkbox m-0\">\n                                <input type=\"checkbox\" class=\"custom-control-input\" value=\"1\" name=\"isActive\" formControlName=\"isActive\" [(ngModel)]=\"model.isActive\">\n                                <span class=\"custom-control-indicator\"></span>\n                                <span>Активный</span>\n                            </label>\n\n                        </div>\n\n                    </div>\n                </div>\n\n            </div>\n            <div class=\"col-md-6\">\n                <div class=\"form-group\">\n                    <label for=\"fieldDescription\" class=\"label-filled\">Описание</label>\n                    <textarea class=\"form-control\" rows=\"5\" name=\"description\" formControlName=\"description\" id=\"fieldDescription\" [(ngModel)]=\"model.description\"></textarea>\n                </div>\n            </div>\n        </div>\n    </form>\n\n    <!-- Input -->\n    <label class=\"label-filled\">Параметры ввода</label>\n\n    <hr class=\"mt-0 mb-0\">\n    <div class=\"text-center mb-2\" style=\"margin-top: -0.8rem;\">\n        <button type=\"button\" class=\"btn btn-outline-secondary bg-white text-secondary btn-xs\" [ngSwitch]=\"collapseContainer1.style.display\" (click)=\"displayToggle(collapseContainer1)\">\n            <span *ngSwitchCase=\"'none'\">\n                <i class=\"icon-plus\"></i>\n                <span i18n>Expand</span>\n            </span>\n            <span *ngSwitchCase=\"'block'\">\n                <i class=\"icon-minus\"></i>\n                <span i18n>Collapse</span>\n            </span>\n        </button>\n    </div>\n\n    <div #collapseContainer1 class=\"mb-3\" style=\"display: block;\">\n        <table class=\"table table-bordered table-divided mb-0\">\n            <thead>\n            <tr>\n                <th>\n                    Системное имя\n                </th>\n                <th>\n                    Название\n                </th>\n                <th>\n                    По умолчанию\n                </th>\n                <th></th>\n            </tr>\n            </thead>\n            <tbody>\n                <tr *ngFor=\"let item of model.inputProperties; let index=index\">\n                    <td>\n                        <input type=\"text\" class=\"form-control\" [(ngModel)]=\"item.name\" name=\"name\">\n                    </td>\n                    <td class=\"text-center\">\n                        <input type=\"text\" class=\"form-control\" [(ngModel)]=\"item.title\" name=\"title\">\n                    </td>\n                    <td class=\"text-center\">\n                        <input type=\"text\" class=\"form-control\" [(ngModel)]=\"item.default_value\" name=\"default_value\">\n                    </td>\n                    <td class=\"text-center\">\n                        <button type=\"button\" class=\"btn btn-secondary\" (click)=\"deleteRow(index, 'inputProperties')\" ngbTooltip=\"Remove\">\n                            <i class=\"icon-cross\"></i>\n                        </button>\n                    </td>\n                </tr>\n            </tbody>\n            <tfoot>\n            <tr class=\"bg-faded\">\n                <td colspan=\"4\" class=\"text-center\">\n                    <button type=\"button\" class=\"btn btn-secondary\" (click)=\"addRow('inputProperties')\">\n                        <i class=\"icon-plus\"></i>\n                        Добавить\n                    </button>\n                </td>\n            </tr>\n            </tfoot>\n        </table>\n    </div>\n    <!-- /Input -->\n\n    <!-- Output -->\n    <label class=\"label-filled\">Параметры вывода</label>\n\n    <hr class=\"mt-0 mb-0\">\n    <div class=\"text-center mb-2\" style=\"margin-top: -0.8rem;\">\n        <button type=\"button\" class=\"btn btn-outline-secondary bg-white text-secondary btn-xs\" [ngSwitch]=\"collapseContainer2.style.display\" (click)=\"displayToggle(collapseContainer2)\">\n            <span *ngSwitchCase=\"'none'\">\n                <i class=\"icon-plus\"></i>\n                <span i18n>Expand</span>\n            </span>\n            <span *ngSwitchCase=\"'block'\">\n                <i class=\"icon-minus\"></i>\n                <span i18n>Collapse</span>\n            </span>\n        </button>\n    </div>\n\n    <div #collapseContainer2 style=\"display: none;\">\n        <table class=\"table table-bordered table-divided mb-0\">\n            <thead>\n                <tr>\n                    <th>\n                        Системное имя\n                    </th>\n                    <th>\n                        Название\n                    </th>\n                    <th>\n                        По умолчанию\n                    </th>\n                    <th></th>\n                </tr>\n            </thead>\n            <tbody>\n                <tr *ngFor=\"let item of model.outputProperties; let index=index\">\n                    <td>\n                        <input type=\"text\" class=\"form-control\" [(ngModel)]=\"item.name\" name=\"name\">\n                    </td>\n                    <td class=\"text-center\">\n                        <input type=\"text\" class=\"form-control\" [(ngModel)]=\"item.title\" name=\"title\">\n                    </td>\n                    <td class=\"text-center\">\n                        <input type=\"text\" class=\"form-control\" [(ngModel)]=\"item.default_value\" name=\"default_value\">\n                    </td>\n                    <td class=\"text-center\">\n                        <button type=\"button\" class=\"btn btn-secondary\" (click)=\"deleteRow(index, 'outputProperties')\" ngbTooltip=\"Remove\">\n                            <i class=\"icon-cross\"></i>\n                        </button>\n                    </td>\n                </tr>\n            </tbody>\n            <tfoot>\n                <tr class=\"bg-faded\">\n                    <td colspan=\"4\" class=\"text-center\">\n                        <button type=\"button\" class=\"btn btn-secondary\" (click)=\"addRow('outputProperties')\">\n                            <i class=\"icon-plus\"></i>\n                            Добавить\n                        </button>\n                    </td>\n                </tr>\n            </tfoot>\n        </table>\n    </div>\n    <!-- /Output -->\n\n    <div class=\"alert alert-danger mt-3 mb-0\" [hidden]=\"!errorMessage\">\n        <button type=\"button\" class=\"close\" (click)=\"errorMessage = ''\">\n            <span aria-hidden=\"true\">&times;</span>\n        </button>\n        {{errorMessage}}\n    </div>\n\n</div>\n<div class=\"modal-footer d-block\">\n    <button type=\"button\" class=\"btn btn-success btn-wide\" [disabled]=\"submitted\" (click)=\"save()\">\n        Save\n    </button>\n    <button type=\"button\" class=\"btn btn-secondary btn-wide\" (click)=\"activeModal.dismiss()\">\n        Cancel\n    </button>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/templates/modal-product.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header d-block\">\n    <div class=\"d-block float-right\">\n        <button type=\"button\" class=\"btn btn-secondary\" (click)=\"activeModal.dismiss()\">\n            Close\n        </button>\n    </div>\n    <h4 class=\"modal-title\">{{modalTitle}}</h4>\n</div>\n\n<form [formGroup]=\"form\" [class.loading]=\"loading\">\n    <div class=\"modal-body\">\n\n        <div class=\"row form-group\" [class.form-group-message]=\"formErrors.parentId\">\n            <div class=\"col-md-5\">\n                <label for=\"fieldCategory\">Основная категория</label>\n            </div>\n            <div class=\"col-md-7\">\n                <select id=\"fieldCategory\" class=\"form-control\" name=\"parentId\" formControlName=\"parentId\" [(ngModel)]=\"model.parentId\" (change)=\"onChangeContentType()\">\n                    <option *ngFor=\"let category of categories\" [value]=\"category.id\">{{category.title}}</option>\n                </select>\n                <div *ngIf=\"formErrors.parentId\" class=\"alert alert-danger\">\n                    {{formErrors.parentId}}\n                </div>\n            </div>\n        </div>\n\n        <div class=\"row form-group\" [class.form-group-message]=\"formErrors.isActive\">\n            <div class=\"col-md-7 ml-md-auto\">\n                <div class=\"card card-body p-2 pl-3\">\n\n                    <label class=\"custom-control custom-checkbox m-0\">\n                        <input type=\"checkbox\" class=\"custom-control-input\" value=\"1\" name=\"isActive\" formControlName=\"isActive\" [(ngModel)]=\"model.isActive\">\n                        <span class=\"custom-control-indicator\"></span>\n                        <span>Активный</span>\n                    </label>\n\n                </div>\n            </div>\n        </div>\n\n        <input-field-renderer [(fields)]=\"currentContentType.fields\" [(groups)]=\"currentContentType.groups\" [(formErrors)]=\"formErrors\" [(validationMessages)]=\"validationMessages\" [(model)]=\"model\" [(form)]=\"form\" [(files)]=\"files\"></input-field-renderer>\n\n        <div class=\"alert alert-danger mt-3 mb-0\" [hidden]=\"!errorMessage\">\n            <button type=\"button\" class=\"close\" (click)=\"errorMessage = ''\">\n                <span aria-hidden=\"true\">&times;</span>\n            </button>\n            {{errorMessage}}\n        </div>\n\n    </div>\n\n    <div class=\"modal-footer d-block\">\n        <button type=\"button\" class=\"btn btn-success btn-wide\" [disabled]=\"submitted\" (click)=\"save()\">\n            Save\n        </button>\n        <button type=\"button\" class=\"btn btn-secondary btn-wide\" (click)=\"activeModal.dismiss()\">\n            Cancel\n        </button>\n    </div>\n\n</form>"

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

module.exports = "\n<ngb-tabset justify=\"fill\">\n    <ngb-tab *ngFor=\"let groupName of groups; let i=index\">\n        <ng-template ngbTabTitle>{{groupName}}</ng-template>\n        <ng-template ngbTabContent>\n            <div class=\"pt-3\">\n\n                <div class=\"form-group\" [class.form-group-message]=\"formErrors[field.name]\" [formGroup]=\"form\" *ngFor=\"let field of fields | filterFieldByGroup: groupName\">\n\n                    <div [ngSwitch]=\"field.inputType\">\n\n                        <div class=\"row\" *ngSwitchCase=\"'system_name'\">\n                            <div class=\"col-md-5\">\n                                <label for=\"field_{{field.name}}\">\n                                    {{field.title}}\n                                    <span class=\"text-danger\" *ngIf=\"field.required\">*</span>\n                                </label>\n                            </div>\n                            <div class=\"col-md-7\">\n                                <div class=\"input-group\">\n                                    <input type=\"text\" class=\"form-control form-control-sm\" id=\"field_{{field.name}}\" [name]=\"field.name\" [formControlName]=\"field.name\" [(ngModel)]=\"model[field.name]\">\n                                    <div class=\"input-group-btn\">\n                                        <button type=\"button\" class=\"btn btn-secondary\" ngbTooltip=\"Generate\" (click)=\"generateName(field)\">\n                                            <i class=\"icon-reload\"></i>\n                                        </button>\n                                    </div>\n                                </div>\n                                <div *ngIf=\"formErrors[field.name]\" class=\"alert alert-danger\">\n                                    {{formErrors[field.name]}}\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"row\" *ngSwitchCase=\"'text'\">\n                            <div class=\"col-md-5\">\n                                <label for=\"field_{{field.name}}\">\n                                    {{field.title}}\n                                    <span class=\"text-danger\" *ngIf=\"field.required\">*</span>\n                                </label>\n                            </div>\n                            <div class=\"col-md-7\">\n                                <input type=\"text\" id=\"field_{{field.name}}\" [name]=\"field.name\" [formControlName]=\"field.name\" [(ngModel)]=\"model[field.name]\" class=\"form-control\">\n                                <div *ngIf=\"formErrors[field.name]\" class=\"alert alert-danger\">\n                                    {{formErrors[field.name]}}\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"row\" *ngSwitchCase=\"'name'\">\n                            <div class=\"col-md-5\">\n                                <label for=\"field_{{field.name}}\">\n                                    {{field.title}}\n                                    <span class=\"text-danger\" *ngIf=\"field.required\">*</span>\n                                </label>\n                            </div>\n                            <div class=\"col-md-7\">\n                                <input type=\"text\" id=\"field_{{field.name}}\" [name]=\"field.name\" [formControlName]=\"field.name\" [(ngModel)]=\"model[field.name]\" class=\"form-control\">\n                                <div *ngIf=\"formErrors[field.name]\" class=\"alert alert-danger\">\n                                    {{formErrors[field.name]}}\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"row\" *ngSwitchCase=\"'number'\">\n                            <div class=\"col-md-5\">\n                                <label for=\"field_{{field.name}}\">\n                                    {{field.title}}\n                                    <span class=\"text-danger\" *ngIf=\"field.required\">*</span>\n                                </label>\n                            </div>\n                            <div class=\"col-md-7\">\n                                <input type=\"number\" class=\"form-control\" id=\"field_{{field.name}}\" [name]=\"field.name\" [formControlName]=\"field.name\" [(ngModel)]=\"model[field.name]\" [min]=\"field.inputProperties.min\" [max]=\"field.inputProperties.max\" [step]=\"field.inputProperties.step\">\n                                <div *ngIf=\"formErrors[field.name]\" class=\"alert alert-danger\">\n                                    {{formErrors[field.name]}}\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"row\" *ngSwitchCase=\"'textarea'\">\n                            <div class=\"col-md-5\">\n                                <label for=\"field_{{field.name}}\">\n                                    {{field.title}}\n                                    <span class=\"text-danger\" *ngIf=\"field.required\">*</span>\n                                </label>\n                            </div>\n                            <div class=\"col-md-7\">\n                                <textarea rows=\"6\" id=\"field_{{field.name}}\" [name]=\"field.name\" [formControlName]=\"field.name\" [(ngModel)]=\"model[field.name]\" class=\"form-control\"></textarea>\n                                <div *ngIf=\"formErrors[field.name]\" class=\"alert alert-danger\">\n                                    {{formErrors[field.name]}}\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"row\" *ngSwitchCase=\"'image'\">\n                            <div class=\"col-md-5\">\n                                <label for=\"field_{{field.name}}\">\n                                    {{field.title}}\n                                    <span class=\"text-danger\" *ngIf=\"field.required\">*</span>\n                                </label>\n                            </div>\n                            <div class=\"col-md-7\">\n                                <input type=\"file\" id=\"field_{{field.name}}\" [name]=\"field.name\" accept=\"image/*\" style=\"display:none;\" (change)=\"fileChange($event, field.name, imgPreview)\" #fileInput>\n                                <input type=\"hidden\" [formControlName]=\"field.name\" [(ngModel)]=\"model[field.name]\">\n\n                                <div class=\"relative\" [ngClass]=\"{'show-on-hover-parent': selectedItems[field.name]}\">\n                                    <div>\n                                        <img src=\"\" alt=\"Preview\" class=\"img-thumbnail\" style=\"width:250px; display:none;\" #imgPreview>\n                                    </div>\n                                    <div class=\"show-on-hover\" style=\"top:10px; left:10px; right:auto;\">\n                                        <button type=\"button\" class=\"btn btn-secondary btn-wide\" (click)=\"fileInput.click()\">\n                                            <i class=\"icon-upload\"></i>\n                                            Обзор\n                                        </button>\n                                        <button type=\"button\" class=\"btn btn-secondary\" *ngIf=\"model[field.name]\" (click)=\"fileClear(field.name, imgPreview)\" title=\"Clear\">\n                                            <i class=\"icon-cross\"></i>\n                                        </button>\n                                    </div>\n                                </div>\n                                <div class=\"py-2 text-secondary\" *ngIf=\"selectedItems[field.name]\">\n                                    <i class=\"icon-file\"></i>\n                                    {{selectedItems[field.name]}}\n                                </div>\n                                <div *ngIf=\"formErrors[field.name]\" class=\"alert alert-danger\">\n                                    {{formErrors[field.name]}}\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"row\" *ngSwitchCase=\"'file'\">\n                            <div class=\"col-md-5\">\n                                <label for=\"field_{{field.name}}\">\n                                    {{field.title}}\n                                    <span class=\"text-danger\" *ngIf=\"field.required\">*</span>\n                                </label>\n                            </div>\n                            <div class=\"col-md-7\">\n                                <input type=\"file\" id=\"field_{{field.name}}\" [name]=\"field.name\" style=\"display:none;\" (change)=\"fileChange($event, field.name)\" #fileInput>\n                                <input type=\"hidden\" [formControlName]=\"field.name\" [(ngModel)]=\"model[field.name]\">\n                                <button type=\"button\" class=\"btn btn-secondary btn-wide\" (click)=\"fileInput.click()\">\n                                    <i class=\"icon-upload\"></i>\n                                    Обзор\n                                </button>\n                                <button type=\"button\" class=\"btn btn-secondary\" *ngIf=\"model[field.name]\" (click)=\"fileClear(field.name)\" title=\"Clear\">\n                                    <i class=\"icon-cross\"></i>\n                                </button>\n                                <div class=\"pt-2 text-secondary\" *ngIf=\"selectedItems[field.name]\">\n                                    <i class=\"icon-file\"></i>\n                                    {{selectedItems[field.name]}}\n                                </div>\n                                <div *ngIf=\"formErrors[field.name]\" class=\"alert alert-danger\">\n                                    {{formErrors[field.name]}}\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"row\" *ngSwitchCase=\"'color'\">\n                            <div class=\"col-md-5\">\n                                <label for=\"field_{{field.name}}\">\n                                    {{field.title}}\n                                    <span class=\"text-danger\" *ngIf=\"field.required\">*</span>\n                                </label>\n                            </div>\n                            <div class=\"col-md-7\">\n                                <input type=\"color\" id=\"field_{{field.name}}\" [name]=\"field.name\" [formControlName]=\"field.name\" [(ngModel)]=\"model[field.name]\" class=\"form-control\">\n                                <div *ngIf=\"formErrors[field.name]\" class=\"alert alert-danger\">\n                                    {{formErrors[field.name]}}\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"row\" *ngSwitchCase=\"'rich_text'\">\n                            <div class=\"col-12\">\n                                <label for=\"field_{{field.name}}\">\n                                    {{field.title}}\n                                    <span class=\"text-danger\" *ngIf=\"field.required\">*</span>\n                                </label>\n                                <p-editor [formControlName]=\"field.name\"\n                                          [(ngModel)]=\"model[field.name]\"\n                                          [formats]=\"field.inputProperties.formats\"\n                                          [style]=\"{'height':'320px'}\">\n                                    <p-header>\n                                        <span class=\"ql-formats\">\n                                            <select class=\"ql-header\" *ngIf=\"field.inputProperties.formats.indexOf('header') > -1\"></select>\n                                            <select class=\"ql-font\" *ngIf=\"field.inputProperties.formats.indexOf('font') > -1\"></select>\n                                            <select class=\"ql-size\" *ngIf=\"field.inputProperties.formats.indexOf('size') > -1\"></select>\n                                        </span>\n                                        <span class=\"ql-formats\">\n                                            <button class=\"ql-bold\" aria-label=\"Bold\" *ngIf=\"field.inputProperties.formats.indexOf('bold') > -1\"></button>\n                                            <button class=\"ql-italic\" aria-label=\"Italic\" *ngIf=\"field.inputProperties.formats.indexOf('italic') > -1\"></button>\n                                            <button class=\"ql-underline\" aria-label=\"Underline\" *ngIf=\"field.inputProperties.formats.indexOf('underline') > -1\"></button>\n                                            <button class=\"ql-strike\" aria-label=\"Strike\" *ngIf=\"field.inputProperties.formats.indexOf('strike') > -1\"></button>\n                                        </span>\n                                        <span class=\"ql-formats\">\n                                            <select class=\"ql-color\" *ngIf=\"field.inputProperties.formats.indexOf('color') > -1\"></select>\n                                            <select class=\"ql-background\" *ngIf=\"field.inputProperties.formats.indexOf('background') > -1\"></select>\n                                        </span>\n                                        <span class=\"ql-formats\">\n                                            <button class=\"ql-list\" value=\"ordered\" aria-label=\"Ordered List\" *ngIf=\"field.inputProperties.formats.indexOf('list') > -1\"></button>\n                                            <button class=\"ql-list\" value=\"bullet\" aria-label=\"Unordered List\" *ngIf=\"field.inputProperties.formats.indexOf('list') > -1\"></button>\n                                            <select class=\"ql-align\" *ngIf=\"field.inputProperties.formats.indexOf('align') > -1\"></select>\n                                        </span>\n                                        <span class=\"ql-formats\">\n                                            <button class=\"ql-link\" aria-label=\"Insert Link\" *ngIf=\"field.inputProperties.formats.indexOf('link') > -1\"></button>\n                                            <button class=\"ql-image\" aria-label=\"Insert Image\" *ngIf=\"field.inputProperties.formats.indexOf('image') > -1\"></button>\n                                            <button class=\"ql-video\" aria-label=\"Insert Video\" *ngIf=\"field.inputProperties.formats.indexOf('video') > -1\"></button>\n                                            <button class=\"ql-code-block\" aria-label=\"Insert Code Block\" *ngIf=\"field.inputProperties.formats.indexOf('code-block') > -1\"></button>\n                                        </span>\n                                        <span class=\"ql-formats\">\n                                            <button class=\"ql-clean\" aria-label=\"Remove Styles\" *ngIf=\"field.inputProperties.formats.indexOf('clean') > -1\"></button>\n                                        </span>\n                                    </p-header>\n                                </p-editor>\n                                <div *ngIf=\"formErrors[field.name]\" class=\"alert alert-danger\">\n                                    {{formErrors[field.name]}}\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"row\" *ngSwitchCase=\"'date'\">\n                            <div class=\"col-md-5\">\n                                <label for=\"field_{{field.name}}\">\n                                    {{field.title}}\n                                    <span class=\"text-danger\" *ngIf=\"field.required\">*</span>\n                                </label>\n                            </div>\n                            <div class=\"col-md-7\">\n\n                                <p-calendar [formControlName]=\"field.name\"\n                                            [(ngModel)]=\"model[field.name]\"\n                                            [dateFormat]=\"field.inputProperties.format\"\n                                            [showTime]=\"field.inputProperties.show_time\"\n                                            [hourFormat]=\"field.inputProperties.hour_format\"\n                                            [locale]=\"calendarLocale[field.inputProperties.locale]\"\n                                            [showButtonBar]=\"true\"\n                                            [showIcon]=\"true\"\n                                            [icon]=\"'icon-date_range'\"></p-calendar>\n\n                                <div *ngIf=\"formErrors[field.name]\" class=\"alert alert-danger\">\n                                    {{formErrors[field.name]}}\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"row\" *ngSwitchCase=\"'select'\">\n                            <div class=\"col-md-5\">\n                                <label for=\"field_{{field.name}}\">\n                                    {{field.title}}\n                                    <span class=\"text-danger\" *ngIf=\"field.required\">*</span>\n                                </label>\n                            </div>\n                            <div class=\"col-md-7\">\n                                <select id=\"field_{{field.name}}\" [name]=\"field.name\" [formControlName]=\"field.name\" [(ngModel)]=\"model[field.name]\" class=\"form-control\">\n                                    <option *ngFor=\"let opt of field.options\" [value]=\"opt.value\">{{opt.title}}</option>\n                                </select>\n                                <div *ngIf=\"formErrors[field.name]\" class=\"alert alert-danger\">\n                                    {{formErrors[field.name]}}\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"row\" *ngSwitchCase=\"'radio'\">\n                            <div class=\"col-md-5\">\n                                <label for=\"field_{{field.name}}\">\n                                    {{field.title}}\n                                    <span class=\"text-danger\" *ngIf=\"field.required\">*</span>\n                                </label>\n                            </div>\n                            <div class=\"col-md-7\">\n                                <label class=\"mr-3\" *ngFor=\"let opt of field.options\">\n                                    <input type=\"radio\" [name]=\"field.name\" [value]=\"opt.value\" [formControlName]=\"field.name\" [(ngModel)]=\"model[field.name]\">\n                                    {{opt.title}}\n                                </label>\n                                <div *ngIf=\"formErrors[field.name]\" class=\"alert alert-danger\">\n                                    {{formErrors[field.name]}}\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"row\" *ngSwitchCase=\"'checkbox'\">\n                            <div class=\"col-md-5\">\n                                <label for=\"field_{{field.name}}\">\n                                    {{field.title}}\n                                    <span class=\"text-danger\" *ngIf=\"field.required\">*</span>\n                                </label>\n                            </div>\n                            <div class=\"col-md-7\">\n                                <label class=\"mr-3\" *ngFor=\"let opt of field.options; let index=index\">\n                                    <input type=\"checkbox\" [name]=\"field.name + index\" [value]=\"opt.value\" (change)=\"selectValue($event, field.name, opt.value)\" [checked]=\"fieldsMultivalues[field.name].checked[index]\">\n                                    {{opt.title}}\n                                </label>\n                                <div *ngIf=\"formErrors[field.name]\" class=\"alert alert-danger\">\n                                    {{formErrors[field.name]}}\n                                </div>\n                            </div>\n                        </div>\n\n                        <div class=\"row\" *ngSwitchCase=\"'tags'\">\n                            <div class=\"col-md-5\">\n                                <label for=\"field_{{field.name}}\">\n                                    {{field.title}}\n                                    <span class=\"text-danger\" *ngIf=\"field.required\">*</span>\n                                </label>\n                            </div>\n                            <div class=\"col-md-7\">\n\n                                <p-chips [formControlName]=\"field.name\" [(ngModel)]=\"model[field.name]\"></p-chips>\n\n                                <div *ngIf=\"formErrors[field.name]\" class=\"alert alert-danger\">\n                                    {{formErrors[field.name]}}\n                                </div>\n                            </div>\n                        </div>\n\n                    </div>\n\n                </div>\n\n            </div>\n        </ng-template>\n    </ngb-tab>\n</ngb-tabset>\n"

/***/ }),

/***/ "../../../../../src/app/templates/render-output-field.html":
/***/ (function(module, exports) {

module.exports = "<div [ngSwitch]=\"outputType\">\n    <div *ngSwitchCase=\"'boolean'\" class=\"text-center\">\n        <i class=\"big text-success icon-circle-check\" [hidden]=\"!value\"></i>\n        <i class=\"big text-muted icon-circle-cross\" [hidden]=\"value\"></i>\n    </div>\n    <div *ngSwitchDefault>{{value}}</div>\n</div>"

/***/ }),

/***/ "../../../../../src/environments/environment.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ "../../../../../src/main.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../../../core/@angular/core.es5.js");
var platform_browser_dynamic_1 = __webpack_require__("../../../platform-browser-dynamic/@angular/platform-browser-dynamic.es5.js");
var i18n_providers_1 = __webpack_require__("../../../../../src/app/i18n-providers.ts");
var app_module_1 = __webpack_require__("../../../../../src/app/app.module.ts");
var environment_1 = __webpack_require__("../../../../../src/environments/environment.ts");
if (environment_1.environment.production) {
    core_1.enableProdMode();
}
//platformBrowserDynamic().bootstrapModule(AppModule);
i18n_providers_1.getTranslationProviders().then(function (providers) {
    var options = { providers: providers };
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule, options);
});
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map