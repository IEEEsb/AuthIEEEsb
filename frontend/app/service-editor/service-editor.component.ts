import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ServiceService } from '../service.service';

import { Service } from '../../../models/Service';

@Component({
	selector: 'app-service-editor',
	templateUrl: './service-editor.component.html',
	styleUrls: ['./service-editor.component.less']
})
export class ServiceEditorComponent implements OnInit {

	editing = false;
	service: Service = {};

	error = null;

	constructor(private serviceService: ServiceService, private router: Router, private route: ActivatedRoute) {
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			if (params['serviceId']) {
				this.editing = true;
				this.serviceService.getSelfService(params['serviceId']).subscribe(
					(service) => {
						this.service = service;
						this.error = null;
					},
					(error) => {
						this.error = error;
					}
				);
			} else {
				this.editing = false;
			}
		});
	}

	addScope(scope) {
		if(!this.service.scope) {
			this.service.scope = [];
		}

		if(this.service.scope.indexOf(scope) == -1) {
			this.service.scope.push(scope);
		}
	}

	removeScope(scope) {
		this.service.scope.splice(this.service.scope.indexOf(scope), 1)
	}

	addService() {
		this.serviceService.addService(this.service).subscribe(
			(service) => {
				this.router.navigate(['/profile/services/edit/' + service._id]);
				this.error = null;
			},
			error => {
				this.error = error;
			}
		);
	}

	updateService() {
		this.serviceService.updateService(this.service).subscribe(
			() => {
				this.router.navigate(['/profile/services/edit/' + this.service._id]);
				this.error = null;
			},
			error => {
				this.error = error;
			}
		);
	}

	removeService() {
		if(confirm("¿Seguro que quieres borrar el servicio?")) {
			this.serviceService.removeService(this.service._id).subscribe(
				() => {
					this.router.navigate(['/profile/services/']);
					this.error = null;
				},
				error => {
					this.error = error;
				}
			);
		}
	}

}
