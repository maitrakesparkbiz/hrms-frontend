import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../../constants/app.constants';

@Injectable()
export class NewsService {

    // // API_URL = 'http://www.snaphrms.taskgrids.com/api/api/';
    //
    // API_URL = 'http://snaphrms.com/api/';
    // // API_URL = 'http://192.168.10.96/api/';

    constructor(private httpClient: HttpClient) {
    }
    saveNews = (news) =>{
        return this.httpClient.post<any>(AppConstants.API_URL + 'news/save_news', news);
    }
    getAllNews = () => {
        return this.httpClient.get<any>(AppConstants.API_URL + 'news/get_all_news');
    }
    getNewsByID = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'news/get_newsById', { 'id': id });
    }

    deleteNews = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'news/delete_news', { 'id': id });
    }
    publishNews = (id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'news/publish_news', { 'id': id });
    }

    getNewsByEmployee= () => {
        return this.httpClient.get(AppConstants.API_URL + 'news/getNewsByEmployee');
    }
    setIsReadNews = (emp_id) => {
        return this.httpClient.post<any>(AppConstants.API_URL + 'news/setIsReadNews', { 'emp_id': emp_id});
    }

}
