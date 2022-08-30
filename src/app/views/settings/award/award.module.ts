import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';
import { AwardComponent } from './award.component';
import { AwardRoutingModule } from './award-routing.module';
import { AwardEditComponent } from './award_edit/award_edit.component';

@NgModule({
    imports: [
        SharedModule,
        AwardRoutingModule
    ],
    declarations: [
        AwardEditComponent,
        AwardComponent
    ]
})
export class AwardModule {
}
