import { Component, OnInit } from '@angular/core';

import { UserService } from '../user.service';

import { User } from '../../../models/User';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

	error = null;

	alias: String = "";
	password: String = "";

	constructor(private userService: UserService) {
		userService.getUser().subscribe((user) => {

		});
	}

	ngOnInit() {
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
