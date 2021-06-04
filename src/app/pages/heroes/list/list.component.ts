import { HeroeService } from '../../../services/heroe.service';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Heroe } from '../../../models/heroe.models'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  heroes$ = this.heroeService.heroes
  heroes : Heroe []
  cargando = false;

  navigationExtras : NavigationExtras = {
    state: {
      value : null
    }
  };



  constructor(private router : Router
             ,private heroeService : HeroeService ) {}

  //Apenas abre la vista carga una lista de héroes
  ngOnInit(): void {
    this.cargando = true;
    this.heroes$.subscribe((resp : any)  =>
      {this.heroes = resp; this.cargando= false});
  }


  //Utilizando el item podemos ir a la vista de edit
  ongoEdit(item : any) : void{
    console.log(item)
    this.navigationExtras.state.value = item  ;
    this.router.navigate(['edit'], this.navigationExtras)
  }

  ongoDelete(heroe: any) {
    Swal.fire({
      title : '¿Estás seguro?',
      text :'Está seguro que deseba borrar a' + heroe.nombre,
      icon : 'question',
      showConfirmButton : true ,
      showCancelButton : true
    }).then (async resp =>{
        if(resp.value){
          try{
            await this.heroeService.onDeleteHeroe(heroe.id);
          }catch(error){
            console.log(error)
          }
        }
    })
  }
}
