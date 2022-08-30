import { Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { FileUploadService } from "../../../../shared/services/file-upload.service";
import { UserService } from "../../../../shared/services/user.service";
import { ProjectSalesService } from "../../../../shared/services/project-sales.service";
import { FlashMessageService } from "../../../../shared/services/flash-message.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PusherService } from "../../../../shared/services/pusher.sevice";
import { StorageManagerService } from "../../../../shared/services/storage-manager.service";
import * as moment from 'moment';
import { CompanyProjectService } from "../../../../shared/services/company-project.service";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import {AppConstants} from "../../../../constants/app.constants";
import {CompanyPolicyService} from "../../../../shared/services/company-policy.service";

@Component({
    selector: 'app-self-company-policy-view',
    templateUrl: 'self-company-policy-view.component.html',
    styleUrls: ['./self-company-policy-view.component.scss']
})

export class SelfCompanyPolicyViewComponent implements OnInit {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();
    empTimingRecord: any = [];
    empTimingRecordTime: any = [];
    disable = false;
    public searchTxt: any;

    projectForm: FormGroup;
    commentForm: FormGroup;
    FILE_URL = AppConstants.FILE_URL;
    userData: any = [];
    projectData: any = [];
    file_response: any;
    files: any;
    filesArr: any = [];
    docArr: any = [];
    project_doc = '';
    employee: any = [];
    ba_list: any = [];
    old_assigned_to: any;
    hold_comment;
    policy_id;
    all_users: any = [];
    baList: any = [];
    timing_date = moment().format('YYYY-MM-DD');
    dropdownSettings: any = [];
    selectedItems: any = [];
    modalRef: BsModalRef;
    userId: any = '';
    oldHoldFlag: any = false;
    fromTl = false;

    constructor(private _fb: FormBuilder,
                private fileuploadservice: FileUploadService,
                private spinner: NgxSpinnerService,
                private userService: UserService,
                private companyProjectService: CompanyProjectService,
                private msgService: FlashMessageService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private company_policy: CompanyPolicyService,
                private pusherService: PusherService,
                private location: Location) {
    }

    ngOnInit() {
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            allowSearchFilter: true
        };
        const user = JSON.parse(StorageManagerService.getUser());
        this.userId = user.id;
        // this.renderer2.addClass(this.agesSelect['element']['children'][0], 'custom-emp-dropdown');
        this.activatedRoute.params.subscribe(
            (res) => {
                this.policy_id = res.id;
            }
        );


        this.userData = JSON.parse(StorageManagerService.getUser());
        this.projectForm = this._fb.group({
            'id': [''],
            'assigned_ba': [[]],
            'client_name': ['', Validators.required],
            'project_name': ['', Validators.required],
            'project_doc': [],
            'est_time': [''],
            'extra_hours': [''],
            'extra_hours_comment': [''],
            'deadline': [''],
            'threshold_limit1': [],
            'threshold_limit2': [],
            'project_description': [''],
            'on_hold': [''],
            'searchTxt': [''],
            'hold_comment': [''],
            'created_by': [this.userData.id],
            'record_timing': this._fb.array([])
        });

        if (this.policy_id) {
            this.getPolicyById();
        }
    }
    getPolicyById = () => {
        this.company_policy.getPolicyById(this.policy_id).subscribe(
            (res: any) => {

                this.projectData = res;
                // console.log(res);
            }
        )
    }


    onBack = () => {
        this.location.back();
    }

    closeModel = () => {
        this.modalRef.hide();
    }


}
