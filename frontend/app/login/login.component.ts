import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../user.service';
import { UtilsService } from '../utils.service';

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

	user: User;

	constructor(private userService: UserService, private utilsService: UtilsService, private router: Router, private route: ActivatedRoute) {
	}

	ngOnInit() {

		this.utilsService.getParams().subscribe(params => {
			if(!params) {
				return;
			}
			if(params.callback) {
				this.redirect = true;
				if(params.service && params.scope) {
					return this.utilsService.setRedirect('grant', params.callback);
				}
			}
		});

		this.userService.getUser().subscribe((user) => {
			this.user = user;
		});
	}

	login() {
		this.userService.login(this.alias, this.password).subscribe(
			(data) => {
				this.continue();
				this.error = null;
			},
			error => {
				this.error = error;
			}
		);
	}

	logout() {
		this.userService.logout().subscribe(
			(data) => {
				this.error = null;
			},
			error => {
				this.error = error;
			}
		);
	}

	continue() {
		return this.utilsService.redirect('login', { token: this.user.token }, ['/profile']);
	}
}
