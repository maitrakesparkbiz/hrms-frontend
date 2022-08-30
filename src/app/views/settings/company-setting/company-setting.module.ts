
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { CompanySettingComponent } from './company-setting.component';

const routes: Routes = [
    {
        path: '',
        component: CompanySettingComponent,
        data: {
            title: 'company-setting'
        }
    }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [CompanySettingComponent],
    exports: [RouterModule]
})
export class CompanySettingModule {
}
