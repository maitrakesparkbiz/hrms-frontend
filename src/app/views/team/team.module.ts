import { NgModule } from '@angular/core';
import { AllTeamsComponent } from './all-teams/all-teams.component';
import { SharedModule } from '../../shared/shared.module';
import { TeamRoutingModule } from './team-routing.module';
import { CommonModule } from '@angular/common';
import { AddTeamComponent } from './add-team/add-team.component';

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        TeamRoutingModule
    ],
    declarations: [
        AllTeamsComponent,
        AddTeamComponent
    ]
})

export class TeamModule {

}
