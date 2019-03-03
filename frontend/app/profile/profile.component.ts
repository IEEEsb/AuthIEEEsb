import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../user.service';

import { User } from '../../../models/User';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {

	menuItems = {
		left: [
			{
				text: 'Datos Personales',
				type: 'router', // router, link or callback
				link: '/profile/user',
				roles: [],
			},
			{
				text: 'Servicios',
				type: 'router', // router, link or callback
				link: '/profile/services',
				roles: [],
			},
			{
				text: 'Logout',
				type: 'callback',
				callback: this.logout.bind(this),
				roles: [],
			}
		],
		right: []
	};

	constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) {
	}

	ngOnInit() {
	}

	logout() {
		this.userService.logout().subscribe(
			() => {
				this.router.navigate(['/login']);
			},
			(error) => {
			}
		);
	}
}
