(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{"9i+i":function(t,e,a){"use strict";a.r(e);var n=a("SVse"),r=a("d2mR"),i=a("iInd"),s=a("IheW"),o=a("LRne"),c=a("JIr8"),l=a("8Y7J");let h=(()=>{class t{constructor(t){this.http=t,this.headers=new s.e({"Content-Type":"application/json","X-Requested-With":"XMLHttpRequest"}),this.requestUrl="/admin/statistics",this.chartLineOptions={responsive:!0,maintainAspectRatio:!1}}setRequestUrl(t){this.requestUrl=t}getRequestUrl(){return this.requestUrl}getParams(t){let e=new s.f;for(const a in t)t.hasOwnProperty(a)&&void 0!==t[a]&&(e=e.append(a,t[a]));return e}getStatisticsOrders(t,e){const a=this.getParams(e),n=this.getRequestUrl()+"/orders";return this.http.get(n,{params:a,headers:this.headers}).pipe(Object(c.a)(this.handleError()))}handleError(t="operation",e){return t=>{if(t.error)throw t.error;return Object(o.a)(e)}}}return t.\u0275fac=function(e){return new(e||t)(l.ec(s.a))},t.\u0275prov=l.Mb({token:t,factory:t.\u0275fac}),t})();var g=a("keWK"),d=a("wgQU"),b=a("7vha"),p=a("s7LF"),u=a("G0yt"),D=a("pV6I"),m=a("TSSN");const S=[{path:"",component:(()=>{class t{constructor(t,e){this.dataService=t,this.appSettings=e,this.type="year",this.loading=!1,this.calendarLocale=g.b,this.rangeDates=[new Date,new Date],this.rangeDates[0].setMonth(this.rangeDates[1].getMonth()-1),this.locale=this.appSettings.settings.locale,this.yearRangeString=[this.rangeDates[1].getFullYear()-5,this.rangeDates[1].getFullYear()].join(":")}ngOnInit(){this.getData()}getData(){this.rangeDates[0]&&this.rangeDates[1]&&(this.loading=!0,this.dataService.getStatisticsOrders(this.type,{dateFrom:this.getDateString(this.rangeDates[0]),dateTo:this.getDateString(this.rangeDates[1])}).subscribe(t=>{this.data=t,this.loading=!1},t=>{this.loading=!1}))}getDateString(t){let e=String(t.getFullYear());return e+="-"+("0"+(t.getMonth()+1)).slice(-2),e+="-"+("0"+t.getDate()).slice(-2),e}}return t.title="STATISTICS",t.\u0275fac=function(e){return new(e||t)(l.Qb(h),l.Qb(d.a))},t.\u0275cmp=l.Kb({type:t,selectors:[["app-statistics"]],features:[l.Cb([h])],decls:17,vars:20,consts:[[1,"card"],[1,"card-body"],[1,"icon-bar-graph-2"],[1,"min-height400"],[1,"d-inline-block","mr-2"],[3,"ngModel","selectionMode","showIcon","monthNavigator","yearNavigator","yearRange","icon","dateFormat","locale","ngModelChange","onSelect"],["type","button",1,"btn","btn-secondary","ml-md-2",3,"ngbTooltip","click"],[1,"icon-reload"],["type","line",3,"data","height","responsive"]],template:function(t,e){1&t&&(l.Wb(0,"div",0),l.Wb(1,"div",1),l.Wb(2,"h3"),l.Rb(3,"i",2),l.Oc(4),l.lc(5,"translate"),l.Vb(),l.Rb(6,"hr"),l.Wb(7,"div",3),l.Wb(8,"div"),l.Wb(9,"div",4),l.Wb(10,"p-calendar",5),l.ic("ngModelChange",(function(t){return e.rangeDates=t}))("onSelect",(function(){return e.getData()})),l.Vb(),l.Vb(),l.Wb(11,"button",6),l.ic("click",(function(){return e.getData()})),l.lc(12,"translate"),l.Rb(13,"i",7),l.Vb(),l.Vb(),l.Rb(14,"hr"),l.Wb(15,"div"),l.Rb(16,"p-chart",8),l.Vb(),l.Vb(),l.Vb(),l.Vb()),2&t&&(l.Db(4),l.Qc(" ",l.mc(5,16,"STATISTICS")," "),l.Db(3),l.Ib("loading",e.loading),l.Db(3),l.rc("ngModel",e.rangeDates)("selectionMode","range")("showIcon",!0)("monthNavigator",!0)("yearNavigator",!0)("yearRange",e.yearRangeString)("icon","icon-date_range")("dateFormat",e.calendarLocale[e.locale].format)("locale",e.calendarLocale[e.locale]),l.Db(1),l.sc("ngbTooltip",l.mc(12,18,"REFRESH")),l.Db(5),l.rc("data",e.data)("height","400px")("responsive",!0))},directives:[b.a,p.n,p.q,u.u,D.b],pipes:[m.c],styles:[""]}),t})()}];let f=(()=>{class t{}return t.\u0275mod=l.Ob({type:t}),t.\u0275inj=l.Nb({factory:function(e){return new(e||t)},imports:[[i.f.forChild(S)],i.f]}),t})();a.d(e,"StatisticsModule",(function(){return y}));let y=(()=>{class t{}return t.\u0275mod=l.Ob({type:t}),t.\u0275inj=l.Nb({factory:function(e){return new(e||t)},imports:[[n.c,r.a,f]]}),t})()}}]);