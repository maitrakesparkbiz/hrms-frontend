import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelfCompanyPolicyComponent } from "./self-company-policy.component";
import {BaViewProjectComponent} from "../self-ba/ba-view-project/ba-view-project.component";
import {SelfCompanyPolicyViewComponent} from "./self-company-policy-view/self-company-policy-view.component";

const routes: Routes = [
    {
        path: '',
        component: SelfCompanyPolicyComponent,
        data: {
            title: 'Company Policy'
        }
    },
    {
        path: 'view/:id',
        component: SelfCompanyPolicyViewComponent,
        data: {
            title: 'View Policy',
            auth: 'SELF-COMPANY-POLICY.VIEW'
        }
    },

];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})


export class SelfCompanyPolicyRoutingModule {

}
