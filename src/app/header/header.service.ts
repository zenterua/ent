import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class HeaderService {
    headerOpened = new BehaviorSubject<boolean>(true);
}