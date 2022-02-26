"use strict";(self.webpackChunkadmin2=self.webpackChunkadmin2||[]).push([[798],{7798:(L,p,s)=>{s.r(p),s.d(p,{StatisticsModule:()=>w});var f=s(9808),v=s(1113),d=s(7854),l=s(520),S=s(9646),y=s(262),t=s(7587);let u=(()=>{class n{constructor(e){this.http=e,this.headers=new l.WM({"Content-Type":"application/json","X-Requested-With":"XMLHttpRequest"}),this.requestUrl="/admin/statistics",this.chartLineOptions={responsive:!0,maintainAspectRatio:!1}}setRequestUrl(e){this.requestUrl=e}getRequestUrl(){return this.requestUrl}getParams(e){let a=new l.LE;for(const i in e)!e.hasOwnProperty(i)||void 0===e[i]||(a=a.append(i,e[i]));return a}getStatisticsOrders(e,a){const i=this.getParams(a),o=this.getRequestUrl()+"/orders";return this.http.get(o,{params:i,headers:this.headers}).pipe((0,y.K)(this.handleError()))}handleError(e="operation",a){return i=>{if(i.error)throw i.error;return(0,S.of)(a)}}}return n.\u0275fac=function(e){return new(e||n)(t.LFG(l.eN))},n.\u0275prov=t.Yz7({token:n,factory:n.\u0275fac}),n})();var Z=s(7579),c=s(2466),m=s(9783);let A=(()=>{class n{constructor(e,a){this.translateService=e,this.messageService=a,this.loading=!1,this.destroyed$=new Z.x}ngOnInit(){this.getData()}getData(e){}navBarToggle(){window.document.querySelector(".layout-sidebar").classList.toggle("active"),window.document.querySelector(".layout-mask").classList.toggle("layout-mask-active")}getLangString(e){return this.translateService.store.translations[this.translateService.currentLang]&&this.translateService.store.translations[this.translateService.currentLang][e]||e}ngOnDestroy(){this.destroyed$.next(),this.destroyed$.complete()}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(c.sK),t.Y36(m.ez))},n.\u0275cmp=t.Xpm({type:n,selectors:[["ng-component"]],decls:0,vars:0,template:function(e,a){},encapsulation:2}),n})();var D=s(1480),T=s(5652),h=s(3075),C=s(845),M=s(5787),F=s(1822),O=s(1874);const R=[{path:"",component:(()=>{class n extends A{constructor(e,a,i,o){super(e,a),this.translateService=e,this.messageService=a,this.dataService=i,this.appSettings=o,this.type="year",this.dateFormat="dd.mm.yy",this.firstDayOfWeek=0,this.menuItems=[{label:this.getLangString("REFRESH"),icon:"pi pi-refresh",command:()=>{this.getData()}}],this.rangeDates=[new Date,new Date],this.rangeDates[0].setMonth(this.rangeDates[1].getMonth()-1),this.locale=this.appSettings.settings.locale,this.yearRangeString=[this.rangeDates[1].getFullYear()-5,this.rangeDates[1].getFullYear()].join(":"),"en"!==this.locale&&(this.firstDayOfWeek=1)}ngOnInit(){this.getData()}getData(){!this.rangeDates[0]||!this.rangeDates[1]||(this.loading=!0,this.dataService.getStatisticsOrders(this.type,{dateFrom:this.getDateString(this.rangeDates[0]),dateTo:this.getDateString(this.rangeDates[1])}).subscribe({next:e=>{this.data=e,this.loading=!1},error:()=>{this.loading=!1}}))}getDateString(e){let a=String(e.getFullYear());return a+="-"+("0"+(e.getMonth()+1)).slice(-2),a+="-"+("0"+e.getDate()).slice(-2),a}}return n.\u0275fac=function(e){return new(e||n)(t.Y36(c.sK),t.Y36(m.ez),t.Y36(u),t.Y36(D.d))},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-statistics"]],features:[t._Bn([u]),t.qOj],decls:23,vars:21,consts:[[1,"layout-topbar","justify-content-between"],["type","button",1,"menu-button",3,"click"],[1,"pi","pi-bars"],[1,"layout-topbar-header","text-3xl","text-600"],[1,"fi","fi-br-chart-histogram","vertical-align-middle","mr-2"],[1,"vertical-align-middle"],[1,"layout-content","bg-white"],[1,"content-section"],[1,"p-datatable","p-component"],[1,"p-datatable-header"],[1,"md:flex","md:justify-content-between","md:flex-wrap"],[1,"d-inline-block","me-2","mb-2","md:mb-0"],["styleClass","w-full md:w-auto",3,"ngModel","selectionMode","showIcon","monthNavigator","yearNavigator","yearRange","dateFormat","firstDayOfWeek","ngModelChange","onSelect"],[1,"w-full","md:w-auto"],["type","button","pButton","","pRipple","","icon","pi pi-chevron-down","iconPos","right",1,"ml-0","md:ml-2","w-full","md:w-auto",3,"label","click"],[1,"min-height400"],[1,"p-4"],["type","line",3,"data","height","responsive"],["styleClass","p-menu-nowrap",3,"popup","model"],["menu",""]],template:function(e,a){if(1&e){const i=t.EpF();t.TgZ(0,"div",0),t.TgZ(1,"button",1),t.NdJ("click",function(){return a.navBarToggle()}),t._UZ(2,"i",2),t.qZA(),t.TgZ(3,"span",3),t._UZ(4,"i",4),t.TgZ(5,"span",5),t._uU(6),t.ALo(7,"translate"),t.qZA(),t.qZA(),t.qZA(),t.TgZ(8,"div",6),t.TgZ(9,"div",7),t.TgZ(10,"div",8),t.TgZ(11,"div",9),t.TgZ(12,"div",10),t.TgZ(13,"div",11),t.TgZ(14,"p-calendar",12),t.NdJ("ngModelChange",function(g){return a.rangeDates=g})("onSelect",function(){return a.getData()}),t.qZA(),t.qZA(),t.TgZ(15,"div",13),t.TgZ(16,"button",14),t.NdJ("click",function(g){return t.CHM(i),t.MAs(22).toggle(g)}),t.ALo(17,"translate"),t.qZA(),t.qZA(),t.qZA(),t.qZA(),t.qZA(),t.TgZ(18,"div",15),t.TgZ(19,"div",16),t._UZ(20,"p-chart",17),t.qZA(),t.qZA(),t.qZA(),t.qZA(),t._UZ(21,"p-menu",18,19)}2&e&&(t.xp6(6),t.Oqu(t.lcZ(7,17,"STATISTICS")),t.xp6(8),t.Q6J("ngModel",a.rangeDates)("selectionMode","range")("showIcon",!0)("monthNavigator",!0)("yearNavigator",!0)("yearRange",a.yearRangeString)("dateFormat",a.dateFormat)("firstDayOfWeek",a.firstDayOfWeek),t.xp6(2),t.Q6J("label",t.lcZ(17,19,"ACTIONS")),t.xp6(2),t.ekj("loading",a.loading),t.xp6(2),t.Q6J("data",a.data)("height","400px")("responsive",!0),t.xp6(1),t.Q6J("popup",!0)("model",a.menuItems))},directives:[T.f,h.JJ,h.On,C.Hq,M.H,F.C,O.v2],pipes:[c.X$],encapsulation:2}),n})()}];let b=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[[d.Bz.forChild(R)],d.Bz]}),n})(),w=(()=>{class n{}return n.\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[[f.ez,v.m,b]]}),n})()}}]);