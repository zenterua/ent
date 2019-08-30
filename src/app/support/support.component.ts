import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html'
})
export class SupportComponent implements OnInit {
  tab: any = 1;
  step: any = -1;
  constructor() { }

  ngOnInit() {
  }

  isSet(tabNum) {
    return this.tab === tabNum;
  }

  setTab(newTab) {
    this.tab = newTab;
  }

  setStepTrff(index: number) {
    this.step = index;
  }

}
