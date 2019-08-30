import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/_shared/services/auth.service';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

@Injectable()
export class AdminOwnersService {
  constructor(private httpClient: HttpClient, private authService: AuthService) {}

  getOwners(sortActive = null, sortDirection, currentPage, itemsPerPage = 10, tableSearch, province, startDate, endDate) {
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
      if ( province ) {
        const newObj = {province};
        sortArray.filter = {...sortArray.filter, ...newObj};
      }
      if ( tableSearch ) {
        const newObj = {name: tableSearch.split(' ').filter(item => item !== '')};
        sortArray.filter = {...sortArray.filter, ...newObj};
      }
      console.log(sortArray);
      return this.httpClient.post(`${environment.adminEndpoint}/admin/owners`, sortArray, {headers}).pipe(
        catchError(() => of(''))
      );
  }
  getOwnerDetail(ownerId: any) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.get(`${environment.adminEndpoint}/admin/owner/info/${ownerId}`, {headers}).pipe(
      catchError((error) => throwError(error))
    );
  }
  editOwnerData(ownerData) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.post(`${environment.adminEndpoint}/admin/owner/save`, ownerData, {headers}).pipe(
      catchError((error) => throwError(error))
    );
  }
  createNewOwner(newOwnerData) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.post(`${environment.adminEndpoint}/admin/owner/save`, newOwnerData, {headers}).pipe(
      catchError((error) => throwError(error))
    );
  }
  getOwnerLicensees(sortActive = null, sortDirection, currentPage, itemsPerPage = 10, tableSearch, id, ownerType) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    const sortArray = {
      currentPage,
      itemsPerPage,
      filter: {},
      sort: {},
      'ownerOnly': ownerType,
      id
    };
    if ( sortDirection !== '' ) {
      const newObj = {[sortActive]: sortDirection};
      sortArray.sort = {...sortArray.sort, ...newObj};
    }
    if ( tableSearch ) {
      const newObj = {name: tableSearch.split(' ').filter(item => item !== '')};
      sortArray.filter = {...sortArray.filter, ...newObj};
    }
    return this.httpClient.post(`${environment.adminEndpoint}/admin/owner/licensees`, sortArray, {headers}).pipe(
      catchError((error) => throwError(error))
    );
  }
  assignLicenseesToOwner(licenseesArray) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.post(`${environment.adminEndpoint}/admin/owner/licensees/assign`, licenseesArray, {headers}).pipe(
      catchError((error) => throwError(error))
    );
  }
  removeLicensees(licenseesArray) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.httpClient.post(`${environment.adminEndpoint}/admin/owner/licensees/remove`, licenseesArray, {headers}).pipe(
      catchError((error) => throwError(error))
    );
  }
}
