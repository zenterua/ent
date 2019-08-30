import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class RouterUrlService {

    private routerUrl: string = "";
    routerCallback = new BehaviorSubject<string>('');

    setRouterUrl(text) {
        console.log('%cROUTER: ' + text, 'color: green');
        this.routerUrl = text;
        this.routerCallback.next(this.routerUrl);
    }

    getRouterUrl() {
        return this.routerCallback;
    }
}