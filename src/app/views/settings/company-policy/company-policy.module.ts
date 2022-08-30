import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { CompanyPolicyComponent } from './company-policy.component';
import { CompanyPolicyRoutingModule } from './company-policy-routing.module';
import { CompanyPolicyAddComponent } from './company-policy-add/company-policy-add.component';
import { QuillModule } from 'ngx-quill';
@NgModule({
    imports: [
        SharedModule,
        CompanyPolicyRoutingModule,
        QuillModule
    ],
    declarations: [
        CompanyPolicyComponent,
        CompanyPolicyAddComponent
    ]
})
export class CompanyPolicyModule {
}
