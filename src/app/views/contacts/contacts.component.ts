import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FlashMessageService } from '../../shared/services/flash-message.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContactService } from '../../shared/services/contact.service';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { DatatableService } from '../../shared/services/datatable.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  modalRef: BsModalRef;
  rowonpage: any;
  AllLeaves;
  contact;
  contact_edit;
  contactdetail;
  search;
  allcheck_id;
  allcheck_id_count = 0;

  constructor(
    public router: Router,
    private spinner: NgxSpinnerService,
    private httpclient: HttpClient,
    private contactservice: ContactService,
    private flashMessageService: FlashMessageService,
    private modalService: BsModalService,
    private datatableService: DatatableService) {
  }

  ngOnInit() {
    this.getAllContact();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


  // getAllContact() {
  //     this.spinner.show();
  //     this.rowonpage = 5

  //     this.contactservice.getAllContact().subscribe(res => {
  //         this.contact = res['data'];
  //         this.spinner.hide();
  //     })
  // }

  getAllContact = () => {
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
      // search: { search: this.leaveForm.get('status').value },
      ajax: (dataTablesParameters: any, callback) => {
        this.datatableService.getTableData(dataTablesParameters, 'datatable/getAllContactsDatatable').subscribe(resp => {
          this.allcheck_id = false;
          this.allcheck_id_count = 0;
          this.contact = resp.data;
          // this.spinner.hide();
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });
      },
      order: [],
      columns: [{ name: 'id', orderable: false },
      { name: 'name' },
      { name: 'number' },
      { name: 'email' },
      { name: 'service' }]
    };
  }

  rerender = (): void => {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  checkboxHeader = (evt: Event) => {

    this.allcheck_id_count = 0;
    if (this.allcheck_id !== true) {
      for (let i = 0; i < this.contact.length; i++) {
        this.contact[i]['isSelected'] = true;
        this.allcheck_id_count++;
      }
    } else {
      for (let i = 0; i < this.contact.length; i++) {
        this.contact[i]['isSelected'] = false;

      }
    }
  }
  checkone = (id) => {
    this.allcheck_id = false;
    let selectId = '';
    this.allcheck_id_count = 0;
    let tempCount = 0;
    // setTimeout(() => {
    for (let i = 0; i < this.contact.length; i++) {
      if (+id === +this.contact[i]['id']) {
        this.contact[i]['isSelected'] = !this.contact[i]['isSelected'];
        if (this.contact[i]['isSelected']) {
          this.allcheck_id_count++;
          selectId = this.contact[i];
        }
      } else {
        if (this.contact[i]['isSelected']) {
          selectId = this.contact[i];
          this.allcheck_id_count++;
        }
      }
      if (this.contact[i]['isSelected']) {
        tempCount++;
      }
    }
    if (tempCount === this.contact.length) {
      this.allcheck_id = true;
    }
    if (this.allcheck_id_count === 1) {
      this.getContactById(selectId);
    }
    // }, 100);
  }
  getContactById = (contact) => {
    this.contactdetail = contact;
  }

  EditContact = () => {
    this.allcheck_id_count = 0;
    this.contact_edit = [];
    this.contact_edit = this.contact;
    for (let i = 0; i < this.contact_edit.length; i++) {
      if (this.contact_edit[i]['isSelected']) {
        this.router.navigate(['/contacts/update-contact/' + this.contact_edit[i].id]);
      }
    }

  }
  deleteContact = () => {
    this.allcheck_id_count = 0;
    this.contact_edit = [];
    this.contact_edit = this.contact;
    this.contactservice.deleteContact(this.contact_edit).subscribe((responseData: any) => {
      if (responseData.response === 'success') {
        this.closeModel();
        this.flashMessageService.pop('error', 'Contact Deleted', 'Deleted Succesfully');
        this.rerender();
      }

    });

  }
  deleteModel = (template) => {
    this.modalRef = this.modalService.show(template);
  }


  closeModel = () => {
    this.modalRef.hide();
  }
}
