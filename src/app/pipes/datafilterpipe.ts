import { Pipe, PipeTransform } from '@angular/core';
import { StorageManagerService } from '../shared/services/storage-manager.service';
import { CompanyService } from '../shared/services/company.service';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dateFilter'
})

export class DataFilterPipe implements PipeTransform {

  constructor(private companyService: CompanyService, private datePipe: DatePipe) { }

  transform(date: any): any {
    const date_format = StorageManagerService.getDateTimeFormat();
    if (!date_format) {
      this.companyService.getDateTimeFormat().subscribe(
        (res) => {
          StorageManagerService.storeDateTimeFormat(res);
        }
      );
    }
    if (date_format) {
      if (date_format === 'DD-MM-YYYY') {
        return this.datePipe.transform(date, 'dd-MM-y');
      } else {
        return this.datePipe.transform(date, 'y-MM-dd');
      }
    }
  }
}
