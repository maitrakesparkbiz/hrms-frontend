import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseComponent } from './expense.component';
import { ExpenseAddComponent } from './expense-add/expense-add.component';
import { LeaveRemainingComponent } from '../leave/leave-remaining/leave-remaining.component';
import { ExpenseClaimComponent } from './expense-claim/expense-claim.component';
import { ExpenseClaimAddComponent } from './expense-claim/expense-claim-add/expense-claim-add.component';
import { RecurringExpenseComponent } from './recurring-expense/recurring-expense.component';
import { RecurringExpenseAddComponent } from './recurring-expense/recurring-expense-add/recurring-expense-add.component';
import { ExpenseReportComponent } from './expense-report/expense-report.component';
const routes: Routes = [
    {
        path: 'view-expense',
        component: ExpenseComponent,
        data: {
            title: 'View Expense',
            auth: 'EXPENSE.VIEW-EXPENSE.VIEW'
        },
    },
    {
        path: 'view-expense/create-expense',
        component: ExpenseAddComponent,
        data: {
            title: 'create',
            auth: 'EXPENSE.VIEW-EXPENSE.ADD'
        },
    },
    {
        path: 'view-expense/update-expense/:id',
        component: ExpenseAddComponent,
        data: {
            title: 'Edit',
            auth: 'EXPENSE.VIEW-EXPENSE.EDIT'
        },
    },
    {
        path: 'expense-claims',
        component: ExpenseClaimComponent,
        data: {
            title: 'Expense Claims',
            auth: 'EXPENSE.CLAIMS.VIEW'
        },
    },
    {
        path: 'expense-claims/create-claim',
        component: ExpenseClaimAddComponent,
        data: {
            title: ' Add Expense Claims',
            auth: 'EXPENSE.CLAIMS.ADD'
        },
    },
    {
        path: 'expense-claims/edit/:id',
        component: ExpenseClaimAddComponent,
        data: {
            title: 'Edit',
            auth: 'EXPENSE.CLAIMS.EDIT'
        },
    },
    {
        path: 'recurring-expense',
        component: RecurringExpenseComponent,
        data: {
            title: 'Recurring Expense'
        },
    },
    {
        path: 'recurring-expense/add',
        component: RecurringExpenseAddComponent,
        data: {
            title: 'Recurring Expense'
        },
    },
    {
        path: 'recurring-expense/edit/:id',
        component: RecurringExpenseAddComponent,
        data: {
            title: 'Recurring Expense'
        },
    },
    {
        path: 'expense-report',
        component: ExpenseReportComponent,
        data: {
            title: 'Expense Report',
            auth: 'EXPENSE.EXPENSE-REPORT.VIEW'
        },
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExpenseRouting {
}
