import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SelectModule } from 'ng-select';
import { ContactsComponent } from './contacts.component';
import { ContactsRoutingModule } from './contacts.routing.module';
import { ContactEditComponent } from './contact-edit/contact-edit.component';
@NgModule({
    imports: [
        SharedModule,
        SelectModule,
        ContactsRoutingModule
    ],
    declarations: [
        ContactsComponent,
        ContactEditComponent
    ]
})
export class ContactsModule {
}
