import { Component, OnInit } from '@angular/core';

import { UserService } from '../user.service';

import { User } from '../../../models/User';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {

	user: User = {};
	error = null;

	constructor(private userService: UserService) {

	}

	ngOnInit() {
		this.userService.getLoggedUser().subscribe((user) => {
			if(user) {
				this.user = user;
			}
		});
	}

	updateUser() {

		this.userService.updateUser(this.user).subscribe(
			() => {
				this.error = null;
			},
			(error) => {
				this.error = error;
			}
		);
	}
}
