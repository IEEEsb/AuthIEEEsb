import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from './user.service';
import { UtilsService } from 'angular-ieeesb-lib';

const config = require('../../config.json');

@Injectable({
	providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

	constructor(private userService: UserService, private utilsService: UtilsService, private router: Router) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		return new Promise((resolve, reject) => {
			this.userService.getSelfUser().subscribe(
				(user) => resolve(true),
				(e) => {
					console.log('guard')
					this.router.navigate(["/"]);
				}
			);
		});
	}
}
