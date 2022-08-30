import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import {SelfCompanyPolicyComponent} from "./self-company-policy.component";
import {SelfCompanyPolicyRoutingModule} from "./self-company-policy-routing.module";
import {SelfCompanyPolicyViewComponent} from "./self-company-policy-view/self-company-policy-view.component";


@NgModule({
    imports: [
        SharedModule,
        SelfCompanyPolicyRoutingModule
    ],
    declarations: [
        SelfCompanyPolicyComponent,
        SelfCompanyPolicyViewComponent
    ]

})


export class SelfCompanyPolicyModule {

}
