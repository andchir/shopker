(self.webpackChunkshk_app=self.webpackChunkshk_app||[]).push([["src_app_statistics_statistics_module_ts"],{75590:function(t,e,a){"use strict";a.r(e),a.d(e,{StatisticsModule:function(){return S}});var r=a(38583),n=a(16964),s=a(5727),i=a(91841),o=a(25917),g=a(5304),c=a(37716);let h=(()=>{class t{constructor(t){this.http=t,this.headers=new i.WM({"Content-Type":"application/json","X-Requested-With":"XMLHttpRequest"}),this.requestUrl="/admin/statistics",this.chartLineOptions={responsive:!0,maintainAspectRatio:!1}}setRequestUrl(t){this.requestUrl=t}getRequestUrl(){return this.requestUrl}getParams(t){let e=new i.LE;for(const a in t)t.hasOwnProperty(a)&&void 0!==t[a]&&(e=e.append(a,t[a]));return e}getStatisticsOrders(t,e){const a=this.getParams(e),r=this.getRequestUrl()+"/orders";return this.http.get(r,{params:a,headers:this.headers}).pipe((0,g.K)(this.handleError()))}handleError(t="operation",e){return t=>{if(t.error)throw t.error;return(0,o.of)(e)}}}return t.\u0275fac=function(e){return new(e||t)(c.LFG(i.eN))},t.\u0275prov=c.Yz7({token:t,factory:t.\u0275fac}),t})();var l=a(73844),d=a(83667),p=a(3679),u=a(95047),m=a(45720),Z=a(29790);const f=[{path:"",component:(()=>{class t{constructor(t,e){this.dataService=t,this.appSettings=e,this.type="year",this.loading=!1,this.dateFormat="MM/dd/yyyy",this.rangeDates=[new Date,new Date],this.rangeDates[0].setMonth(this.rangeDates[1].getMonth()-1),this.locale=this.appSettings.settings.locale,this.yearRangeString=[this.rangeDates[1].getFullYear()-5,this.rangeDates[1].getFullYear()].join(":")}ngOnInit(){this.getData()}getData(){this.rangeDates[0]&&this.rangeDates[1]&&(this.loading=!0,this.dataService.getStatisticsOrders(this.type,{dateFrom:this.getDateString(this.rangeDates[0]),dateTo:this.getDateString(this.rangeDates[1])}).subscribe(t=>{this.data=t,this.loading=!1},t=>{this.loading=!1}))}getDateString(t){let e=String(t.getFullYear());return e+="-"+("0"+(t.getMonth()+1)).slice(-2),e+="-"+("0"+t.getDate()).slice(-2),e}}return t.title="STATISTICS",t.\u0275fac=function(e){return new(e||t)(c.Y36(h),c.Y36(l.d))},t.\u0275cmp=c.Xpm({type:t,selectors:[["app-statistics"]],features:[c._Bn([h])],decls:17,vars:18,consts:[[1,"card"],[1,"card-body"],[1,"icon-bar-graph-2"],[1,"min-height400"],[1,"d-inline-block","me-2"],[3,"ngModel","selectionMode","showIcon","monthNavigator","yearNavigator","yearRange","dateFormat","ngModelChange","onSelect"],["type","button",1,"btn","btn-secondary","ms-md-2",3,"ngbTooltip","click"],[1,"icon-reload"],["type","line",3,"data","height","responsive"]],template:function(t,e){1&t&&(c.TgZ(0,"div",0),c.TgZ(1,"div",1),c.TgZ(2,"h3"),c._UZ(3,"i",2),c._uU(4),c.ALo(5,"translate"),c.qZA(),c._UZ(6,"hr"),c.TgZ(7,"div",3),c.TgZ(8,"div"),c.TgZ(9,"div",4),c.TgZ(10,"p-calendar",5),c.NdJ("ngModelChange",function(t){return e.rangeDates=t})("onSelect",function(){return e.getData()}),c.qZA(),c.qZA(),c.TgZ(11,"button",6),c.NdJ("click",function(){return e.getData()}),c.ALo(12,"translate"),c._UZ(13,"i",7),c.qZA(),c.qZA(),c._UZ(14,"hr"),c.TgZ(15,"div"),c._UZ(16,"p-chart",8),c.qZA(),c.qZA(),c.qZA(),c.qZA()),2&t&&(c.xp6(4),c.hij(" ",c.lcZ(5,14,"STATISTICS")," "),c.xp6(3),c.ekj("loading",e.loading),c.xp6(3),c.Q6J("ngModel",e.rangeDates)("selectionMode","range")("showIcon",!0)("monthNavigator",!0)("yearNavigator",!0)("yearRange",e.yearRangeString)("dateFormat",e.dateFormat),c.xp6(1),c.s9C("ngbTooltip",c.lcZ(12,16,"REFRESH")),c.xp6(5),c.Q6J("data",e.data)("height","400px")("responsive",!0))},directives:[d.f,p.JJ,p.On,u._L,m.C],pipes:[Z.X$],styles:[""]}),t})()}];let y=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=c.oAB({type:t}),t.\u0275inj=c.cJS({imports:[[s.Bz.forChild(f)],s.Bz]}),t})(),S=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=c.oAB({type:t}),t.\u0275inj=c.cJS({imports:[[r.ez,n.m,y]]}),t})()}}]);