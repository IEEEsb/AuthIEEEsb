import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

function objectToQuerystring (params) {
	return '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
}

@Injectable({
	providedIn: 'root'
})
export class UtilsService {

	redirectParams: any;
	private paramsSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

	constructor(private route: ActivatedRoute, private router: Router) {
		route.queryParams.subscribe(params => {
			if (Object.keys(params).length > 0) this.setParams(params);
		});
	}

	setRedirect(on, callback) {
		if(this.redirectParams) return;
		this.redirectParams = { on, callback };
	}

	getRedirect() {
		return this.redirectParams;
	}

	redirect(on, params, navigate) {
		if(this.redirectParams){
			if (this.redirectParams && this.redirectParams.on === on) {
				return window.location.replace(`${this.redirectParams.callback}${objectToQuerystring(params)}`);
			}
			return this.router.navigate([`/${this.redirectParams.on}`]);
		}
		if(navigate){
			return this.router.navigate(navigate);
		}

	}

	setParams(params) {
		this.paramsSubject.next(params);
	}

	getParams() {
		return this.paramsSubject.asObservable();
	}
}
