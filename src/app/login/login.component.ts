import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ServiciosService } from 'src/shared/services/servicios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public usuario:string="";
  public contrasena:string="";
  public bandera:boolean=false;
  public formu:boolean=true;
  public sedes:Array<any>= new Array<any>();
  public lasede:any;
  public mensaje:string="";
  public turno:boolean=false;
  public elturno:number=0;
  public elpuesto:number=0;
  public lista1:Array<any>=[{valor:1,Descripcion:"Caja"},{valor:2,Descripcion:"Parrilla"},{valor:3,Descripcion:"Asistente cocina"},{valor:4,Descripcion:"Mesero"}];
  public lista2:Array<any>=[{valor:1,Descripcion:"Medio turno"},{valor:2,Descripcion:"Turno Completo"}];

  public listapuesto:Array<any>=new Array<any>();
  public listaturno:Array<any>=new Array<any>();
  constructor(private losservicios:ServiciosService,private router:Router) {
    this.losservicios.getSedes().subscribe(x =>{
      this.sedes = x;
      this.lasede = x.find((y: any) => y.Id==1)
    });  

    let fecha = new Date('2023-03-16T00:00:00')
    debugger
  }

  ngOnInit(): void {
  }


  logueo(){    
    this.mensaje="";
    this.losservicios.Loguear(this.usuario,this.contrasena).subscribe(x =>{     
      if(x == null){       
        this.mensaje ="Ingreso incorrecto."
        return;
      }
      if(x.Activo == "1"){
        this.losservicios.savesession(x);
        this.formu=false;
        if(x.Tipo!="1"){
          this.turno=true;
        }
      }else{      
        this.mensaje ="Usuario inactivo."
      }
    })
  }

  entrar(){
    this.mensaje="";       
    if(this.turno){
      if(this.lasede == null || this.listaturno.length==0 || this.listapuesto.length==0){
        this.mensaje ="Seleccione los parametros de turno."      
      }else{     
        let usuario = this.losservicios.getsession();
        debugger
        let usunu ={
          Activo: usuario.Activo,
          Id: usuario.Id,
          NombreUsuario: usuario.NombreUsuario,
          Tipo: usuario.Tipo,
          Clase: this.listapuesto[0].Descripcion,
          NombreCompleto:usuario.NombreCompleto
        }
        this.losservicios.savesession(usunu)
        let elturnoo = this.listaturno[this.listaturno.length-1];
        let elpuestoo = this.listapuesto[this.listapuesto.length-1];
        let lafecha1 = new Date();
       let lafecha = lafecha1.getFullYear()+"-"+ (lafecha1.getMonth()+1)+"-"+lafecha1.getDate()+" "+lafecha1.getHours()+":"+lafecha1.getMinutes()+":"+lafecha1.getSeconds();
       this.losservicios.saveTurno(usuario.Id,true,lafecha,( (elturnoo.valor==1)?true:false),elpuestoo.valor).subscribe(yy =>{                            
          if(yy != null && yy.message1 =="Ok"){

            this.router.navigate(['/Admin']);
          }else{
            this.mensaje ="Error al guardar turno."    
          }
        })        
      }
    }else{
      if(this.lasede == null){
        this.mensaje ="Seleccione la sede."      
      }else{     
        this.router.navigate(['/Admin']);
      }
    }    
  }

  cambiado1(evento:any,entrada:any){
    
    if(evento.currentTarget.checked){
      this.listapuesto.push(entrada);
    }else{
      
      this.listapuesto = this.listapuesto.filter(x => x.valor != entrada.valor)
    }   
  }

  cambiado2(evento:any,entrada:any){
    if(evento.currentTarget.checked){
      this.listaturno.push(entrada);
    }else{
      this.listaturno = this.listaturno.filter(x => x.valor != entrada.valor)
    }   
  }
}
