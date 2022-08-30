import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SelfTeamComponent} from "./self-team.component";
import {SelfTeamAddComponent} from "./self-team-add/self-team-add.component";

const routes: Routes = [
    {
        path: '',
        component: SelfTeamComponent,
        data: {
            title: 'Team'
        }
    },
    {
        path: 'edit/:id',
        component: SelfTeamAddComponent,
        data: {
            title: 'Team'
        }
    },

];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})


export class SelfTeamRoutingModule {

}
