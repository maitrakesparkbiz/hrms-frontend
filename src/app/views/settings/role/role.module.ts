import { NgModule } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';
import { RoleRoutingModule } from './role-routing.module';
import { RoleComponent } from './role.component';
import { RoleEditComponent } from './role_edit/role_edit.component';

@NgModule({
    imports: [
        SharedModule,
        RoleRoutingModule
    ],
    declarations: [
        RoleComponent,
        RoleEditComponent
    ]
})
export class RoleModule {
}
