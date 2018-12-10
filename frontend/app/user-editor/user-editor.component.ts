import { Component, OnInit } from '@angular/core';

import { UserService } from '../user.service';

import { User } from '../../../models/User';

@Component({
	selector: 'app-user-editor',
	templateUrl: './user-editor.component.html',
	styleUrls: ['./user-editor.component.less']
})
export class UserEditorComponent implements OnInit {

	user: User = {};
	error = null;

	constructor(private userService: UserService) {

	}

	ngOnInit() {
		this.userService.getUser().subscribe((user) => {
			if(user) {
				this.user = user;
			} else {
				this.user = {}
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
