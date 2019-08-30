import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';

@Component({
	selector: 'app-snack-bar',
	templateUrl: './snack-bar.component.html',
	styleUrls: ['./snack-bar.component.scss']
})
export class SnackBarComponent implements OnInit {
	constructor(private snackBar: MatSnackBar) { }
	ngOnInit() {
	}
	openSnackBar(snackMessage) {
		this.snackBar.open(snackMessage, null, {
			duration: 3000
		});
	}

}
