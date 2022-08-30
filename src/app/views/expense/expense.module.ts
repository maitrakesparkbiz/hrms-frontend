import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SelectModule } from 'ng-select';
import { ExpenseRouting } from './expense.routing';
import { ExpenseComponent } from './expense.component';
import { ExpenseAddComponent } from './expense-add/expense-add.component';
import { ExpenseClaimComponent } from './expense-claim/expense-claim.component';
import { ExpenseClaimAddComponent } from './expense-claim/expense-claim-add/expense-claim-add.component';
import { RecurringExpenseComponent } from './recurring-expense/recurring-expense.component';
import { RecurringExpenseAddComponent } from './recurring-expense/recurring-expense-add/recurring-expense-add.component';
import { ExpenseReportComponent } from './expense-report/expense-report.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { OwlDateTimeFormats, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
export const MY_MOMENT_DATE_TIME_FORMATS: OwlDateTimeFormats = {
    parseInput: 'MM/YYYY',
    fullPickerInput: 'l LT',
    datePickerInput: 'DD/MM/YYYY',
    timePickerInput: 'LT',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
};
@NgModule({
    imports: [
        SharedModule,
        ExpenseRouting,
        ChartsModule
    ],
    providers: [
        { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_DATE_TIME_FORMATS }
    ],
    declarations: [
        ExpenseComponent,
        ExpenseAddComponent,
        ExpenseClaimComponent,
        ExpenseClaimAddComponent,
        RecurringExpenseComponent,
        RecurringExpenseAddComponent,
        ExpenseReportComponent
    ]
})
export class ExpenseModule {
}
