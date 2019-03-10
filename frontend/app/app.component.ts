import { Component, AfterViewInit } from '@angular/core';

import { LoadingService } from 'angular-ieeesb-lib';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.less']
})
export class AppComponent implements AfterViewInit {

	loading = false;

	constructor(private loadingService: LoadingService) {

	}

	ngAfterViewInit() {
		this.loading = false;
		this.loadingService.getLoading().subscribe((loading) => {
			this.loading = loading;
		});
	}
}
