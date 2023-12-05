import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ServiciosService } from 'src/shared/services/servicios.service';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-pedido-productos',
  templateUrl: './pedido-productos.component.html',
  styleUrls: ['./pedido-productos.component.css']
})
export class PedidoProductosComponent implements OnInit {
  public listatipos:Array<any>=new Array<any>();
  public listaprod:Array<any>=new Array<any>();
  public listaprodbase:Array<any>=new Array<any>();
  public eltipo:number=0;
  
  constructor(public dialogRef: MatDialogRef<PedidoProductosComponent>,private servicios:ServiciosService) { }

  ngOnInit(): void {
    this.servicios.GetTiposAll().subscribe(x =>{      
      this.listatipos = x; 
      
      this.listatipos.push( {IdTipo:0,NombreTipo:"Todos"} )         
    })
    this.servicios.mostrarProductosALL().subscribe(x =>{      
      this.listaprod = x;  
      this.listaprodbase = x;    
    })

    this.servicios.cerrarventanas.subscribe(x=>{
      this.dialogRef.close();
    })
    
   
    
  }

  ngAfterViewInit (){
    setTimeout(() => {
      this.servicios.tococanasta.next(true);
  });
    
  }

  seleccionartipo(){  
    let eltipoo = this.eltipo as any;     
    
    if(eltipoo==0){
      this.listaprod = this.listaprodbase;
    }else{
      this.listaprod = this.listaprodbase.filter( x => x.Tipo == eltipoo);
    }
    
  }

  adicionar(entrada:any){
    this.servicios.addcanasta(entrada);
  }

}
