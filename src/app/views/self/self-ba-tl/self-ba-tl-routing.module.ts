import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BaTlProjectsComponent } from './ba-tl-projects/ba-tl-projects.component';
import { BaCreateProjectComponent } from '../self-ba/ba-create-project/ba-create-project.component';
import { BaTlOwnProjectsComponent } from './ba-tl-own-projects/ba-tl-own-projects.component';
import {BaViewProjectComponent} from "../self-ba/ba-view-project/ba-view-project.component";
import {BaTlClosedProjectsComponent} from "./ba-tl-closed-projects/ba-tl-closed-projects.component";
import {BaTlCreateProjectComponent} from "./ba-tl-create-project/ba-tl-create-project.component";
import {BaTlReportComponent} from "./ba-tl-report/ba-tl-report.component";

const routes: Routes = [
    {
        path: 'create-project',
        component: BaTlCreateProjectComponent,
        data: {
            title: 'Create Project',
            auth:'SELF-BA-TL.PROJECTS.ADD',
            fromTl: true
        }
    },
    {
        path: 'update-project/:id',
        component: BaTlCreateProjectComponent,
        data: {
            title: 'Update Project',
            auth:'SELF-BA-TL.PROJECTS.EDIT',
            fromTl: true
        }
    },
    {
        path: 'projects',
        component: BaTlProjectsComponent,
        data: {
            title: 'Projects',
            auth:'SELF-BA-TL.PROJECTS.VIEW'
        }
    },
    {
        path: 'own-projects',
        component: BaTlOwnProjectsComponent,
        data: {
            title: 'Own Projects',
            auth:'SELF-BA-TL.OWN-PROJECTS.VIEW'
        }
    },
    {
        path: 'view-project/:id',
        component: BaViewProjectComponent,
        data: {
            title: 'View Project',
            auth:'SELF-BA-TL.PROJECTS.VIEW'
        }
    },
    {
        path: 'closed-projects',
        component: BaTlClosedProjectsComponent,
        data: {
            title: 'Closed Project',
            auth:'SELF-BA-TL.CLOSED-PROJECTS.VIEW'
        }
    },
    {
        path: 'report-projects',
        component: BaTlReportComponent,
        data: {
            title: 'Report Project',
            auth:'SELF-BA-TL.REPORT.VIEW'
        }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})

export class SelfBaTlRoutingModule {

}
