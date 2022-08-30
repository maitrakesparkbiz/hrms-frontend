import { NgModule } from '@angular/core';
import { RouterModule, Route, Routes } from '@angular/router';
import { HolidayComponent } from './holiday.component';
import { HolidayAddComponent } from './holiday-add/holiday-add.component';


const routes: Routes = [
    {
        path: '',
        component: HolidayComponent,
        data: {
            title: 'Holiday'
        }
    },
    {
        path: 'add/:year',
        component: HolidayAddComponent,
        data: {
            title: 'Holiday-add',
            auth: 'HOLIDAYS.ADD'
        }
    },
    {
        path: 'edit/:id',
        component: HolidayAddComponent,
        data: {
            title: 'Holiday-edit',
            auth: 'HOLIDAYS.EDIT'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HolidayRoutingModule {

}
