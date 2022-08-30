
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseCategoriesComponent } from './expense_categories.component';

const routes: Routes = [
    {
        path: '',
        component: ExpenseCategoriesComponent,
        data: {
            title: 'Expense Category'
        }
    }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [ExpenseCategoriesComponent],
    exports: [RouterModule]
})

export class ExpenseCategoriesModule {
}
