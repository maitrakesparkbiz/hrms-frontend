import { Routes, RouterModule } from "@angular/router";
import { CompanyPolicyComponent } from "./company-policy.component";
import { NgModule } from "@angular/core";
import { CompanyPolicyAddComponent } from "./company-policy-add/company-policy-add.component";

const routes: Routes = [
    {
        path: '',
        component: CompanyPolicyComponent,
        data: {
            title: 'Company Policy'
        },
    },
    {
        path: 'add',
        component: CompanyPolicyAddComponent,
        data: {
            title: 'Add Company Policy'
        },
    },
    {
        path: 'edit/:id',
        component: CompanyPolicyAddComponent,
        data: {
            title: 'Edit Company Policy'
        },
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CompanyPolicyRoutingModule {

}