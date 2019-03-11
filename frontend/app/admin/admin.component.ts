import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { UserService } from '../user.service';

const config = require('../../../config.json');

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.less']
})
export class AdminComponent implements OnInit {

	menuItems = {
		logo: {
			type: 'router',
			link: '/',
		},
		left: [
			{
				text: 'Usuarios',
				type: 'router', // router, link or callback
				link: '/admin/users',
				roles: [config.adminRole],
			},
		],
		right: []
	};

	user;
	activeLink = "";

	constructor(private userService: UserService, private router: Router, private location: Location) {
		this.router.events.subscribe((val) => {
			this.activeLink = this.location.path() === '' ? '/' : this.location.path();
		});
	}

	ngOnInit() {
		this.userService.getLoggedUser().subscribe((user) => {
			this.user = user;
		});
	}

}
