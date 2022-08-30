import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BaProjectsComponent } from "./ba-projects/ba-projects.component";
import { BaCreateProjectComponent } from "./ba-create-project/ba-create-project.component";
import { BaViewProjectComponent } from "./ba-view-project/ba-view-project.component";
import { BaTlClosedProjectsComponent } from "../self-ba-tl/ba-tl-closed-projects/ba-tl-closed-projects.component";
import {BaTlOwnProjectsComponent} from "../self-ba-tl/ba-tl-own-projects/ba-tl-own-projects.component";
import {BaOwnProjectsComponent} from "./ba-own-projects/ba-own-projects.component";
import {BaTlReportComponent} from "../self-ba-tl/ba-tl-report/ba-tl-report.component";

const routes: Routes = [
    {
        path: 'create-project',
        component: BaCreateProjectComponent,
        data: {
            title: 'Create Project',
            auth: 'SELF-BA.PROJECTS.ADD'
        }
    },
    {
        path: 'update-project/:id',
        component: BaCreateProjectComponent,
        data: {
            title: 'Update Project',
            auth: 'SELF-BA.PROJECTS.EDIT'
        }
    },
    {
        path: 'projects',
        component: BaProjectsComponent,
        data: {
            title: 'Projects',
            auth: 'SELF-BA.PROJECTS.VIEW'
        }
    },
    {
        path: 'view-project/:id',
        component: BaViewProjectComponent,
        data: {
            title: 'View Project',
            auth: 'SELF-BA.PROJECTS.VIEW'
        }
    },
    // {
    //     path: 'own-projects',
    //     component: BaOwnProjectsComponent,
    //     data: {
    //         title: 'Own Projects',
    //         auth:'SELF-BA-TL.OWN-PROJECTS.VIEW'
    //     }
    // },
    {
        path: 'closed-projects',
        component: BaTlClosedProjectsComponent,
        data: {
            title: 'Closed Project',
            auth: 'SELF-BA.CLOSED-PROJECTS.VIEW',
            is_ba:true
        }
    },
    {
        path: 'report-projects',
        component: BaTlReportComponent,
        data: {
            title: 'Report Project',
            auth:'SELF-BA.REPORT.VIEW'
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

export class SelfBaRoutingModule {

}
