import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { NewsService } from '../../../shared/services/news.service';
import { StorageManagerService } from '../../../shared/services/storage-manager.service';
import { DatePipe } from '@angular/common';
import {DashboardService} from "../../../shared/services/dashboard.service";

@Component({
    selector: 'app-self-news',
    templateUrl: 'self-news.component.html',
    styleUrls: ['./self-news.component.scss']
})

export class SelfNewsComponent implements OnInit {
    modalRef: BsModalRef;
    allNews: any = [];
    emp_id;
    modalData;
    constructor(private modalService: BsModalService,
        private newsService: NewsService,
        private datePipe: DatePipe,
                private dashboardService:DashboardService) {
    }

    ngOnInit() {
        const data = JSON.parse(StorageManagerService.getUser());
        this.emp_id = data.id;
        this.newsService.getNewsByEmployee().subscribe(
            (res) => {
                this.allNews = res;
                Object.keys(this.allNews).forEach(index => {
                    if (this.allNews[index]['publish_date'] !== null) {
                        this.allNews[index]['publish_date'] = this.datePipe.transform(this.allNews[index]['publish_date'].date, 'dd MMM')
                            .toUpperCase();
                    }
                });
            }
        );
        this.setIsRead();
    }
    setIsRead = () => {
        this.newsService.setIsReadNews(this.emp_id).subscribe(
            (res) => {
                this.dashboardService.unreadNews.next();

            }
        );
    }

    getNewsData = (id, template) => {
        this.modalData = {};
        for (const news of this.allNews) {
            if (+news.id === +id) {
                this.modalData = news;
            }
        }
        this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
    }

    // openModal(template) {
    //     this.modalRef = this.modalService.show(template);
    // }

    closeModel = () => {
        this.modalRef.hide();
    }
}
