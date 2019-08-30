import { Injectable } from "@angular/core";
import { AsyncValidator, AbstractControl, ValidationErrors } from "@angular/forms";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class UniquUserValidator implements AsyncValidator {
    constructor(private httpClient: HttpClient) { }

    validate(
        ctrl: AbstractControl
    ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        return (this.httpClient.post(environment.endpoint + 'auth/check-email/1', { 'email': ctrl.value }, { responseType: 'json' })
            .pipe(
                map((response:any) => (response.error) ? { uniqueEmail: true, code: response.errorCode } : null),
                catchError(() => of({ uniqueEmail: true }))
            )
        )
    }
}