import { Component, OnInit } from '@angular/core';

import { ServiceService } from '../service.service';

import { Service } from '../../../models/Service';

@Component({
	selector: 'app-services',
	templateUrl: './services.component.html',
	styleUrls: ['./services.component.less']
})
export class ServicesComponent implements OnInit {

	services: Service[] = [];
	
	constructor(private serviceService: ServiceService) {

	}

	ngOnInit() {
		this.serviceService.getServices().subscribe((services) => {
			this.services = services;
		});
	}

}
