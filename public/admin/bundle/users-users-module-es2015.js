(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{"4p3S":function(t,e,o){"use strict";o.d(e,"a",(function(){return m}));var s=o("XNiG"),i=o("1G5W"),r=o("RwQR"),n=o("Y2tp"),l=o("fXoL"),a=o("7AsP"),c=o("1kSV"),d=o("sYmb");const b=["table"];let m=(()=>{class t{constructor(t,e,o,i){this.dataService=t,this.activeModal=e,this.modalService=o,this.translateService=i,this.items=[],this.loading=!1,this.selectedIds=[],this.collectionSize=0,this.queryOptions=new r.a("name","asc",1,10,0,0),this.destroyed$=new s.a}ngOnInit(){this.getList(),this.afterInit()}afterInit(){}onSearchClear(){this.getList()}onModalClose(t){}onSearchWordUpdate(t){if(void 0!==t)return this.queryOptions.search_word=t,this.queryOptions.page=1,void(this.queryOptions.search_word?this.getList():this.onSearchClear());clearTimeout(this.searchTimer),this.searchTimer=setTimeout(()=>{this.queryOptions.page=1,this.getList()},700)}getModalElementId(t){return["modal",t||0].join("-")}setModalInputs(t,e=!1,o=""){const s=void 0!==t&&!e;this.modalRef.componentInstance.modalTitle=this.getLangString(s?"EDITING":"ADD"),this.modalRef.componentInstance.modalId=o,this.modalRef.componentInstance.itemId=t||0,this.modalRef.componentInstance.isItemCopy=e||!1,this.modalRef.componentInstance.isEditMode=s}modalOpen(t,e=!1){const o=this.getModalElementId(t);if(window.document.body.classList.add("modal-open"),window.document.getElementById(o)){const t=window.document.getElementById(o),e=t.previousElementSibling;return t.classList.add("d-block"),t.classList.remove("modal-minimized"),void e.classList.remove("d-none")}this.modalRef=this.modalService.open(this.getModalContent(),{size:"lg",backdrop:"static",keyboard:!1,backdropClass:"modal-backdrop-left45",windowClass:"modal-left45",container:"#modals-container"}),this.setModalInputs(t,e,o),this.modalRef.result.then(t=>{this.destroyed$.isStopped||(this.onModalClose(t),this.getList())},t=>{this.destroyed$.isStopped||(this.onModalClose(t),t&&["submit","updated"].indexOf(t)>-1&&this.getList())})}deleteItemConfirm(t){this.modalRef=this.modalService.open(n.b),this.modalRef.componentInstance.modalTitle=this.getLangString("CONFIRM"),this.modalRef.componentInstance.modalContent=this.getLangString("YOU_SURE_YOU_WANT_DELETE"),this.modalRef.result.then(e=>{"accept"===e&&this.deleteItem(t)})}getLangString(t){return this.translateService.store.translations[this.translateService.currentLang]&&this.translateService.store.translations[this.translateService.currentLang][t]||t}confirmAction(t){return this.modalRef=this.modalService.open(n.b),this.modalRef.componentInstance.modalTitle=this.getLangString("CONFIRM"),this.modalRef.componentInstance.modalContent=t,this.modalRef.result}blockSelected(){0!==this.selectedIds.length?this.dataService.actionBatch(this.selectedIds,"block").subscribe(t=>{this.clearSelected(),this.getList()},t=>this.showAlert(t.error||this.getLangString("ERROR"))):this.showAlert(this.getLangString("NOTHING_IS_SELECTED"))}deleteSelected(){0!==this.selectedIds.length?this.confirmAction(this.getLangString("YOU_SURE_YOU_WANT_DELETE_SELECTED")).then(t=>{"accept"===t&&this.dataService.actionBatch(this.selectedIds,"delete").subscribe(t=>{this.clearSelected(),this.getList()},t=>this.showAlert(t.error||this.getLangString("ERROR")))}):this.showAlert(this.getLangString("NOTHING_IS_SELECTED"))}showAlert(t){this.modalRef=this.modalService.open(n.a),this.modalRef.componentInstance.modalContent=t,this.modalRef.componentInstance.modalTitle=this.getLangString("ERROR"),this.modalRef.componentInstance.messageType="error"}deleteItem(t){this.confirmAction(this.getLangString("YOU_SURE_YOU_WANT_DELETE")).then(e=>{"accept"===e&&this.dataService.deleteItem(t).subscribe(t=>{this.getList()},t=>{t.error&&this.showAlert(t.error)})})}clearSelected(){this.table&&this.table.clearSelected()}actionRequest(t){switch(t[0]){case"edit":this.modalOpen(t[1]);break;case"copy":this.modalOpen(t[1],!0);break;case"delete":this.deleteItem(t[1]);break;case"changeQuery":this.getList()}}getList(){this.loading=!0,this.dataService.getListPage(this.queryOptions).pipe(Object(i.a)(this.destroyed$)).subscribe({next:t=>{this.items=t.items,this.collectionSize=t.total,this.loading=!1},error:t=>{this.items=[],this.collectionSize=0,t.error&&this.showAlert(t.error),this.loading=!1}})}ngOnDestroy(){this.destroyed$.next(),this.destroyed$.complete()}}return t.title="",t.\u0275fac=function(e){return new(e||t)(l.Qb(a.a),l.Qb(c.b),l.Qb(c.h),l.Qb(d.d))},t.\u0275dir=l.Lb({type:t,viewQuery:function(t,e){var o;1&t&&l.Jc(b,!0),2&t&&l.Cc(o=l.jc())&&(e.table=o.first)}}),t})()},ot8b:function(t,e,o){"use strict";o.d(e,"a",(function(){return b}));var s=o("3Pt+"),i=o("XNiG"),r=o("1G5W"),n=o("7AsP"),l=o("fXoL"),a=o("1kSV"),c=o("sYmb");const d=["formEl"];let b=(()=>{class t{constructor(t,e,o,s,r){this.fb=t,this.activeModal=e,this.translateService=o,this.dataService=s,this.elRef=r,this.modalId="",this._formFieldsErrors={},this.submitted=!1,this.loading=!1,this.closeReason="canceled",this.files={},this.formFields=[],this.arrayFields={},this.isSaveButtonDisabled=!1,this.localeDefault="",this.localeCurrent="",this.localeFieldsAllowed=[],this.localePreviousValues={},this.uniqueId="",this.destroyed$=new i.a}set formErrors(t){for(const e in t)if(t.hasOwnProperty(e)){const t=this.getControl(this.form,null,e);t&&t.setErrors({incorrect:!0})}this._formFieldsErrors=t}get formErrors(){return this._formFieldsErrors}ngOnInit(){this.uniqueId=this.createUniqueId(),this.elRef&&this.getRootElement().setAttribute("id",this.modalId),this.onBeforeInit(),this.buildForm(),this.isEditMode||this.isItemCopy?this.getModelData().then(()=>{this.onAfterGetData()}):this.onAfterGetData(),this.onAfterInit()}onBeforeInit(){}onAfterInit(){}onAfterGetData(){this.buildControls(this.form,this.formFields)}getSystemFieldName(){return""}getLangString(t){return this.translateService.store.translations[this.translateService.currentLang][t]||t}getModelData(){return this.loading=!0,new Promise((t,e)=>{this.dataService.getItem(this.itemId).pipe(Object(r.a)(this.destroyed$)).subscribe({next:e=>{if(this.isItemCopy){e.id=null;const t=this.getSystemFieldName();t&&(e[t]="")}Object.assign(this.model,e),this.loading=!1,t(e)},error:t=>{this.errorMessage=t.error||this.getLangString("ERROR"),this.loading=!1,e(t)}})})}buildForm(){this.form=this.fb.group(this.buildControls(null,this.formFields)),this.form.valueChanges.pipe(Object(r.a)(this.destroyed$)).subscribe(()=>this.onValueChanged())}buildControls(t,e,o="model"){const s={};return void 0===t&&(t=this.form||null),e.forEach(e=>{const i=this.getControl(t,e);let r=null;if(o&&this[o]?(this[o].options||(this[o].options={}),r=0===e.name.indexOf("options_")?this[o].options[e.name.substr(8)]||null:this[o][e.name]||null):r=null,i)if(e.disabled&&i.disable(),e.children){const t=r,o=i;o.clear(),t.forEach((t,s)=>{const i=this.getFormFieldByName(e.name),r=this.buildControls(null,i.children,null);o.push(this.fb.group(r))}),o.patchValue(t)}else i.setValue(r);else e.children?(s[e.name]=this.fb.array([]),this.createArrayFieldsProperty(e.name)):s[e.name]=this.fb.control({value:r,disabled:e.disabled||!1},e.validators)}),s}onValueChanged(t="form"){this[t]&&(this[t].valid&&(this.errorMessage=""),Object.keys(this[t].value).forEach(t=>{this.formErrors[t]="";const e=this.getControl(this.form,null,t);if(e&&!e.valid&&e.errors){let o="";Object.keys(e.errors).forEach(t=>{o+=(o?" ":"")+this.getLangString("INVALID_"+t.toUpperCase())}),this.formErrors[t]=o}}))}getFormFieldByName(t){const e=this.formFields.filter(e=>e.name===t);return e.length>0?e[0]:null}createArrayFieldsProperty(t){Object.defineProperty(this.arrayFields,t,{get:()=>this.form?this.form.get(t):null})}getControl(t,e,o){return t?t.get(o||e.name):null}focusFormError(){setTimeout(()=>{this.formEl.nativeElement.querySelector(".form-control.is-invalid")&&this.formEl.nativeElement.querySelector(".form-control.is-invalid").focus()},1)}formGroupMarkTouched(t){Object.keys(t.controls).forEach(e=>{t.controls[e].markAsTouched(),t.controls[e]instanceof s.c&&Array.from(this.form.controls[e].controls).forEach(t=>{this.formGroupMarkTouched(t)})})}getSaveRequest(t){return t.id||"root"===t.name?this.dataService.update(t):this.dataService.create(t)}getFormData(){const t=this.form.value;return t.id=this.model.id||0,void 0!==this.model.translations&&(t.translations=this.model.translations||null),t}arrayFieldDelete(t,e,o){o&&o.preventDefault(),this.arrayFields[t].removeAt(e)}arrayFieldAdd(t,e){e&&e.preventDefault();const o=this.getFormFieldByName(t);if(!o)return;const s=this.buildControls(null,o.children,null);this.arrayFields[t].push(this.fb.group(s))}closeModal(t){t&&t.preventDefault(),this.close(this.closeReason)}close(t,e){e&&e.preventDefault(),"submit"===t?this.activeModal.close(t):this.activeModal.dismiss(t)}minimize(t){t&&t.preventDefault(),window.document.body.classList.remove("modal-open");const e=this.getRootElement(),o=e.previousElementSibling;e.classList.remove("d-block"),e.classList.add("modal-minimized"),o.classList.add("d-none")}maximize(t){t&&t.preventDefault(),window.document.body.classList.add("modal-open");const e=this.getRootElement(),o=e.previousElementSibling;e.classList.add("d-block"),e.classList.remove("modal-minimized"),o.classList.remove("d-none")}save(t=!1,e){e&&e.preventDefault(),this.onSubmit(t)}saveFiles(t){if(0===Object.keys(this.files).length)return void this.close("submit");const e=new FormData;for(const o in this.files)this.files.hasOwnProperty(o)&&this.files[o]instanceof File&&e.append(o,this.files[o],this.files[o].name);e.append("itemId",String(t)),this.dataService.postFormData(e).pipe(Object(r.a)(this.destroyed$)).subscribe({next:()=>{this.close("submit")},error:t=>{this.errorMessage=t.error||this.getLangString("ERROR"),this.submitted=!1,this.loading=!1}})}onSubmit(t=!1){if(this.formGroupMarkTouched(this.form),!this.form.valid)return this.errorMessage=this.getLangString("PLEASE_FIX_FORM_ERRORS"),void this.focusFormError();this.errorMessage="",this.loading=!0,this.submitted=!0;const e=this.getFormData();this.getSaveRequest(e).pipe(Object(r.a)(this.destroyed$)).subscribe({next:e=>{Object.keys(this.files).length>0?this.saveFiles(e._id||e.id):t&&this.close("submit"),e&&e.id&&(this.model.id=e.id),this.closeReason="updated",this.loading=!1,this.submitted=!1},error:t=>{t.error&&(this.errorMessage=t.error),t.errors&&(this.formErrors=t.errors,this.errorMessage=this.getLangString("PLEASE_FIX_FORM_ERRORS")),this.loading=!1,this.submitted=!1}})}onLocaleSwitch(){if(this.localeCurrent===this.localeDefault)return this.localeFieldsAllowed.forEach(t=>{this.model[t]=this.localePreviousValues[t],this.getControl(this.form,null,t).setValue(this.localePreviousValues[t])}),void(this.isSaveButtonDisabled=!1);this.model.translations||(this.model.translations={}),this.isSaveButtonDisabled=!0,this.localeFieldsAllowed.forEach(t=>{this.localePreviousValues[t]=this.getControl(this.form,null,t).value,this.model.translations[t]?(this.model[t]=this.model.translations[t][this.localeCurrent]||"",this.getControl(this.form,null,t).setValue(this.model[t])):(this.model[t]="",this.getControl(this.form,null,t).setValue(""))})}saveTranslations(t){t&&t.preventDefault(),this.localeFieldsAllowed.forEach(t=>{this.getControl(this.form,null,t)&&this.getControl(this.form,null,t).value?(this.model.translations[t]||(this.model.translations[t]={}),this.model.translations[t][this.localeCurrent]=this.getControl(this.form,null,t).value):this.model.translations[t]&&(this.model.translations[t][this.localeCurrent]&&delete this.model.translations[t][this.localeCurrent],0===Object.keys(this.model.translations[t]).length&&delete this.model.translations[t])}),this.localeCurrent=this.localeDefault,this.onLocaleSwitch()}emailValidator(t){return t.value?/\S+@\S+\.\S+/.test(t.value)?void 0:{email:!0}:{required:!0}}getRootElement(){return this.elRef.nativeElement.parentNode.parentNode.parentNode}createUniqueId(){return Math.random().toString(36).substr(2,9)}ngOnDestroy(){this.destroyed$.next(),this.destroyed$.complete()}}return t.\u0275fac=function(e){return new(e||t)(l.Qb(s.e),l.Qb(a.b),l.Qb(c.d),l.Qb(n.a),l.Qb(l.l))},t.\u0275dir=l.Lb({type:t,viewQuery:function(t,e){var o;1&t&&l.Sc(d,!0),2&t&&l.Cc(o=l.jc())&&(e.formEl=o.first)},inputs:{modalTitle:"modalTitle",itemId:"itemId",modalId:"modalId",isItemCopy:"isItemCopy",isEditMode:"isEditMode"}}),t})()},zrcO:function(t,e,o){"use strict";o.r(e);var s=o("ofXK"),i=o("d2mR"),r=o("tyNb"),n=o("3Pt+"),l=o("1G5W"),a=o("lJxs"),c=o("LvDl");class d{constructor(t,e,o,s,i,r,n,l,a,c){this.id=t,this.email=e,this.fullName=o,this.roles=s,this.isActive=i,this.options=r,this.role=n,this.phone=l,this.password=a,this.confirmPassword=c}}var b=o("4p3S"),m=o("JIr8"),h=o("7AsP"),u=o("fXoL"),f=o("tk/3");let p=(()=>{class t extends h.a{constructor(t){super(t),this.setRequestUrl("/admin/users")}getRolesList(){const t=this.getRequestUrl()+"/roles";return this.http.get(t,{headers:this.headers}).pipe(Object(m.a)(this.handleError()))}}return t.\u0275fac=function(e){return new(e||t)(u.ec(f.a))},t.\u0275prov=u.Mb({token:t,factory:t.\u0275fac}),t})();var g=o("wgQU"),v=o("RwQR"),S=o("ot8b"),E=o("1kSV"),y=o("sYmb"),D=o("hecf");function V(t,e){if(1&t&&(u.Wb(0,"div",46),u.Oc(1),u.Vb()),2&t){const t=u.kc();u.Db(1),u.Qc(" ",t.formErrors.email," ")}}function w(t,e){if(1&t&&(u.Wb(0,"div",46),u.Oc(1),u.Vb()),2&t){const t=u.kc();u.Db(1),u.Qc(" ",t.formErrors.fullName," ")}}function I(t,e){if(1&t&&(u.Wb(0,"div",46),u.Oc(1),u.Vb()),2&t){const t=u.kc();u.Db(1),u.Qc(" ",t.formErrors.phone," ")}}function R(t,e){if(1&t&&(u.Ub(0),u.Wb(1,"option",47),u.Oc(2),u.Vb(),u.Tb()),2&t){const t=e.$implicit;u.Db(1),u.rc("value",t.name),u.Db(1),u.Pc(t.title)}}function O(t,e){if(1&t&&(u.Wb(0,"div",46),u.Oc(1),u.Vb()),2&t){const t=u.kc();u.Db(1),u.Qc(" ",t.formErrors.password," ")}}function W(t,e){if(1&t&&(u.Wb(0,"div",46),u.Oc(1),u.Vb()),2&t){const t=u.kc();u.Db(1),u.Qc(" ",t.formErrors.password," ")}}function C(t,e){if(1&t&&(u.Wb(0,"div",46),u.Oc(1),u.Vb()),2&t){const t=u.kc();u.Db(1),u.Qc(" ",t.formErrors.confirmPassword," ")}}const L=function(t){return{"is-invalid":t}};function M(t,e){if(1&t){const t=u.Xb();u.Wb(0,"tr",59),u.Wb(1,"td"),u.Rb(2,"input",60),u.Vb(),u.Wb(3,"td"),u.Rb(4,"input",61),u.Vb(),u.Wb(5,"td",62),u.Rb(6,"input",63),u.Vb(),u.Wb(7,"td",62),u.Wb(8,"button",64),u.ic("click",(function(o){u.Ec(t);const s=e.index;return u.kc(3).arrayFieldDelete("options",s,o)})),u.lc(9,"translate"),u.Rb(10,"i",11),u.Vb(),u.Vb(),u.Vb()}if(2&t){const t=e.$implicit;u.rc("formGroupName",e.index+""),u.Db(2),u.rc("ngClass",u.wc(7,L,t.controls.name.touched&&!t.controls.name.valid)),u.Db(2),u.rc("ngClass",u.wc(9,L,t.controls.title.touched&&!t.controls.title.valid)),u.Db(2),u.rc("ngClass",u.wc(11,L,t.controls.value.touched&&!t.controls.value.valid)),u.Db(2),u.sc("ngbTooltip",u.mc(9,5,"DELETE"))}}function k(t,e){if(1&t&&(u.Wb(0,"tbody"),u.Mc(1,M,11,13,"tr",58),u.Vb()),2&t){const t=u.kc(2);u.Db(1),u.rc("ngForOf",t.arrayFields.options.controls)}}function A(t,e){if(1&t){const t=u.Xb();u.Wb(0,"div",48),u.Wb(1,"table",49),u.Wb(2,"colgroup"),u.Rb(3,"col",50),u.Rb(4,"col",50),u.Rb(5,"col",51),u.Rb(6,"col",52),u.Vb(),u.Wb(7,"thead"),u.Wb(8,"tr"),u.Wb(9,"th"),u.Oc(10),u.lc(11,"translate"),u.Vb(),u.Wb(12,"th"),u.Oc(13),u.lc(14,"translate"),u.Vb(),u.Wb(15,"th"),u.Oc(16),u.lc(17,"translate"),u.Vb(),u.Rb(18,"th"),u.Vb(),u.Vb(),u.Mc(19,k,2,1,"tbody",53),u.Wb(20,"tfoot"),u.Wb(21,"tr",54),u.Wb(22,"td",55),u.Wb(23,"button",56),u.ic("click",(function(e){return u.Ec(t),u.kc().arrayFieldAdd("options",e)})),u.Rb(24,"i",57),u.Oc(25," \xa0 "),u.Wb(26,"span"),u.Oc(27),u.lc(28,"translate"),u.Vb(),u.Vb(),u.Vb(),u.Vb(),u.Vb(),u.Vb(),u.Vb()}if(2&t){const t=u.kc();u.Db(10),u.Pc(u.mc(11,5,"SYSTEM_NAME")),u.Db(3),u.Pc(u.mc(14,7,"NAME")),u.Db(3),u.Pc(u.mc(17,9,"VALUE")),u.Db(3),u.rc("ngIf",t.arrayFields.options),u.Db(8),u.Pc(u.mc(28,11,"ADD"))}}function N(t,e){if(1&t){const t=u.Xb();u.Wb(0,"div",65),u.Wb(1,"button",66),u.ic("click",(function(){return u.Ec(t),u.kc().errorMessage=""})),u.Wb(2,"span",67),u.Oc(3,"\xd7"),u.Vb(),u.Vb(),u.Oc(4),u.Vb()}if(2&t){const t=u.kc();u.Db(4),u.Qc(" ",t.errorMessage," ")}}function F(t,e){if(1&t&&(u.Wb(0,"div",68),u.Wb(1,"a",69),u.Wb(2,"span"),u.Oc(3),u.lc(4,"translate"),u.Vb(),u.Vb(),u.Vb()),2&t){const t=u.kc();u.Db(1),u.uc("href","",t.baseUrl,"?_switch_user=",t.model.email,"",u.Gc),u.Db(2),u.Pc(u.mc(4,3,"IMPERSONATION"))}}const P=function(t){return{"no-events":t}},T=function(t){return{"form-control-search-clear":t}};let _=(()=>{class t extends S.a{constructor(t,e,o,s,i,r){super(t,e,o,s,i),this.fb=t,this.activeModal=e,this.translateService=o,this.dataService=s,this.elRef=i,this.appSettings=r,this.allowImpersonation=!1,this.model=new d(0,"","",[],!0,[]),this.formFields=[{name:"email",validators:[n.w.required,this.emailValidator]},{name:"fullName",validators:[n.w.required]},{name:"phone",validators:[]},{name:"role",validators:[n.w.required]},{name:"isActive",validators:[]},{name:"password",validators:[]},{name:"confirmPassword",validators:[]},{name:"options",validators:[],children:[{name:"name",validators:[n.w.required]},{name:"title",validators:[n.w.required]},{name:"value",validators:[n.w.required]}]}]}onBeforeInit(){if(!this.isEditMode){const t=Object(c.findIndex)(this.formFields,{name:"password"});t>-1&&(this.formFields[t].validators.push(n.w.required),this.formFields[t+1].validators.push(n.w.required))}this.baseUrl=g.a.getBaseUrl(),this.getUserRoles()}onAfterGetData(){this.buildControls(this.form,this.formFields),this.isEditMode&&this.appSettings.isSuperAdmin&&this.appSettings.settings.userEmail!==this.model.email&&(this.allowImpersonation=!0)}getUserRoles(){this.userRoles$=this.dataService.getRolesList().pipe(Object(l.a)(this.destroyed$),Object(a.a)(t=>t.roles))}}return t.\u0275fac=function(e){return new(e||t)(u.Qb(n.e),u.Qb(E.b),u.Qb(y.d),u.Qb(p),u.Qb(u.l),u.Qb(g.a))},t.\u0275cmp=u.Kb({type:t,selectors:[["app-modal-user"]],features:[u.Cb([]),u.Ab],decls:104,vars:85,consts:[[1,"position-relative","modal-on-maximized"],[1,"tabs-top"],["type","button",1,"btn","btn-outline-primary","btn-sm","d-block",3,"disabled","click"],[1,"icon-cross","mr-1"],[1,"icon-minimize","mr-1"],[1,"modal-header","d-block"],[1,"position-relative","modal-on-minimized"],[1,"pos-absolute-right"],["type","button",1,"btn","btn-no-border","btn-sm-sm",3,"title","click"],[1,"icon-maximize"],["type","button",1,"btn","btn-no-border","btn-sm-sm","ml-1",3,"title","click"],[1,"icon-cross"],[1,"modal-title","text-overflow","mr-5"],["method","post",3,"formGroup","ngClass","ngSubmit"],["formEl",""],[1,"modal-body","py-0"],[1,"row"],[1,"col-lg-6"],[1,"form-group","form-group-message"],[1,"label-filled"],["type","text","autocomplete","off","formControlName","email",1,"form-control",3,"ngClass"],["class","alert alert-danger",4,"ngIf"],["type","text","autocomplete","off","formControlName","fullName",1,"form-control",3,"ngClass"],["type","text","formControlName","phone","autocomplete","off",1,"form-control"],["formControlName","role",1,"custom-select",3,"ngClass"],[4,"ngFor","ngForOf"],["type","password","autocomplete","off","formControlName","password",1,"form-control",3,"ngClass"],["type","password","autocomplete","off","formControlName","confirmPassword",1,"form-control",3,"ngClass"],[1,"form-group"],[1,"card","card-body","p-2","pl-3"],[1,"custom-control","custom-checkbox","m-0"],["type","checkbox","value","1","formControlName","isActive",1,"custom-control-input",3,"id"],[1,"custom-control-label",3,"for"],["activeIds","accordion-user-options",1,"ngb-accordion",3,"closeOthers"],["id","accordion-user-options",3,"title"],["ngbPanelContent",""],["class","alert alert-danger mt-3 mb-0",4,"ngIf"],[1,"modal-footer","display-block"],["class","float-right",4,"ngIf"],[1,"btn-group","mr-1"],["type","button",1,"btn","btn-success","btn-wide",3,"disabled","click"],["ngbDropdown","","role","group","placement","top-right",1,"btn-group"],["type","button","ngbDropdownToggle","",1,"btn","btn-success","dropdown-toggle-split",3,"disabled"],["ngbDropdownMenu","",1,"dropdown-menu"],["type","button","ngbDropdownItem","",3,"click"],["type","button",1,"btn","btn-secondary","btn-wide",3,"click"],[1,"alert","alert-danger"],[3,"value"],["formArrayName","options"],[1,"table","table-bordered","mb-0"],["width","27%"],["width","39%"],["width","7%"],[4,"ngIf"],[1,"bg-faded"],["colspan","4",1,"text-center"],["type","button",1,"btn","btn-secondary","btn-sm",3,"click"],[1,"icon-plus"],[3,"formGroupName",4,"ngFor","ngForOf"],[3,"formGroupName"],["type","text","formControlName","name",1,"form-control","form-control-sm",3,"ngClass"],["type","text","formControlName","title",1,"form-control","form-control-sm",3,"ngClass"],[1,"text-center"],["type","text","formControlName","value",1,"form-control","form-control-sm",3,"ngClass"],["type","button",1,"btn","btn-secondary","btn-sm",3,"ngbTooltip","click"],[1,"alert","alert-danger","mt-3","mb-0"],["type","button",1,"close",3,"click"],["aria-hidden","true"],[1,"float-right"],[1,"btn","btn-primary",3,"href"]],template:function(t,e){1&t&&(u.Wb(0,"div",0),u.Wb(1,"div",1),u.Wb(2,"button",2),u.ic("click",(function(t){return e.closeModal(t)})),u.Rb(3,"i",3),u.Wb(4,"span"),u.Oc(5),u.lc(6,"translate"),u.Vb(),u.Vb(),u.Wb(7,"button",2),u.ic("click",(function(t){return e.minimize(t)})),u.Rb(8,"i",4),u.Wb(9,"span"),u.Oc(10),u.lc(11,"translate"),u.Vb(),u.Vb(),u.Vb(),u.Vb(),u.Wb(12,"div",5),u.Wb(13,"div",6),u.Wb(14,"div",7),u.Wb(15,"button",8),u.ic("click",(function(t){return e.maximize(t)})),u.lc(16,"translate"),u.Rb(17,"i",9),u.Vb(),u.Wb(18,"button",10),u.ic("click",(function(t){return e.closeModal(t)})),u.lc(19,"translate"),u.Rb(20,"i",11),u.Vb(),u.Vb(),u.Vb(),u.Wb(21,"h4",12),u.Oc(22),u.Vb(),u.Vb(),u.Wb(23,"form",13,14),u.ic("ngSubmit",(function(){return e.onSubmit()})),u.Wb(25,"div",15),u.Wb(26,"div",16),u.Wb(27,"div",17),u.Wb(28,"div",18),u.Wb(29,"label",19),u.Oc(30),u.lc(31,"translate"),u.Vb(),u.Rb(32,"input",20),u.Mc(33,V,2,1,"div",21),u.Vb(),u.Vb(),u.Wb(34,"div",17),u.Wb(35,"div",18),u.Wb(36,"label",19),u.Oc(37),u.lc(38,"translate"),u.Vb(),u.Rb(39,"input",22),u.Mc(40,w,2,1,"div",21),u.Vb(),u.Vb(),u.Vb(),u.Wb(41,"div",16),u.Wb(42,"div",17),u.Wb(43,"div",18),u.Wb(44,"label",19),u.Oc(45),u.lc(46,"translate"),u.Vb(),u.Rb(47,"input",23),u.Mc(48,I,2,1,"div",21),u.Vb(),u.Vb(),u.Wb(49,"div",17),u.Wb(50,"div",18),u.Wb(51,"label",19),u.Oc(52),u.lc(53,"translate"),u.Vb(),u.Wb(54,"select",24),u.Mc(55,R,3,2,"ng-container",25),u.lc(56,"async"),u.Vb(),u.Mc(57,O,2,1,"div",21),u.Vb(),u.Vb(),u.Vb(),u.Wb(58,"div",16),u.Wb(59,"div",17),u.Wb(60,"div",18),u.Wb(61,"label",19),u.Oc(62),u.lc(63,"translate"),u.Vb(),u.Rb(64,"input",26),u.Mc(65,W,2,1,"div",21),u.Vb(),u.Vb(),u.Wb(66,"div",17),u.Wb(67,"div",18),u.Wb(68,"label",19),u.Oc(69),u.lc(70,"translate"),u.Vb(),u.Rb(71,"input",27),u.Mc(72,C,2,1,"div",21),u.Vb(),u.Vb(),u.Vb(),u.Wb(73,"div",16),u.Wb(74,"div",17),u.Wb(75,"div",28),u.Wb(76,"div",29),u.Wb(77,"div",30),u.Rb(78,"input",31),u.Wb(79,"label",32),u.Oc(80),u.lc(81,"translate"),u.Vb(),u.Vb(),u.Vb(),u.Vb(),u.Vb(),u.Vb(),u.Wb(82,"ngb-accordion",33),u.Wb(83,"ngb-panel",34),u.lc(84,"translate"),u.Mc(85,A,29,13,"ng-template",35),u.Vb(),u.Vb(),u.Mc(86,N,5,1,"div",36),u.Vb(),u.Wb(87,"div",37),u.Mc(88,F,5,5,"div",38),u.Wb(89,"div",39),u.Wb(90,"button",40),u.ic("click",(function(t){return e.save(!0,t)})),u.Wb(91,"span"),u.Oc(92),u.lc(93,"translate"),u.Vb(),u.Vb(),u.Wb(94,"div",41),u.Rb(95,"button",42),u.Wb(96,"div",43),u.Wb(97,"button",44),u.ic("click",(function(t){return e.save(!1,t)})),u.Oc(98),u.lc(99,"translate"),u.Vb(),u.Vb(),u.Vb(),u.Vb(),u.Wb(100,"button",45),u.ic("click",(function(t){return e.closeModal(t)})),u.Wb(101,"span"),u.Oc(102),u.lc(103,"translate"),u.Vb(),u.Vb(),u.Vb(),u.Vb()),2&t&&(u.Db(2),u.rc("disabled",e.submitted),u.Db(3),u.Pc(u.mc(6,41,"CLOSE")),u.Db(2),u.rc("disabled",e.submitted),u.Db(3),u.Pc(u.mc(11,43,"MINIMIZE")),u.Db(5),u.rc("title",u.mc(16,45,"EXPAND")),u.Db(3),u.rc("title",u.mc(19,47,"CLOSE")),u.Db(4),u.Pc(e.modalTitle),u.Db(1),u.rc("formGroup",e.form)("ngClass",u.wc(73,P,e.submitted)),u.Db(2),u.Ib("loading",e.loading),u.Db(5),u.Qc(" ",u.mc(31,49,"EMAIL")," "),u.Db(2),u.rc("ngClass",u.wc(75,L,e.form.controls.email.touched&&!e.form.controls.email.valid)),u.Db(1),u.rc("ngIf",e.formErrors.email),u.Db(4),u.Qc(" ",u.mc(38,51,"FULL_NAME")," "),u.Db(2),u.rc("ngClass",u.wc(77,L,e.form.controls.fullName.touched&&!e.form.controls.fullName.valid)),u.Db(1),u.rc("ngIf",e.formErrors.fullName),u.Db(5),u.Qc(" ",u.mc(46,53,"PHONE")," "),u.Db(3),u.rc("ngIf",e.formErrors.phone),u.Db(4),u.Qc(" ",u.mc(53,55,"ROLE")," "),u.Db(2),u.rc("ngClass",u.wc(79,L,e.form.controls.role.touched&&!e.form.controls.role.valid)),u.Db(1),u.rc("ngForOf",u.mc(56,57,e.userRoles$)),u.Db(2),u.rc("ngIf",e.formErrors.password),u.Db(5),u.Qc(" ",u.mc(63,59,"PASSWORD")," "),u.Db(2),u.rc("ngClass",u.wc(81,L,e.form.controls.password.touched&&!e.form.controls.password.valid)),u.Db(1),u.rc("ngIf",e.formErrors.password),u.Db(4),u.Qc(" ",u.mc(70,61,"CONFIRM_PASSWORD")," "),u.Db(2),u.rc("ngClass",u.wc(83,L,e.form.controls.confirmPassword.touched&&!e.form.controls.confirmPassword.valid)),u.Db(1),u.rc("ngIf",e.formErrors.confirmPassword),u.Db(6),u.tc("id","fieldIsActive",e.model.id,""),u.Db(1),u.tc("for","fieldIsActive",e.model.id,""),u.Db(1),u.Pc(u.mc(81,63,"ACTIVE")),u.Db(2),u.rc("closeOthers",!0),u.Db(1),u.rc("title",u.mc(84,65,"OPTIONS")),u.Db(3),u.rc("ngIf",e.errorMessage),u.Db(2),u.rc("ngIf",e.allowImpersonation),u.Db(2),u.rc("disabled",e.submitted),u.Db(2),u.Pc(u.mc(93,67,"SAVE_AND_CLOSE")),u.Db(3),u.rc("disabled",e.submitted),u.Db(3),u.Pc(u.mc(99,69,"SAVE")),u.Db(4),u.Pc(u.mc(103,71,"CLOSE")))},directives:[n.y,n.o,n.h,s.n,n.b,n.n,n.g,s.p,n.v,s.o,n.a,E.a,E.k,E.l,E.d,E.g,E.f,E.e,n.r,n.x,n.d,n.i,E.u],pipes:[y.c,s.b],encapsulation:2}),t})();const q=[{path:"",redirectTo:"/users/",pathMatch:"full"},{path:":userEmail",component:(()=>{class t extends b.a{constructor(t,e,o,s,i,r){super(t,e,o,s),this.dataService=t,this.activeModal=e,this.modalService=o,this.translateService=s,this.route=i,this.router=r,this.queryOptions=new v.a("id","desc",1,10,0,0),this.tableFields=[{name:"id",sortName:"id",title:"ID",outputType:"text",outputProperties:{}},{name:"email",sortName:"email",title:"EMAIL",outputType:"text",outputProperties:{}},{name:"fullName",sortName:"fullName",title:"FULL_NAME",outputType:"text",outputProperties:{}},{name:"role",sortName:"roles",title:"ROLE",outputType:"userRole",outputProperties:{}},{name:"createdDate",sortName:"createdDate",title:"DATE_TIME",outputType:"date",outputProperties:{format:"dd/MM/y H:mm:s"}},{name:"isActive",sortName:"isActive",title:"STATUS",outputType:"boolean",outputProperties:{}}]}ngOnInit(){this.afterInit()}afterInit(){this.route.paramMap.subscribe(t=>{this.queryOptions.search_word=t.get("userEmail"),this.getList()})}onSearchClear(){this.route.snapshot.url&&this.route.snapshot.url[0].path?this.router.navigate(["/users",""]):this.getList()}setModalInputs(t,e=!1,o=""){const s=void 0!==t&&!e;this.modalRef.componentInstance.modalTitle=s?`${this.getLangString("USER")} #${t}`:this.getLangString("ADD_USER"),this.modalRef.componentInstance.modalId=o,this.modalRef.componentInstance.itemId=t||0,this.modalRef.componentInstance.isItemCopy=e||!1,this.modalRef.componentInstance.isEditMode=s}getModalElementId(t){return["modal","user",t||0].join("-")}getModalContent(){return _}changeRequest(t){}}return t.title="USERS",t.\u0275fac=function(e){return new(e||t)(u.Qb(p),u.Qb(E.b),u.Qb(E.h),u.Qb(y.d),u.Qb(r.a),u.Qb(r.c))},t.\u0275cmp=u.Kb({type:t,selectors:[["app-shk-users"]],features:[u.Cb([p]),u.Ab],decls:37,vars:29,consts:[[1,"card"],[1,"card-body"],[1,"icon-head"],[1,"mb-3"],[1,"float-md-left"],[1,"form-control-search","mb-2","mb-md-0",3,"ngClass"],["type","text",1,"form-control","min-width250",3,"placeholder","ngModel","ngModelChange"],[3,"click"],[1,"float-md-right"],["ngbDropdown","","placement","bottom-right",1,"d-block","d-md-inline-block","mb-2","mb-md-0"],["ngbDropdownToggle","",1,"btn","btn-info","d-block","d-md-inline-block","width-100","width-md-auto"],["ngbDropdownMenu",""],[1,"dropdown-item",3,"click"],["type","button",1,"btn","btn-success","btn-wide","d-block","d-md-inline-block","width-100","width-md-auto","ml-md-2","mb-2","mb-md-0",3,"click"],[1,"icon-plus"],[1,"float-left"],[1,"clearfix"],[1,"min-height400"],[3,"items","selectedIds","collectionSize","queryOptions","tableFields","loading","isCloneAllowed","selectedIdsChange","loadingChange","actionRequest","changeRequest"],["table",""]],template:function(t,e){1&t&&(u.Wb(0,"div",0),u.Wb(1,"div",1),u.Wb(2,"h3"),u.Rb(3,"i",2),u.Oc(4),u.lc(5,"translate"),u.Vb(),u.Rb(6,"hr"),u.Wb(7,"div",3),u.Wb(8,"div",4),u.Wb(9,"div",5),u.Wb(10,"input",6),u.ic("ngModelChange",(function(t){return e.queryOptions.search_word=t}))("ngModelChange",(function(){return e.onSearchWordUpdate()})),u.lc(11,"translate"),u.Vb(),u.Wb(12,"span",7),u.ic("click",(function(){return e.onSearchWordUpdate("")})),u.Vb(),u.Vb(),u.Vb(),u.Wb(13,"div",8),u.Wb(14,"div",9),u.Wb(15,"button",10),u.Wb(16,"span"),u.Oc(17),u.lc(18,"translate"),u.Vb(),u.Vb(),u.Wb(19,"div",11),u.Wb(20,"button",12),u.ic("click",(function(){return e.blockSelected()})),u.Oc(21),u.lc(22,"translate"),u.Vb(),u.Wb(23,"button",12),u.ic("click",(function(){return e.deleteSelected()})),u.Oc(24),u.lc(25,"translate"),u.Vb(),u.Vb(),u.Vb(),u.Wb(26,"button",13),u.ic("click",(function(){return e.modalOpen()})),u.Rb(27,"i",14),u.Oc(28," \xa0 "),u.Wb(29,"span"),u.Oc(30),u.lc(31,"translate"),u.Vb(),u.Vb(),u.Vb(),u.Rb(32,"div",15),u.Rb(33,"div",16),u.Vb(),u.Wb(34,"div",17),u.Wb(35,"app-table",18,19),u.ic("selectedIdsChange",(function(t){return e.selectedIds=t}))("loadingChange",(function(t){return e.loading=t}))("actionRequest",(function(t){return e.actionRequest(t)}))("changeRequest",(function(t){return e.changeRequest(t)})),u.Vb(),u.Vb(),u.Vb(),u.Vb()),2&t&&(u.Db(4),u.Qc(" ",u.mc(5,15,"USERS")," "),u.Db(5),u.rc("ngClass",u.wc(27,T,!!e.queryOptions.search_word)),u.Db(1),u.tc("placeholder","",u.mc(11,17,"SEARCH"),"..."),u.rc("ngModel",e.queryOptions.search_word),u.Db(7),u.Pc(u.mc(18,19,"BATCH_ACTIONS")),u.Db(4),u.Pc(u.mc(22,21,"DISABLE_ENABLE")),u.Db(3),u.Pc(u.mc(25,23,"DELETE")),u.Db(6),u.Pc(u.mc(31,25,"ADD")),u.Db(5),u.rc("items",e.items)("selectedIds",e.selectedIds)("collectionSize",e.collectionSize)("queryOptions",e.queryOptions)("tableFields",e.tableFields)("loading",e.loading)("isCloneAllowed",!1))},directives:[s.n,n.b,n.n,n.q,E.d,E.g,E.f,D.a],pipes:[y.c],encapsulation:2}),t})()}];let Q=(()=>{class t{}return t.\u0275mod=u.Ob({type:t}),t.\u0275inj=u.Nb({factory:function(e){return new(e||t)},imports:[[r.f.forChild(q)],r.f]}),t})();o.d(e,"UsersModule",(function(){return x}));let x=(()=>{class t{}return t.\u0275mod=u.Ob({type:t}),t.\u0275inj=u.Nb({factory:function(e){return new(e||t)},providers:[p],imports:[[s.c,i.a,Q]]}),t})()}}]);