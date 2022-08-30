import { Component, OnInit, TemplateRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { AppConstants } from '../../../constants/app.constants';
import { AwardService } from '../../../shared/services/award.service';
import { UserService } from '../../../shared/services/user.service';
import { CompanyService } from '../../../shared/services/company.service';
import { AppreciationService } from '../../../shared/services/appreciation.service';
import { NgOption } from '@ng-select/ng-select';


@Component({
  selector: 'app-appreciation-edit',
  templateUrl: './appreciations-edit.component.html',
  styleUrls: ['./appreciations-edit.component.scss']
})
export class AppreciationsEditComponent implements OnInit {
  modalRef: BsModalRef;
  AllLeaves;
  appreciationForm: FormGroup;
  search;
  appreciation: any = {};
  appreciationedit;
  image;
  allcheck_id;
  file_response;
  Leave_status;
  allcheck_id_count = 0;
  IMAGE_URL;
  sub;
  id;
  employee_image;
  validFormSubmitted = false;
  public award: NgOption[];
  UserData: any = [];
  public employee: NgOption[];
  @ViewChild('awardOtp') awardOtp: ElementRef;
  @ViewChild('awardOtp1') awardOtp1: ElementRef;
  constructor(
    public router: Router,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private companyservice: CompanyService,
    private awardservice: AwardService,
    private userservice: UserService,
    private flashMessageService: FlashMessageService, private modalService: BsModalService,
    private appreciationservice: AppreciationService,
    private renderer2: Renderer2) {
  }

  ngOnInit() {
    const array = [];
    const awardarray = [];
    this.IMAGE_URL = AppConstants.IMAGE_URL;
    this.employee_image = '../../../assets/img/avatars/profile_image.jpg';
    this.appreciationForm = new FormGroup({
      'id': new FormControl(),
      'award_id': new FormControl(null, [Validators.required]),
      'emp_id': new FormControl(null, [Validators.required]),
      'date': new FormControl(null, Validators.required),
      'prize': new FormControl()

    });
    this.UserData = this.userservice.all_users;
    if (this.UserData.length === 0) {
      this.getSetAllUsers();
    } else {
      const arr = [];
      for (const data of this.UserData) {
        arr.push({ label: data.firstname + ' ' + data.lastname, value: data.id });
      }
      this.employee = arr;
    }
    this.awardservice.getAwards().subscribe(res => {
      for (const data of res['data']) {
        awardarray.push({ label: data.name, value: data.id });
      }
      this.award = awardarray;
      this.renderer2.addClass(this.awardOtp['element']['children'][0], 'custom-emp-dropdown');
      this.renderer2.addClass(this.awardOtp1['element']['children'][0], 'custom-emp-dropdown');
    });
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
    });
    if (this.id) {
      this.spinner.show();
      this.appreciationservice.getAppreciationByID(this.id).subscribe(response => {
        this.appreciation = response[0];
        this.appreciationForm.controls['id'].setValue(this.appreciation['id']);
        this.appreciationForm.controls['award_id'].setValue(this.appreciation['award_id']['id']);
        this.appreciationForm.controls['emp_id'].setValue(this.appreciation['emp_id']['id']);
        if (this.appreciation['date']) {
          this.appreciation.date = new Date(moment(this.appreciation.date.date).format());
          this.appreciationForm.controls['date'].setValue(this.appreciation['date']);
        }
        this.appreciationForm.controls['prize'].setValue(this.appreciation['prize']);
        this.file_response = this.appreciation['image'];
        this.spinner.hide();
      });


    }


  }
    getSetAllUsers = async () =>{
    const arr = [];
    this.UserData = await this.userservice.getSetAllUsers().toPromise();
    for (const data of this.UserData) {
      arr.push({ label: data.firstname + ' ' + data.lastname, value: data.id });
    }
    this.employee = arr;
  }
  uploadImage = (event: any) => {

    const file_name = event.target.id;
    const files = event.target.files;
    const fData: FormData = new FormData;
    for (let i = 0; i < files.length; i++) {
      fData.append('file', files[i]);
    }
    this.companyservice.uploadImage(fData).subscribe(
      response => {
        this.file_response = response.filename;
        this.appreciation['image'] = response.filename;
        //  this.image = this.IMAGE_URL + this.file_response.filename;
      },
      error => {
      }
    );
  }


  SaveAppreciation = () => {
    if (this.appreciationForm.valid) {
      this.validFormSubmitted = true;
      this.appreciation = this.appreciationForm.value;
      this.appreciation['image'] = this.file_response;
      this.appreciationservice.saveAppreciation(this.appreciation).subscribe(res => {
        if (res === 'appreciation Add succesfully') {
          this.router.navigate(['/appreciation']);
          this.flashMessageService.pop('success', 'Appreciation Add Succesfully', 'Add Succesfully');
        }
        if (res === 'appreciation Update succesfully') {
          this.router.navigate(['/appreciation']);
          this.flashMessageService.pop('success', 'Appreciation Updated Succesfully', 'Updated Succesfully');
        }
      });
    }
  }


  RemoveImages = (file_name) => {
    this.appreciation[file_name] = '';
    this.file_response = '';
  }


  cancel = () => {
    this.router.navigate(['/appreciation']);
  }
}
