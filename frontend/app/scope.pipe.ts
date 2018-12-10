import { Pipe, PipeTransform } from '@angular/core';

const scopeMap = {
	alias: "Tu alias",
	email: "Tu e-mail",
	name: "Tu nombre y apellidos",
	ieee: "Tu número del IEEE",
}

@Pipe({
	name: 'scope'
})
export class ScopePipe implements PipeTransform {

	transform(value: any, args?: any): any {
		return scopeMap[value];
	}

}
