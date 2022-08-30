import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactsComponent } from './contacts.component';
import { ContactEditComponent } from './contact-edit/contact-edit.component';
const routes: Routes = [
    {
        path: '',
        component: ContactsComponent,
        data: {
            title: 'Contacts'
        },
    },
    {
        path: 'create-contact',
        component: ContactEditComponent,
        data: {
            title: 'create',
            auth: 'CONTACTS.ADD'
        },
    },
    {
        path: 'update-contact/:id',
        component: ContactEditComponent,
        data: {
            title: 'Edit',
            auth: 'CONTACTS.EDIT'
        },
    }


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContactsRoutingModule {
}
