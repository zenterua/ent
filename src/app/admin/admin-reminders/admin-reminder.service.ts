import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../_shared/services/auth.service';
import { environment } from 'src/environments/environment';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable()
export class AdminReminderService {
  constructor(private httpClient: HttpClient, private authService: AuthService) {}
  saveTemplate(template) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.post(`${environment.adminEndpoint}/admin/reminders/template/save`, template, {headers}).pipe(
      catchError(error => throwError(error))
    );
  }
  getAllTemplates() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.get(`${environment.adminEndpoint}/admin/reminders/template`, {headers}).pipe(
      catchError((error) => throwError(error))
    );
  }
  removeTemplate(id) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.post(`${environment.adminEndpoint}/admin/reminders/template/remove`, id, {headers}).pipe(
      catchError((error) => throwError(error))
    );
  }
  getReminderTariff() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.get(`${environment.adminEndpoint}/admin/reminders/tariffs`, {headers}).pipe(
      catchError((error) => throwError(error))
    );
  }
  saveReminder(reminder) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.post(`${environment.adminEndpoint}/admin/reminders/save`, reminder, {headers}).pipe(
      catchError((error) => throwError(error))
    );
  }
  getAllReminders(sortActive = null, sortDirection, currentPage, itemsPerPage = 10, tableSearch, startDate, endDate) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    const sortArray = {
      currentPage,
      itemsPerPage,
      filter: {},
      sort: {}
    };
    if ( sortDirection !== '' ) {
      const newObj = {[sortActive]: sortDirection};
      sortArray.sort = {...sortArray.sort, ...newObj};
    }
    if ( startDate ) {
      const newObj = {startDate};
      sortArray.filter = {...sortArray.filter, ...newObj};
    }
    if ( endDate ) {
      const newObj = {endDate};
      sortArray.filter = {...sortArray.filter, ...newObj};
    }
    if ( tableSearch ) {
      const newObj = {name: tableSearch};
      sortArray.filter = {...sortArray.filter, ...newObj};
    }
    return this.httpClient.post(`${environment.adminEndpoint}/admin/reminders`, sortArray, {headers}).pipe(
      catchError((error) => throwError(error))
    );
  }
  removeReminder(id) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.post(`${environment.adminEndpoint}/admin/reminders/remove`, id, {headers}).pipe(
      catchError((error) => throwError(error))
    );
  }
  getReminderInfo(id) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.get(`${environment.adminEndpoint}/admin/reminder/info/${id}`, {headers}).pipe(
      catchError((error) => throwError(error))
    );
  }

}
