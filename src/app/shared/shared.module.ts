import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule, CollapseModule, ModalModule, TimepickerModule, TooltipModule, ProgressbarModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DROPZONE_CONFIG, DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DataTableModule } from 'angular2-datatable';
import { ApiService } from './services/api.service';
import { StorageManagerService } from './services/storage-manager.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiInterceptorService } from './services/api-interceptor.service';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { FlashMessageService } from './services/flash-message.service';
import { BotDetectCaptchaModule } from 'angular-captcha';
import { CompanyService } from './services/company.service';
import { OptionService } from './services/option.service';
import { DepartmentService } from './services/department.service';
import { DesignationService } from './services/designation.service';
import { LocationService } from './services/location.service';
import { ExpensecategoryService } from './services/expensecategory.service';
import { AwardService } from './services/award.service';
import { CalenderService } from './services/calender.service';
import { LeaveTypeService } from './services/leave_type.service';
import { PermissionService } from './services/permission.service';
import { RoleService } from './services/role.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { UserService } from './services/user.service';
import { FileUploadService } from './services/file-upload.service';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { LeaveapplicationService } from './services/leaveapplication.service';
import { ContactService } from './services/contact.service';
import { AppreciationService } from './services/appreciation.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NewsService } from './services/news.service';
import { ExpenseService } from './services/expense.service';
import { JobsService } from './services/jobs.service';
import { HolidayService } from './services/holiday.service';
import { AttandanceService } from './services/attandance.service';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
import { EmailSettingsService } from './services/email-settings.service';
import { EmailTemplateService } from './services/email-template.service';
import { TagInputModule } from 'ngx-chips';
import { Daterangepicker } from 'ng2-daterangepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { DashboardService } from './services/dashboard.service';
import { DatatableService } from './services/datatable.service';
import { TeamService } from './services/team.service';
import { DataFilterPipe } from '../pipes/datafilterpipe';
import { CheckUnauthorizedDirective } from '../directives/check-unauthorized.directive';
import { DisableButtonDirective } from '../directives/disableButton.directive';
import { NavService } from './services/nav.service';
import { ProjectSalesService } from './services/project-sales.service';
import { ProjectBaService } from './services/project-ba.service';
import { ProjectCommentsService } from './services/project-comments.service';
import { ProjectJrBaService } from './services/project-jr-ba.service';
import { PusherService } from './services/pusher.sevice';
import { SearchPipe } from "../pipes/mfsearchpipe";
import { CompanyProjectService } from "./services/company-project.service";
import { BaCreateProjectComponent } from '../views/self/self-ba/ba-create-project/ba-create-project.component';
import { ActivityBoxService } from './services/activity-box.service';
import { OwlDateTimeFormats, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { BaViewProjectComponent } from "../views/self/self-ba/ba-view-project/ba-view-project.component";
import { BaTlClosedProjectsComponent } from "../views/self/self-ba-tl/ba-tl-closed-projects/ba-tl-closed-projects.component";
import { RouterModule } from '@angular/router';
import { CompanyPolicyService } from './services/company-policy.service';
import { EmailGenerateService } from './services/email-generate.service';
import { BaTlCreateProjectComponent } from "../views/self/self-ba-tl/ba-tl-create-project/ba-tl-create-project.component";
import {BaOwnProjectsComponent} from "../views/self/self-ba/ba-own-projects/ba-own-projects.component";
import {BaTlReportComponent} from "../views/self/self-ba-tl/ba-tl-report/ba-tl-report.component";
import {EmployeeTimingsService} from "./services/employee-timings.service";
import {Searchpipeproject} from "../pipes/searchpipeproject";
import {CandidateInfoService} from "./services/candidate-info.service";

export const MY_MOMENT_DATE_TIME_FORMATS: OwlDateTimeFormats = {
  parseInput: 'MM/YYYY',
  fullPickerInput: 'l LT',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};
const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // url: 'https://httpbin.org/post',
  // maxFilesize: 50,
  acceptedFiles: 'image/*'
};

@NgModule({
  imports: [
    CommonModule,
    TimepickerModule.forRoot(),
    FormsModule,
    DropzoneModule,
    TabsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    OwlMomentDateTimeModule,
    DataTableModule,
    DataTablesModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    ProgressbarModule.forRoot(),
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    CollapseModule.forRoot(),
    Ng2SearchPipeModule,
    NgSelectModule,
    HttpClientModule,
    TagInputModule,
    ToasterModule.forRoot(),
    BotDetectCaptchaModule.forRoot({
      captchaEndpoint: 'http://core.com/captcha'
    }),
    Daterangepicker,
    PopoverModule,
    RouterModule
  ],

  exports: [
    TimepickerModule,
    FormsModule,
    DropzoneModule,
    TabsModule,
    DataTableModule,
    DataTablesModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    OwlMomentDateTimeModule,
    ModalModule,
    TooltipModule,
    NgSelectModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    CollapseModule,
    HttpClientModule,
    ToasterModule,
    AccordionModule,
    NgbModule,
    TagInputModule,
    BotDetectCaptchaModule,
    Daterangepicker,
    PopoverModule,
    DataFilterPipe,
    SearchPipe,
      Searchpipeproject,
    CheckUnauthorizedDirective,
    DisableButtonDirective,
    BaCreateProjectComponent,
    BaViewProjectComponent,
    BaTlClosedProjectsComponent,
    BaTlCreateProjectComponent,
      BaTlReportComponent,
      BaOwnProjectsComponent
  ],
  declarations: [DataFilterPipe,
    DisableButtonDirective,
    CheckUnauthorizedDirective,
    SearchPipe,
      Searchpipeproject,
    BaCreateProjectComponent,
    BaViewProjectComponent,
    BaTlClosedProjectsComponent,
    BaTlCreateProjectComponent,
    BaTlReportComponent,
    BaOwnProjectsComponent
  ],
  providers: [
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_DATE_TIME_FORMATS }
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptorService, multi: true },
        { provide: DROPZONE_CONFIG, useValue: DEFAULT_DROPZONE_CONFIG },
        ApiService,
        CompanyService,
        DepartmentService,
        DesignationService,
        LocationService,
        ExpensecategoryService,
        OptionService,
        UserService,
        AwardService,
        CalenderService,
        AppreciationService,
        LeaveapplicationService,
        FileUploadService,
        LeaveTypeService,
        PermissionService,
        RoleService,
        NewsService,
        ContactService,
        ExpenseService,
        StorageManagerService,
        ToasterService,
        FlashMessageService,
        JobsService,
        HolidayService,
        StorageManagerService,
        AttandanceService,
        EmailSettingsService,
        EmailTemplateService,
        DashboardService,
        DatatableService,
        TeamService,
        NavService,
        ProjectSalesService,
        ProjectBaService,
        ProjectCommentsService,
        ProjectJrBaService,
        PusherService,
        CompanyProjectService,
        ActivityBoxService,
        CompanyPolicyService,
        EmailGenerateService,
          EmployeeTimingsService,
          CandidateInfoService
      ],
    };
  }
}
