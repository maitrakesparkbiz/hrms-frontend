import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { UserService } from '../../../shared/services/user.service';
import { AppreciationService } from '../../../shared/services/appreciation.service';
import { NgOption } from '@ng-select/ng-select';
import { NewsService } from '../../../shared/services/news.service';
import { StorageManagerService } from '../../../shared/services/storage-manager.service';

@Component({
  selector: 'app--news-edit',
  templateUrl: './news-edit.component.html',
  styleUrls: ['./news-edit.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class NewsEditComponent implements OnInit {
  modalRef: BsModalRef;
  newsForm: FormGroup;
  public employee: NgOption[];
  dropdownList: any = [];
  dropdownSettings: any = [];
  newsDetail;
  selectedItems: any = [];
  emp: any = {};
  allUsers: any = [];
  emp_id = [];
  sub;
  UserData: any = [];
  id;
  newsEdit: any = [];
  objLen: any = 0;
  constructor(
    public router: Router,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private userservice: UserService,
    private newsservice: NewsService,
    private flashMessageService: FlashMessageService, private modalService: BsModalService,
    private appreciationservice: AppreciationService) {
  }

  ngOnInit() {
    const array = [];
    this.newsEdit.status = 'Draft';
    this.allUsers = this.userservice.all_users;
    if (this.allUsers.length === 0) {
      this.getSetAllUsers();
    } else {
      Object.keys(this.allUsers).forEach(key => {
        this.dropdownList.push({
          item_id: this.allUsers[key]['id'],
          item_text: (this.allUsers[key]['firstname'] + ' ' + this.allUsers[key]['lastname'])
        });
      });
    }
    // this.allUsersOtp();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
    });

    if (this.id) {
      this.selectedItems = [];
      this.spinner.show();
      this.newsservice.getNewsByID(this.id).subscribe(res => {
        this.newsEdit = res;
        this.newsForm.controls['id'].setValue(this.newsEdit['id']);
        this.newsForm.controls['title'].setValue(this.newsEdit['title']);
        this.newsForm.controls['status'].setValue(this.newsEdit['status']);
        this.newsForm.controls['description'].setValue(this.newsEdit['description']);
        const temp = [];
        if (this.newsEdit.status === 'Publish') {
          this.newsForm.controls['status'].disable();
        }

        if (this.newsEdit.news_employee !== null) {
          Object.keys(this.newsEdit.news_employee).forEach(element => {
            this.selectedItems.push({
              item_id: this.newsEdit.news_employee[element]['emp_id']['id'],
              item_text: (this.newsEdit.news_employee[element]['emp_id']['firstname'] + ' '
                + this.newsEdit.news_employee[element]['emp_id']['lastname'])
            });
          });
        }
        this.objLen = Object.keys(this.newsEdit).length;
        this.spinner.hide();
      });
    }

    this.newsForm = new FormGroup({
      'id': new FormControl(),
      'title': new FormControl('', Validators.required),
      'emp_id': new FormControl(),
      'status': new FormControl(),
      'description': new FormControl()
    });
  }

  getSetAllUsers = async () => {
    this.allUsers = await this.userservice.getSetAllUsers().toPromise();
    Object.keys(this.allUsers).forEach(key => {
      this.dropdownList.push({
        item_id: this.allUsers[key]['id'],
        item_text: (this.allUsers[key]['firstname'] + ' ' + this.allUsers[key]['lastname'])
      });
    });
  }

  onItemSelect(item: any) {
  }
  onSelectAll(items: any) {
  }

  SaveNews = () => {
    if (this.newsForm.valid) {
      this.newsDetail = this.newsForm.value;
      if (this.newsDetail['emp_id'].length > 0) {
        const temp = [];
        for (const data of this.newsDetail['emp_id']) {
          temp.push(data.item_id);
        }
        this.newsDetail['emp_id'] = temp;
      }
      this.spinner.show();
      this.newsservice.saveNews(this.newsDetail).subscribe(res => {
        if (res === 'News Add succesfully') {
          this.router.navigate(['/news']);
          this.flashMessageService.pop('success', 'News Add Succesfully', 'Add Succesfully');
        }
        if (res === 'News Update succesfully') {
          this.router.navigate(['/news']);
          this.flashMessageService.pop('success', 'News Updated Succesfully', 'Updated Succesfully');
        }
        this.spinner.hide();
      });
    }
  }

  cancel = () => {
    this.router.navigate(['/news']);
  }

}

