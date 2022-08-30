import { Routes, RouterModule } from '@angular/router';
import { ProjectJrBaComponent } from './project-jr-ba.component';
import { NgModule } from '@angular/core';
import { ProjectJrBaAddComponent } from './project-jr-ba-add/project-jr-ba-add.component';
import { ProjectJrBaApprovedComponent } from './project-jr-ba-approved/project-jr-ba-approved.component';
import { ProjectJrBaApprovedAddComponent } from './project-jr-ba-approved/project-jr-ba-approved-add/project-jr-ba-approved-add.component';

const routes: Routes = [
    {
        path: 'projects-jr-ba',
        component: ProjectJrBaComponent,
        data: {
            title: 'Project Jr Ba',
            auth: 'SELF-JR-BA.PROJECTS.VIEW'
        }
    },
    {
        path: 'projects-jr-ba/edit-project/:id',
        component: ProjectJrBaAddComponent,
        data: {
            title: 'Edit Project',
            auth: 'SELF-JR-BA.PROJECTS.EDIT'
        }
    },
    {
        path: 'approved-projects',
        component: ProjectJrBaApprovedComponent,
        data: {
            title: 'Approved Projects',
            auth: 'SELF-JR-BA.APPROVED-PROJECTS.VIEW'
        }
    },
    {
        path: 'approved-projects/update-project/:id',
        component: ProjectJrBaApprovedAddComponent,
        data: {
            title: 'Update Project',
            auth: 'SELF-JR-BA.APPROVED-PROJECTS.EDIT'
        }
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ProjectJrBaRoutingModule {

}
