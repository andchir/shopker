import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {TemplatesEditComponent} from './templates-edit.component';
import {TemplatesEditMainComponent} from './main.component';
import {AssetsEditComponent} from './assets-edit.component';

const routes: Routes = [
    {
        path: '',
        component: TemplatesEditMainComponent,
        children: [
            {
                path: '',
                redirectTo: 'templates'
            },
            {
                path: 'templates',
                component: TemplatesEditComponent
            },
            {
                path: 'assets',
                component: AssetsEditComponent
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplatesEditRoutingModule { }
