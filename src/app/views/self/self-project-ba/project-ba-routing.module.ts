import { Routes, RouterModule } from '@angular/router';
import { ProjectBaComponent } from './project-ba.component';
import { NgModule } from '@angular/core';
import { ProjectBaAddComponent } from './project-ba-add/project-ba-add.component';
import { ProjectBaApprovedComponent } from './project-ba-approved/project-ba-approved.component';
import { ProjectBaApprovedAddComponent } from './project-ba-approved/project-ba-approved-add/project-ba-approved-add.component';

const routes: Routes = [
    {
        path: 'projects-ba',
        component: ProjectBaComponent,
        data: {
            title: 'Projects',
            auth: 'SELF-BA.PROJECTS.VIEW'
        }
    },
    {
        path: 'projects-ba/edit-project/:id',
        component: ProjectBaAddComponent,
        data: {
            title: 'Edit Project',
            auth: 'SELF-BA.PROJECTS.EDIT'
        }
    },
    {
        path: 'approved-projects',
        component: ProjectBaApprovedComponent,
        data: {
            title: 'Approved Projects',
            auth: 'SELF-BA.APPROVED-PROJECTS.VIEW'
        }
    },
    {
        path: 'approved-projects/update-project/:id',
        component: ProjectBaApprovedAddComponent,
        data: {
            title: 'Update Project',
            auth: 'SELF-BA.APPROVED-PROJECTS.EDIT'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ProjectBaRoutingModule {

}
