import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Heroe } from 'src/app/models/heroe.models';
import { HeroeService } from 'src/app/services/heroe.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  public previsualizacion : any;
  public archivos : any = [];


  file ?: string ;
  heroeForm !: FormGroup;
  heroe : Heroe ;
  constructor(private router: Router,
              private fb : FormBuilder,
              private heroeService:HeroeService,
              private sanitizer : DomSanitizer,
              private afs : AngularFirestore) {
    const navigation = this.router.getCurrentNavigation();
    this.heroe = navigation?.extras?.state?.value;
    this.previsualizacion =this.heroe.ruta || null
    this.initForm()
    console.log(this.heroe)
  }

  ngOnInit(): void {
    if (typeof this.heroe === 'undefined') {
      this.router.navigate(['new']);
    } else {
      this.heroeForm.patchValue(
        {name : this.heroe.name,
        alias : this.heroe.alias,
        casa : this.heroe.casa,
        ruta : this.heroe.ruta}
      )

    }
  }

 onSave( ){
    Swal.fire({
      title : 'Espere',
      text  : 'Actualizando información',
      icon  : 'info',
      allowOutsideClick : false
    });
    Swal.showLoading();

    if(this.heroeForm.valid){
        const heroe = this.heroeForm.value;
        const heroeId  =  this.heroe?.id || null;
        console.log(heroeId)
        this.heroeService.onSaveHeroe(heroe, heroeId, this.file)
        this.heroeForm.reset();
        Swal.fire({
          title : 'Héroe Creado',
          text : 'Se actualizó correctamente',
          icon : 'success'
        })
    }else{
      Swal.fire({
        title : 'Héroe Error',
        text : 'No se puede actualizar  al héroe, faltan datos',
        icon : 'error'
      })
    }
  }


  extraerBase64 = async (e : any) => new Promise((resolve , reject) =>{
    try{
      const unsafeImg = window.URL.createObjectURL(e);
      const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL(e);
      reader.onload = () => {
        resolve({
          base : reader.result
        })
      };
      reader.onerror = error => {
        resolve({
          base : null
        });
      };
    }catch(e){
        return null;
    }
  })



  ongoBackToList(){
    this.router.navigate(['list'])
  }


  isValidField(field: string): string {
    const validatedField = this.heroeForm.get(field);
    return (!validatedField.valid && validatedField.touched)
      ? 'is-invalid' : validatedField.touched ? 'is-valid' : '';
  }


  onUpload(e : any){
    //console.log('', e.target.files)
    this.file = e.target.files[0];
    this.extraerBase64(this.file).then((imagen : any)=> {
      console.log(imagen.base)
      this.previsualizacion = imagen.base;
    })
    this.archivos.push(this.file)
  }


  private initForm(): void{
    this.heroeForm = this.fb.group({
      name:       ['',[Validators.required]],
      alias :  ['',[Validators.required]],
      casa :      ['',[Validators.required]],
      ruta : ['', Validators.required]
    })
  }
}
