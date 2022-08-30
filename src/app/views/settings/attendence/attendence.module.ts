
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceComponent } from './attendence.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
    {
        path: '',
        component: AttendanceComponent,
        data: {
            title: 'attendence',
            auth: 'ATTENDANCE-SETTING.EDIT'
        }
    }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        NgbModule
    ],
    declarations: [AttendanceComponent],
    exports: [RouterModule]
})
export class AttendenceModule {
}

