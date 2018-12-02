import { Component } from '@angular/core';

import { LoadingService } from './loading.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.less']
})
export class AppComponent {
	loading = false;

	constructor(private loadingService: LoadingService) {
		loadingService.getLoading().subscribe((loading) => {
			this.loading = loading;
		});
	}
}
