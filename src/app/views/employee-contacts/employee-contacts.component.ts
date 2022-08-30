import { Component, OnInit, TemplateRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AppConstants } from '../../constants/app.constants';
import { fromEvent, Observable } from 'rxjs';
// import { debounceTime } from 'rxjs-compat/operator/debounceTime';
import { map, debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-employee-contacts',
    templateUrl: 'employee-contacts.component.html',
    styleUrls: ['./employee-contacts.component.scss']
})

export class EmployeeContactsComponent implements OnInit {
    params: any = {};
    filerForm: FormGroup;
    allUsers: any = [];
    pagination: any = [];
    recordPerPage = 9;
    pageClicked;
    IMAGE_URL;
    employee_image;
    searchValue = '';
    searchOb$: any;
    @ViewChild('searchFilter') searchFilter;
    constructor(private userService: UserService,
        private _fb: FormBuilder,
        private renderer: Renderer2,
        private elem: ElementRef) {
    }

    ngOnInit() {
        this.IMAGE_URL = AppConstants.IMAGE_URL;
        this.employee_image = '../../../assets/img/avatars/profile_image.jpg';
        this.filerForm = this._fb.group({
            status: ['all'],
            search: ['']
        });
        this.searchOb$ = fromEvent(this.searchFilter.nativeElement, 'keyup')
            .pipe(
                debounceTime(200)
            ).subscribe(
                (res: any) => {
                    const search = res.target.value;
                    if (search == null) {
                        this.pageClicked = 0;
                        this.getContactUsers();
                    } else {
                        if (search !== this.searchValue) {
                            this.searchValue = search;
                            this.pageClicked = 0;
                            this.getContactUsers();
                        }
                    }
                }
            )
        this.getContactUsers();
    }

    getContactUsers = (page: any = null, pageClass: any = null) => {
        if (page === null) {
            this.pageClicked = 0;
        }
        if (this.pageClicked !== page) {
            this.pageClicked = page;
            this.setParams(page);
            this.userService.getContactUsers(this.params).subscribe(
                (res) => {
                    this.allUsers = res.data;
                    this.setPagination(res.recordsFiltered, pageClass);
                }
            );
        }
    }

    setParams = (page) => {
        this.params['search'] = this.filerForm.get('search').value;
        this.params['statusSearch'] = this.filerForm.get('status').value;
        this.params['start'] = this.onPageClick(page);
        this.params['length'] = this.recordPerPage;
    }

    onFilter = (search = null) => {
        if (search == null) {
            this.pageClicked = 0;
            this.getContactUsers();
        } else {
            if (search !== this.searchValue) {
                this.searchValue = search;
                this.pageClicked = 0;
                this.getContactUsers();
            }
        }
    }

    setPagination = (total, pageClass = null) => {
        this.pagination = [];
        const pages = Math.ceil((total / this.recordPerPage));
        if (pages > 0) {
            for (let i = 0; i < pages; i++) {
                this.pagination.push(i);
            }
        }
        setTimeout(() => {
            if (pageClass == null) {
                pageClass = 'page0';
            }
            for (let i = 0; i < pages; i++) {
                const tempEle = this.elem.nativeElement.querySelectorAll('.page' + i);
                for (const newEle of tempEle) {
                    if ('page' + i === pageClass) {
                        this.renderer.addClass(newEle, 'custom-active');
                    } else {
                        this.renderer.removeClass(newEle, 'custom-active');
                    }
                }
            }
        }, 100);

    }

    onPageClick = (page = null) => {
        if (page) {
            return page * this.recordPerPage;
        }
        return 0;
    }

    lastPage = () => {
        return this.pagination.length - 1;
    }

    pageClass = (str, num) => {
        return str + num;
    }
}
