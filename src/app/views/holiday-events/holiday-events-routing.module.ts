import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HolidayEventsComponent } from './holiday-events.component';


const routes: Routes = [
    {
        path: '',
        component: HolidayEventsComponent,
        data: {
            title: 'Holiday-events'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class HolidayEventsRoutingModule {

}
