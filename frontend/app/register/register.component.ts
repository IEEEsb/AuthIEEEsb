import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../user.service';

import { User } from '../../../models/User';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {

	error = null;

	user: User = {};

	constructor(private userService: UserService, private router: Router) { }

	ngOnInit() {
	}

	register() {
		this.userService.register(this.user).subscribe(
			() => {
				this.router.navigate(['/login']);
				this.error = null;
			},
			error => {
				this.error = error;
			}
		);
	}

}
