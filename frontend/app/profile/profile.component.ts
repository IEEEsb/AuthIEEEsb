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

	constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) {
	}

	ngOnInit() {
		console.log(this.route);
		setTimeout(() => console.log(this.route), 2000);
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
