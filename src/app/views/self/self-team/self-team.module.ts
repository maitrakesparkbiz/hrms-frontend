import { NgModule } from '@angular/core';
import { SelfTeamComponent } from './self-team.component';
import { SharedModule } from '../../../shared/shared.module';
import {SelfTeamRoutingModule} from "./self-team-routing.module";
import {SelfTeamAddComponent} from "./self-team-add/self-team-add.component";


@NgModule({
    imports: [
        SharedModule,
        SelfTeamRoutingModule
    ],
    declarations: [
        SelfTeamComponent,
        SelfTeamAddComponent
    ]

})


export class SelfTeamModule {

}
