"use strict";(self.webpackChunkshk_app=self.webpackChunkshk_app||[]).push([["src_app_statistics_statistics_module_ts"],{49904:function(t,e,a){a.r(e),a.d(e,{StatisticsModule:function(){return Z}});var s=a(16274),r=a(51903),n=a(58335),i=a(31887),o=a(267),h=a(72072),c=a(42741);let g=(()=>{class t{constructor(t){this.http=t,this.headers=new i.WM({"Content-Type":"application/json","X-Requested-With":"XMLHttpRequest"}),this.requestUrl="/admin/statistics",this.chartLineOptions={responsive:!0,maintainAspectRatio:!1}}setRequestUrl(t){this.requestUrl=t}getRequestUrl(){return this.requestUrl}getParams(t){let e=new i.LE;for(const a in t)!t.hasOwnProperty(a)||void 0===t[a]||(e=e.append(a,t[a]));return e}getStatisticsOrders(t,e){const a=this.getParams(e),s=this.getRequestUrl()+"/orders";return this.http.get(s,{params:a,headers:this.headers}).pipe((0,h.K)(this.handleError()))}handleError(t="operation",e){return t=>{if(t.error)throw t.error;return(0,o.of)(e)}}}return t.\u0275fac=function(e){return new(e||t)(c.LFG(i.eN))},t.\u0275prov=c.Yz7({token:t,factory:t.\u0275fac}),t})();var l=a(63005),d=a(22038),p=a(93324),u=a(77924),f=a(58041),m=a(81633);const y=[{path:"",component:(()=>{class t{constructor(t,e){this.dataService=t,this.appSettings=e,this.type="year",this.loading=!1,this.dateFormat="dd.mm.yy",this.firstDayOfWeek=0,this.rangeDates=[new Date,new Date],this.rangeDates[0].setMonth(this.rangeDates[1].getMonth()-1),this.locale=this.appSettings.settings.locale,this.yearRangeString=[this.rangeDates[1].getFullYear()-5,this.rangeDates[1].getFullYear()].join(":"),"en"!==this.locale&&(this.firstDayOfWeek=1)}ngOnInit(){this.getData()}getData(){!this.rangeDates[0]||!this.rangeDates[1]||(this.loading=!0,this.dataService.getStatisticsOrders(this.type,{dateFrom:this.getDateString(this.rangeDates[0]),dateTo:this.getDateString(this.rangeDates[1])}).subscribe(t=>{this.data=t,this.loading=!1},t=>{this.loading=!1}))}getDateString(t){let e=String(t.getFullYear());return e+="-"+("0"+(t.getMonth()+1)).slice(-2),e+="-"+("0"+t.getDate()).slice(-2),e}}return t.title="STATISTICS",t.\u0275fac=function(e){return new(e||t)(c.Y36(g),c.Y36(l.d))},t.\u0275cmp=c.Xpm({type:t,selectors:[["app-statistics"]],features:[c._Bn([g])],decls:17,vars:19,consts:[[1,"card"],[1,"card-body"],[1,"icon-bar-graph-2"],[1,"min-height400"],[1,"d-inline-block","me-2"],[3,"ngModel","selectionMode","showIcon","monthNavigator","yearNavigator","yearRange","dateFormat","firstDayOfWeek","ngModelChange","onSelect"],["type","button",1,"btn","btn-secondary","ms-md-2",3,"ngbTooltip","click"],[1,"icon-reload"],["type","line",3,"data","height","responsive"]],template:function(t,e){1&t&&(c.TgZ(0,"div",0),c.TgZ(1,"div",1),c.TgZ(2,"h3"),c._UZ(3,"i",2),c._uU(4),c.ALo(5,"translate"),c.qZA(),c._UZ(6,"hr"),c.TgZ(7,"div",3),c.TgZ(8,"div"),c.TgZ(9,"div",4),c.TgZ(10,"p-calendar",5),c.NdJ("ngModelChange",function(t){return e.rangeDates=t})("onSelect",function(){return e.getData()}),c.qZA(),c.qZA(),c.TgZ(11,"button",6),c.NdJ("click",function(){return e.getData()}),c.ALo(12,"translate"),c._UZ(13,"i",7),c.qZA(),c.qZA(),c._UZ(14,"hr"),c.TgZ(15,"div"),c._UZ(16,"p-chart",8),c.qZA(),c.qZA(),c.qZA(),c.qZA()),2&t&&(c.xp6(4),c.hij(" ",c.lcZ(5,15,"STATISTICS")," "),c.xp6(3),c.ekj("loading",e.loading),c.xp6(3),c.Q6J("ngModel",e.rangeDates)("selectionMode","range")("showIcon",!0)("monthNavigator",!0)("yearNavigator",!0)("yearRange",e.yearRangeString)("dateFormat",e.dateFormat)("firstDayOfWeek",e.firstDayOfWeek),c.xp6(1),c.s9C("ngbTooltip",c.lcZ(12,17,"REFRESH")),c.xp6(5),c.Q6J("data",e.data)("height","400px")("responsive",!0))},directives:[d.f,p.JJ,p.On,u._L,f.C],pipes:[m.X$],styles:[""]}),t})()}];let D=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=c.oAB({type:t}),t.\u0275inj=c.cJS({imports:[[n.Bz.forChild(y)],n.Bz]}),t})(),Z=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=c.oAB({type:t}),t.\u0275inj=c.cJS({imports:[[s.ez,r.m,D]]}),t})()}}]);