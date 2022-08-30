import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AwardComponent } from './award.component';
import { AwardEditComponent } from './award_edit/award_edit.component';
const routes: Routes = [
    {
        path: '',
        component: AwardComponent,
        data: {
            title: 'award',
            auth: 'AWARDS.VIEW'
        },
    },
    {
        path: 'create',
        component: AwardEditComponent,
        data: {
            title: 'Add award',
            auth: 'AWARDS.ADD'
        }
    },
    {
        path: 'edit-award/:id',
        component: AwardEditComponent,
        data: {
            title: 'Edit award',
            auth: 'AWARDS.EDIT'
        }
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AwardRoutingModule {
}
