import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';
import { LeaveTypesComponent } from './leave_types.component';
import { LeaveTypesRoutingModule } from './leave_types-routing.module';
import { LeaveTypesEditComponent } from './leave_types_edit/leave_types_edit.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        SharedModule,
        LeaveTypesRoutingModule,
        NgbModule
    ],
    declarations: [
        LeaveTypesEditComponent,
        LeaveTypesComponent
    ]
})
export class LeaveTypesModule {
}
