"use strict";(self.webpackChunkadmin2=self.webpackChunkadmin2||[]).push([[896],{4241:(St,v,p)=>{p.r(v),p.d(v,{OrdersModule:()=>Nt});var u=p(9808),U=p(1113),y=p(7854),_=p(5330),m=p(9783),E=p(608),t=p(7587),L=p(520);let g=(()=>{class n extends E.D{constructor(e){super(e),this.setRequestUrl("/admin/orders")}}return n.\u0275fac=function(e){return new(e||n)(t.LFG(L.eN))},n.\u0275prov=t.Yz7({token:n,factory:n.\u0275fac}),n})();var M=p(511),S=p(6421),a=p(3075),O=p(1480);class f{constructor(i,e,o,r,l,s,d,T,h,x,A,b,C){this.id=i,this.title=e,this.count=o,this.price=r,this.uniqId=l,this.priceTotal=s,this.contentTypeName=d,this.uri=T,this.image=h,this.parameters=x,this.files=A,this.currency=b,this.deleted=C,this.createParametersString(),this.createFilesString(),void 0===this.deleted&&(this.deleted=!1)}static priceUpdate(i){i.priceTotal=i.price*i.count;let e=0;void 0!==i.parameters&&i.parameters.forEach(o=>{e+=o.price*i.count}),i.priceTotal+=e}get parametersString(){return this._parametersString}set parametersString(i){this._parametersString=i}get filesString(){return this._filesString}set filesString(i){this._filesString=i}priceUpdate(){this.priceTotal=this.price*this.count;let i=0;void 0!==this.parameters&&this.parameters.forEach(e=>{i+=e.price*this.count}),this.priceTotal+=i}createParametersString(){if(!this.parameters)return;const i=[];this.parameters.forEach(e=>{let o="";e.name&&(o+=`${e.name}: `),o+=e.value+(e.price?` (${e.price})`:""),i.push(o)}),this.parametersString=i.join(", ")}createFilesString(){if(!this.files)return;const i=[],e=O.d.getBaseUrl();this.files.forEach(o=>{let l=`<a href="${e}admin/files/download/${o.fileId}" target="_blank">`;l+=`${o.title}.${o.extension}</a>`,i.push(l)}),this.filesString=i.join(", ")}}class J{constructor(i,e,o,r,l,s,d,T,h,x,A,b,C,qt,It,wt,Ut,Et,Lt,Mt){this.id=i,this.userId=e,this.status=o,this.email=r,this.phone=l,this.fullName=s,this.createdDate=d,this.deliveryName=T,this.deliveryPrice=h,this.paymentName=x,this.paymentValue=A,this.comment=b,this.contentCount=C,this.price=qt,this.currency=It,this.options=wt,this.currencyRate=Ut,this.discount=Et,this.discountPercent=Lt,this.promoCode=Mt}get content(){return this._content}set content(i){this._content=[],i.forEach(e=>{this._content.push(new f(e.id,e.title,e.count,e.price,e.uniqId,e.priceTotal,e.contentTypeName,e.uri,e.image,e.parameters,e.files||[],"",e.deleted||!1))})}}var R=p(846),Y=p(4332),N=p(845),q=p(1424),P=p(3407),I=p(3787),c=p(4851),w=p(5787),Q=p(4036),D=p(4119),F=p(3724),Z=p(2466);function k(n,i){if(1&n&&(t.TgZ(0,"div",38),t.TgZ(1,"div",9),t.TgZ(2,"label",39),t._uU(3),t.ALo(4,"translate"),t.qZA(),t._UZ(5,"p-dropdown",40),t.qZA(),t.TgZ(6,"div",9),t.TgZ(7,"label",41),t._uU(8),t.ALo(9,"translate"),t.qZA(),t._UZ(10,"p-dropdown",42),t.qZA(),t.qZA()),2&n){const e=t.oxw();t.xp6(3),t.hij(" ",t.lcZ(4,4,"DELIVERY_METHOD")," "),t.xp6(2),t.Q6J("options",e.settings.SETTINGS_DELIVERY),t.xp6(3),t.hij(" ",t.lcZ(9,6,"PAYMENT_METHOD")," "),t.xp6(2),t.Q6J("options",e.settings.SETTINGS_PAYMENT)}}function j(n,i){1&n&&(t.TgZ(0,"tr"),t.TgZ(1,"th"),t._uU(2),t.ALo(3,"translate"),t.qZA(),t.TgZ(4,"th"),t._uU(5),t.ALo(6,"translate"),t.qZA(),t.TgZ(7,"th"),t._uU(8),t.ALo(9,"translate"),t.qZA(),t.qZA()),2&n&&(t.xp6(2),t.Oqu(t.lcZ(3,3,"SYSTEM_NAME")),t.xp6(3),t.Oqu(t.lcZ(6,5,"NAME")),t.xp6(3),t.Oqu(t.lcZ(9,7,"VALUE")))}function B(n,i){1&n&&(t.TgZ(0,"tr",43),t.TgZ(1,"td"),t._UZ(2,"input",44),t.qZA(),t.TgZ(3,"td"),t._UZ(4,"input",45),t.qZA(),t.TgZ(5,"td"),t._UZ(6,"input",46),t.qZA(),t.qZA()),2&n&&t.Q6J("formGroupName",i.rowIndex+"")}function H(n,i){1&n&&(t.TgZ(0,"tr"),t.TgZ(1,"th"),t._uU(2),t.ALo(3,"translate"),t.qZA(),t.TgZ(4,"th"),t._uU(5),t.ALo(6,"translate"),t.qZA(),t.TgZ(7,"th",47),t._uU(8),t.ALo(9,"translate"),t.qZA(),t.TgZ(10,"th",47),t._uU(11),t.ALo(12,"translate"),t.qZA(),t.TgZ(13,"th",47),t._uU(14),t.ALo(15,"translate"),t.qZA(),t.qZA()),2&n&&(t.xp6(2),t.Oqu(t.lcZ(3,5,"ID")),t.xp6(3),t.Oqu(t.lcZ(6,7,"NAME")),t.xp6(3),t.Oqu(t.lcZ(9,9,"PRICE")),t.xp6(3),t.Oqu(t.lcZ(12,11,"QUANTITY")),t.xp6(3),t.Oqu(t.lcZ(15,13,"PRICE_TOTAL")))}function $(n,i){if(1&n&&(t.ynx(0),t._uU(1),t.BQk()),2&n){const e=t.oxw().$implicit;t.xp6(1),t.hij(" ",e.title," ")}}function V(n,i){if(1&n&&(t.TgZ(0,"a",60),t._uU(1),t.qZA()),2&n){const e=t.oxw().$implicit,o=t.oxw();t.hYB("href","/",o.baseUrl,"",e.uri,"",t.LSH),t.xp6(1),t.hij(" ",e.title," ")}}function G(n,i){if(1&n&&(t.TgZ(0,"div"),t._UZ(1,"i",63),t._uU(2,"\xa0 "),t._UZ(3,"span",64),t.qZA()),2&n){const e=t.oxw(2).$implicit;t.xp6(3),t.Q6J("innerHTML",e.filesString,t.oJD)}}function z(n,i){if(1&n&&(t.TgZ(0,"div",61),t._uU(1),t.YNc(2,G,4,1,"div",62),t.qZA()),2&n){const e=t.oxw().$implicit;t.xp6(1),t.hij(" ",e.parametersString," "),t.xp6(1),t.Q6J("ngIf",e.filesString)}}function X(n,i){1&n&&t._UZ(0,"input",65)}function K(n,i){if(1&n&&(t._uU(0),t.ALo(1,"number")),2&n){const e=t.oxw().$implicit;t.hij(" ",t.Dn7(1,1,e.price,"1.2-2","en-EN")," ")}}function W(n,i){1&n&&t._UZ(0,"input",66)}function tt(n,i){if(1&n&&t._uU(0),2&n){const e=t.oxw().$implicit;t.hij(" ",e.count," ")}}function et(n,i){1&n&&(t._UZ(0,"button",67),t.ALo(1,"translate")),2&n&&t.Q6J("pTooltip",t.lcZ(1,1,"EDIT"))}function nt(n,i){if(1&n){const e=t.EpF();t.TgZ(0,"button",68),t.NdJ("click",function(){t.CHM(e);const r=t.oxw().$implicit;return t.oxw().deleteContent(r)}),t.ALo(1,"translate"),t.qZA()}2&n&&t.Q6J("pTooltip",t.lcZ(1,1,"DELETE"))}function ot(n,i){if(1&n){const e=t.EpF();t.TgZ(0,"button",69),t.NdJ("click",function(){t.CHM(e);const r=t.oxw(),l=r.$implicit,s=r.rowIndex;return t.oxw().onRowEditSave(l,s)}),t.ALo(1,"translate"),t.qZA()}2&n&&t.Q6J("pTooltip",t.lcZ(1,1,"SAVE"))}function it(n,i){if(1&n){const e=t.EpF();t.TgZ(0,"button",70),t.NdJ("click",function(){t.CHM(e);const r=t.oxw(),l=r.$implicit,s=r.rowIndex;return t.oxw().onRowEditCancel(l,s)}),t.ALo(1,"translate"),t.qZA()}2&n&&t.Q6J("pTooltip",t.lcZ(1,1,"CANCEL"))}function rt(n,i){if(1&n&&(t.TgZ(0,"tr",48),t.TgZ(1,"td"),t._uU(2),t.qZA(),t.TgZ(3,"td"),t.TgZ(4,"div",49),t.YNc(5,$,2,1,"ng-container",50),t.YNc(6,V,2,3,"ng-template",null,51,t.W1O),t.YNc(8,z,3,2,"div",52),t.qZA(),t.qZA(),t.TgZ(9,"td"),t.TgZ(10,"p-cellEditor"),t.YNc(11,X,1,0,"ng-template",53),t.YNc(12,K,2,5,"ng-template",54),t.qZA(),t.qZA(),t.TgZ(13,"td",47),t.TgZ(14,"p-cellEditor"),t.YNc(15,W,1,0,"ng-template",53),t.YNc(16,tt,1,1,"ng-template",54),t.qZA(),t.qZA(),t.TgZ(17,"td",47),t.TgZ(18,"div",55),t.YNc(19,et,2,3,"button",56),t.YNc(20,nt,2,3,"button",57),t.YNc(21,ot,2,3,"button",58),t.YNc(22,it,2,3,"button",59),t.qZA(),t._uU(23),t.ALo(24,"number"),t.qZA(),t.qZA()),2&n){const e=i.$implicit,o=i.editing,r=i.rowIndex,l=t.MAs(7);t.Udp("text-decoration",e.deleted?"line-through":"none"),t.Q6J("pEditableRow",e)("formGroupName",r+""),t.xp6(2),t.hij(" ",e.id," "),t.xp6(3),t.Q6J("ngIf",!e.uri)("ngIfElse",l),t.xp6(3),t.Q6J("ngIf",e.parametersString),t.xp6(11),t.Q6J("ngIf",!o&&!e.deleted),t.xp6(1),t.Q6J("ngIf",!o),t.xp6(1),t.Q6J("ngIf",o),t.xp6(1),t.Q6J("ngIf",o),t.xp6(1),t.hij(" ",t.Dn7(24,13,e.priceTotal,"1.2-2","en-EN")," ")}}function lt(n,i){if(1&n&&(t.TgZ(0,"span"),t._uU(1),t.ALo(2,"number"),t.qZA()),2&n){const e=t.oxw(3);t.xp6(1),t.Oqu(t.Dn7(2,1,e.model.discount,"1.2-2","ru-RU"))}}function pt(n,i){if(1&n&&(t.TgZ(0,"span"),t._uU(1),t.qZA()),2&n){const e=t.oxw(3);t.xp6(1),t.hij("",e.model.discountPercent,"%")}}function at(n,i){if(1&n&&(t.ynx(0),t.TgZ(1,"tr"),t.TgZ(2,"td",71),t._uU(3),t.ALo(4,"translate"),t.qZA(),t.TgZ(5,"td",47),t.YNc(6,lt,3,5,"span",62),t.YNc(7,pt,2,1,"span",62),t.qZA(),t.qZA(),t.BQk()),2&n){const e=t.oxw(2);t.xp6(3),t.Oqu(t.lcZ(4,3,"DISCOUNT")),t.xp6(3),t.Q6J("ngIf",e.model.discount),t.xp6(1),t.Q6J("ngIf",e.model.discountPercent)}}function st(n,i){if(1&n&&(t.YNc(0,at,8,5,"ng-container",62),t.TgZ(1,"tr"),t.TgZ(2,"td",71),t._uU(3),t.ALo(4,"translate"),t.qZA(),t.TgZ(5,"td",47),t._uU(6),t.ALo(7,"number"),t.qZA(),t.qZA(),t.TgZ(8,"tr"),t.TgZ(9,"td",72),t._uU(10),t.ALo(11,"translate"),t.qZA(),t.TgZ(12,"td",73),t.TgZ(13,"b"),t._uU(14),t.ALo(15,"number"),t.qZA(),t._uU(16," \xa0 "),t.TgZ(17,"span",74),t._uU(18),t.qZA(),t.qZA(),t.qZA()),2&n){const e=t.oxw();t.Q6J("ngIf",e.model.discount||e.model.discountPercent),t.xp6(3),t.Oqu(t.lcZ(4,8,"DELIVERY")),t.xp6(2),t.Udp("text-decoration",e.deliveryLimitApplied?"line-through":"none"),t.xp6(1),t.hij(" ",t.Dn7(7,10,e.model.deliveryPrice,"1.2-2","ru-RU")," "),t.xp6(4),t.hij(" ",t.lcZ(11,14,"PRICE_TOTAL"),": "),t.xp6(4),t.Oqu(t.Dn7(15,16,e.model.price,"1.2-2","ru-RU")),t.xp6(4),t.Oqu(e.model.currency)}}function ct(n,i){if(1&n&&t._UZ(0,"p-message",75),2&n){const e=t.oxw();t.Q6J("text",e.errorMessage)}}let dt=(()=>{class n extends R.P{constructor(e,o,r,l,s){super(e,o,r),this.ref=e,this.config=o,this.dataService=r,this.settingsService=l,this.appSettings=s,this.model=new J(0,0,"","",""),this.modalTitle="Order",this.deliveryLimit=0,this.deliveryLimitApplied=!1,this.formFields=[],this.contentEdit=new f(0,"",0,0),this.form=new a.cw({id:new a.NI("",[]),createdDate:new a.NI("",[]),status:new a.NI("",[]),email:new a.NI("",[]),fullName:new a.NI("",[]),phone:new a.NI("",[]),comment:new a.NI("",[]),deliveryName:new a.NI("",[]),paymentName:new a.NI("",[]),options:new a.Oe([]),content:new a.Oe([])}),this.arrayFieldsData={options:{name:{validators:[a.kI.required]},title:{validators:[a.kI.required]},value:{validators:[]}},content:{id:{validators:[]},uniqId:{validators:[]},title:{validators:[]},price:{validators:[]},count:{validators:[]},deleted:{validators:[]}}}}ngOnInit(){super.ngOnInit(),this.settings=this.appSettings.settings.systemSettings,this.createArrayFieldsProperty("options"),this.createArrayFieldsProperty("content")}onGetData(e){super.onGetData(e),this.priceTotalUpdate(),this.getDeliveryLimit()}onDataSaved(){super.onDataSaved(),this.priceTotalUpdate()}getDeliveryLimit(){if(!this.model||!this.model.options)return;const e=this.model.options.findIndex(o=>"deliveryPriceLimit"===o.name);e>-1&&(this.deliveryLimit=parseFloat(this.model.options[e].value))}priceTotalUpdate(){let e=0;this.model.content.forEach(o=>{o instanceof f?o.priceUpdate():f.priceUpdate(o),!o.deleted&&(e+=o.priceTotal)}),this.model.discount&&(e-=this.model.discount),this.model.discountPercent&&(e*=this.model.discountPercent/100),this.deliveryLimit&&e>=this.deliveryLimit?this.deliveryLimitApplied=!0:(e+=this.model.deliveryPrice||0,this.deliveryLimitApplied=!1),this.model.price=Math.max(e,0)}deleteContent(e){const o=this.model.content.findIndex(r=>r.uniqId===e.uniqId&&r.contentTypeName===e.contentTypeName);o>-1&&(this.arrayFields.content.at(o).get("deleted").setValue(!this.model.content[o].deleted),this.model.content[o].deleted=!this.model.content[o].deleted,this.priceTotalUpdate())}onRowEditSave(e,o){const r=this.arrayFields.content.controls[o];e.price=r.controls.price.value,e.count=r.controls.count.value,this.priceTotalUpdate()}onRowEditCancel(e,o){const r=this.arrayFields.content.controls[o];r.controls.price.setValue(e.price),r.controls.count.setValue(e.count)}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(_.E7),t.Y36(_.S),t.Y36(g),t.Y36(Y.g),t.Y36(O.d))},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-modal-order"]],features:[t._Bn([]),t.qOj],decls:66,vars:45,consts:[[3,"formGroup"],["formEl",""],[1,"grid","align-content-start","mb-3","mt-0","border-round","border-1","surface-200","border-400"],[1,"col-6"],[1,"p-2"],[1,"col-6","text-right"],["pButton","","target","_blank",1,"no-underline",3,"href"],[1,"pi","pi-print","mr-2"],[1,"grid"],[1,"col-12","md:col-6"],["for","fieldId",1,"block","mb-2"],["type","text","id","fieldId","pInputText","","formControlName","id","readonly","",1,"w-full"],["for","fieldEmail",1,"block","mb-2"],["type","text","id","fieldEmail","pInputText","","formControlName","email",1,"w-full"],[1,"mb-3"],["for","fieldFullName",1,"block","mb-2"],["type","text","id","fieldFullName","pInputText","","formControlName","fullName",1,"w-full"],["for","fieldPhone",1,"block","mb-2"],["type","text","id","fieldPhone","pInputText","","formControlName","phone",1,"w-full"],["for","fieldComment",1,"block","mb-2"],["id","fieldComment","rows","5","pInputTextarea","","formControlName","comment",1,"w-full"],["class","grid mb-2",4,"ngIf"],[3,"header"],["formArrayName","options"],["styleClass","p-datatable-sm",3,"value"],["pTemplate","header"],["pTemplate","body"],[3,"header","selected"],["formArrayName","content"],["dataKey","uniqId","editMode","row",3,"value"],["pTemplate","footer"],["role","separator",1,"p-divider","p-component","p-divider-horizontal","p-divider-solid","p-divider-left"],[1,"p-divider-content"],["styleClass","block w-full text-left mb-3","severity","error",3,"text",4,"ngIf"],[1,"text-right","pt-2"],["pButton","","pRipple","","type","button","icon","pi pi-check",1,"p-button-success","p-button-raised","w-full","md:w-auto","mb-2","md:mb-0","md:ml-2",3,"label","click"],["pButton","","pRipple","","type","button","icon","pi pi-check",1,"p-button-warning","p-button-raised","w-full","md:w-auto","mb-2","md:mb-0","md:ml-2",3,"label","click"],["pButton","","pRipple","","type","button",1,"p-button-secondary","p-button-raised","w-full","md:w-auto","mb-2","md:mb-0","md:ml-2",3,"label","click"],[1,"grid","mb-2"],["for","fieldDeliveryName",1,"block","mb-2"],["inputId","fieldDeliveryName","styleClass","w-full","optionLabel","name","optionValue","name","formControlName","deliveryName",3,"options"],["for","fieldPaymentName",1,"block","mb-2"],["inputId","fieldPaymentName","styleClass","w-full","optionLabel","name","optionValue","name","formControlName","paymentName",3,"options"],[3,"formGroupName"],["type","text","pInputText","","formControlName","name",1,"p-inputtext-sm","w-full"],["type","text","pInputText","","formControlName","title",1,"p-inputtext-sm","w-full"],["type","text","pInputText","","formControlName","value",1,"p-inputtext-sm","w-full"],[1,"text-center"],[1,"show-on-hover-parent",3,"pEditableRow","formGroupName"],[1,"text-overflow"],[4,"ngIf","ngIfElse"],["productLink",""],["class","text-muted small",4,"ngIf"],["pTemplate","input"],["pTemplate","output"],[1,"show-on-hover","absolute","pos-right10","pos-top10"],["pButton","","pRipple","","type","button","pInitEditableRow","","icon","pi pi-pencil","tooltipPosition","bottom","class","p-button-raised p-button-rounded p-button-sm",3,"pTooltip",4,"ngIf"],["pButton","","pRipple","","type","button","icon","pi pi-trash","tooltipPosition","bottom","class","p-button-raised p-button-rounded p-button-danger p-button-sm ml-2",3,"pTooltip","click",4,"ngIf"],["pButton","","pRipple","","type","button","pSaveEditableRow","","icon","pi pi-check","tooltipPosition","bottom","class","p-button-raised p-button-rounded p-button-success p-button-sm ml-2",3,"pTooltip","click",4,"ngIf"],["pButton","","pRipple","","type","button","pCancelEditableRow","","icon","pi pi-times","tooltipPosition","bottom","class","p-button-raised p-button-rounded p-button-secondary p-button-sm ml-2",3,"pTooltip","click",4,"ngIf"],["target","_blank",3,"href"],[1,"text-muted","small"],[4,"ngIf"],[1,"pi","pi-file"],[3,"innerHTML"],["pInputText","","type","number","formControlName","price",1,"p-inputtext-sm","w-full"],["pInputText","","type","number","formControlName","count",1,"p-inputtext-sm","w-full"],["pButton","","pRipple","","type","button","pInitEditableRow","","icon","pi pi-pencil","tooltipPosition","bottom",1,"p-button-raised","p-button-rounded","p-button-sm",3,"pTooltip"],["pButton","","pRipple","","type","button","icon","pi pi-trash","tooltipPosition","bottom",1,"p-button-raised","p-button-rounded","p-button-danger","p-button-sm","ml-2",3,"pTooltip","click"],["pButton","","pRipple","","type","button","pSaveEditableRow","","icon","pi pi-check","tooltipPosition","bottom",1,"p-button-raised","p-button-rounded","p-button-success","p-button-sm","ml-2",3,"pTooltip","click"],["pButton","","pRipple","","type","button","pCancelEditableRow","","icon","pi pi-times","tooltipPosition","bottom",1,"p-button-raised","p-button-rounded","p-button-secondary","p-button-sm","ml-2",3,"pTooltip","click"],["colspan","4"],["colspan","4",1,"text-end"],[1,"text-center","big"],[1,"small"],["styleClass","block w-full text-left mb-3","severity","error",3,"text"]],template:function(e,o){1&e&&(t.TgZ(0,"div"),t.TgZ(1,"form",0,1),t.TgZ(3,"div",2),t.TgZ(4,"div",3),t.TgZ(5,"div",4),t._uU(6),t.ALo(7,"date"),t.qZA(),t.qZA(),t.TgZ(8,"div",5),t.TgZ(9,"a",6),t._UZ(10,"i",7),t._uU(11),t.ALo(12,"translate"),t.qZA(),t.qZA(),t.qZA(),t.TgZ(13,"div",8),t.TgZ(14,"div",9),t.TgZ(15,"label",10),t._uU(16),t.ALo(17,"translate"),t.qZA(),t._UZ(18,"input",11),t.qZA(),t.TgZ(19,"div",9),t.TgZ(20,"label",12),t._uU(21),t.ALo(22,"translate"),t.qZA(),t._UZ(23,"input",13),t.qZA(),t.qZA(),t.TgZ(24,"div",8),t.TgZ(25,"div",9),t.TgZ(26,"div",14),t.TgZ(27,"label",15),t._uU(28),t.ALo(29,"translate"),t.qZA(),t._UZ(30,"input",16),t.qZA(),t.TgZ(31,"div"),t.TgZ(32,"label",17),t._uU(33),t.ALo(34,"translate"),t.qZA(),t._UZ(35,"input",18),t.qZA(),t.qZA(),t.TgZ(36,"div",9),t.TgZ(37,"label",19),t._uU(38),t.ALo(39,"translate"),t.qZA(),t._UZ(40,"textarea",20),t.qZA(),t.qZA(),t.YNc(41,k,11,8,"div",21),t.TgZ(42,"p-accordion"),t.TgZ(43,"p-accordionTab",22),t.ALo(44,"translate"),t.TgZ(45,"div",23),t.TgZ(46,"p-table",24),t.YNc(47,j,10,9,"ng-template",25),t.YNc(48,B,7,1,"ng-template",26),t.qZA(),t.qZA(),t.qZA(),t.TgZ(49,"p-accordionTab",27),t.ALo(50,"translate"),t.TgZ(51,"div",28),t.TgZ(52,"p-table",29),t.YNc(53,H,16,15,"ng-template",25),t.YNc(54,rt,25,17,"ng-template",26),t.YNc(55,st,19,20,"ng-template",30),t.qZA(),t.qZA(),t.qZA(),t.qZA(),t.TgZ(56,"div",31),t._UZ(57,"div",32),t.qZA(),t.YNc(58,ct,1,1,"p-message",33),t.TgZ(59,"div",34),t.TgZ(60,"button",35),t.NdJ("click",function(l){return o.saveData(!0,l)}),t.ALo(61,"translate"),t.qZA(),t.TgZ(62,"button",36),t.NdJ("click",function(l){return o.saveData(!1,l)}),t.ALo(63,"translate"),t.qZA(),t.TgZ(64,"button",37),t.NdJ("click",function(l){return o.dismissModal(l)}),t.ALo(65,"translate"),t.qZA(),t.qZA(),t.qZA(),t.qZA()),2&e&&(t.xp6(1),t.Q6J("formGroup",o.form),t.xp6(5),t.hij(" ",t.xi3(7,20,o.model.createdDate,"dd/MM/y HH:mm:ss")," "),t.xp6(3),t.hYB("href","",o.baseUrl,"orders/print/",o.model.id,"",t.LSH),t.xp6(2),t.hij(" ",t.lcZ(12,23,"PRINT")," "),t.xp6(5),t.hij(" ",t.lcZ(17,25,"ID")," "),t.xp6(5),t.hij(" ",t.lcZ(22,27,"EMAIL")," "),t.xp6(7),t.hij(" ",t.lcZ(29,29,"FULL_NAME")," "),t.xp6(5),t.hij(" ",t.lcZ(34,31,"PHONE")," "),t.xp6(5),t.hij(" ",t.lcZ(39,33,"COMMENT")," "),t.xp6(3),t.Q6J("ngIf",o.settings),t.xp6(2),t.Q6J("header",t.lcZ(44,35,"OPTIONS")),t.xp6(3),t.Q6J("value",o.arrayFields.options.controls),t.xp6(3),t.Q6J("header",t.lcZ(50,37,"ORDER_CONTENT"))("selected",!0),t.xp6(3),t.Q6J("value",o.model.content),t.xp6(6),t.Q6J("ngIf",o.errorMessage),t.xp6(2),t.Q6J("label",t.lcZ(61,39,"SAVE_AND_CLOSE")),t.xp6(2),t.Q6J("label",t.lcZ(63,41,"SAVE")),t.xp6(2),t.Q6J("label",t.lcZ(65,43,"CLOSE")))},directives:[a._Y,a.JL,a.sg,N.Hq,a.Fj,q.o,a.JJ,a.u,P.g,u.O5,I.UQ,I.US,a.CE,c.iA,m.jx,w.H,Q.Lt,a.x0,c.D$,c.YL,a.wV,c.Pv,D.u,c.U1,c.wT,F.q],pipes:[u.uU,Z.X$,u.JJ],encapsulation:2}),n})();var ut=p(889),mt=p(9114),_t=p(1874),gt=p(6572);function ft(n,i){if(1&n){const e=t.EpF();t.TgZ(0,"div",16),t.TgZ(1,"span",17),t._UZ(2,"i",18),t.TgZ(3,"input",19),t.NdJ("input",function(){return t.CHM(e),t.oxw().onInputSearch()})("ngModelChange",function(r){return t.CHM(e),t.oxw().queryOptions.search_word=r}),t.ALo(4,"translate"),t.qZA(),t.qZA(),t.TgZ(5,"div"),t.TgZ(6,"button",20),t.NdJ("click",function(r){return t.CHM(e),t.oxw(),t.MAs(18).toggle(r)}),t.ALo(7,"translate"),t.qZA(),t.qZA(),t.qZA()}if(2&n){const e=t.oxw();t.xp6(3),t.MGl("placeholder","",t.lcZ(4,3,"SEARCH"),"..."),t.Q6J("ngModel",e.queryOptions.search_word),t.xp6(3),t.Q6J("label",t.lcZ(7,5,"ACTIONS"))}}function Zt(n,i){if(1&n&&(t.TgZ(0,"th",22),t._uU(1),t.ALo(2,"translate"),t._UZ(3,"p-sortIcon",23),t.qZA()),2&n){const e=i.$implicit;t.Q6J("pSortableColumn",e.field),t.xp6(1),t.hij(" ",t.lcZ(2,3,e.header)," "),t.xp6(2),t.Q6J("field",e.field)}}function Tt(n,i){if(1&n&&(t.TgZ(0,"tr"),t.TgZ(1,"th"),t._UZ(2,"p-tableHeaderCheckbox"),t.qZA(),t.YNc(3,Zt,4,5,"th",21),t.qZA()),2&n){const e=i.$implicit;t.xp6(3),t.Q6J("ngForOf",e)}}function ht(n,i){if(1&n){const e=t.EpF();t.ynx(0),t.TgZ(1,"div",29),t.TgZ(2,"button",30),t.NdJ("click",function(){t.CHM(e);const r=t.oxw(2).$implicit;return t.oxw().openModal(r)}),t.qZA(),t.TgZ(3,"button",31),t.NdJ("click",function(){t.CHM(e);const r=t.oxw(2).$implicit;return t.oxw().deleteItem(r)}),t.qZA(),t.qZA(),t.BQk()}}function xt(n,i){if(1&n){const e=t.EpF();t.TgZ(0,"td"),t.TgZ(1,"app-render-output",27),t.NdJ("changeRequest",function(r){return t.CHM(e),t.oxw(2).onOptionUpdate(r)}),t.qZA(),t.YNc(2,ht,4,0,"ng-container",28),t.qZA()}if(2&n){const e=i.$implicit,o=i.index,r=t.oxw(),l=r.$implicit,s=r.columns;t.xp6(1),t.Q6J("value",l[e.field])("key",e.field)("outputType",e.outputType)("options",e.outputProperties)("object",l),t.xp6(1),t.Q6J("ngIf",s.length==o+1)}}function At(n,i){if(1&n&&(t.TgZ(0,"tr",24),t.TgZ(1,"td"),t._UZ(2,"p-tableCheckbox",25),t.qZA(),t.YNc(3,xt,3,6,"td",26),t.qZA()),2&n){const e=i.$implicit,o=i.columns;t.xp6(2),t.Q6J("value",e),t.xp6(1),t.Q6J("ngForOf",o)}}function bt(n,i){1&n&&(t.ynx(0),t._uU(1),t.ALo(2,"translate"),t.BQk()),2&n&&(t.xp6(1),t.hij(" ",t.lcZ(2,1,"NOTHING_FOUND"),". "))}function Ct(n,i){1&n&&(t._uU(0),t.ALo(1,"translate")),2&n&&t.hij(" ",t.lcZ(1,1,"EMPTY"),". ")}function vt(n,i){if(1&n&&(t.TgZ(0,"tr"),t.TgZ(1,"td",32),t.YNc(2,bt,3,3,"ng-container",33),t.YNc(3,Ct,2,3,"ng-template",null,34,t.W1O),t.qZA(),t.qZA()),2&n){const e=i.$implicit,o=t.MAs(4),r=t.oxw();t.xp6(1),t.Q6J("colSpan",e.length+1),t.xp6(1),t.Q6J("ngIf",r.queryOptions.search_word)("ngIfElse",o)}}const yt=[{path:"",component:(()=>{class n extends S.p{constructor(e,o,r,l,s,d){super(e,o,r,l,s,d),this.dialogService=e,this.contentTypesService=o,this.dataService=r,this.translateService=l,this.messageService=s,this.confirmationService=d,this.queryOptions=new M.J(1,12,"id","desc"),this.items=[],this.cols=[{field:"id",header:"ID",outputType:"text-center",outputProperties:{}},{field:"status",header:"STATUS",outputType:"status",outputProperties:{}},{field:"price",header:"PRICE",outputType:"number",outputProperties:{}},{field:"contentCount",header:"CONTENT_COUNT",outputType:"text-center",outputProperties:{}},{field:"email",header:"EMAIL",outputType:"userEmail",outputProperties:{}},{field:"createdDate",header:"DATE_TIME",outputType:"date",outputProperties:{format:"dd/MM/y HH:mm:ss"}}]}ngOnInit(){this.menuItems=[{label:this.getLangString("REFRESH"),icon:"pi pi-refresh",command:()=>{this.queryOptions.page=1,this.queryOptions.search_word="",this.getData()}},{label:this.getLangString("DELETE_SELECTED"),icon:"pi pi-times",command:()=>{this.deleteSelected()}}],super.ngOnInit()}getModalComponent(){return dt}onOptionUpdate(e){const[o,r,l]=e;!o.id||this.dataService.updateProperty(o.id,r,l).subscribe(()=>{this.getData()})}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(_.xA),t.Y36(ut.s),t.Y36(g),t.Y36(Z.sK),t.Y36(m.ez),t.Y36(m.YP))},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-orders"]],features:[t._Bn([_.xA,m.YP,g]),t.qOj],decls:19,vars:19,consts:[[1,"layout-topbar"],["type","button",1,"menu-button",3,"click"],[1,"pi","pi-bars"],[1,"layout-topbar-header","text-3xl","text-600"],[1,"fi","fi-br-shopping-bag","vertical-align-middle","mr-2"],[1,"vertical-align-middle"],[1,"layout-content"],[1,"content-section"],["styleClass","p-datatable-striped","dataKey","id",3,"selection","sortField","sortOrder","lazy","paginator","showJumpToPageDropdown","value","columns","rows","totalRecords","loading","selectionChange","onLazyLoad"],["pTemplate","caption"],["pTemplate","header"],["pTemplate","body"],["pTemplate","emptymessage"],["icon","pi pi-exclamation-triangle",3,"header"],["styleClass","p-menu-nowrap",3,"popup","model"],["menu",""],[1,"flex","justify-content-between"],[1,"p-input-icon-left","lg:w-auto","w-full"],[1,"pi","pi-search"],["pInputText","","type","text",1,"lg:w-auto","w-full",3,"ngModel","placeholder","input","ngModelChange"],["type","button","pButton","","pRipple","","icon","pi pi-chevron-down","iconPos","right",1,"ml-3",3,"label","click"],[3,"pSortableColumn",4,"ngFor","ngForOf"],[3,"pSortableColumn"],[3,"field"],[1,"show-on-hover-parent"],[3,"value"],[4,"ngFor","ngForOf"],[3,"value","key","outputType","options","object","changeRequest"],[4,"ngIf"],[1,"absolute","show-on-hover","pos-top15","pos-right15"],["pButton","","pRipple","","icon","pi pi-pencil",1,"p-button","p-button-sm","p-button-rounded","p-button-info",3,"click"],["pButton","","pRipple","","icon","pi pi-trash",1,"p-button","p-button-sm","p-button-rounded","p-button-danger","ml-2",3,"click"],[3,"colSpan"],[4,"ngIf","ngIfElse"],["emptyMessage",""]],template:function(e,o){1&e&&(t.TgZ(0,"div",0),t.TgZ(1,"button",1),t.NdJ("click",function(){return o.navBarToggle()}),t._UZ(2,"i",2),t.qZA(),t.TgZ(3,"span",3),t._UZ(4,"i",4),t.TgZ(5,"span",5),t._uU(6),t.ALo(7,"translate"),t.qZA(),t.qZA(),t.qZA(),t.TgZ(8,"div",6),t.TgZ(9,"div",7),t.TgZ(10,"p-table",8),t.NdJ("selectionChange",function(l){return o.itemsSelected=l})("onLazyLoad",function(l){return o.getData(l)}),t.YNc(11,ft,8,7,"ng-template",9),t.YNc(12,Tt,4,1,"ng-template",10),t.YNc(13,At,4,2,"ng-template",11),t.YNc(14,vt,5,3,"ng-template",12),t.qZA(),t.qZA(),t.qZA(),t._UZ(15,"p-confirmDialog",13),t.ALo(16,"translate"),t._UZ(17,"p-menu",14,15)),2&e&&(t.xp6(6),t.Oqu(t.lcZ(7,15,"ORDERS")),t.xp6(4),t.Q6J("selection",o.itemsSelected)("sortField",o.queryOptions.sort_by)("sortOrder","asc"==o.queryOptions.sort_dir?1:-1)("lazy",!0)("paginator",!0)("showJumpToPageDropdown",!0)("value",o.items)("columns",o.cols)("rows",o.queryOptions.limit)("totalRecords",o.itemsTotal)("loading",o.loading),t.xp6(5),t.Q6J("header",t.lcZ(16,17,"CONFIRM")),t.xp6(2),t.Q6J("popup",!0)("model",o.menuItems))},directives:[c.iA,m.jx,mt.Q,_t.v2,a.Fj,q.o,a.JJ,a.On,N.Hq,w.H,c.Mo,u.sg,c.lQ,c.fz,c.UA,gt.g,u.O5],pipes:[Z.X$],encapsulation:2}),n})()}];let Ot=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[[y.Bz.forChild(yt)],y.Bz]}),n})(),Nt=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({providers:[g],imports:[[u.ez,U.m,Ot]]}),n})()}}]);