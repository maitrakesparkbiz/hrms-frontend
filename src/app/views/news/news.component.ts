import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { UserService } from '../../shared/services/user.service';
import { LeaveTypeService } from '../../shared/services/leave_type.service';
import { FlashMessageService } from '../../shared/services/flash-message.service';
import { AppConstants } from '../../constants/app.constants';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormControl } from '@angular/forms';
import { NewsService } from '../../shared/services/news.service';
import { DomSanitizer } from '@angular/platform-browser';
import { StorageManagerService } from '../../shared/services/storage-manager.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatatableService } from '../../shared/services/datatable.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})

export class NewsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();


  modalRef: BsModalRef;
  rejectForm: FormGroup;
  search;
  allcheck_id;
  newsdetail;
  employeelist;
  news_edit;
  IMAGE_URL;
  news;
  news_status;
  allcheck_id_count: any = 0;
  employee_image = '../../../assets/img/avatars/profile_image.jpg';
  str;
  filterForm: FormGroup;
  constructor(
    public router: Router,
    public userservice: UserService,
    public leavetypeservice: LeaveTypeService,
    private spinner: NgxSpinnerService,
    private newsservice: NewsService,
    private flashMessageService: FlashMessageService,
    private modalService: BsModalService,
    private santizer: DomSanitizer,
    private datatableService: DatatableService) {
    this.santizer.bypassSecurityTrustResourceUrl(this.str);
  }

  ngOnInit() {
    this.IMAGE_URL = AppConstants.IMAGE_URL;
    this.filterForm = new FormGroup({
      'status': new FormControl('all')
    });
    this.getAllNews();
  }

  // getAllNews() {
  //     this.spinner.show();
  //     this.newsservice.getAllNews().subscribe(res => {
  //         this.news = res.data;
  //         for (let i = 0; i < this.news.length; i++) {
  //             if (this.news[i]['publish_date']) {
  //                 this.news[i]['publish_date'] = moment(this.news[i]['publish_date'].date).format('Y-M-D');
  //             } else {
  //                 this.news[i]['publish_date'] = ' - ';
  //             }
  //         }
  //         this.spinner.hide();
  //     });
  // }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  getAllNews = () => {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50],
      serverSide: true,
      processing: true,
      language: {
        searchPlaceholder: 'Search...',
        search: ''
      },
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.columns[2].search.value = this.filterForm.get('status').value;
        this.datatableService.getTableData(dataTablesParameters, 'datatable/getAllNews').subscribe(resp => {
          this.allcheck_id = false;
          this.news = resp.data;
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });
      },
      order: [],
      columns: [{ name: 'id', orderable: false },
      { name: 'title' },
      { name: 'status' },
      { name: 'publish_date', searchable: false }]
    };
  }

  checkboxHeader = (evt: Event) => {

    this.allcheck_id_count = 0;
    if (this.allcheck_id !== true) {
      for (let i = 0; i < this.news.length; i++) {
        this.news[i]['isSelected'] = true;
        this.allcheck_id_count++;
      }
    } else {
      for (let i = 0; i < this.news.length; i++) {
        this.news[i]['isSelected'] = false;
      }
    }
    // console.log(this.dept);
  }

  checkone = (id) => {
    this.allcheck_id = false;
    let selectId = '';
    this.allcheck_id_count = 0;
    this.newsdetail = [];
    for (let i = 0; i < this.news.length; i++) {
      if (+this.news[i]['id'] === +id) {
        this.news[i]['isSelected'] = !this.news[i]['isSelected'];
        if (this.news[i]['isSelected']) {
          this.news_status = this.news[i]['status'];
          this.allcheck_id_count++;
          selectId = this.news[i];
        }
      } else {
        this.news[i]['isSelected'] = false;
      }
    }
    if (this.allcheck_id_count === 1) {
      this.getNewsDetail(selectId);
    }
  }

  getNewsDetail = (newsdetail) => {
    this.employeelist = newsdetail.news_employee;
    this.newsdetail = newsdetail;
    this.str = this.newsdetail['description'];
  }
  EditNews = () => {
    this.news_edit = [];
    this.news_edit = this.news;
    for (let i = 0; i < this.news.length; i++) {
      if (this.news_edit[i]['isSelected']) {
        this.router.navigate(['/news/edit/' + this.news_edit[i].id]);
      }
    }
  }
  openModel = (template) => {
    this.modalRef = this.modalService.show(template);
  }
  closeModel = () => {
    this.modalRef.hide();
  }


  DeleteNews = () => {
    this.news_edit = [];
    this.news_edit = this.news;
    for (let i = 0; i < this.news.length; i++) {
      if (this.news_edit[i]['isSelected']) {
        this.closeModel();
        this.newsservice.deleteNews(this.news_edit[i]['id']).subscribe(res => {
          if (res === 'News Delete succesfully') {
            // this.getAllNews();
            this.rerender();
            this.newsdetail = [];
            this.flashMessageService.pop('error', 'News Deleted SuccesFully', 'Delete News');
          }
        });
      }
    }
  }


  PublishNews = () => {
    this.news_edit = [];
    this.news_edit = this.news;
    for (let i = 0; i < this.news.length; i++) {
      if (this.news_edit[i]['isSelected']) {
        this.closeModel();
        this.newsservice.publishNews(this.news_edit[i]['id']).subscribe(res => {
          if (res === 'News update succesfully') {
            // this.getAllNews();
            this.rerender();
            this.flashMessageService.pop('success', 'News Publish SuccesFully', 'News Publish');
          }
        });
      }
    }
  }


  rerender = (): void  => {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }


}
