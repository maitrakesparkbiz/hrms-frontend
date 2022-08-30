import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ExpenseModule } from '../../expense/expense.module';
import { SelfExpenseComponent } from './self-expense.component';
import { SelfExpenseRoutingModule } from './self-expense-routing.component';

@NgModule({
    imports: [
        ExpenseModule,
        SharedModule,
        SelfExpenseRoutingModule
    ],
    declarations: [
        SelfExpenseComponent
    ],
})

export class SelfExpenseModule {

}
