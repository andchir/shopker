import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {CatalogComponent} from './catalog.component';

const routes: Routes = [
    {
        path: '',
        component: CatalogComponent,
        children: [
            // {
            //     path: '',
            //     redirectTo: 'category/0',
            //     pathMatch: 'full'
            // },
            // {
            //     path: 'category/:categoryId',
            //     component: CatalogCategoryComponent
            // },
            // {
            //     path: 'content_types',
            //     component: ContentTypesComponent
            // },
            // {
            //     path: 'field_types',
            //     component: FieldTypesComponent
            // }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CatalogRoutingModule {
}
