import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, BehaviorSubject, throwError } from 'rxjs';
import { map, tap, delay, catchError } from 'rxjs/operators';

import { SHA256 } from 'crypto-js';

import { LoadingService } from './loading.service';

import { User } from '../../models/User';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	private user: User;
	private timeout = 250;

	private userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(this.user);
	private authRedirectSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

	constructor(private http: HttpClient, private loadingService: LoadingService) {

	}

	getUser() {
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
			catchError(this.handleError.bind(this))
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
			catchError(this.handleError.bind(this))
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
			catchError(this.handleError.bind(this))
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
			catchError(this.handleError.bind(this))
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
			catchError(this.handleError.bind(this))
		);
	}

	getAuthRedirect() {
		return this.authRedirectSubject.asObservable();
	}

	setAuthRedirect(authRequired) {
		this.authRedirectSubject.next(authRequired);
	}

	private handleError(error: HttpErrorResponse) {

		this.loadingService.unsetLoading();
		let errorText;
		if (error.error instanceof ProgressEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error('An error occurred:', error.message);
			errorText = 'Error en la red';
		} else {
			console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);

			switch (error.error.code) {
				case 'wrong_user_pass':
				errorText = 'Usuario/Contraseña incorrectos';
				break;

				case 'duplicate_key':
				errorText = `Parámetro ${error.error.key} duplicado`;
				break;

				case 'invalid_parameters':
				errorText = `Parámetro ${error.error.violations[0].context.key} inválido`;
				break;

				default:
				errorText = 'Error desconocido';
				break;
			}
		}
		// return an observable with a user-facing error message
		return throwError(errorText);
	}
}
