import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { ExpenseClaimAddComponent } from '../../expense/expense-claim/expense-claim-add/expense-claim-add.component';
import { SelfExpenseComponent } from './self-expense.component';

const routes: Routes = [
    {
        path: 'my-claims',
        component: SelfExpenseComponent,
        data: {
            title: 'Expense Claims'
        },
    },
    {
        path: 'create-claim',
        component: ExpenseClaimAddComponent,
        data: {
            title: 'Add Expense Claims',
            auth: 'SELF-EXPENSE-CLAIMS.ADD'
        },
    },
    {
        path: 'edit/:id',
        component: ExpenseClaimAddComponent,
        data: {
            title: 'Edit',
            auth: 'SELF-EXPENSE-CLAIMS.EDIT'
        },
    }
];
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class SelfExpenseRoutingModule {

}
