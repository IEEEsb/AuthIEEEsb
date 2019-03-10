import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AngularIEEEsbLibModule } from 'angular-ieeesb-lib';

import { UserService } from './user.service';
import { ServiceService } from './service.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { UserEditorComponent } from './user-editor/user-editor.component';
import { ServicesComponent } from './services/services.component';
import { ServiceEditorComponent } from './service-editor/service-editor.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { GrantComponent } from './grant/grant.component';
import { ScopePipe } from './scope.pipe';
import { MainComponent } from './main/main.component';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { UsersEditorComponent } from './users-editor/users-editor.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		RegisterComponent,
		ProfileComponent,
		UserEditorComponent,
		ServicesComponent,
		ServiceEditorComponent,
		GrantComponent,
		ScopePipe,
		MainComponent,
		AdminComponent,
		HomeComponent,
		UsersEditorComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		AngularIEEEsbLibModule.forRoot(),
		NgbModule
	],
	providers: [
		UserService,
		ServiceService,
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
