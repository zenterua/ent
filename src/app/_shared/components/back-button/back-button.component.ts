import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'back-button',
  templateUrl: './back-button.component.html'
})
export class BackButtonComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }
    
  goBack(){
     this.location.back();
  }    

}
