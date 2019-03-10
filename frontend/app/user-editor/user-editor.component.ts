import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../user.service';

import { User } from '../../../models/User';

@Component({
	selector: 'app-user-editor',
	templateUrl: './user-editor.component.html',
	styleUrls: ['./user-editor.component.less']
})
export class UserEditorComponent implements OnInit {

	user: User = {};
	error;
	role = '';

	constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['userId']) {
				this.userService.getUser(params['userId']).subscribe(
					(data) => {
						this.user = data.user;
						this.error = null;
					},
					(error) => {
						this.error = error;
					}
				);
			}
		});
	}

	addRole() {
		if(!confirm(`¿Seguro que quieres introducir este rol: ${this.role}?`)) return;
		this.userService.addRole(this.user._id, this.role).subscribe(
			(data) => {
				this.user = data.user;
				this.error = null;
			},
			(error) => {
				this.error = error;
			}
		)
	}

	enableUser() {
		if(!confirm(`¿Seguro que quieres habilitar este usuario?`)) return;
		this.userService.enableUser(this.user._id).subscribe(
			(data) => {
				this.user = data.user;
				this.error = null;
			},
			(error) => {
				this.error = error;
			}
		)
	}


}
