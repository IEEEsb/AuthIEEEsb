import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../user.service';

import { User } from '../../../models/User';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

	error = null;

	redirect = false;

	alias: String = "";
	password: String = "";

	constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) {
	}

	ngOnInit() {

		this.route.queryParams.subscribe(params => {
			if (params['callback'] && params['scope'] && params['service']) {
				this.redirect = true;
				console.log({
					callback: params['callback'],
					scope: params['scope'].split(","),
					service: params['service'],
				});
				this.userService.setAuthRedirect({
					callback: params['callback'],
					scope: params['scope'].split(","),
					service: params['service'],
				});
			}


		});

		this.userService.getUser().subscribe((user) => {
			if(user) {
				if(this.redirect) {
					this.router.navigate(['/grant']);
				} else {
					this.router.navigate(['/profile']);
				}
			}
		});
	}

	login() {
		this.userService.login(this.alias, this.password).subscribe(
			(data: User) => {
				this.error = null;
			},
			error => {
				this.error = error;
			}
		);
	}
}
