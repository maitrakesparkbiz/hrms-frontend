import { OnInit, Component, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Moment } from 'moment';
import { OwlDateTimeComponent, OwlDateTimeFormats, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import * as _moment from 'moment';
import { ExpensecategoryService } from '../../../shared/services/expensecategory.service';
import { ExpenseService } from '../../../shared/services/expense.service';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { DashboardService } from '../../../shared/services/dashboard.service';

const moment1 = (_moment as any).default ? (_moment as any).default : _moment;

export const MY_MOMENT_DATE_TIME_FORMATS: OwlDateTimeFormats = {
  parseInput: 'MM/YYYY',
  fullPickerInput: 'l LT',
  datePickerInput: 'YYYY',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY'
};

@Component({
  selector: 'app-dashboard-report',
  templateUrl: 'dashboard-expense-report.component.html',
  styleUrls: ['./dashboard-expense-report.component.scss'],
  providers: [
    { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_DATE_TIME_FORMATS },
  ],
})

export class DashboardExpenseReportComponent implements OnInit {
  chartForm: FormGroup;
  categories: any = [];
  selectedCategory;
  selectedYear;
  defaultYear;
  expenseData: any = [];
  chartUpdated = false;

  barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      xAxes: [{
        barPercentage: 0.5
      }]
    }
  };
  barChartLabels: string[] =
    ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'];
  barChartType = 'bar';
  barChartLegend = true;

  barChartData: any[] = [
    { data: [], label: 'Expense' }
  ];

  constructor(private _fb: FormBuilder,
    private expenseService: ExpenseService,
    private dashboardService: DashboardService) {
  }

  ngOnInit() {
    this.chartForm = this._fb.group({
      'year': [moment1()],
    });
    this.getchartdata();
    this.dashboardService.pendingClaims.subscribe(
      (res) => {
        this.onChange();
      }
    );
  }

  chosenYearHandler = (normalizedYear: Moment, datepicker: OwlDateTimeComponent<Moment>) => {
    const ctrlValue = this.chartForm.get('year').value;
    ctrlValue.year(normalizedYear.year());
    this.chartForm.get('year').setValue(ctrlValue);
    datepicker.close();
    this.getExpenseByYear();
  }

  onChange = () => {
    this.selectedYear = this.chartForm.get('year').value;
    if (this.selectedYear) {
      this.getExpenseByYear();
    }
  }

  getchartdata = () =>{
    const data = {};
    this.defaultYear = this.chartForm.get('year').value;
    data['year'] = this.defaultYear.format('YYYY');


    this.expenseService.getExpenseByYear(data).subscribe(
        (res) => {
          this.expenseData = res;
          this.generateChartData();
        }
    );
  }

  getExpenseByYear = () => {
    const data = {};
    data['year'] = this.selectedYear.format('YYYY');


    this.expenseService.getExpenseByYear(data).subscribe(
      (res) => {
        this.expenseData = res;
        this.generateChartData();
      }
    );
  }



  generateChartData = () => {
    const monthData = [];
    for (let i = 1; i <= 12; i++) {
      let totalAmount = 0;
      for (const expense of this.expenseData) {
        expense['amount'] = +expense['amount'];
        if (+_moment(expense['bill_date']['date']).month() === (i - 1)) {
          totalAmount += expense['amount'];
        }
      }
      monthData.push(totalAmount);
    }
    this.barChartData = [];
    this.barChartData.push({ 'data': monthData, 'label': 'Expense' });
  }

  onSubmit() { }
}
