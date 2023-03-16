import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GrancanastaComponent } from 'src/app/componentes/grancanasta/grancanasta.component';
import { ServiciosService } from 'src/shared/services/servicios.service';
import { PedidoProductosComponent  } from '../../componentes/pedido-productos/pedido-productos.component';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {
  
  public lafecha: Date = new Date();
  public lafecha2: Date = new Date();

  public lafechaE: Date = new Date();
  public lafecha2E: Date = new Date();
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

  llenargrilla(){
    this.lafechaE = new Date(this.lafecha);
    this.lafecha2E = new Date(this.lafecha2);
    this.lafecha = new Date(this.lafechaE.getFullYear(),(this.lafechaE.getMonth()),this.lafechaE.getDate(),0,0,0);
    this.lafecha2=new Date(this.lafecha2E.getFullYear(),(this.lafecha2E.getMonth()),this.lafecha2E.getDate(),0,0,0);
   
    
    this.servicios.getHIstorial(this.lafechaE.getFullYear()+"-"+(this.lafechaE.getMonth()+1)+"-"+this.lafechaE.getDate()+"T00:00:00"
    ,this.lafecha2E.getFullYear()+"-"+(this.lafecha2E.getMonth()+1)+"-"+this.lafecha2E.getDate()+"T23:59:59" ).subscribe( y=>{
      this.listapedidos = y;
    })
  }


  cambio(evento:any){

  }

  cambio2(evento:any){

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
