import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioModel } from 'src/app/models/usuario.model';
import {AuthService} from '../../services/auth.service'

import Swal from 'sweetalert2'

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  //Usuario es el modelo
  usuario: UsuarioModel;

  //Variable del formulario
  usuarioForm !: FormGroup;


  constructor(  private fb : FormBuilder,
                private auth : AuthService) {this.initForm() }

  ngOnInit() {
  }


  onRegister(){
    if (this.usuarioForm.valid){
      const usuario = this.usuarioForm.value;
      console.log(usuario)
      this.auth.nuevoUsuario(usuario)
        .subscribe(resp => {
          this.auth.onRegister(usuario, resp.idToken)
          console.log(this.usuario)
          this.usuarioForm.reset();
          this.mensaje_ok('Usuario registrado', 'Se creó correctamente', 'success')
        },error =>{
          this.mensaje_ok('Error Crear usuario', error.error.error.message, 'error')
      });
    }else{
      this.mensaje_ok('Usuario error', 'No se puede crear al usuario, faltan datos', 'error')
    }
  }

  //Mensajes

  mensaje(titulo : string , mensaje : string , icono : any){
    Swal.fire({
      title : titulo,
      text  : mensaje,
      icon  : icono,
      allowOutsideClick : false
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
      nombre      :     ['',[Validators.required]],
      email     :       ['',[Validators.required]],
      password  :       ['',[Validators.required]],
    })
  }

  //Validador de campos vacíos
  isValidField(field: string): string {
    const validatedField = this.usuarioForm.get(field);
    return (!validatedField.valid && validatedField.touched)
      ? 'is-invalid' : validatedField.touched ? 'is-valid' : '';
  }

}
