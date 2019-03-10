import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, BehaviorSubject, throwError } from 'rxjs';
import { map, tap, delay, catchError } from 'rxjs/operators';

import { LoadingService, UtilsService } from 'angular-ieeesb-lib';

import { Service } from '../../models/Service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

	private services: Service[] = [];
	private timeout = 250;

	private servicesSubject: BehaviorSubject<Service> = new BehaviorSubject<Service>(this.services);

	constructor(private http: HttpClient, private loadingService: LoadingService, private utilsService: UtilsService) {

	}

	getServices() {
		this.getSelfServices().subscribe();
		return this.servicesSubject.asObservable();
	}

	getSelfServices() {
		this.loadingService.setLoading();
		return this.http.get<Service[]>('api/user/service/all/')
		.pipe(
			delay(this.timeout),
			tap((services) => {
				this.services = services;
				this.servicesSubject.next(this.services);
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	getSelfService(serviceId: String) {
		this.loadingService.setLoading();
		return this.http.get<Service>('api/user/service/self/' + serviceId)
		.pipe(
			delay(this.timeout),
			tap((service) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	getService(serviceId: String) {
		this.loadingService.setLoading();
		return this.http.get<Service>('api/user/service/' + serviceId)
		.pipe(
			delay(this.timeout),
			tap((service) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	addService(service: Service) {
		this.loadingService.setLoading();
		return this.http.post<Service>('api/user/service', service)
		.pipe(
			delay(this.timeout),
			tap((service) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	updateService(service: Service) {
		this.loadingService.setLoading();
		return this.http.patch('api/user/service/' + service._id, { name: service.name, scope: service.scope })
		.pipe(
			delay(this.timeout),
			tap(() => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	removeService(serviceId) {
		this.loadingService.setLoading();
		return this.http.delete('api/user/service/' + serviceId)
		.pipe(
			delay(this.timeout),
			tap(() => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}

	grantPermission(serviceId: String, scope: String[]) {
		this.loadingService.setLoading();
		return this.http.post<any>('api/user/service/' + serviceId + '/grant', { scope: scope })
		.pipe(
			delay(this.timeout),
			tap((scope) => {
				this.loadingService.unsetLoading();
			}),
			catchError(this.utilsService.handleError.bind(this))
		);
	}
}
