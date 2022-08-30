import {NgModule} from '@angular/core';
import {LockAppComponent} from './lock-app.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: LockAppComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LockAppComponent],
  exports: [RouterModule]
})
export class LockAppModule {
}
