import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, BehaviorSubject, throwError } from 'rxjs';
import { map, tap, delay, catchError } from 'rxjs/operators';

import { LoadingService } from './loading.service';

import { User } from '../../models/User';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	private user: User;
	private timeout = 250;

	private userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(this.user);

	constructor(private http: HttpClient, private loadingService: LoadingService) {

	}

	getUser() {
		return this.userSubject.asObservable();
	}

	login(alias: String, password: String) {
		this.loadingService.setLoading();
		return this.http.post<User>('api/login/', { alias, password })
		.pipe(
			delay(this.timeout),
			tap((user) => {
				this.user = user;
				this.userSubject.next(this.user);
				this.loadingService.unsetLoading();
			}),
			catchError(this.handleError.bind(this))
		);
	}

	register(alias: String, email: String, name: String, ieee: String, password: String) {
		this.loadingService.setLoading();
		return this.http.post<User>('api/register/', { alias, email, name, ieee, password })
		.pipe(
			delay(this.timeout),
			tap(() => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.handleError.bind(this))
		);
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
