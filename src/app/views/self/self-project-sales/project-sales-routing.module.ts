import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectSalesComponent } from './project-sales.component';
import { ProjectSalesAddComponent } from './project-sales-add/project-sales-add.component';
import { ProjectSalesApprovedComponent } from './project-sales-approved/project-sales-approved.component';
import { ProjectSalesApprovedAddComponent } from './project-sales-approved/project-sales-approved-add/project-sales-approved-add.component';

const routes: Routes = [
    {
        path: 'projects-sales',
        component: ProjectSalesComponent,
        data: {
            title: 'Project Sales',
            auth: 'SELF-SALES.PROJECTS.VIEW'
        }
    },
    {
        path: 'projects-sales/create-project',
        component: ProjectSalesAddComponent,
        data: {
            title: 'Create Project',
            auth: 'SELF-SALES.PROJECTS.ADD'
        }
    },
    {
        path: 'projects-sales/update-project/:id',
        component: ProjectSalesAddComponent,
        data: {
            title: 'Update Project',
            auth: 'SELF-SALES.PROJECTS.EDIT'
        }
    },
    {
        path: 'approved-projects',
        component: ProjectSalesApprovedComponent,
        data: {
            title: 'Approved Projects',
            auth: 'SELF-SALES.APPROVED-PROJECTS.VIEW'
        }
    },
    {
        path: 'approved-projects/update-project/:id',
        component: ProjectSalesApprovedAddComponent,
        data: {
            title: 'Update Project',
            auth: 'SELF-SALES.APPROVED-PROJECTS.EDIT'
        }
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})


export class ProjectSalesRoutingModule {

}
