
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { DesignationComponent } from './designation.component';

const routes: Routes = [
    {
        path: '',
        component: DesignationComponent,
        data: {
            title: 'Designation'
        }
    }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [DesignationComponent],
    exports: [RouterModule]
})
export class DesignationModule {
}
