import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EldialogComponent } from 'src/app/componentes/eldialog/eldialog.component';
import { ServiciosService } from 'src/shared/services/servicios.service';

@Component({
  selector: 'app-adminusu',
  templateUrl: './adminusu.component.html',
  styleUrls: ['./adminusu.component.css']
})
export class AdminusuComponent implements OnInit {

  public UserName:string="";
  public Password:string="";
  public Email:string="";
  public Sueldo:string="0";
  public NombreCompleto:string="";
  public lista:Array<any>= new Array<any>();
  public eltipo:string="";
  public elusuario:any;

  constructor(private servicios:ServiciosService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.elusuario = this.servicios.getsession();
    if(this.elusuario.Clase == null){
      this.elusuario.Clase="";
    }
    this.llenargrilla();
  }

  llenargrilla(){
   
    
    this.servicios.GetUsuarios().subscribe( y=>{
      this.lista = y;
    })
  }

  

  crear(){
    let envio ={
      NombreUsuario:this.UserName,PasswordUsuario:this.Password,
      Email:this.Email,NombreCompleto : this.NombreCompleto,Tipo:this.eltipo,Activo:true,Sueldo:this.Sueldo
    }
    this.servicios.save_usuario(envio).subscribe(x =>{
      const dialogRef = this.dialog.open(EldialogComponent, {
        maxWidth: '100vw',
        minWidth: '40%',
        panelClass: 'my-panel',
        data: {  
          tipo:0,mensaje:"usuario creado con exito."          
        }               
      });
      
      this.llenargrilla();
    })
  }

}
