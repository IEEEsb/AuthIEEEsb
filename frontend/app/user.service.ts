import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, BehaviorSubject, throwError } from 'rxjs';
import { map, tap, delay, catchError } from 'rxjs/operators';

import { SHA256 } from 'crypto-js';

import { LoadingService, UtilsService } from 'angular-ieeesb-lib';

import { User } from '../../models/User';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	private user: User;
	private timeout = 250;

	private userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(this.user);
	private authRedirectSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

	constructor(private http: HttpClient, private loadingService: LoadingService, private utilsService: UtilsService) {

	}

	getLoggedUser() {
		this.getSelfUser().subscribe();
		return this.userSubject.asObservable();
	}

	getSelfUser() {
		this.loadingService.setLoading();
		return this.http.get<User>('api/user/self/')
		.pipe(
			delay(this.timeout),
			tap((user) => {
				this.user = user.user;
				this.user.token = user.token;
				this.userSubject.next(this.user);
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	getAllUsers() {
		this.loadingService.setLoading();
		return this.http.get<User>('api/user/all/')
		.pipe(
			delay(this.timeout),
			tap((user) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	getUser(userId) {
		this.loadingService.setLoading();
		return this.http.get<any>(`api/user/${userId}`)
		.pipe(
			tap((data) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	login(alias: String, password: String) {
		this.loadingService.setLoading();
		console.log(SHA256(password));
		return this.http.post<User>('api/user/login/', { alias, password: SHA256(password).toString() })
		.pipe(
			delay(this.timeout),
			tap((data) => {
				this.user = data.user;
				this.user.token = data.token
				this.userSubject.next(this.user);
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	logout() {
		this.loadingService.setLoading();
		return this.http.post('api/user/logout', {})
		.pipe(
			delay(this.timeout),
			tap(() => {
				this.user = null;
				this.userSubject.next(this.user);
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	addRole(userId, role) {
		this.loadingService.setLoading();
		return this.http.post<any>(`api/user/${userId}/addRole`, { role })
		.pipe(
			tap((data) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	enableUser(userId) {
		this.loadingService.setLoading();
		return this.http.post<any>(`api/user/${userId}/enable`, {})
		.pipe(
			tap((data) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	updateUser(user: User) {
		this.loadingService.setLoading();
		return this.http.patch<User>('api/user/self', { alias: user.alias, name: user.name, email: user.email, ieee: user.ieee })
		.pipe(
			delay(this.timeout),
			tap((user) => {
				this.user = user.user;
				this.userSubject.next(this.user);
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	register(_user: User) {
		this.loadingService.setLoading();
		let user: any = {};
		Object.assign(user, _user);
		user.password = SHA256(user.password).toString();
		return this.http.post<User>('api/user/register/', user)
		.pipe(
			delay(this.timeout),
			tap(() => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	getAuthRedirect() {
		return this.authRedirectSubject.asObservable();
	}

	setAuthRedirect(authRequired) {
		this.authRedirectSubject.next(authRequired);
	}
}
