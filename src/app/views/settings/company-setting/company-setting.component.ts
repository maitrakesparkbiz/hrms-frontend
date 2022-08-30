import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../../shared/services/company.service';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { OptionService } from '../../../shared/services/option.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageManagerService } from '../../../shared/services/storage-manager.service';
import { PermissionService } from '../../../shared/services/permission.service';
import { fromIterable } from 'rxjs/internal-compatibility';
@Component({
  selector: 'app-company-setting',
  templateUrl: './company-setting.component.html',
  styleUrls: ['./company-setting.component.scss']
})
export class CompanySettingComponent implements OnInit {

  ComppanySettingForm: FormGroup;
  company: any = {};
  finansial_start_months = [];
  currencys = [];
  timezones = [];
  datetimes = [];
  editAllowed = true;
  keys = ['id', 'datetimeformat', 'financial_year_start_month', 'leave_start_month','default_break_time'];
  constructor(public companyservice: CompanyService, public optionservice: OptionService,
    private flashMessageService: FlashMessageService,
    private spinner: NgxSpinnerService,
    private perService: PermissionService) { }

  ngOnInit() {
    this.editAllowed = this.perService.hasPermission('GENERAL-SETTINGS.EDIT');
    this.ComppanySettingForm = new FormGroup({
      // 'currency': new FormControl(),
      // 'currency_symbol': new FormControl(),
      // 'timezone': new FormControl(),
      'datetimeformat': new FormControl(),
      'financial_year_start_month': new FormControl(),
      // 'from_email': new FormControl(null, [Validators.required, Validators.email]),
      // 'from_name': new FormControl(),
      'leave_start_month': new FormControl(),
      'default_break_time':new FormControl()
    });

    if (!this.editAllowed) {
      Object.keys(this.ComppanySettingForm.controls).forEach(index => {
        this.ComppanySettingForm.controls[index].disable();
      });
    }
    this.spinner.show();
    this.optionservice.getSelectOption('2').subscribe(response => {
      this.finansial_start_months = response.data;
    });
    // this.optionservice.getSelectOption('3').subscribe(response => {
    //     this.currencys = response.data;
    // });
    // this.optionservice.getSelectOption('4').subscribe(response => {
    //     this.timezones = response.data;
    // });
    this.optionservice.getSelectOption('5').subscribe(response => {
      this.datetimes = response.data;
    });
    this.companyservice.getCompanyById('1').subscribe(response => {
      this.company = response[0];

      // if (this.company.timezone) {
      //     this.company.timezone = this.company.timezone.id;
      // }
      // if (this.company.currency) {
      //     this.company.currency = this.company.currency.id;
      // }
      if (this.company.financial_year_start_month) {
        this.company.financial_year_start_month = +this.company.financial_year_start_month.id;
      }
      if (this.company.leave_start_month) {
        this.company.leave_start_month = +this.company.leave_start_month.id;
      }
      // if (this.company.country) {
      //     this.company.country = this.company.country.id;
      // }
      if (this.company.datetimeformat) {
        this.company.datetimeformat = this.company.datetimeformat.id;
      }

      Object.keys(this.company).forEach((index) => {
        if (this.keys.indexOf(index) === -1) {
          delete this.company[index];
        }
      });
      this.spinner.hide();
    });

  }
  SaveCompany = () => {
    if (this.editAllowed) {

      this.companyservice.saveCompany(this.company).subscribe((responseData: any) => {
        if (responseData.response === 'success') {
          let dateFormat = '';
          for (const format of this.datetimes) {
            if (format.id === this.company.datetimeformat) {
              dateFormat = format.value_text;
            }
          }
          StorageManagerService.storeDateTimeFormat(dateFormat);
          this.flashMessageService.pop('success', 'Company-Settings', ' Updated  SuccesFully');
        }
      });
    }
  }
}
