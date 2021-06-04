import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule , ReactiveFormsModule} from '@angular/forms'
import { RegistroComponent } from './pages/registro/registro.component';
import { HomeComponent } from './shared/components/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import {AngularFireModule} from '@angular/fire'
import {AngularFirestore, AngularFirestoreModule} from '@angular/fire/firestore'
import { environment } from 'src/environments/environment';
import {HttpClientModule} from '@angular/common/http';
import { HeaderComponent } from './shared/components/header/header.component';
import { ListComponent } from './pages/heroes/list/list.component';
import { AddComponent } from './pages/heroes/add/add.component';
import { EditComponent } from './pages/heroes/edit/edit.component'
@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    ListComponent,
    AddComponent,
    EditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
