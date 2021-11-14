!function(){"use strict";function e(e,o){if("function"!=typeof o&&null!==o)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(o&&o.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),o&&t(e,o)}function t(e,o){return(t=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,o)}function o(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(e){return!1}}();return function(){var o,r=i(e);if(t){var a=i(this).constructor;o=Reflect.construct(r,arguments,a)}else o=r.apply(this,arguments);return n(this,o)}}function n(e,t){if(t&&("object"==typeof t||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}function i(e){return(i=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function s(e,t,o){return t&&a(e.prototype,t),o&&a(e,o),e}(self.webpackChunkshk_app=self.webpackChunkshk_app||[]).push([["src_app_users_users_module_ts"],{83919:function(e,t,o){o.d(t,{B:function(){return p}});var n,i=o(93324),a=o(6006),l=o(27194),c=o(45341),u=o(36729),d=o(42741),m=o(77924),f=o(81633),h=["formEl"],p=((n=function(){function e(t,o,n,i,s,l){r(this,e),this.fb=t,this.activeModal=o,this.translateService=n,this.systemNameService=i,this.dataService=s,this.elRef=l,this.modalId="",this._formFieldsErrors={},this.submitted=!1,this.loading=!1,this.dataLoaded=!1,this.closeReason="canceled",this.files={},this.formFields=[],this.arrayFields={},this.isSaveButtonDisabled=!1,this.localeDefault="",this.localeCurrent="",this.localeFieldsAllowed=[],this.localePreviousValues={},this.uniqueId="",this.destroyed$=new a.xQ}return s(e,[{key:"formErrors",get:function(){return this._formFieldsErrors},set:function(e){for(var t in e)if(e.hasOwnProperty(t)){var o=this.getControl(this.form,null,t);o&&o.setErrors({incorrect:!0})}this._formFieldsErrors=e}},{key:"ngOnInit",value:function(){var e=this;this.uniqueId=this.createUniqueId(),this.elRef&&this.getRootElement().setAttribute("id",this.modalId),this.onBeforeInit(),this.buildForm(),this.isEditMode||this.isItemCopy?this.getModelData().then(function(){e.onAfterGetData()}):this.onAfterGetData(),this.onAfterInit()}},{key:"onBeforeInit",value:function(){}},{key:"onAfterInit",value:function(){}},{key:"onAfterGetData",value:function(){this.dataLoaded=!0,this.buildControls(this.form,this.formFields)}},{key:"getSystemFieldName",value:function(){return""}},{key:"getLangString",value:function(e){return this.translateService.store.translations[this.translateService.currentLang][e]||e}},{key:"getModelData",value:function(){var e=this;return this.loading=!0,new Promise(function(t,o){e.dataService.getItem(e.itemId).pipe((0,l.R)(e.destroyed$)).subscribe({next:function(o){if(e.isItemCopy){o.id=null;var n=e.getSystemFieldName();n&&(o[n]="")}Object.assign(e.model,o),e.loading=!1,t(o)},error:function(t){e.errorMessage=t.error||e.getLangString("ERROR"),e.loading=!1,o(t)}})})}},{key:"buildForm",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"form",o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"model";o||(o=this.formFields),this[t]=this.fb.group(this.buildControls(null,o,i)),this[t].valueChanges.pipe((0,l.R)(this.destroyed$)).subscribe(function(){return e.onValueChanged(t,n)})}},{key:"buildControls",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"model",i={};return o.forEach(function(o){var r=t?e.getControl(t,o):null,a=null;if(n&&e[n]?(e[n].options||(e[n].options={}),a=0===o.name.indexOf("options_")?e[n].options[o.name.substr(8)]||null:e[n][o.name]||null):a=null,r)if(o.disabled&&r.disable(),o.children){var s=a,l=r;l.clear(),s.forEach(function(t,n){var i=e.getFormFieldByName(o.name),r=e.buildControls(null,i.children,null);l.push(e.fb.group(r))}),l.patchValue(s)}else r.setValue(a);else o.children?(i[o.name]=e.fb.array([]),e.createArrayFieldsProperty(o.name)):i[o.name]=e.fb.control({value:a,disabled:o.disabled||!1},o.validators)}),i}},{key:"onValueChanged",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"form",o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;this[t]&&(o||(o=this.formErrors),this[t].valid&&(this.errorMessage=""),Object.keys(this[t].value).forEach(function(n){o[n]="";var i=e.getControl(e[t],null,n);if(i&&!i.valid&&i.errors){var r="";Object.keys(i.errors).forEach(function(t){r+=(r?" ":"")+e.getLangString("INVALID_"+t.toUpperCase())}),o[n]=r}}))}},{key:"getFormFieldByName",value:function(e){var t=this.formFields.filter(function(t){return t.name===e});return t.length>0?t[0]:null}},{key:"createArrayFieldsProperty",value:function(e){var t=this;Object.defineProperty(this.arrayFields,e,{get:function(){return t.form?t.form.get(e):null}})}},{key:"getControl",value:function(e,t,o){return e?e.get(o||t.name):null}},{key:"focusFormError",value:function(){var e=this;setTimeout(function(){e.formEl.nativeElement.querySelector(".form-control.is-invalid")&&e.formEl.nativeElement.querySelector(".form-control.is-invalid").focus()},1)}},{key:"formGroupMarkTouched",value:function(e){var t=this;Object.keys(e.controls).forEach(function(o){e.controls[o].markAsTouched(),e.controls[o]instanceof i.Oe&&Array.from(t.form.controls[o].controls).forEach(function(e){t.formGroupMarkTouched(e)})})}},{key:"getSaveRequest",value:function(e){return e.id||"root"===e.name?this.dataService.update(e):this.dataService.create(e)}},{key:"getFormData",value:function(){var e=this.form.value;return e.id=this.model.id||0,void 0!==this.model.translations&&(e.translations=this.model.translations||null),e}},{key:"arrayFieldDelete",value:function(e,t,o){o&&o.preventDefault(),this.arrayFields[e].removeAt(t)}},{key:"arrayFieldAdd",value:function(e,t){t&&t.preventDefault();var o=this.getFormFieldByName(e);if(o){var n=this.buildControls(null,o.children,null);this.arrayFields[e].push(this.fb.group(n))}}},{key:"generateName",value:function(e,t){var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;t&&t.preventDefault(),o||(o=this.form);var n=this.getControl(o,null,"title").value||"";e.name=this.systemNameService.generateName(n),this.getControl(o,null,"name").setValue(e.name)}},{key:"closeModal",value:function(e){e&&e.preventDefault(),this.close(this.closeReason)}},{key:"close",value:function(e,t){t&&t.preventDefault(),"submit"===e?this.activeModal.close(e):this.activeModal.dismiss(e)}},{key:"minimize",value:function(e){e&&e.preventDefault(),window.document.body.classList.remove("modal-open");var t=this.getRootElement(),o=t.previousElementSibling;t.classList.remove("d-block"),t.classList.add("modal-minimized"),o.classList.add("d-none")}},{key:"maximize",value:function(e){e&&e.preventDefault(),window.document.body.classList.add("modal-open");var t=this.getRootElement(),o=t.previousElementSibling;t.classList.add("d-block"),t.classList.remove("modal-minimized"),o.classList.remove("d-none")}},{key:"save",value:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=arguments.length>1?arguments[1]:void 0;t&&t.preventDefault(),this.onSubmit(e)}},{key:"saveFiles",value:function(e){var t=this;if(0!==Object.keys(this.files).length){var o=new FormData;for(var n in this.files)this.files.hasOwnProperty(n)&&this.files[n]instanceof File&&o.append(n,this.files[n],this.files[n].name);o.append("itemId",String(e)),this.dataService.postFormData(o).pipe((0,l.R)(this.destroyed$)).subscribe({next:function(){t.close("submit")},error:function(e){t.errorMessage=e.error||t.getLangString("ERROR"),t.submitted=!1,t.loading=!1}})}else this.close("submit")}},{key:"onSubmit",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(this.formGroupMarkTouched(this.form),!this.form.valid)return this.errorMessage=this.getLangString("PLEASE_FIX_FORM_ERRORS"),void this.focusFormError();this.errorMessage="",this.loading=!0,this.submitted=!0;var o=this.getFormData();this.getSaveRequest(o).pipe((0,l.R)(this.destroyed$)).subscribe({next:function(o){Object.keys(e.files).length>0?e.saveFiles(o._id||o.id):t&&e.close("submit"),o&&o.id&&(e.model.id=o.id),e.closeReason="updated",e.loading=!1,e.submitted=!1},error:function(t){t.error&&(e.errorMessage=t.error),t.errors&&(e.formErrors=t.errors,e.errorMessage=e.getLangString("PLEASE_FIX_FORM_ERRORS")),e.loading=!1,e.submitted=!1}})}},{key:"onLocaleSwitch",value:function(){var e=this;if(this.localeCurrent===this.localeDefault)return this.localeFieldsAllowed.forEach(function(t){e.model[t]=e.localePreviousValues[t],e.getControl(e.form,null,t).setValue(e.localePreviousValues[t])}),void(this.isSaveButtonDisabled=!1);this.model.translations||(this.model.translations={}),this.isSaveButtonDisabled=!0,this.localeFieldsAllowed.forEach(function(t){e.localePreviousValues[t]=e.getControl(e.form,null,t).value,e.model.translations[t]?(e.model[t]=e.model.translations[t][e.localeCurrent]||"",e.getControl(e.form,null,t).setValue(e.model[t])):(e.model[t]="",e.getControl(e.form,null,t).setValue(""))})}},{key:"saveTranslations",value:function(e){var t=this;e&&e.preventDefault(),this.localeFieldsAllowed.forEach(function(e){t.getControl(t.form,null,e)&&t.getControl(t.form,null,e).value?(t.model.translations[e]||(t.model.translations[e]={}),t.model.translations[e][t.localeCurrent]=t.getControl(t.form,null,e).value):t.model.translations[e]&&(t.model.translations[e][t.localeCurrent]&&delete t.model.translations[e][t.localeCurrent],0===Object.keys(t.model.translations[e]).length&&delete t.model.translations[e])}),this.localeCurrent=this.localeDefault,this.onLocaleSwitch()}},{key:"emailValidator",value:function(e){return e.value?/\S+@\S+\.\S+/.test(e.value)?void 0:{email:!0}:{required:!0}}},{key:"getRootElement",value:function(){return this.elRef.nativeElement.parentNode.parentNode.parentNode}},{key:"createUniqueId",value:function(){return Math.random().toString(36).substr(2,9)}},{key:"displayToggle",value:function(e,t,o){o&&o.preventDefault(),e.style.display=(t=t||"none"===e.style.display)?"block":"none"}},{key:"ngOnDestroy",value:function(){this.destroyed$.next(),this.destroyed$.complete()}}]),e}()).\u0275fac=function(e){return new(e||n)(d.Y36(i.qu),d.Y36(m.Kz),d.Y36(f.sK),d.Y36(u.U),d.Y36(c.D),d.Y36(d.SBq))},n.\u0275cmp=d.Xpm({type:n,selectors:[["ng-component"]],viewQuery:function(e,t){var o;1&e&&d.Gf(h,5),2&e&&d.iGM(o=d.CRH())&&(t.formEl=o.first)},inputs:{modalTitle:"modalTitle",itemId:"itemId",modalId:"modalId",isItemCopy:"isItemCopy",isEditMode:"isEditMode"},decls:0,vars:0,template:function(e,t){},encapsulation:2}),n)},36828:function(e,t,o){o.d(t,{U:function(){return p}});var n,i=o(6006),a=o(27194),l=o(48254),c=o(45341),u=o(80094),d=o(42741),m=o(77924),f=o(81633),h=["table"],p=((n=function(){function e(t,o,n,a){r(this,e),this.dataService=t,this.activeModal=o,this.modalService=n,this.translateService=a,this.items=[],this.loading=!1,this.selectedIds=[],this.collectionSize=0,this.queryOptions=new l.J("name","asc",1,10,0,0),this.destroyed$=new i.xQ}return s(e,[{key:"ngOnInit",value:function(){this.getList(),this.afterInit()}},{key:"afterInit",value:function(){}},{key:"onSearchClear",value:function(){this.getList()}},{key:"onModalClose",value:function(e){}},{key:"onSearchWordUpdate",value:function(e){var t=this;if(void 0!==e)return this.queryOptions.search_word=e,this.queryOptions.page=1,void(this.queryOptions.search_word?this.getList():this.onSearchClear());clearTimeout(this.searchTimer),this.searchTimer=setTimeout(function(){t.queryOptions.page=1,t.getList()},700)}},{key:"getModalElementId",value:function(e){return["modal",e||0].join("-")}},{key:"setModalInputs",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",n=void 0!==e&&!t;this.modalRef.componentInstance.modalTitle=this.getLangString(n?"EDITING":"ADD"),this.modalRef.componentInstance.modalId=o,this.modalRef.componentInstance.itemId=e||0,this.modalRef.componentInstance.isItemCopy=t||!1,this.modalRef.componentInstance.isEditMode=n}},{key:"modalOpen",value:function(e){var t=this,o=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=this.getModalElementId(e);if(window.document.body.classList.add("modal-open"),window.document.getElementById(n)){var i=window.document.getElementById(n),r=i.previousElementSibling;return i.classList.add("d-block"),i.classList.remove("modal-minimized"),void r.classList.remove("d-none")}this.modalRef=this.modalService.open(this.getModalContent(),{size:"lg",backdrop:"static",keyboard:!1,backdropClass:"modal-backdrop-left45",windowClass:"modal-left45",container:"#modals-container"}),this.setModalInputs(e,o,n),this.modalRef.result.then(function(e){t.destroyed$.isStopped||(t.onModalClose(e),t.getList())},function(e){t.destroyed$.isStopped||(t.onModalClose(e),e&&["submit","updated"].indexOf(e)>-1&&t.getList())})}},{key:"deleteItemConfirm",value:function(e){var t=this;this.modalRef=this.modalService.open(u.q0),this.modalRef.componentInstance.modalTitle=this.getLangString("CONFIRM"),this.modalRef.componentInstance.modalContent=this.getLangString("YOU_SURE_YOU_WANT_DELETE"),this.modalRef.result.then(function(o){"accept"===o&&t.deleteItem(e)})}},{key:"getLangString",value:function(e){return this.translateService.store.translations[this.translateService.currentLang]&&this.translateService.store.translations[this.translateService.currentLang][e]||e}},{key:"confirmAction",value:function(e){return this.modalRef=this.modalService.open(u.q0),this.modalRef.componentInstance.modalTitle=this.getLangString("CONFIRM"),this.modalRef.componentInstance.modalContent=e,this.modalRef.result}},{key:"blockSelected",value:function(){var e=this;0!==this.selectedIds.length?this.dataService.actionBatch(this.selectedIds,"block").subscribe(function(t){e.clearSelected(),e.getList()},function(t){return e.showAlert(t.error||e.getLangString("ERROR"))}):this.showAlert(this.getLangString("NOTHING_IS_SELECTED"))}},{key:"deleteSelected",value:function(){var e=this;0!==this.selectedIds.length?this.confirmAction(this.getLangString("YOU_SURE_YOU_WANT_DELETE_SELECTED")).then(function(t){"accept"===t&&e.dataService.actionBatch(e.selectedIds,"delete").subscribe(function(t){e.clearSelected(),e.getList()},function(t){return e.showAlert(t.error||e.getLangString("ERROR"))})}):this.showAlert(this.getLangString("NOTHING_IS_SELECTED"))}},{key:"showAlert",value:function(e){this.modalRef=this.modalService.open(u.$N),this.modalRef.componentInstance.modalContent=e,this.modalRef.componentInstance.modalTitle=this.getLangString("ERROR"),this.modalRef.componentInstance.messageType="error"}},{key:"deleteItem",value:function(e){var t=this;this.confirmAction(this.getLangString("YOU_SURE_YOU_WANT_DELETE")).then(function(o){"accept"===o&&t.dataService.deleteItem(e).subscribe(function(e){t.getList()},function(e){e.error&&t.showAlert(e.error)})})}},{key:"clearSelected",value:function(){this.table&&this.table.clearSelected()}},{key:"actionRequest",value:function(e){switch(e[0]){case"edit":this.modalOpen(e[1]);break;case"copy":this.modalOpen(e[1],!0);break;case"delete":this.deleteItem(e[1]);break;case"changeQuery":this.getList()}}},{key:"getList",value:function(){var e=this;this.loading=!0,this.dataService.getListPage(this.queryOptions).pipe((0,a.R)(this.destroyed$)).subscribe({next:function(t){e.items=t.items,e.collectionSize=t.total,e.loading=!1},error:function(t){e.items=[],e.collectionSize=0,t.error&&e.showAlert(t.error),e.loading=!1}})}},{key:"ngOnDestroy",value:function(){this.destroyed$.next(),this.destroyed$.complete()}}]),e}()).title="",n.\u0275fac=function(e){return new(e||n)(d.Y36(c.D),d.Y36(m.Kz),d.Y36(m.FF),d.Y36(f.sK))},n.\u0275dir=d.lG2({type:n,viewQuery:function(e,t){var o;1&e&&d.Gf(h,7),2&e&&d.iGM(o=d.CRH())&&(t.table=o.first)}}),n)},59552:function(t,n,i){i.r(n),i.d(n,{UsersModule:function(){return z}});var a,l=i(16274),c=i(51903),u=i(58335),d=i(93324),m=i(27194),f=i(88561),h=i(46243),p=function e(t,o,n,i,a,s,l,c,u,d,m){r(this,e),this.id=t,this.email=o,this.fullName=n,this.roles=i,this.isActive=a,this.options=s,this.role=l,this.phone=c,this.password=u,this.confirmPassword=d,this.apiToken=m},g=i(36828),v=i(36729),Z=i(72072),b=i(45341),y=i(42741),A=i(31887),q=((a=function(t){e(i,t);var n=o(i);function i(e){var t;return r(this,i),(t=n.call(this,e)).setRequestUrl("/admin/users"),t}return s(i,[{key:"getRolesList",value:function(){var e=this.getRequestUrl()+"/roles";return this.http.get(e,{headers:this.headers}).pipe((0,Z.K)(this.handleError()))}},{key:"createApiToken",value:function(){var e=this.getRequestUrl()+"/create_api_token";return this.http.post(e,{},{headers:this.headers}).pipe((0,Z.K)(this.handleError()))}}]),i}(b.D)).\u0275fac=function(e){return new(e||a)(y.LFG(A.eN))},a.\u0275prov=y.Yz7({token:a,factory:a.\u0275fac}),a),T=i(63005),k=i(48254),E=i(83919),S=i(77924),I=i(81633),_=i(79226);function w(e,t){if(1&e&&(y.TgZ(0,"div",51),y._uU(1),y.qZA()),2&e){var o=y.oxw();y.xp6(1),y.hij(" ",o.formErrors.email," ")}}function x(e,t){if(1&e&&(y.TgZ(0,"div",51),y._uU(1),y.qZA()),2&e){var o=y.oxw();y.xp6(1),y.hij(" ",o.formErrors.fullName," ")}}function C(e,t){if(1&e&&(y.TgZ(0,"div",51),y._uU(1),y.qZA()),2&e){var o=y.oxw();y.xp6(1),y.hij(" ",o.formErrors.phone," ")}}function L(e,t){if(1&e&&(y.ynx(0),y.TgZ(1,"option",52),y._uU(2),y.qZA(),y.BQk()),2&e){var o=t.$implicit;y.xp6(1),y.Q6J("value",o.name),y.xp6(1),y.Oqu(o.title)}}function R(e,t){if(1&e&&(y.TgZ(0,"div",51),y._uU(1),y.qZA()),2&e){var o=y.oxw();y.xp6(1),y.hij(" ",o.formErrors.password," ")}}function O(e,t){if(1&e&&(y.TgZ(0,"div",51),y._uU(1),y.qZA()),2&e){var o=y.oxw();y.xp6(1),y.hij(" ",o.formErrors.password," ")}}function N(e,t){if(1&e&&(y.TgZ(0,"div",51),y._uU(1),y.qZA()),2&e){var o=y.oxw();y.xp6(1),y.hij(" ",o.formErrors.confirmPassword," ")}}var U=function(e){return{"is-invalid":e}};function M(e,t){if(1&e){var o=y.EpF();y.TgZ(0,"tr",64),y.TgZ(1,"td"),y._UZ(2,"input",65),y.qZA(),y.TgZ(3,"td"),y._UZ(4,"input",66),y.qZA(),y.TgZ(5,"td",67),y._UZ(6,"input",68),y.qZA(),y.TgZ(7,"td",67),y.TgZ(8,"button",69),y.NdJ("click",function(e){var t=y.CHM(o).index;return y.oxw(3).arrayFieldDelete("options",t,e)}),y.ALo(9,"translate"),y._UZ(10,"i",11),y.qZA(),y.qZA(),y.qZA()}if(2&e){var n=t.$implicit;y.Q6J("formGroupName",t.index+""),y.xp6(2),y.Q6J("ngClass",y.VKq(7,U,n.controls.name.touched&&!n.controls.name.valid)),y.xp6(2),y.Q6J("ngClass",y.VKq(9,U,n.controls.title.touched&&!n.controls.title.valid)),y.xp6(2),y.Q6J("ngClass",y.VKq(11,U,n.controls.value.touched&&!n.controls.value.valid)),y.xp6(2),y.s9C("ngbTooltip",y.lcZ(9,5,"DELETE"))}}function F(e,t){if(1&e&&(y.TgZ(0,"tbody"),y.YNc(1,M,11,13,"tr",63),y.qZA()),2&e){var o=y.oxw(2);y.xp6(1),y.Q6J("ngForOf",o.arrayFields.options.controls)}}function D(e,t){if(1&e){var o=y.EpF();y.TgZ(0,"div",53),y.TgZ(1,"table",54),y.TgZ(2,"colgroup"),y._UZ(3,"col",55),y._UZ(4,"col",55),y._UZ(5,"col",56),y._UZ(6,"col",57),y.qZA(),y.TgZ(7,"thead"),y.TgZ(8,"tr"),y.TgZ(9,"th"),y._uU(10),y.ALo(11,"translate"),y.qZA(),y.TgZ(12,"th"),y._uU(13),y.ALo(14,"translate"),y.qZA(),y.TgZ(15,"th"),y._uU(16),y.ALo(17,"translate"),y.qZA(),y._UZ(18,"th"),y.qZA(),y.qZA(),y.YNc(19,F,2,1,"tbody",58),y.TgZ(20,"tfoot"),y.TgZ(21,"tr",59),y.TgZ(22,"td",60),y.TgZ(23,"button",61),y.NdJ("click",function(e){return y.CHM(o),y.oxw().arrayFieldAdd("options",e)}),y._UZ(24,"i",62),y._uU(25," \xa0 "),y.TgZ(26,"span"),y._uU(27),y.ALo(28,"translate"),y.qZA(),y.qZA(),y.qZA(),y.qZA(),y.qZA(),y.qZA(),y.qZA()}if(2&e){var n=y.oxw();y.xp6(10),y.Oqu(y.lcZ(11,5,"SYSTEM_NAME")),y.xp6(3),y.Oqu(y.lcZ(14,7,"NAME")),y.xp6(3),y.Oqu(y.lcZ(17,9,"VALUE")),y.xp6(3),y.Q6J("ngIf",n.arrayFields.options),y.xp6(8),y.Oqu(y.lcZ(28,11,"ADD"))}}function J(e,t){if(1&e){var o=y.EpF();y.TgZ(0,"div",70),y._uU(1),y.TgZ(2,"button",71),y.NdJ("click",function(){return y.CHM(o),y.oxw().errorMessage=""}),y.qZA(),y.qZA()}if(2&e){var n=y.oxw();y.xp6(1),y.hij(" ",n.errorMessage," ")}}function Y(e,t){if(1&e&&(y.TgZ(0,"div",72),y.TgZ(1,"a",73),y.TgZ(2,"span"),y._uU(3),y.ALo(4,"translate"),y.qZA(),y.qZA(),y.qZA()),2&e){var o=y.oxw();y.xp6(1),y.hYB("href","",o.baseUrl,"?_switch_user=",o.model.email,"",y.LSH),y.xp6(2),y.Oqu(y.lcZ(4,3,"IMPERSONATION"))}}var j=function(e){return{"no-events":e}},P=function(e){return{"form-control-search-clear":e}},Q=function(){var t=function(t){e(i,t);var n=o(i);function i(e,t,o,a,s,l,c){var u;return r(this,i),(u=n.call(this,e,t,o,a,s,l)).fb=e,u.activeModal=t,u.translateService=o,u.systemNameService=a,u.dataService=s,u.elRef=l,u.appSettings=c,u.allowImpersonation=!1,u.model=new p(0,"","",[],!0,[]),u.formFields=[{name:"email",validators:[d.kI.required,u.emailValidator]},{name:"fullName",validators:[d.kI.required]},{name:"phone",validators:[]},{name:"role",validators:[d.kI.required]},{name:"isActive",validators:[]},{name:"password",validators:[]},{name:"confirmPassword",validators:[]},{name:"apiToken",validators:[]},{name:"options",validators:[],children:[{name:"name",validators:[d.kI.required]},{name:"title",validators:[d.kI.required]},{name:"value",validators:[d.kI.required]}]}],u}return s(i,[{key:"onBeforeInit",value:function(){if(!this.isEditMode){var e=(0,h.findIndex)(this.formFields,{name:"password"});e>-1&&(this.formFields[e].validators.push(d.kI.required),this.formFields[e+1].validators.push(d.kI.required))}this.baseUrl=T.d.getBaseUrl(),this.getUserRoles()}},{key:"onAfterGetData",value:function(){this.buildControls(this.form,this.formFields),this.isEditMode&&this.appSettings.isSuperAdmin&&this.appSettings.settings.userEmail!==this.model.email&&(this.allowImpersonation=!0)}},{key:"getUserRoles",value:function(){this.userRoles$=this.dataService.getRolesList().pipe((0,m.R)(this.destroyed$),(0,f.U)(function(e){return e.roles}))}},{key:"clearApiToken",value:function(e){e&&e.preventDefault(),this.getControl(this.form,null,"apiToken").setValue("")}},{key:"generateApiToken",value:function(e){var t=this;e&&e.preventDefault(),this.loading=!0,this.dataService.createApiToken().pipe((0,m.R)(this.destroyed$)).subscribe({next:function(e){t.getControl(t.form,null,"apiToken").setValue(e.token),t.loading=!1},error:function(e){t.errorMessage=e.error||t.getLangString("ERROR"),t.loading=!1}})}}]),i}(E.B);return t.\u0275fac=function(e){return new(e||t)(y.Y36(d.qu),y.Y36(S.Kz),y.Y36(I.sK),y.Y36(v.U),y.Y36(q),y.Y36(y.SBq),y.Y36(T.d))},t.\u0275cmp=y.Xpm({type:t,selectors:[["app-modal-user"]],features:[y._Bn([]),y.qOj],decls:118,vars:96,consts:[[1,"position-relative","modal-on-maximized"],[1,"tabs-top"],["type","button",1,"btn","btn-outline-primary","btn-sm","d-block",3,"disabled","click"],[1,"icon-cross","me-1"],[1,"icon-minimize","me-1"],[1,"modal-header","d-block"],[1,"position-relative","modal-on-minimized"],[1,"pos-absolute-right"],["type","button",1,"btn","btn-no-border","btn-sm-sm",3,"title","click"],[1,"icon-maximize"],["type","button",1,"btn","btn-no-border","btn-sm-sm","ms-1",3,"title","click"],[1,"icon-cross"],[1,"modal-title","text-overflow","me-5"],["method","post",3,"formGroup","ngClass","ngSubmit"],["formEl",""],[1,"modal-body","py-0"],[1,"row"],[1,"col-lg-6"],[1,"mb-2","form-group-message"],[1,"label-filled"],["type","text","autocomplete","off","formControlName","email",1,"form-control",3,"ngClass"],["class","alert alert-danger",4,"ngIf"],["type","text","autocomplete","off","formControlName","fullName",1,"form-control",3,"ngClass"],["type","text","formControlName","phone","autocomplete","off",1,"form-control"],["formControlName","role",1,"form-select",3,"ngClass"],[4,"ngFor","ngForOf"],["type","password","autocomplete","off","formControlName","password",1,"form-control",3,"ngClass"],["type","password","autocomplete","off","formControlName","confirmPassword",1,"form-control",3,"ngClass"],[1,"mb-2"],[1,"input-group"],["type","text","name","apiToken","autocomplete","off","formControlName","apiToken",1,"form-control"],["type","button","container","body",1,"btn","btn-secondary",3,"ngbTooltip","click"],[1,"icon-reload"],[1,"mb-2","mt-0","mt-lg-4"],[1,"card","card-body","p-2","ps-3"],[1,"form-check","m-0"],["type","checkbox","value","1","formControlName","isActive",1,"form-check-input",3,"id"],[1,"form-check-label",3,"for"],["activeIds","accordion-user-options",1,"ngb-accordion",3,"closeOthers"],["id","accordion-user-options",3,"title"],["ngbPanelContent",""],["class","alert alert-dismissible alert-danger mt-3 mb-0",4,"ngIf"],[1,"modal-footer","display-block"],["class","float-end",4,"ngIf"],[1,"btn-group","me-1"],["type","button",1,"btn","btn-success","btn-wide",3,"disabled","click"],["ngbDropdown","","role","group","placement","top-right",1,"btn-group"],["type","button","ngbDropdownToggle","",1,"btn","btn-success","dropdown-toggle-split",3,"disabled"],["ngbDropdownMenu","",1,"dropdown-menu","dropdown-menu-end"],["type","button","ngbDropdownItem","",3,"click"],["type","button",1,"btn","btn-secondary","btn-wide",3,"click"],[1,"alert","alert-danger"],[3,"value"],["formArrayName","options"],[1,"table","table-bordered","mb-0"],["width","27%"],["width","39%"],["width","7%"],[4,"ngIf"],[1,"bg-faded"],["colspan","4",1,"text-center"],["type","button",1,"btn","btn-secondary","btn-sm",3,"click"],[1,"icon-plus"],[3,"formGroupName",4,"ngFor","ngForOf"],[3,"formGroupName"],["type","text","formControlName","name",1,"form-control","form-control-sm",3,"ngClass"],["type","text","formControlName","title",1,"form-control","form-control-sm",3,"ngClass"],[1,"text-center"],["type","text","formControlName","value",1,"form-control","form-control-sm",3,"ngClass"],["type","button",1,"btn","btn-secondary","btn-sm",3,"ngbTooltip","click"],[1,"alert","alert-dismissible","alert-danger","mt-3","mb-0"],["type","button",1,"btn-close",3,"click"],[1,"float-end"],[1,"btn","btn-primary",3,"href"]],template:function(e,t){1&e&&(y.TgZ(0,"div",0),y.TgZ(1,"div",1),y.TgZ(2,"button",2),y.NdJ("click",function(e){return t.closeModal(e)}),y._UZ(3,"i",3),y.TgZ(4,"span"),y._uU(5),y.ALo(6,"translate"),y.qZA(),y.qZA(),y.TgZ(7,"button",2),y.NdJ("click",function(e){return t.minimize(e)}),y._UZ(8,"i",4),y.TgZ(9,"span"),y._uU(10),y.ALo(11,"translate"),y.qZA(),y.qZA(),y.qZA(),y.qZA(),y.TgZ(12,"div",5),y.TgZ(13,"div",6),y.TgZ(14,"div",7),y.TgZ(15,"button",8),y.NdJ("click",function(e){return t.maximize(e)}),y.ALo(16,"translate"),y._UZ(17,"i",9),y.qZA(),y.TgZ(18,"button",10),y.NdJ("click",function(e){return t.closeModal(e)}),y.ALo(19,"translate"),y._UZ(20,"i",11),y.qZA(),y.qZA(),y.qZA(),y.TgZ(21,"h4",12),y._uU(22),y.qZA(),y.qZA(),y.TgZ(23,"form",13,14),y.NdJ("ngSubmit",function(){return t.onSubmit()}),y.TgZ(25,"div",15),y.TgZ(26,"div",16),y.TgZ(27,"div",17),y.TgZ(28,"div",18),y.TgZ(29,"label",19),y._uU(30),y.ALo(31,"translate"),y.qZA(),y._UZ(32,"input",20),y.YNc(33,w,2,1,"div",21),y.qZA(),y.qZA(),y.TgZ(34,"div",17),y.TgZ(35,"div",18),y.TgZ(36,"label",19),y._uU(37),y.ALo(38,"translate"),y.qZA(),y._UZ(39,"input",22),y.YNc(40,x,2,1,"div",21),y.qZA(),y.qZA(),y.qZA(),y.TgZ(41,"div",16),y.TgZ(42,"div",17),y.TgZ(43,"div",18),y.TgZ(44,"label",19),y._uU(45),y.ALo(46,"translate"),y.qZA(),y._UZ(47,"input",23),y.YNc(48,C,2,1,"div",21),y.qZA(),y.qZA(),y.TgZ(49,"div",17),y.TgZ(50,"div",18),y.TgZ(51,"label",19),y._uU(52),y.ALo(53,"translate"),y.qZA(),y.TgZ(54,"select",24),y.YNc(55,L,3,2,"ng-container",25),y.ALo(56,"async"),y.qZA(),y.YNc(57,R,2,1,"div",21),y.qZA(),y.qZA(),y.qZA(),y.TgZ(58,"div",16),y.TgZ(59,"div",17),y.TgZ(60,"div",18),y.TgZ(61,"label",19),y._uU(62),y.ALo(63,"translate"),y.qZA(),y._UZ(64,"input",26),y.YNc(65,O,2,1,"div",21),y.qZA(),y.qZA(),y.TgZ(66,"div",17),y.TgZ(67,"div",18),y.TgZ(68,"label",19),y._uU(69),y.ALo(70,"translate"),y.qZA(),y._UZ(71,"input",27),y.YNc(72,N,2,1,"div",21),y.qZA(),y.qZA(),y.qZA(),y.TgZ(73,"div",16),y.TgZ(74,"div",17),y.TgZ(75,"div",28),y.TgZ(76,"label",19),y._uU(77),y.ALo(78,"translate"),y.qZA(),y.TgZ(79,"div",29),y._UZ(80,"input",30),y.TgZ(81,"button",31),y.NdJ("click",function(e){return t.clearApiToken(e)}),y.ALo(82,"translate"),y._UZ(83,"i",11),y.qZA(),y.TgZ(84,"button",31),y.NdJ("click",function(e){return t.generateApiToken(e)}),y.ALo(85,"translate"),y._UZ(86,"i",32),y.qZA(),y.qZA(),y.qZA(),y.qZA(),y.TgZ(87,"div",17),y.TgZ(88,"div",28),y.TgZ(89,"div",33),y.TgZ(90,"div",34),y.TgZ(91,"div",35),y._UZ(92,"input",36),y.TgZ(93,"label",37),y._uU(94),y.ALo(95,"translate"),y.qZA(),y.qZA(),y.qZA(),y.qZA(),y.qZA(),y.qZA(),y.qZA(),y.TgZ(96,"ngb-accordion",38),y.TgZ(97,"ngb-panel",39),y.ALo(98,"translate"),y.YNc(99,D,29,13,"ng-template",40),y.qZA(),y.qZA(),y.YNc(100,J,3,1,"div",41),y.qZA(),y.TgZ(101,"div",42),y.YNc(102,Y,5,5,"div",43),y.TgZ(103,"div",44),y.TgZ(104,"button",45),y.NdJ("click",function(e){return t.save(!0,e)}),y.TgZ(105,"span"),y._uU(106),y.ALo(107,"translate"),y.qZA(),y.qZA(),y.TgZ(108,"div",46),y._UZ(109,"button",47),y.TgZ(110,"div",48),y.TgZ(111,"button",49),y.NdJ("click",function(e){return t.save(!1,e)}),y._uU(112),y.ALo(113,"translate"),y.qZA(),y.qZA(),y.qZA(),y.qZA(),y.TgZ(114,"button",50),y.NdJ("click",function(e){return t.closeModal(e)}),y.TgZ(115,"span"),y._uU(116),y.ALo(117,"translate"),y.qZA(),y.qZA(),y.qZA(),y.qZA()),2&e&&(y.xp6(2),y.Q6J("disabled",t.submitted),y.xp6(3),y.Oqu(y.lcZ(6,46,"CLOSE")),y.xp6(2),y.Q6J("disabled",t.submitted),y.xp6(3),y.Oqu(y.lcZ(11,48,"MINIMIZE")),y.xp6(5),y.Q6J("title",y.lcZ(16,50,"EXPAND")),y.xp6(3),y.Q6J("title",y.lcZ(19,52,"CLOSE")),y.xp6(4),y.Oqu(t.modalTitle),y.xp6(1),y.Q6J("formGroup",t.form)("ngClass",y.VKq(84,j,t.submitted)),y.xp6(2),y.ekj("loading",t.loading),y.xp6(5),y.hij(" ",y.lcZ(31,54,"EMAIL")," "),y.xp6(2),y.Q6J("ngClass",y.VKq(86,U,t.form.controls.email.touched&&!t.form.controls.email.valid)),y.xp6(1),y.Q6J("ngIf",t.formErrors.email),y.xp6(4),y.hij(" ",y.lcZ(38,56,"FULL_NAME")," "),y.xp6(2),y.Q6J("ngClass",y.VKq(88,U,t.form.controls.fullName.touched&&!t.form.controls.fullName.valid)),y.xp6(1),y.Q6J("ngIf",t.formErrors.fullName),y.xp6(5),y.hij(" ",y.lcZ(46,58,"PHONE")," "),y.xp6(3),y.Q6J("ngIf",t.formErrors.phone),y.xp6(4),y.hij(" ",y.lcZ(53,60,"ROLE")," "),y.xp6(2),y.Q6J("ngClass",y.VKq(90,U,t.form.controls.role.touched&&!t.form.controls.role.valid)),y.xp6(1),y.Q6J("ngForOf",y.lcZ(56,62,t.userRoles$)),y.xp6(2),y.Q6J("ngIf",t.formErrors.password),y.xp6(5),y.hij(" ",y.lcZ(63,64,"PASSWORD")," "),y.xp6(2),y.Q6J("ngClass",y.VKq(92,U,t.form.controls.password.touched&&!t.form.controls.password.valid)),y.xp6(1),y.Q6J("ngIf",t.formErrors.password),y.xp6(4),y.hij(" ",y.lcZ(70,66,"CONFIRM_PASSWORD")," "),y.xp6(2),y.Q6J("ngClass",y.VKq(94,U,t.form.controls.confirmPassword.touched&&!t.form.controls.confirmPassword.valid)),y.xp6(1),y.Q6J("ngIf",t.formErrors.confirmPassword),y.xp6(5),y.hij(" ",y.lcZ(78,68,"API_TOKEN")," "),y.xp6(2),y.ekj("is-invalid",t.formErrors.name),y.xp6(2),y.s9C("ngbTooltip",y.lcZ(82,70,"CLEAR")),y.xp6(3),y.s9C("ngbTooltip",y.lcZ(85,72,"GENERATE")),y.xp6(8),y.MGl("id","fieldIsActive",t.model.id,""),y.xp6(1),y.MGl("for","fieldIsActive",t.model.id,""),y.xp6(1),y.hij(" ",y.lcZ(95,74,"ACTIVE")," "),y.xp6(2),y.Q6J("closeOthers",!0),y.xp6(1),y.Q6J("title",y.lcZ(98,76,"OPTIONS")),y.xp6(3),y.Q6J("ngIf",t.errorMessage),y.xp6(2),y.Q6J("ngIf",t.allowImpersonation),y.xp6(2),y.Q6J("disabled",t.submitted),y.xp6(2),y.Oqu(y.lcZ(107,78,"SAVE_AND_CLOSE")),y.xp6(3),y.Q6J("disabled",t.submitted),y.xp6(3),y.Oqu(y.lcZ(113,80,"SAVE")),y.xp6(4),y.Oqu(y.lcZ(117,82,"CLOSE")))},directives:[d._Y,d.JL,d.sg,l.mk,d.Fj,d.JJ,d.u,l.O5,d.EJ,l.sg,S._L,d.Wl,S.gY,S.Gk,S.gW,S.jt,S.iD,S.Vi,S.TH,d.YN,d.Kr,d.CE,d.x0],pipes:[I.X$,l.Ov],encapsulation:2}),t}(),V=[{path:"",redirectTo:"/users/",pathMatch:"full"},{path:":userEmail",component:function(){var t=function(t){e(i,t);var n=o(i);function i(e,t,o,a,s,l){var c;return r(this,i),(c=n.call(this,e,t,o,a)).dataService=e,c.activeModal=t,c.modalService=o,c.translateService=a,c.route=s,c.router=l,c.queryOptions=new k.J("id","desc",1,10,0,0),c.tableFields=[{name:"id",sortName:"id",title:"ID",outputType:"text",outputProperties:{}},{name:"email",sortName:"email",title:"EMAIL",outputType:"text",outputProperties:{}},{name:"fullName",sortName:"fullName",title:"FULL_NAME",outputType:"text",outputProperties:{}},{name:"role",sortName:"roles",title:"ROLE",outputType:"userRole",outputProperties:{}},{name:"createdDate",sortName:"createdDate",title:"DATE_TIME",outputType:"date",outputProperties:{format:"dd/MM/y H:mm:s"}},{name:"isActive",sortName:"isActive",title:"STATUS",outputType:"boolean",outputProperties:{}}],c}return s(i,[{key:"ngOnInit",value:function(){this.afterInit()}},{key:"afterInit",value:function(){var e=this;this.route.paramMap.subscribe(function(t){e.queryOptions.search_word=t.get("userEmail"),e.getList()})}},{key:"onSearchClear",value:function(){this.route.snapshot.url&&this.route.snapshot.url[0].path?this.router.navigate(["/users",""]):this.getList()}},{key:"setModalInputs",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",n=void 0!==e&&!t;this.modalRef.componentInstance.modalTitle=n?"".concat(this.getLangString("USER")," #").concat(e):this.getLangString("ADD_USER"),this.modalRef.componentInstance.modalId=o,this.modalRef.componentInstance.itemId=e||0,this.modalRef.componentInstance.isItemCopy=t||!1,this.modalRef.componentInstance.isEditMode=n}},{key:"getModalElementId",value:function(e){return["modal","user",e||0].join("-")}},{key:"getModalContent",value:function(){return Q}},{key:"changeRequest",value:function(e){}}]),i}(g.U);return t.title="USERS",t.\u0275fac=function(e){return new(e||t)(y.Y36(q),y.Y36(S.Kz),y.Y36(S.FF),y.Y36(I.sK),y.Y36(u.gz),y.Y36(u.F0))},t.\u0275cmp=y.Xpm({type:t,selectors:[["app-shk-users"]],features:[y._Bn([q]),y.qOj],decls:37,vars:29,consts:[[1,"card"],[1,"card-body"],[1,"icon-head"],[1,"mb-3"],[1,"float-md-start"],[1,"form-control-search","mb-2","mb-md-0",3,"ngClass"],["type","text",1,"form-control","min-width250",3,"placeholder","ngModel","ngModelChange"],[3,"click"],[1,"float-md-end"],["ngbDropdown","","placement","bottom-right",1,"d-block","d-md-inline-block","mb-2","mb-md-0"],["ngbDropdownToggle","",1,"btn","btn-info","d-block","d-md-inline-block","width-100","width-md-auto"],["ngbDropdownMenu","",1,"dropdown-menu","dropdown-menu-end"],[1,"dropdown-item",3,"click"],["type","button",1,"btn","btn-success","btn-wide","d-block","d-md-inline-block","width-100","width-md-auto","ms-md-2","mb-2","mb-md-0",3,"click"],[1,"icon-plus"],[1,"float-start"],[1,"clearfix"],[1,"min-height400"],[3,"items","selectedIds","collectionSize","queryOptions","tableFields","loading","isCloneAllowed","selectedIdsChange","loadingChange","actionRequest","changeRequest"],["table",""]],template:function(e,t){1&e&&(y.TgZ(0,"div",0),y.TgZ(1,"div",1),y.TgZ(2,"h3"),y._UZ(3,"i",2),y._uU(4),y.ALo(5,"translate"),y.qZA(),y._UZ(6,"hr"),y.TgZ(7,"div",3),y.TgZ(8,"div",4),y.TgZ(9,"div",5),y.TgZ(10,"input",6),y.NdJ("ngModelChange",function(e){return t.queryOptions.search_word=e})("ngModelChange",function(){return t.onSearchWordUpdate()}),y.ALo(11,"translate"),y.qZA(),y.TgZ(12,"span",7),y.NdJ("click",function(){return t.onSearchWordUpdate("")}),y.qZA(),y.qZA(),y.qZA(),y.TgZ(13,"div",8),y.TgZ(14,"div",9),y.TgZ(15,"button",10),y.TgZ(16,"span"),y._uU(17),y.ALo(18,"translate"),y.qZA(),y.qZA(),y.TgZ(19,"div",11),y.TgZ(20,"button",12),y.NdJ("click",function(){return t.blockSelected()}),y._uU(21),y.ALo(22,"translate"),y.qZA(),y.TgZ(23,"button",12),y.NdJ("click",function(){return t.deleteSelected()}),y._uU(24),y.ALo(25,"translate"),y.qZA(),y.qZA(),y.qZA(),y.TgZ(26,"button",13),y.NdJ("click",function(){return t.modalOpen()}),y._UZ(27,"i",14),y._uU(28," \xa0 "),y.TgZ(29,"span"),y._uU(30),y.ALo(31,"translate"),y.qZA(),y.qZA(),y.qZA(),y._UZ(32,"div",15),y._UZ(33,"div",16),y.qZA(),y.TgZ(34,"div",17),y.TgZ(35,"app-table",18,19),y.NdJ("selectedIdsChange",function(e){return t.selectedIds=e})("loadingChange",function(e){return t.loading=e})("actionRequest",function(e){return t.actionRequest(e)})("changeRequest",function(e){return t.changeRequest(e)}),y.qZA(),y.qZA(),y.qZA(),y.qZA()),2&e&&(y.xp6(4),y.hij(" ",y.lcZ(5,15,"USERS")," "),y.xp6(5),y.Q6J("ngClass",y.VKq(27,P,!!t.queryOptions.search_word)),y.xp6(1),y.MGl("placeholder","",y.lcZ(11,17,"SEARCH"),"..."),y.Q6J("ngModel",t.queryOptions.search_word),y.xp6(7),y.Oqu(y.lcZ(18,19,"BATCH_ACTIONS")),y.xp6(4),y.Oqu(y.lcZ(22,21,"DISABLE_ENABLE")),y.xp6(3),y.Oqu(y.lcZ(25,23,"DELETE")),y.xp6(6),y.Oqu(y.lcZ(31,25,"ADD")),y.xp6(5),y.Q6J("items",t.items)("selectedIds",t.selectedIds)("collectionSize",t.collectionSize)("queryOptions",t.queryOptions)("tableFields",t.tableFields)("loading",t.loading)("isCloneAllowed",!1))},directives:[l.mk,d.Fj,d.JJ,d.On,S.jt,S.iD,S.Vi,_.a],pipes:[I.X$],encapsulation:2}),t}()}],B=function(){var e=function e(){r(this,e)};return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=y.oAB({type:e}),e.\u0275inj=y.cJS({imports:[[u.Bz.forChild(V)],u.Bz]}),e}(),z=function(){var e=function e(){r(this,e)};return e.\u0275fac=function(t){return new(t||e)},e.\u0275mod=y.oAB({type:e}),e.\u0275inj=y.cJS({providers:[q],imports:[[l.ez,c.m,B]]}),e}()}}])}();