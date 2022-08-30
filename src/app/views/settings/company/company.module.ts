
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from './company.component';

const routes: Routes = [
    {
        path: '',
        component: CompanyComponent,
        data: {
            title: 'company'
        }
    }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [CompanyComponent],
    exports: [RouterModule]
})
export class CompanyModule {
}
