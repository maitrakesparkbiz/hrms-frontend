import { OnInit, Component, ViewChild, ViewChildren, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Moment } from 'moment';
import { OwlDateTimeComponent, OwlDateTimeFormats, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import * as _moment from 'moment';
import { ExpensecategoryService } from '../../../shared/services/expensecategory.service';
import { ExpenseService } from '../../../shared/services/expense.service';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';

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
    selector: 'app-expense-report',
    templateUrl: 'expense-report.component.html',
    styleUrls: ['./expense-report.component.scss'],
    providers: [
        { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_DATE_TIME_FORMATS },
    ],
})

export class ExpenseReportComponent implements OnInit {
    chartForm: FormGroup;
    categories: any = [];
    selectedCategory;
    selectedYear;
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
        private expenseCatService: ExpensecategoryService,
        private expenseService: ExpenseService) {
    }

    ngOnInit() {
        this.chartForm = this._fb.group({
            'year': [moment1()],
            'category_id': []
        });
        this.getAllExpenseCategories();
    }

    getAllExpenseCategories = () => {
        const arr = [];
        this.expenseCatService.getExpenseCategory().subscribe(
            (res) => {
                for (const data of res.data) {
                    arr.push({ label: data.name, value: data.id });
                }
                this.categories = arr;
            }
        );
    }

    // events
    chartClicked = (e: any): void => {
        // console.log(e);
    }

    chartHovered = (e: any): void => {
        // console.log(e);
    }


    chosenYearHandler = (normalizedYear: Moment, datepicker: OwlDateTimeComponent<Moment>) => {
        const ctrlValue = this.chartForm.get('year').value;
        ctrlValue.year(normalizedYear.year());
        this.chartForm.get('year').setValue(ctrlValue);
        datepicker.close();
    }

    onChange = () => {
        this.selectedCategory = this.chartForm.get('category_id').value;
        this.selectedYear = this.chartForm.get('year').value;
        if (this.selectedCategory && this.selectedYear) {
            this.getExpenseByYear();
        }
    }

    getExpenseByYear = () => {
        const data = {};
        data['cat_id'] = this.selectedCategory;
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
        // console.log(monthData);
        this.barChartData = [];
        this.barChartData.push({ 'data': monthData, 'label': 'Expense' });

        // console.log(this.chart.chart.config.data.datasets[0]['data']);
    }

    onSubmit() { }
}
