import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { UserService } from '../user.service';

const config = require('../../../config.json');

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.less']
})
export class MainComponent implements OnInit {

	menuItems = {
		left: [
			{
				text: 'Servicios',
				type: 'router',
				link: '/service',
				roles: [],
			}
		],
		right: [
			{
				text: 'Login',
				type: 'router',
				link: '/login',
			},
			{
				text: 'Perfil',
				type: 'router',
				link: '/profile',
				roles: [],
			},
			{
				text: 'Administrar',
				type: 'router',
				link: '/admin/users',
				roles: [config.adminRole],
			},
			{
				text: 'Logout',
				type: 'callback',
				callback: this.logout.bind(this),
				roles: [],
			}
		]
	}

	user;
	activeLink = '';
	
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



	logout() {
		this.userService.logout().subscribe(() => {
			console.log('main logout')
			this.router.navigate(['/']);
		});
	}

}
