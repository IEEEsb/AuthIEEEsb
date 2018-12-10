import { Component, OnInit } from '@angular/core';

import { ServiceService } from '../service.service';
import { UserService } from '../user.service';

import { Service } from '../../../models/Service';
import { User } from '../../../models/User';

@Component({
	selector: 'app-grant',
	templateUrl: './grant.component.html',
	styleUrls: ['./grant.component.less']
})
export class GrantComponent implements OnInit {

	authRedirect;
	service: Service = null;
	user: User = null;
	scope = [];
	error = null;

	constructor(private userService: UserService, private serviceService: ServiceService) {

	}

	ngOnInit() {
		this.userService.getAuthRedirect().subscribe(authRedirect => {
			if(authRedirect) {
				this.serviceService.getService(authRedirect.service).subscribe(
					(service) => {
						console.log("service");
						console.log(authRedirect);
						console.log(service);
						this.authRedirect = authRedirect;
						service.scope = authRedirect.scope.filter(scope => service.scope.indexOf(scope) >= 0);
						this.service = service;
						this.scope = service.scope.map(e => e);
						this.error = null;
						/*if(this.user) {
							this.userAlredyGranted();
						}*/
					},
					(error) => {
						this.error = error;
					}
				);

				/*this.userService.getUser().subscribe(
					(user) => {
						if(user) {
							console.log("user")
							this.user = user;
							if(this.service) {
								console.log(this.user);
								this.userAlredyGranted();
							}
						}
					},
					(error) => {
						this.error = error;
					}
				);*/
			}
		});
	}

	userAlredyGranted() {
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
		console.log(this.service);
		this.serviceService.grantPermission(this.service._id, this.scope).subscribe(
			(code) => {
				console.log(this.authRedirect.callback + `?code=${code.code}`);
				window.location.replace(`${this.authRedirect.callback}?code=${code.code}`);
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
