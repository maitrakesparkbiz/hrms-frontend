
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './default.component';

const routes: Routes = [
    {
        path: '',
        component: DefaultComponent,
        data: {
            title: ''
        }
    }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [DefaultComponent],
    exports: [RouterModule]
})
export class DefaultModule {
}
