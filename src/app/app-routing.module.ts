import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './shared/components/home/home.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { ListComponent } from './pages/heroes/list/list.component';
import { AddComponent } from './pages/heroes/add/add.component';
import { EditComponent } from './pages/heroes/edit/edit.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'home'    , component: HomeComponent , canActivate : [AuthGuard]},
  { path: 'registro', component: RegistroComponent  },
  { path: 'login'   , component: LoginComponent  },
  { path: 'list'   , component: ListComponent , canActivate : [AuthGuard]},
  { path: 'add'   , component: AddComponent , canActivate : [AuthGuard]},
  { path: 'edit'   , component: EditComponent , canActivate : [AuthGuard]},
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
