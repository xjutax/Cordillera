import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GrancanastaComponent } from 'src/app/componentes/grancanasta/grancanasta.component';
import { ServiciosService } from 'src/shared/services/servicios.service';
import { PedidoProductosComponent  } from '../../componentes/pedido-productos/pedido-productos.component';

@Component({
  selector: 'app-mesero',
  templateUrl: './mesero.component.html',
  styleUrls: ['./mesero.component.css']
})
export class MeseroComponent implements OnInit {
  
  public listapedidos : Array<any>= new Array<any>();
  constructor(public dialog: MatDialog,private servicios:ServiciosService) { }

  ngOnInit(): void {
    this.cargarPedidos();

    this.servicios.cerrarventanas.subscribe(x =>{
      this.cargarPedidos();
    })

    this.servicios.tocoPedidos.subscribe(x =>{
      this.cargarPedidos();
    })
  }

  cargarPedidos(){
    this.servicios.listar_pedidosP().subscribe(x =>{
      x.forEach((element:any) => {
          element.TipoPedido = (element.Mesa >0)?"Mesa":"Domicilio",
          element.EsMesa = (element.EsMesa=="0")?false:true;
      });
      this.listapedidos = x;    
      console.log(x);  
    })
  }

  crearpedido(){
    this.servicios.dropCanasta();
    const dialogRef = this.dialog.open(PedidoProductosComponent, {     
      maxWidth: '100vw',
      minWidth: '70%',
      panelClass: 'my-panel',
      data: {         
      }
    });
  }

  buscar(){
    this.cargarPedidos();
  }
  
  comandar(entrada:any){
    entrada.Estado='Comandado'
    this.servicios.update_pedido(entrada).subscribe( x =>{
      this.cargarPedidos();
    })
  }

  modificar(entrada:any){
    this.servicios.GetPedido(entrada.Id).subscribe( x=>{
      this.servicios.dropCanasta();
      x.forEach((element:any) => {
        this.servicios.addcanasta(element);
      });
      
      this.servicios.tococanasta.next(true);
      const dialogRef = this.dialog.open(PedidoProductosComponent, {     
        maxWidth: '100vw',
        minWidth: '70%',
        panelClass: 'my-panel',
        data: {   
          Id:entrada.Id      
        }
      });
    })
    
  }

  facturar(entrada:any){
    
    this.servicios.GetPedido(entrada.Id).subscribe( x=>{
      
      x.forEach((element:any) => {
        element.esFactura = true;       
      });
      this.servicios.setcanasta(x);
      this.servicios.tococanasta.next(true);
      const dialogRef = this.dialog.open(GrancanastaComponent, {     
        maxWidth: '100vw',
        minWidth: '70%',
        panelClass: 'my-panel',
        data: {   
          elenvio:x[0] 
        }
      });
    })    
  }

  Cancelar(entrada:any){
    entrada.Estado='Cancelado'
    this.servicios.update_pedido(entrada).subscribe( x =>{
      this.cargarPedidos();
    })
  }
  
}
