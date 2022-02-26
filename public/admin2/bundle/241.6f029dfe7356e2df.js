"use strict";(self.webpackChunkadmin2=self.webpackChunkadmin2||[]).push([[241],{889:(D,m,n)=>{n.d(m,{s:()=>f});var l=n(262),g=n(608),h=n(7587),d=n(520);let f=(()=>{class s extends g.D{constructor(o){super(o),this.setRequestUrl("/admin/content_types")}getItemByName(o){const p=this.getRequestUrl()+`/by_name/${o}`;return this.http.get(p).pipe((0,l.K)(this.handleError()))}getItemByCategory(o){const p=this.getRequestUrl()+`/by_category/${o}`;return this.http.get(p).pipe((0,l.K)(this.handleError()))}}return s.\u0275fac=function(o){return new(o||s)(h.LFG(d.eN))},s.\u0275prov=h.Yz7({token:s,factory:s.\u0275fac,providedIn:"root"}),s})()},846:(D,m,n)=>{n.d(m,{P:()=>y});var l=n(3075),g=n(7579),h=n(2722);class d{constructor(r,t,e,i,u,E,_,v){this.fileId=r,this.title=t,this.extension=e,this.size=i,this.fileName=u,this.dirPath=E,this.dataUrl=_,this.isDir=v,this.toString=()=>`${this.title}.${this.extension}`}static getFileData(r){if(!r)return null;const t=r.name.substr(0,r.name.lastIndexOf(".")),e=r.name.substr(r.name.lastIndexOf(".")+1);return new d(0,t,e,r.size)}static getImageUrl(r,t){if(!t)return"";if(t.dataUrl)return t.dataUrl;let e="";return t.fileName&&(t.fileId&&(e+=`${r}/`),e+=`${t.dirPath}/`,e+=`${t.fileName}.${t.extension}`),e}static getIsImageFile(r){return["jpg","jpeg","png","webp","gif"].indexOf(r)>-1}static getFileName(r){return`${r.title}.${r.extension}`}static getExtension(r){if(-1===r.indexOf("."))return"";const t=(r=d.baseName(r)).toLowerCase().split(".");return t[t.length-1].toLowerCase()}static baseName(r){return r.indexOf("/")>-1?r.substr(r.lastIndexOf("/")+1):r}}class f{constructor(r,t,e,i,u,E,_,v,S,O,T){this.id=r,this.title=t,this.fileName=e,this.extension=i,this.mimeType=u,this.ownerType=E,this.size=_,this.createdDate=v,this.modifiedDate=S,this.isDir=O,this.isEditable=T,this.toString=()=>`${this.title}.${this.extension}`}static getFileData(r){const t=r.name.substr(0,r.name.lastIndexOf(".")),e=r.name.substr(r.name.lastIndexOf(".")+1);return new d(0,t,e,r.size)}}var s=n(7587),a=n(5330),o=n(608);const p=["formEl"];let y=(()=>{class c{constructor(t,e,i){this.ref=t,this.config=e,this.dataService=i,this._formFieldsErrors={},this.loading=!1,this.files={},this.arrayFields={},this.arrayFieldsData={},this.destroyed$=new g.x,this.errorMessage="",this.closeReason="canceled"}set formFieldsErrors(t){for(const e in t)if(t.hasOwnProperty(e)){const i=this.form.get(e);i&&i.setErrors({incorrect:!0})}this._formFieldsErrors=t}get formFieldsErrors(){return this._formFieldsErrors}onGetData(t){this.model=t}onDataSaved(){this.closeReason="updated",this.loading=!1}ngOnInit(){this.config.data.id?this.getData(this.config.data.id):this.updateControls(),this.form.valueChanges.pipe((0,h.R)(this.destroyed$)).subscribe(()=>this.onValueChanged("form"))}getData(t){this.loading=!0,this.dataService.getItem(t).pipe((0,h.R)(this.destroyed$)).subscribe({next:e=>{this.onGetData(e),this.updateControls(),setTimeout(()=>{this.loading=!1},300)},error:e=>{e.error&&(this.errorMessage=e.error),this.loading=!1}})}getFormData(){const t=this.form.value;return Object.keys(this.model).forEach(e=>{this.files[e]&&(t[e]=Array.isArray(this.model[e])?[f.getFileData(this.files[e])]:f.getFileData(this.files[e]))}),t}saveRequest(){return this.model&&this.model.id?this.dataService.update(this.getFormData()):this.dataService.create(this.getFormData())}saveData(t=!1,e){if(e&&e.preventDefault(),this.errorMessage="",!this.form.valid)return this.formGroupMarkTouched(this.form),void this.focusFormError();this.loading=!0,this.saveRequest().pipe((0,h.R)(this.destroyed$)).subscribe({next:i=>{i.id&&(this.model=i),this.onDataSaved(),t&&this.closeModal()},error:i=>{i.error&&(this.errorMessage=i.error),i.errors&&(this.formFieldsErrors=i.errors,this.focusFormError()),this.loading=!1}})}formGroupMarkTouched(t){Object.keys(t.controls).forEach(e=>{t.controls[e].markAsTouched(),t.controls[e].markAsDirty(),t.controls[e]instanceof l.Oe&&Array.from(this.form.controls[e].controls).forEach(i=>{this.formGroupMarkTouched(i)})})}updateControls(){const t=this.form.controls;Object.keys(t).forEach(e=>{void 0!==this.model[e]&&(Array.isArray(this.model[e])&&this.arrayFields[e]?this.model[e].forEach((i,u)=>{this.arrayFieldAdd(e,i)}):t[e].setValue(this.model[e]))})}createArrayFieldsProperty(t){Object.defineProperty(this.arrayFields,t,{get:()=>this.form?this.form.get(t):null})}buildFormGroup(t,e){if(!this.arrayFieldsData[t])return new l.cw({});const i={};for(let u in this.arrayFieldsData[t])!this.arrayFieldsData[t].hasOwnProperty(u)||(i[u]=new l.NI(e[u]||"",this.arrayFieldsData[t][u].validators));return new l.cw(i)}arrayFieldAdd(t,e,i){if(i&&i.preventDefault(),e||(e={}),!this.form.controls[t]||!this.arrayFields[t])return;const E=this.buildFormGroup(t,e);this.arrayFields[t].push(E)}arrayFieldDelete(t,e,i){i&&i.preventDefault(),this.arrayFields[t].removeAt(e)}focusFormError(){setTimeout(()=>{this.formEl.nativeElement.querySelector("input.ng-invalid, textarea.ng-invalid")&&this.formEl.nativeElement.querySelector("input.ng-invalid, textarea.ng-invalid").focus()},1)}onValueChanged(t){!this[t]||this[t].valid&&(this.formFieldsErrors={})}closeModal(t){t&&t.preventDefault(),this.ref.close(this.closeReason)}dismissModal(t){this.ref.close(null)}ngOnDestroy(){this.destroyed$.next(),this.destroyed$.complete()}}return c.\u0275fac=function(t){return new(t||c)(s.Y36(a.E7),s.Y36(a.S),s.Y36(o.D))},c.\u0275cmp=s.Xpm({type:c,selectors:[["ng-component"]],viewQuery:function(t,e){if(1&t&&s.Gf(p,5),2&t){let i;s.iGM(i=s.CRH())&&(e.formEl=i.first)}},decls:0,vars:0,template:function(t,e){},encapsulation:2}),c})()},6421:(D,m,n)=>{n.d(m,{p:()=>y});var l=n(7579),g=n(2722),h=n(511),d=n(7587),f=n(5330),s=n(889),a=n(608),o=n(2466),p=n(9783);let y=(()=>{class c{constructor(t,e,i,u,E,_){this.dialogService=t,this.contentTypesService=e,this.dataService=i,this.translateService=u,this.messageService=E,this.confirmationService=_,this.loading=!1,this.items=[],this.itemsTotal=0,this.queryOptions=new h.J(1,12,"createdDate","desc"),this.destroyed$=new l.x}ngOnInit(){this.menuItems=[{label:this.getLangString("REFRESH"),icon:"pi pi-refresh",command:()=>{this.queryOptions.page=1,this.queryOptions.search_word="",this.getData()}},{label:this.getLangString("DELETE_SELECTED"),icon:"pi pi-times",command:()=>{this.deleteSelected()}}],this.getContentTypeFields()}getData(t){t&&t.rows&&this.pageChanged(t),t&&t.sortField&&this.onSortingChange(t),this.loading=!0,this.dataService.getListPage(this.queryOptions).pipe((0,g.R)(this.destroyed$)).subscribe({next:e=>{this.items=e.items,this.itemsTotal=e.total,this.loading=!1,this.itemsSelected=[]},error:e=>{e.error&&this.messageService.add({key:"message",severity:"error",detail:e.error}),this.items=[],this.itemsTotal=0,this.loading=!1}})}getContentTypeFields(){this.contentTypesService.getList().pipe((0,g.R)(this.destroyed$)).subscribe({next:t=>{},error:this.onRequestError.bind(this)})}getItemData(t){return{id:t?t.id:0}}getModalTitle(t){return this.getLangString(t?"EDIT":"CREATE")}openModal(t,e){e&&e.preventDefault(),this.dialogService.open(this.getModalComponent(),{header:this.getModalTitle(t),width:"800px",data:this.getItemData(t)}).onClose.pipe((0,g.R)(this.destroyed$)).subscribe(u=>{u&&(this.messageService.add({key:"message",severity:"success",detail:t?"Edited successfully!":"Created successfully!"}),this.getData())})}onSortingChange(t){t&&t.sortField&&(this.queryOptions.sort_by=t.sortField,this.queryOptions.sort_dir=t.sortOrder>0?"asc":"desc")}pageChanged(t){t&&t.rows&&(this.queryOptions.page=t.first/t.rows+1)}onInputSearch(){clearTimeout(this.searchTimer),this.searchTimer=setTimeout(()=>{this.getData()},500)}deleteItem(t,e){e&&e.preventDefault(),this.confirmationService.confirm({message:this.getLangString("YOU_SURE_YOU_WANT_DELETE"),accept:()=>{this.loading=!0,this.dataService.deleteItem(t.id).pipe((0,g.R)(this.destroyed$)).subscribe({next:i=>{this.messageService.add({key:"message",severity:"success",detail:this.getLangString("DELETED_SUCCESSFULLY")}),1===this.items.length&&(this.queryOptions.page=1),this.getData()},error:this.onRequestError.bind(this)})}})}blockSelected(){if(!this.itemsSelected||0===this.itemsSelected.length)return void this.showAlert(this.getLangString("NOTHING_IS_SELECTED"));const t=this.itemsSelected.map(e=>e.id);this.dataService.actionBatch(t,"block").pipe((0,g.R)(this.destroyed$)).subscribe({next:e=>{this.getData()},error:this.onRequestError.bind(this)})}deleteSelected(){this.itemsSelected&&0!==this.itemsSelected.length?this.confirmationService.confirm({message:this.getLangString("YOU_SURE_YOU_WANT_DELETE_SELECTED"),accept:()=>{const t=this.itemsSelected.map(e=>e.id);this.dataService.actionBatch(t,"delete").pipe((0,g.R)(this.destroyed$)).subscribe({next:e=>{this.messageService.add({key:"message",severity:"success",detail:this.getLangString("DELETED_SUCCESSFULLY")}),1===this.items.length&&(this.queryOptions.page=1),this.getData()},error:this.onRequestError.bind(this)})}}):this.showAlert(this.getLangString("NOTHING_IS_SELECTED"))}showAlert(t,e="error"){this.messageService.add({key:"message",severity:e,detail:t})}navBarToggle(){window.document.querySelector(".layout-sidebar").classList.toggle("active"),window.document.querySelector(".layout-mask").classList.toggle("layout-mask-active")}onOptionUpdate(t){const[e,i,u]=t}getLangString(t){return this.translateService.store.translations[this.translateService.currentLang]&&this.translateService.store.translations[this.translateService.currentLang][t]||t}onRequestError(t){t.error&&this.messageService.add({key:"message",severity:"error",detail:t.error}),this.loading=!1}ngOnDestroy(){this.destroyed$.next(),this.destroyed$.complete()}}return c.\u0275fac=function(t){return new(t||c)(d.Y36(f.xA),d.Y36(s.s),d.Y36(a.D),d.Y36(o.sK),d.Y36(p.ez),d.Y36(p.YP))},c.\u0275cmp=d.Xpm({type:c,selectors:[["ng-component"]],decls:0,vars:0,template:function(t,e){},encapsulation:2}),c})()},511:(D,m,n)=>{n.d(m,{J:()=>l});class l{constructor(h,d,f,s,a,o,p,y,c,r){this.page=h,this.limit=d,this.sort_by=f,this.sort_dir=s,this.order_by=a,this.full=o,this.only_active=p,this.query=y,this.search_word=c,this.category=r,void 0===c&&(this.search_word="")}}},608:(D,m,n)=>{n.d(m,{D:()=>d});var l=n(520),g=n(9646),h=n(262);class d{constructor(s){this.http=s,this.headers=new l.WM({"Content-Type":"application/json","X-Requested-With":"XMLHttpRequest"}),this.requestUrl="",this.requestUrl="/admin/app/data_list"}setRequestUrl(s){this.requestUrl=s}getRequestUrl(){return this.requestUrl}getItem(s){const a=this.getRequestUrl()+`/${s}`;return this.http.get(a,{headers:this.headers}).pipe((0,h.K)(this.handleError()))}createHttpParams(s){let a=new l.LE;return Object.keys(s).forEach(o=>{a=a.append(o,s[o])}),a}getList(s){let a=new l.LE;for(const o in s)!s.hasOwnProperty(o)||void 0===s[o]||(a=a.append(o,s[o]));return this.http.get(this.getRequestUrl(),{params:a,headers:this.headers}).pipe((0,h.K)(this.handleError()))}getListPage(s){let a=new l.LE;if(s)for(const o in s)!s.hasOwnProperty(o)||void 0===s[o]||(a=a.append(o,s[o]));return this.http.get(this.getRequestUrl(),{params:a,headers:this.headers}).pipe((0,h.K)(this.handleError()))}deleteItem(s){const a=this.getRequestUrl()+`/${s}`;return this.http.delete(a,{headers:this.headers}).pipe((0,h.K)(this.handleError()))}deleteByArray(s){const a=this.getRequestUrl()+"/batch";return this.http.post(a,{ids:s},{headers:this.headers}).pipe((0,h.K)(this.handleError()))}actionBatch(s,a="delete"){const o=`${this.getRequestUrl()}/${a}/batch`;return this.http.post(o,{ids:s},{headers:this.headers}).pipe((0,h.K)(this.handleError()))}create(s){return this.http.post(this.getRequestUrl(),s,{headers:this.headers}).pipe((0,h.K)(this.handleError()))}update(s){const a=this.getRequestUrl()+`/${s.id}`;return this.http.put(a,s,{headers:this.headers}).pipe((0,h.K)(this.handleError()))}postFormData(s){const a=new l.WM({enctype:"multipart/form-data",Accept:"application/json","X-Requested-With":"XMLHttpRequest"});return this.http.post(`${this.getRequestUrl()}/upload`,s,{headers:a}).pipe((0,h.K)(this.handleError()))}updateProperty(s,a,o){const p=this.getRequestUrl()+`/update/${a}/${s}`;return this.http.patch(p,{value:o},{headers:this.headers}).pipe((0,h.K)(this.handleError()))}handleError(s="operation",a){return o=>{if(o.error)throw o.error;return(0,g.of)(a)}}}}}]);