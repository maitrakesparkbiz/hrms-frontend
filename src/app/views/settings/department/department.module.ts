
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentComponent } from './department.component';

const routes: Routes = [
    {
        path: '',
        component: DepartmentComponent,
        data: {
            title: 'Department'
        }
    }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [DepartmentComponent],
    exports: [RouterModule]
})
export class DepartmentModule {
}
