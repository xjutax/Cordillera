import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EldialogComponent } from 'src/app/componentes/eldialog/eldialog.component';
import { ServiciosService } from 'src/shared/services/servicios.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {
  public listatipos:Array<any>=new Array<any>();
  public listaprod:Array<any>=new Array<any>();
  public listaparametros:Array<any>=new Array<any>();
  public eltipo:number=0;
  constructor(public dialog: MatDialog,private servicios:ServiciosService) { }

  ngOnInit(): void {
    this.cargargrilla()
  }

  cargargrilla(){
    this.servicios.GetTiposAll().subscribe(x =>{      
      this.listatipos = x; 
      
      this.listatipos.push( {IdTipo:0,NombreTipo:"Todos"} )         
    })
    this.servicios.GetParametros().subscribe(x =>{           
      this.listaparametros = x;    
    })
  }

  
  modificar(item:any){
    const dialogRef = this.dialog.open(EldialogComponent, {
      maxWidth: '100vw',
      minWidth: '40%',
      panelClass: 'my-panel',
      data: {  
        tipo:3,producto:item         
      }
    });
  }

}
