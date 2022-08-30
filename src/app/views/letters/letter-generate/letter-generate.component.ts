import { Component, OnInit, ViewChild } from "@angular/core";
import { AppConstants } from "../../../constants/app.constants";
import { FlashMessageService } from "../../../shared/services/flash-message.service";
import { BsModalService } from "ngx-bootstrap";
import { DatatableService } from "../../../shared/services/datatable.service";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";

@Component({
    templateUrl: './letter-generate.component.html',
    styleUrls: ['./letter-generate.component.scss']
})

export class LetterGenerateComponent implements OnInit {
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject();
    IMAGE_URL = AppConstants.IMAGE_URL;
    allcheck_id_count = 0;
    allLetters; any = [];
    selectedLetter: any = [];
    employee_image = '../../../../assets/img/avatars/profile_image.jpg';
    constructor(private flashMessageService: FlashMessageService,
        private modalService: BsModalService,
        private datatableService: DatatableService) {

    }

    ngOnInit() {
        this.getAllGeneratedLetters();
    }
    rerender = (): void => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
        });
    }
    ngAfterViewInit(): void {
        this.dtTrigger.next();
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.dtTrigger.unsubscribe();
    }

    getAllGeneratedLetters() {
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
                this.datatableService.getLetterTemplate(dataTablesParameters, 'datatable/getAllGeneratedEmailsDatatable').subscribe(resp => {
                    this.allcheck_id_count = 0;
                    this.allLetters = resp.data;
                    // this.spinner.hide();
                    callback({
                        recordsTotal: resp.recordsTotal,
                        recordsFiltered: resp.recordsFiltered,
                        data: []
                    });
                });
            },
            order: [],
            columns: [
                { name: 'firstname' },
                { name: 'template_name' },
                { name: 'created_at' }]
        };
    }

    checkone = (id) => {
        let selectId = '';
        this.allcheck_id_count = 0;
        this.selectedLetter = [];
        // let tempCount = 0;
        for (let i = 0; i < this.allLetters.length; i++) {
            if (+id === +this.allLetters[i]['id']) {
                this.allLetters[i]['isSelected'] = !this.allLetters[i]['isSelected'];
                if (this.allLetters[i]['isSelected']) {
                    this.allcheck_id_count++;
                    this.selectedLetter = this.allLetters[i];
                }
            } else {
                this.allLetters[i]['isSelected'] = false;
            }
        }
    }
}