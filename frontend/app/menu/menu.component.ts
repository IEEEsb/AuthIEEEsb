import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { UserService } from '../user.service';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.less']
})
export class MenuComponent implements OnInit {

	@Input() items: any;
	@Input() align: String;

	activeLink = '';
	navbarOpen = false;
	user;

	constructor(private location: Location, private router: Router, private userService: UserService) {
		this.router.events.subscribe((val) => {
			this.activeLink = this.location.path() === '' ? '/' : this.location.path();
		});
	}

	ngOnInit() {
		this.userService.getUser().subscribe((user) => {
			this.user = user;
		})
	}


	toggleNavbar() {
		this.navbarOpen = !this.navbarOpen;
	}

	userHasRoles(roles) {
		if (!this.user) return false;

		return roles.reduce((l, a) => this.user.roles.indexOf(a) >= 0 && l, true);
	}
}
