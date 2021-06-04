import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { UsuarioModel } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import auth from 'firebase/app'
import {AngularFireAuth} from '@angular/fire/auth'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //Declarar un usuario observable y una colección
  usuarios : Observable<UsuarioModel[]>;
  private usuarioCollection : AngularFirestoreCollection<UsuarioModel>;

  //Datos de firebase url y apikey
  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private apikey = 'AIzaSyCFl51vGCcBEMBE415THGTiBiicB_t3waQ';

  //Token de usuario
  userToken : string ='';

  //Constructor
  constructor(private readonly afs : AngularFirestore,
              private http: HttpClient,
              public afauth : AngularFireAuth  ) {
    this.usuarioCollection = afs.collection<UsuarioModel>('usuarios')
  }


  //Iniciar sesión del usuario
  iniciarSesion(usuario : UsuarioModel){
    const authData  = {
      email: usuario.email,
      password : usuario.password,
      returnSecureToken : true
    }
    return this.http.post(
      `${this.url}signInWithPassword?key=${this.apikey}` , authData
    ).pipe(
      map((resp : any) => {
        this.guardarToken(resp['idToken'])
        return resp;
      })
    );
  }

  //Registrar un nuevo usuario en firebase
  //Registra en el auth service
  nuevoUsuario(usuario : UsuarioModel){
    const authData  = {
      email: usuario.email,
      password : usuario.password,
      nombre : usuario.nombre,
      returnSecureToken : true
    }

    return this.http.post(
      `${this.url}signUp?key=${this.apikey}` , authData
    ).pipe(
      map((resp : any) => {
        this.guardarToken(resp['idToken'])
        return resp;
      })
    );
  }

  //Cerrar Sesión
  ceerarSesion(){
    localStorage.removeItem('token')
  }


  //Guardar token de la sesión
  private guardarToken(idToken : string){
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    hoy.setSeconds(3600);

    localStorage.setItem('expira', hoy.getTime().toString());
  }

  //Registra en una colección los datos del usuario para crearle un perfil de usuario
  onRegister(usuario : UsuarioModel, usuarioId : string): Promise<void>{
    return new Promise(async(resolve , reject) =>{
      try{
        const id = usuarioId;
        const authData  = {
          id : usuarioId,
          email : usuario.email,
          password : usuario.password,
          nombre : usuario.nombre
          }

        const result = await this.usuarioCollection.doc(id).set(authData);
          resolve(result);
      }catch(error){
          reject(error.message)
      }
    });
  }

  leerToken(){
    if (localStorage.getItem('token')){
      this.userToken = localStorage.getItem('token');
    }else{
      this.userToken = '';
    }
    return this.userToken;
  }

  estaAutenticado() : boolean {
      return this.userToken.length > 2;
  }
}

