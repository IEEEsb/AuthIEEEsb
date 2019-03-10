import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ServiceService } from '../service.service';
import { UserService } from '../user.service';
import { UtilsService } from 'angular-ieeesb-lib';

import { Service } from '../../../models/Service';
import { User } from '../../../models/User';

@Component({
	selector: 'app-grant',
	templateUrl: './grant.component.html',
	styleUrls: ['./grant.component.less']
})
export class GrantComponent implements OnInit {

	service: Service = null;
	user: User = null;
	scope = [];
	error = null;

	constructor(private userService: UserService, private serviceService: ServiceService, private utilsService: UtilsService, private router: Router) {

	}

	ngOnInit() {
		this.utilsService.getParams().subscribe(params => {
			if(!params) {
				return;
			}
			if(params.callback) {
				this.utilsService.setRedirect('grant', params.callback);
			}
			if(!params.scope || !params.service) {
				this.error = "Parámetros inválidos";
				return;
			}
			let _scope = params.scope.split(",");
			this.serviceService.getService(params.service).subscribe(
				(service) => {
					service.scope = _scope.filter(scope => service.scope.indexOf(scope) >= 0);
					this.service = service;
					this.scope = service.scope.map(e => e);
					this.error = null;
				},
				(error) => {
					this.error = error;
				}
			);

			this.userService.getSelfUser().subscribe(
				(data) => {
					this.user = data.user;
				},
				(error) => {
					this.error = error;
					this.router.navigate(['/login']);
				}
			);
		});
	}

	userAlredyGranted() {
		if(!this.user.services) return;
		let userService = this.user.services.find(e => e.id == this.service._id);
		if (userService) {
			let result = true;
			for(let scope of this.service.scope) {
				if(!userService.scope.includes(scope)) {
					result = false;
					break;
				}
			}
			if(result) {
				this.scope = this.service.scope;
				this.grant();
			}
		}
	}

	grant() {
		this.serviceService.grantPermission(this.service._id, this.scope).subscribe(
			(data) => {
				const navigate = this.utilsService.redirect('grant', { scope: data.scope, token: data.token });
				if(navigate) {
					this.router.navigate(navigate);
				}
			},
			(error) => {
				this.error = error;
			}
		);
	}

	toggleScope(scope) {
		if(this.scope.indexOf(scope) == -1) {
			this.scope.push(scope);
		} else {
			this.scope.splice(this.scope.indexOf(scope), 1)
		}
	}

}
