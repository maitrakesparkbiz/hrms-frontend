import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllTeamsComponent } from './all-teams/all-teams.component';
import { AddTeamComponent } from './add-team/add-team.component';

const routes: Routes = [
    {
        path: '',
        component: AllTeamsComponent,
        data: {
            title: 'All Teams'
        }
    },
    {
        path: 'add-team',
        component: AddTeamComponent,
        data: {
            title: 'Add Team',
            auth: 'TEAMS.ADD'
        }
    },
    {
        path: 'edit-team/:id',
        component: AddTeamComponent,
        data: {
            title: 'Edit Team',
            auth: 'TEAMS.EDIT'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class TeamRoutingModule {

}
