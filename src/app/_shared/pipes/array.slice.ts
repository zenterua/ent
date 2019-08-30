import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; 
@Pipe({
  name: 'contain'
})
export class ContainPipe implements PipeTransform { 
	constructor(private _sanitizer: DomSanitizer) { }
	
  transform(items: any[], num: number): any {
	  let residual = 0;
	  let spliceArr = [];
	  if (items.length > num){
		  residual = items.length - num;
		  spliceArr = [...items.splice(0, num)];
		  let termsApply = spliceArr.toString() + ' <span class="text sm grey">( +' + residual + ' other)</span>'
		  return termsApply;
	  }else{
		  return items;
	  }
	  
    }
}