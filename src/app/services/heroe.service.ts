import { Injectable } from '@angular/core';
import { AngularFirestoreCollection ,AngularFirestore} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Heroe } from '../models/heroe.models';
import { delay , map } from 'rxjs/operators';


import {AngularFireStorage} from '@angular/fire/storage'
import firebase from 'firebase/app'
import 'firebase/storage'

@Injectable({
  providedIn: 'root'
})
export class HeroeService {

  heroes : Observable<Heroe[]>;
  private heroesCollection : AngularFirestoreCollection<Heroe>;

  constructor(private readonly afs : AngularFirestore , private storage : AngularFireStorage ) {
  this.heroesCollection = afs.collection<Heroe>('heroes');
  this.getHeroes();
  }

  //Obtener lista de héroes
  private getHeroes()  {
    this.heroes = this.heroesCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => a.payload.doc.data() as Heroe)),
      delay(1500)
    )
  }

  //Crear o actualizar héroe en la bbdd
  onSaveHeroe(heroe : Heroe, heroeId : string, file : any) : Promise<void>{
    return new Promise( async (resolve , reject) => {
      try{
        const id = heroeId || this.afs.createId();
        const filePath = `upload/heroe/${id}`


        const storageRef = firebase.storage().ref()

        const uploadTask : firebase.storage.UploadTask =
          storageRef.child(filePath).put(file);
          uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED,
            () => {
            uploadTask.snapshot.ref.getDownloadURL()
              .then((url : any) => {
                console.log(url)
                heroe.ruta = url;
                const data = {id , ...heroe}
                const result = this.heroesCollection.doc(id).set(data)
                delay(1500)
                resolve(result);
              });
            });
      }catch(error){
          reject(error.message)
      }
    })
  }


  onDeleteHeroe(heroeId : string) : Promise<void>{
    return new Promise(async (resolve, reject) =>{
      try{
        const result = this.heroesCollection.doc(heroeId).delete()
        resolve(result);
      }catch(error){
        reject(error.message)
      }
    })
  }

}
