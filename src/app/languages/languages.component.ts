import { Component, OnInit, LOCALE_ID, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RouterUrlService } from '../_shared/services/router.url.service';

@Component({
    selector: 'app-languages',
    templateUrl: './languages.component.html'
})
export class LanguagesComponent implements OnInit, OnDestroy {
    routerCallbackSubscription: Subscription;
    languages = [
        {'code': 'en-US', 'text': 'EN', 'url': ''},
        {'code': 'fr', 'text': 'FR', 'url': ''}
    ];
    constructor(@Inject(LOCALE_ID) protected localeId: string, private routerUrlService: RouterUrlService) { }

    ngOnInit() {
		
        this.routerCallbackSubscription = this.routerUrlService.routerCallback.subscribe((value) => {
            this.languages[0].url = window.location.href.replace('/fr/', '/en/');
            this.languages[1].url = window.location.href.replace('/en/', '/fr/');
        });
    }

    ngOnDestroy() {
        this.routerCallbackSubscription.unsubscribe();
    }

}
