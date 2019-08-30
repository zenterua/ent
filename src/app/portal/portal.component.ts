import {Component, OnInit, OnDestroy, LOCALE_ID, Inject, ViewChild} from '@angular/core';
import {animationPopup, routerAnimation} from '../_shared/animations';
import { Subscription } from 'rxjs';
import { trigger } from '@angular/animations';
import { RouterUrlService } from '../_shared/services/router.url.service';

@Component({
    selector: 'app-portal',
    templateUrl: './portal.component.html',
    animations: [
        trigger('routerAnimation', routerAnimation),
         trigger('animationPopup', animationPopup)
    ]
})
export class PortalComponent implements OnInit, OnDestroy {
    routerUrlSubscription: Subscription;
    routerUrl: string;
    videoInterval: any;
    routerCallbackSubscription: Subscription;
    frenchPopupOpened: boolean;
    languages = [
        { 'code': 'en-US', 'text': 'EN', 'url': '' },
        { 'code': 'fr', 'text': 'FR', 'url': '' }
    ];
    @ViewChild('bgvid') bgvid;

    constructor(private routerUrlService: RouterUrlService, @Inject(LOCALE_ID) public localeId: string) { }
    ngOnInit() {
        this.routerCallbackSubscription = this.routerUrlService.routerCallback.subscribe((value) => {
            this.languages[0].url = window.location.href.replace('/fr/', '/en/');
            this.languages[1].url = window.location.href.replace('/en/', '/fr/');
        });
        this.routerUrlSubscription = this.routerUrlService.getRouterUrl().subscribe(value => {
            this.routerUrl = value;
        });
      this.videoInterval = setInterval(() => {
        if (  this.bgvid.nativeElement.readyState === 4 ) {
          this.bgvid.nativeElement.play();
          clearInterval(this.videoInterval);
        }

      }, 500);
    }

  ngOnDestroy() {
        if (this.routerUrlSubscription) { this.routerUrlSubscription.unsubscribe(); }
        if (this.routerCallbackSubscription) { this.routerCallbackSubscription.unsubscribe(); }
    }

    getRouteAnimation(outlet) {
        return outlet.activatedRouteData.animation
    }

}
