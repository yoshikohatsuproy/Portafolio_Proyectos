import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioModel } from 'src/app/models/usuario.model';
import {AuthService} from '../../services/auth.service'

import Swal from 'sweetalert2'
import {  Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  //Usuario es el modelo
  usuario: UsuarioModel;

  //Variable del formulario
  usuarioForm !: FormGroup;

  constructor(  private router : Router,
                private fb : FormBuilder,
                private auth : AuthService) {this.initForm() }

  ngOnInit() {
  }

  onLogin(){
    if(this.usuarioForm.valid){
      const usuario = this.usuarioForm.value;
      console.log(usuario)
      this.auth.iniciarSesion(usuario)
        .subscribe((resp: any) => {
          this.usuarioForm.reset();
          console.log(resp.idToken)
          this.mensaje_ok('Éxito iniciar sesión',`Bienvenido ${usuario.email}`, 'success')
          this.router.navigate(['home'])
        },error =>{
          this.mensaje_ok('Error al iniciar sesión', error.error.error.message, 'error')
      });
    }else{
      this.mensaje_ok('Usuario error', 'No se puede acceder al sistema', 'error')
    }
  }


  //Mensajes
  mensaje(titulo : string , mensaje : string , icono : any){
    Swal.fire({
      title : titulo,
      text  : mensaje,
      icon  : icono,
      allowOutsideClick : false,
      timer: 2000
    });
  }

  mensaje_ok(titulo : string , mensaje : string , icono : any){
    Swal.fire({
      title : titulo,
      text  : mensaje,
      icon  : icono,
    });
  }

  //Validaciones del formulario
  private initForm(): void{
    this.usuarioForm = this.fb.group({
      email     :       ['',[Validators.required]],
      password  :       ['',[Validators.required]],
    })
  }

  isValidField(field: string): string {
    const validatedField = this.usuarioForm.get(field);
    return (!validatedField.valid && validatedField.touched)
      ? 'is-invalid' : validatedField.touched ? 'is-valid' : '';
  }
  onLoginFacebook(){
    console.log('login with fb')
  }
  onLoginTwitter(){
    console.log('login with twiter')
  }

}
