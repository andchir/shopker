import {
    Component, ComponentFactory, ComponentRef, Injector, NgModuleFactory, NgModuleFactoryLoader, NgModuleRef,
    OnDestroy, OnInit, Type, ViewChild, ViewContainerRef
} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-moduleloader',
    templateUrl: './moduleloader.component.html',
    styleUrls: ['./moduleloader.component.css'],
    providers: []
})
export class ModuleLoaderComponent implements OnInit, OnDestroy {

    @ViewChild('vc', {read: ViewContainerRef, static: true}) _vcRef: ViewContainerRef;
    moduleName: string;
    subModuleName: string;
    modulePath = '';
    load = false;
    subs = new Subscription();

    private _injector: Injector;
    private _cmpRef: ComponentRef<any>;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private _loader: NgModuleFactoryLoader
    ) {
    }

    ngOnInit(): void {
        this._injector = Injector.create({providers: [], parent: this._vcRef.parentInjector});
        this.subs.add(this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                const subModuleName = this.route.snapshot.paramMap.get('subModuleName');
                if (subModuleName) {
                    this.subModuleName =  subModuleName;
                    this.loadDynamicModule();
                }
            }
        }));

        this.moduleName = this.route.snapshot.paramMap.get('moduleName');
        this.subModuleName = this.route.snapshot.paramMap.get('subModuleName');

        if (this.subModuleName) {
            this.modulePath = `src/app/${this.moduleName}/${this.moduleName}.module`;
            this.modulePath += `#${this.toCamelCase(this.moduleName)}Module`;
            this.loadDynamicModule();
        } else {
            this.router.navigate([`/module/${this.moduleName}/home`]);
        }
    }

    loadDynamicModule(): void {
        this._loader.load(this.modulePath)
            .then((_ngModuleFactory: NgModuleFactory<any>) => {
                const _ngModuleRef: NgModuleRef<any> = _ngModuleFactory.create(this._injector);
                const _cmpType: Type<any> = _ngModuleRef.instance.cmps.get(this.subModuleName);
                const _cmpFactory: ComponentFactory<any> = _ngModuleRef
                    .componentFactoryResolver
                    .resolveComponentFactory(_cmpType);
                this._vcRef.clear();
                this._cmpRef = this._vcRef.createComponent(_cmpFactory, 0, this._injector, []);
            });
    }

    toCamelCase(str: string, separator = '-') {
        return str.split(separator).map(function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join('');
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
