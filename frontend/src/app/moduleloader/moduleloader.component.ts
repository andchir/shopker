import {
    Component, ComponentFactory, ComponentRef, NgModuleFactory, NgModuleFactoryLoader, NgModuleRef, OnInit,
    ReflectiveInjector,
    SystemJsNgModuleLoader, Type,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
    selector: 'app-moduleloader',
    templateUrl: './moduleloader.component.html',
    styleUrls: ['./moduleloader.component.css'],
    providers: []
})
export class ModuleLoaderComponent implements OnInit {

    @ViewChild('vc', {read: ViewContainerRef, static: true}) _vcRef: ViewContainerRef;
    moduleName: string;
    subModuleName: string;
    modulePath = '';
    load = false;

    private _injector: ReflectiveInjector;
    private _cmpRef: ComponentRef<any>;

    static toCamelCase(str: string, separator = '-') {
        return str.split(separator).map(function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join('');
    }

    constructor(
        private route: ActivatedRoute,
        private _loader: NgModuleFactoryLoader
    ) {
    }

    ngOnInit(): void {
        this._injector = ReflectiveInjector.fromResolvedProviders([], this._vcRef.parentInjector);
        this.moduleName = this.route.snapshot.paramMap.get('moduleName');
        this.subModuleName = this.route.snapshot.paramMap.get('subModuleName');

        this.modulePath = `src/app/${this.moduleName}/${this.moduleName}.module`;
        this.modulePath += `#${ModuleLoaderComponent.toCamelCase(this.moduleName)}Module`;

        this.loadDynamicModule();
    }

    loadDynamicModule(): void {
        this._loader.load(this.modulePath)
            .then((_ngModuleFactory: NgModuleFactory<any>) => {
                const _ngModuleRef: NgModuleRef<any> = _ngModuleFactory.create(this._injector);
                const _cmpType: Type<any> = _ngModuleRef.instance.cmps.get(this.subModuleName);
                const _cmpFactory: ComponentFactory<any> = _ngModuleRef
                    .componentFactoryResolver
                    .resolveComponentFactory(_cmpType);
                this._cmpRef = this._vcRef.createComponent(_cmpFactory, 0, this._injector, []);
            });
    }

}
