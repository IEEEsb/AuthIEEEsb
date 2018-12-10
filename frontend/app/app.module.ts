import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserService } from './user.service';
import { LoadingService } from './loading.service';
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
		ScopePipe
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		NgbModule
	],
	providers: [
		UserService,
		LoadingService,
		ServiceService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
