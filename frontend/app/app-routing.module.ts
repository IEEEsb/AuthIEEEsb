import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoggedInGuard } from './guards.guard'

import { MainComponent } from './main/main.component'
import { AdminComponent } from './admin/admin.component'
import { HomeComponent } from './home/home.component'
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { UsersEditorComponent } from './users-editor/users-editor.component'
import { UserEditorComponent } from './user-editor/user-editor.component';
import { ServicesComponent } from './services/services.component';
import { ServiceEditorComponent } from './service-editor/service-editor.component';
import { GrantComponent } from './grant/grant.component';

const routes: Routes = [
	{
		path: '', component: MainComponent, children: [
			{ path: '', component: HomeComponent },
			{ path: 'login', component: LoginComponent },
			{ path: 'register', component: RegisterComponent },
			{ path: 'grant', component: GrantComponent },
			{ path: 'profile', component: ProfileComponent },
			{ path: 'service', component: ServicesComponent },
			{ path: 'services/add', component: ServiceEditorComponent },
			{ path: 'services/:serviceId', component: ServiceEditorComponent },
		]
	},
	{
		path: 'admin', component: AdminComponent, canActivate:[LoggedInGuard], children: [
			{ path: '', component: HomeComponent },
			{ path: 'users', component: UsersEditorComponent },
			{ path: 'users/:userId', component: UserEditorComponent },
		]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: false })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
