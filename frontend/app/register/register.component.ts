import { Component, OnInit } from '@angular/core';

import { UserService } from '../user.service';

import { User } from '../../../models/User';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {

	error = null;

	alias: String = "";
	email: String = "";
	name: String = "";
	ieee: String = "";
	password: String = "";

	constructor(private userService: UserService) { }

	ngOnInit() {
	}

	register() {
		this.userService.register(this.alias, this.email, this.name, this.ieee, this.password).subscribe(
			() => {
				this.error = null;
			},
			error => {
				this.error = error;
			}
		);
	}

}
