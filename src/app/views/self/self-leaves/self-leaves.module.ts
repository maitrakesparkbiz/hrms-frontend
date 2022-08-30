import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { SelfLeavesComponent } from './self-leaves.component';
import { ApplicationsComponent } from './applications/applications.component';
import { LeaveRemainingComponent } from './leave-remaining/leave-remaining.component';
import { UnpaidLeavesComponent } from './unpaid-leaves/unpaid-leaves.component';
import { SelfLeavesRoutingModule } from './self-leaves-routing.module';
import { TakenLeavesComponent } from './taken-leaves/taken-leaves.component';
import { OWL_DATE_TIME_FORMATS, OwlDateTimeFormats } from 'ng-pick-datetime';

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
        SelfLeavesRoutingModule
    ],
    providers: [
        { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_DATE_TIME_FORMATS }
    ],
    declarations: [
        SelfLeavesComponent,
        ApplicationsComponent,
        LeaveRemainingComponent,
        UnpaidLeavesComponent,
        TakenLeavesComponent
    ]
})

export class SelfLeavesModule {

}
