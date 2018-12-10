import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, BehaviorSubject, throwError } from 'rxjs';
import { map, tap, delay, catchError } from 'rxjs/operators';

import { LoadingService } from './loading.service';

import { Service } from '../../models/Service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

	private services: Service[] = [];
	private timeout = 250;

	private servicesSubject: BehaviorSubject<Service> = new BehaviorSubject<Service>(this.services);

	constructor(private http: HttpClient, private loadingService: LoadingService) {

	}

	getServices() {
		this.getSelfServices().subscribe();
		return this.servicesSubject.asObservable();
	}

	getSelfServices() {
		this.loadingService.setLoading();
		return this.http.get<Service[]>('api/service/all/')
		.pipe(
			delay(this.timeout),
			tap((services) => {
				this.services = services;
				this.servicesSubject.next(this.services);
				this.loadingService.unsetLoading();
			}),
			catchError(this.handleError.bind(this))
		);
	}

	getSelfService(serviceId: String) {
		this.loadingService.setLoading();
		return this.http.get<Service>('api/service/self/' + serviceId)
		.pipe(
			delay(this.timeout),
			tap((service) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.handleError.bind(this))
		);
	}

	getService(serviceId: String) {
		this.loadingService.setLoading();
		return this.http.get<Service>('api/service/' + serviceId)
		.pipe(
			delay(this.timeout),
			tap((service) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.handleError.bind(this))
		);
	}

	addService(service: Service) {
		this.loadingService.setLoading();
		return this.http.post<Service>('api/service', service)
		.pipe(
			delay(this.timeout),
			tap((service) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.handleError.bind(this))
		);
	}

	updateService(service: Service) {
		this.loadingService.setLoading();
		return this.http.patch('api/service/' + service._id, { name: service.name, scope: service.scope })
		.pipe(
			delay(this.timeout),
			tap(() => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.handleError.bind(this))
		);
	}

	removeService(serviceId) {
		this.loadingService.setLoading();
		return this.http.delete('api/service/' + serviceId)
		.pipe(
			delay(this.timeout),
			tap(() => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.handleError.bind(this))
		);
	}

	grantPermission(serviceId: String, scope: String[]) {
		console.log("id:", serviceId, " scope: ", scope)
		this.loadingService.setLoading();
		return this.http.post<any>('api/service/' + serviceId + '/grant', { scope: scope })
		.pipe(
			delay(this.timeout),
			tap((code) => {
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

			console.log(error.error)
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
