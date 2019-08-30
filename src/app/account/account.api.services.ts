import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../_shared/services/auth.service';

@Injectable()
export class AccountApiServices {
  header:any
	
  constructor(private http: HttpClient, private Auth: AuthService) {}

  addAccount(isPrimary, user){
      return this.http.post(environment.endpoint + 'profile/account/add-contact/' + isPrimary, user)
	  .pipe(
	  	map((response: any) => {
			return response;
	   	}), catchError(val => throwError(val)));
  }
	
  editAccount(contactId, isPrimary, user){
      return this.http.post(environment.endpoint + 'profile/account/edit-contact/' + contactId + '/' + isPrimary, user)
	  .pipe(
	  	map((response: any) => {
			return response;
	   	}), catchError(val => throwError(val)));
  }
	
  deleteAccount(id){
      return this.http.get(environment.endpoint + 'profile/account/del-contact/' + id)
	  .pipe(
	  	map((response: any) => {
			return response;
	   	}), catchError(val => throwError(val)));
  }	
	
  getAllContacts(){
      return this.http.get(environment.endpoint + 'profile/account/contacts')
	  .pipe(
	  	map((response: any) => {
			return response;
	   	}), catchError(val => throwError(val)));
  }
	
  editProfile(data){
      return this.http.post(environment.endpoint + 'profile/account/edit', data)
	  .pipe(
	  	map((response: any) => {
			return response;
	   	}), catchError(val => throwError(val)));
  }
	
  editPassword(data){
      return this.http.post(environment.endpoint + 'profile/account/change-password', data)
	  .pipe(
	  	map((response: any) => {
			return response;
	   	}), catchError(val => throwError(val)));
  }
	
  editEmail(data, lang){
      return this.http.post(environment.endpoint + 'profile/account/edit-email/' + lang, data)
	  .pipe(
	  	map((response: any) => {
			return response;
	   	}), catchError(val => throwError(val)));
  }	
	
  setPrimaryContact(id){
      return this.http.get(environment.endpoint + 'profile/account/primary-contact/' + id)
	  .pipe(
	  	map((response: any) => {
			return response;
	   	}), catchError(val => throwError(val)));
  }
	
  setPromotion(number){
      return this.http.get(environment.endpoint + 'profile/account/promo/' + number)
	  .pipe(
	  	map((response: any) => {
			return response;
	   	}), catchError(val => throwError(val)));
  }	
	
		
}
