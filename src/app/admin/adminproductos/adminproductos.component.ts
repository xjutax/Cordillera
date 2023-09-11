import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EldialogComponent } from 'src/app/componentes/eldialog/eldialog.component';
import { ServiciosService } from 'src/shared/services/servicios.service';

@Component({
  selector: 'app-adminproductos',
  templateUrl: './adminproductos.component.html',
  styleUrls: ['./adminproductos.component.css']
})
export class AdminproductosComponent implements OnInit {
  public listatipos:Array<any>=new Array<any>();
  public listaprod:Array<any>=new Array<any>();
  public listaprodbase:Array<any>=new Array<any>();
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
    this.servicios.mostrarInventarioALL().subscribe(x =>{      
      this.listaprod = x;  
      this.listaprodbase = x;    
    })
  }

  seleccionartipo(){  
    let eltipoo = this.eltipo as any;     
    if(eltipoo==0){
      this.listaprod = this.listaprodbase;
    }else{
      this.listaprod = this.listaprodbase;
      this.listaprod = this.listaprod.filter( x => x.Tipo == eltipoo);
    }    
  }

  modificar(item:any){
    const dialogRef = this.dialog.open(EldialogComponent, {
      maxWidth: '100vw',
      minWidth: '40%',
      panelClass: 'my-panel',
      data: {  
        tipo:2,producto:item         
      }
    });
  }

}
