import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { UserEditorComponent } from './user-editor/user-editor.component';
import { ServicesComponent } from './services/services.component';
import { ServiceEditorComponent } from './service-editor/service-editor.component';
import { GrantComponent } from './grant/grant.component';

const routes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'grant', component: GrantComponent },
	{
		path: 'profile', component: ProfileComponent,
		children: [
			{ path: '', redirectTo: 'user', pathMatch: 'full' },
			{ path: 'user', component: UserEditorComponent },
			{ path: 'services', component: ServicesComponent },
			{ path: 'services/edit', component: ServiceEditorComponent },
			{ path: 'services/edit/:serviceId', component: ServiceEditorComponent },
		]
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: false })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
