import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'card-detail-type',
  templateUrl: './card-detail-type.component.html'
})
export class CardDetailTypeComponent implements OnInit {
  @Input() type:string;
	
  constructor() { }

  ngOnInit() {
	 
  }

}
