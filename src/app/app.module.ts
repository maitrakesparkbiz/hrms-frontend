import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, DatePipe, TitleCasePipe, PathLocationStrategy } from '@angular/common';

import { PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { AppAsideModule, AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule } from '@coreui/angular';

import { DefaultLayoutComponent } from './containers';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';

import { AuthGuardService } from './shared/guard/auth-guard.service';
import { SharedModule } from './shared/shared.module';
import { AppLockGuardService } from './shared/guard/app-lock-guard.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PopoverModule } from 'ngx-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PublicJobsComponent } from './views/public-jobs/public-jobs.component';
import { RoleGuard } from './shared/guard/role-guard.service';
import { ActivityBoxComponent } from './views/activity-box/activity-box.component';
import {P404Component} from './views/error/404.component';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    NgxSpinnerModule,
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    NgbModule.forRoot(),
    ChartsModule,
    SharedModule.forRoot()
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    PublicJobsComponent,
    ActivityBoxComponent,
      P404Component
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    AuthGuardService,
    RoleGuard,
    AppLockGuardService,
    DatePipe,
    TitleCasePipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule {

}

