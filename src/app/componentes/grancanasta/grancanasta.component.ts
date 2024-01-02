import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiciosService } from 'src/shared/services/servicios.service';
import { EldialogComponent } from '../eldialog/eldialog.component';
import jsPDF from 'jspdf';


@Component({
  selector: 'app-grancanasta',
  templateUrl: './grancanasta.component.html',
  styleUrls: ['./grancanasta.component.css']
})
export class GrancanastaComponent implements OnInit {

  public subtotal:number=0;
  public listaprod:Array<any>=new Array<any>();
  public listaprod2:Array<any>=new Array<any>();
  public listaproddiv:Array<any>=new Array<any>();
  public escliente:boolean=false;
  public escliente2:boolean=false;
  public eltextoboton:string="Confirmar";
  public esmesaa:boolean=false;
  public esdomi:boolean=false;
  public esdecun:boolean=false;
  public esefect:boolean=true;
  public estarje:boolean=false;
  public estranfere:boolean=false;

  public estranfe2:boolean=false;
  public esefect2:boolean=true;
  public estarje2:boolean=false;

  public servicio:number=0;
  public total:number=0;
  public esservicio:boolean=true;
  public subtotalbase:number=0;
  public elporcenajte:number=0;
  public observacion:string="";
  public cantidadT:number=0;
  public eldescu:number=0;
  public listamesas:Array<number>=new Array<number>()
  public lamesa:number=0;
  public esmodificar:boolean=false;
  public elpedido:number=0;
  public editservicio:boolean=false;
  public Elefect:number|undefined;
  public elcambio:number=0;
  public elusuario:any;
  public nombres:string="";
  public direccion:string="";
  public Celular:string="";
  public esFactura:boolean=false;
  public serveditado:number=0;
  public MensajeError:string="";
  
  public eldescuval:number=0;

  public pagodivide:boolean=false;
  public totaldivide:number=0;
  public textobotondivide:string="Dividir pago";
  public serviciomemoria:number=0;

  public moneda:boolean=false;
  public elvalormoneda:number=0;
  public listapagodivid:Array<any>=new Array<any>();
  public totalmoneda:number=0;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<GrancanastaComponent>,private servicios:ServiciosService,public dialog: MatDialog) { }

  ngOnInit(): void {   
    this.lamesa=1;
    this.esmesaa=true;
    
    this.elusuario = this.servicios.getsession();
    if(this.elusuario.Clase == null){
      this.elusuario.Clase="";
    }
    for (let index = 0; index < 20; index++) {
      this.listamesas.push(index);    
    }
    
    if(this.data.elenvio.Pedido != null){
      this.eltextoboton="Modificar"
      this.observacion = this.data.elenvio.Observacion
      this.esmodificar=true;
      this.direccion = this.data.elenvio.Direccion
      this.Celular = this.data.elenvio.Celular
      this.nombres = this.data.elenvio.Nombres
      this.elpedido = this.data.elenvio.Pedido;
      if(this.data.elenvio.Mesa != null && this.data.elenvio.Mesa != "0"){
        this.lamesa = Number(this.data.elenvio.Mesa);
       
      }else{
        this.escliente2 = true;
        this.esdomi =true;
        this.esmesaa =false;
      }

      if(this.data.elenvio.esFactura){
        this.esFactura=true;
      }
    }

  }

  escribir(){
    if(this.Elefect != undefined){
      this.elcambio =  this.total - this.Elefect
      if(this.elcambio <0)
        this.elcambio = this.elcambio*(-1)
    }else{
      this.elcambio = 0;
    }
    
  }

  modservi(){
    this.total = (this.subtotal )+ Number(this.servicio)
  }

  editserf(){
    this.editservicio=!this.editservicio
    if(this.editservicio == false){
      this.esservi();
    }
  }

 
  estarjett(){
    if(this.estarje){
      this.esefect=false;    
      this.estranfere=false;  
    }else{
      this.esefect=true;
    } 
  }

  estranfeF(){
    if(this.estranfere){
      this.esefect=false;   
      this.estarje =false;   
    }
  }

  esefectt(){
    
    if(this.esefect){
      this.Elefect=undefined;
      this.estarje=false;
      this.estranfere=false;
    }else{
      this.estarje=true;
    }    
  }

  estarjett2(){
    if(this.estarje2){
      this.esefect2=false;    
      this.estranfe2=false;  
    }else{
      this.esefect2=true;
    } 
  }

  estranfeF2(){
    if(this.estranfe2){
      this.esefect2=false;   
      this.estarje2 =false;   
    }
  }

  esefectt2(){
    
    if(this.esefect2){      
      this.estarje2=false;
      this.estranfe2=false;
    }else{
      this.estarje2=true;
    }    
  }

  facturarpedido(){
    
    let ellistaenvio = this.servicios.getcanasta();
    let envio1={
      Valor:this.total,
      Cantidad:this.cantidadT,
      Fecha2:new Date(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500')),
      Estado:"Facturado",
      Direccion:this.direccion,
      Observacion:this.observacion,
      Celular:this.Celular,
      Nombre:this.nombres,
      Efectivo:(this.Elefect != undefined)?this.Elefect:0,
      TipoPago:(this.esefect)?1:0,
      EsMesa:this.esmesaa,
      Mesa:this.lamesa,
      Usuario: this.servicios.getsession().Id,
      Descuento:this.esdecun,
      Servicio:this.esservicio,
      Sede:1,
      Id:ellistaenvio[0].Pedido,
      ValorNeto:this.subtotal,
      ValServicio:this.servicio,
      ValDescuento : this.eldescuval,
      detalle:ellistaenvio
    }
    if(this.estranfere){
      envio1.TipoPago=2;
    }

    if(this.esdecun){
      envio1.ValorNeto=this.subtotalbase
    }
    
    this.servicios.Facturar(envio1).subscribe(x =>{
      if(x != null && x.IdPedido >0){    
        
        if(this.listapagodivid.length > 0){
          this.listapagodivid.forEach(element => {
            element.Fecha = new Date(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500')),
            this.servicios.save_pagodivido(element).subscribe(x =>{
              if(x != null && x.IdPedido >0){
                
                this.MensajeError="";
                this.totalmoneda = Number(this.totalmoneda )- Number(this.elvalormoneda)
                this.elvalormoneda=0;
              }else{
                this.MensajeError="Algo sucedio contactese con el administrador o vuelva a intentarlo."
              }
            });
          });
          
        }

          const dialogRef = this.dialog.open(EldialogComponent, {
            maxWidth: '100vw',
            minWidth: '40%',
            panelClass: 'my-panel',
            data: {  
              tipo:0,mensaje:"Pedido facturado con exito."          
            }                
          });
          this.dialogRef.close();
          this.servicios.cerrarventanas.next(true);      
         

          setTimeout(() => {
            this.generarfactura(envio1);     
        }, 1000);
      }else{
        const dialogRef = this.dialog.open(EldialogComponent, {
          maxWidth: '100vw',
          minWidth: '40%',
          panelClass: 'my-panel',
          data: {  
            tipo:0,mensaje:"Error al facturar el pedido."          
          }
        });
      }
    })
  }



  generarfactura(entrada:any){
    const doc = new jsPDF();
    doc.setFontSize(9);

    doc.text('LA CORDILLERA HAMBURGUESERIA ', 5, 5);
    doc.setFontSize(7);
    doc.text('Hamburguesas artesanales al carbon', 5, 10);
    doc.text('Carrera 14 Calle 46 Norte. ', 5, 15);
    doc.text('', 5, 20);
    doc.text('NIT: 1094913384-4', 5, 25);
    doc.text('Cel: 323 436 7484', 5, 30);

    if(entrada.EsMesa){
      doc.text('Pedido Mesa:'+entrada.Mesa, 5, 35);      
    }else{
      doc.text('Pedido:'+entrada.Direccion, 5, 35);
    }
    
    doc.text('Empleado:'+ this.elusuario.NombreCompleto, 5, 40);
    doc.text('Caja: 1', 5, 45);
    doc.text('------------------------------------------------------------', 5, 50);
    let nombre:string;
    let _i:number=54;
    entrada.detalle.forEach((element:any) => {
      if(element.Cantidad ==0)
        return;
      nombre = element.Nombre;
      
      doc.text(nombre.replace("Hamburguesa","Hamb."), 5,_i );
      doc.text("$"+ new Intl.NumberFormat('es-CO').format( (element.Precio*element.Cantidad)), 40,_i );
      _i=_i+3;
      doc.text(element.Cantidad +" x $"+new Intl.NumberFormat('es-CO').format( element.Precio), 5,_i );   
      _i=_i+6;  
      
    });   
    doc.text('------------------------------------------------------------', 5, _i);
    _i=_i+3;  

    if(entrada.EsMesa){
      doc.text('Total:', 5, _i);    
      doc.text('$'+new Intl.NumberFormat('es-CO').format( entrada.Valor), 40, _i);    
      _i=_i+5;  
      doc.text('SubTotal:', 5, _i);    
      doc.text('$'+new Intl.NumberFormat('es-CO').format( entrada.ValorNeto), 40, _i);    
      _i=_i+5;  
      doc.text('Servicio:', 5, _i);    
      doc.text('$'+new Intl.NumberFormat('es-CO').format( entrada.ValServicio), 40, _i);    
      _i=_i+5;  
      doc.text('Descuento:', 5, _i);    
      doc.text('$'+new Intl.NumberFormat('es-CO').format( entrada.ValDescuento), 40, _i);  
    }else{
      doc.text('Total: $'+new Intl.NumberFormat('es-CO').format( entrada.Valor), 5, _i);
    }
    _i=_i+5;  
    doc.text('------------------------------------------------------------', 5, _i);
    _i=_i+7;  

    doc.setFontSize(6);

    doc.text("**Se informa a los consumidores que este", 5, _i);
    _i=_i+4;  
    doc.text("establecimiento de comercio sugiere una", 5, _i);
    _i=_i+4;  
    doc.text("propina del 10% del valor de la compra cómo", 5, _i);
    _i=_i+4;  
    doc.text("fue reglamentado por la Ley 1935 del 03 de", 5, _i);
    _i=_i+4;  
    doc.text("agosto del 2018. el cuál podra ser ACEPTADO", 5, _i);
    _i=_i+4;  
    doc.text(",RECHAZADO o MODIFICADO por el consumidor", 5, _i);
    _i=_i+4;  
    doc.text("de acuerdo a la valoración del servicio", 5, _i);
    _i=_i+4;  
    doc.text("prestado en mesa. en caso algún inconveniente", 5, _i);
    _i=_i+4;  
    doc.text("con el cobro de la propina puede comunicarse", 5, _i);
    _i=_i+4;  
    doc.text("con la Super Intendencia de Industria y Comercio", 5, _i);
    _i=_i+4;  
    doc.text("al teléfono: 018000 910165**", 5, _i);
   

    _i=_i+10; 
    doc.setFontSize(8);
    doc.text('GRACIAS POR SU VISITA', 5, _i);
    _i=_i+8; 
    doc.text(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500'), 5, _i);
    
    window.open(doc.output('bloburl'))
  }

  cargardatos(){

    this.listaprod = this.servicios.getcanasta() as Array<any>;   
    if(this.esFactura){
      this.listaprod = this.listaprod.filter(x => x.Cantidad >0);     
    } 
    
    if(this.listaprod != null){
      this.cantidadT = this.listaprod.reduce((sum, current) => sum + current.Cantidad, 0);   
      this.subtotal = this.listaprod.reduce((sum, current) => sum + (Number(current.Cantidad)*Number(current.Precio)), 0);
      this.subtotalbase = this.listaprod.reduce((sum, current) => sum + (Number(current.Cantidad)*Number(current.Precio)), 0);
      this.servicios.GetParametros().subscribe(x =>{     
        this.eldescu = x.find((y:any) => y.Nombre=="Descuento").Valor1
        this.elporcenajte = x.find((y:any) => y.Nombre=="Servicio").Valor1
        this.servicio = (this.subtotal*(Number(this.elporcenajte)/100))
        this.serviciomemoria = (this.subtotal*(Number(this.elporcenajte)/100))
        this.total = this.subtotal + this.servicio;      
      })
    }    
  }

  esdescuF(){
    this.elcambio = 0;
    this.Elefect = undefined;
    if(!this.esservicio){
      if(this.esdecun){    
        this.eldescuval =    (this.subtotalbase*(Number(this.eldescu)/100));    
        this.subtotal = this.subtotalbase -(this.subtotalbase*(Number(this.eldescu)/100))      
        this.total = this.subtotal   
      }else{     
        this.servicio = 0
        this.subtotal = this.subtotalbase;
        this.total = this.subtotalbase;  
        this.eldescuval =   0;    
      }
    }else{
      if(this.esdecun){     
        this.eldescuval =    (this.subtotalbase*(Number(this.eldescu)/100));
        this.subtotal = this.subtotalbase -(this.subtotalbase*(Number(this.eldescu)/100))  
        this.servicio = (this.subtotal*(Number(this.elporcenajte)/100))    
        this.total = this.subtotal   + this.servicio
      }else{     
       
        this.subtotal = this.subtotalbase;
        this.servicio = (this.subtotalbase*(Number(this.elporcenajte)/100))
        this.total = this.subtotal + this.servicio;
        this.eldescuval=0;
      }
    }
   
  }  

  esservi(){  
    this.elcambio = 0;
    this.Elefect = undefined;
    if(!this.esdecun){
      if(this.esservicio){        
          this.servicio = (this.subtotalbase*(Number(this.elporcenajte)/100))
          this.total = this.subtotal + this.servicio;
      }else{
        this.servicio = 0
        this.total = this.subtotalbase;
      }
    } else{
      if(this.esservicio){        
        this.servicio = (this.subtotal*(Number(this.elporcenajte)/100))
        this.total = this.subtotal + this.servicio;
      }else{
        this.servicio = 0
        this.total = this.subtotal;
      }
    } 
   
    this.totalmoneda=this.total;
  }

  esmesaF(){
    if(this.esmesaa){
      this.escliente2=false;
      this.esdomi=false;
    }else{
      this.escliente2=true;
    }
    this.MensajeError="";
  }

  esdomiF(){
    if(this.esdomi){
      this.escliente2=true;
      this.esmesaa=false;
      this.esservicio=false
      this.esservi();
    }else{
      this.escliente2=false;
    }
    this.MensajeError="";
  }

  ngAfterViewInit (){
    setTimeout(() => {
      this.cargardatos();    
  });
 }

  adicionar(entrada:any){
    this.servicios.addcanasta(entrada);
    this.cargardatos();
  }

  quitar(entrada:any){
    this.servicios.deletecanasta(entrada);
    this.cargardatos();
  }

  
  
  enviarPedido(){
    if(this.esmesaa && this.lamesa==0){
      this.MensajeError ="Seleccione una mesa por favor."
      return;
    }
    
    this.MensajeError="";
    let ellistaenvio = this.servicios.getcanasta();
    if(this.esmodificar){
      if(!this.escliente2){
        let envio1={
          Valor:this.total,
          Cantidad:this.cantidadT,
          Fecha2:new Date(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500')),
          Estado:"Modificado",
          Direccion:"",
          Observacion:this.observacion,
          Celular:"",
          Nombre:"",
          Efectivo:0,
          TipoPago:1,
          EsMesa:true,
          Mesa:this.lamesa,
          Usuario: this.servicios.getsession().Id,
          Descuento:this.esdecun,
          Servicio:this.esservicio,
          Sede:1,
          Id:ellistaenvio[0].Pedido,
          ValorNeto:this.subtotal,
          ValServicio:this.servicio,
          ValDescuento : this.eldescuval
        }
        if(this.estranfere){
          envio1.TipoPago=2;
        }
        
        this.servicios.update_pedido(envio1).subscribe(x =>{
          if(x != null && x.IdPedido >0){             
            //this.listaprod = this.listaprod.filter( y => y.Cantidad!=0);
            this.listaprod.forEach(element => {
              element.IdDetalle= (element.IdDetalle == undefined)?null:element.IdDetalle,
              element.Pedido = this.elpedido,
              element.Producto = (element.Producto == undefined)?element.Id:element.Producto

            });    
            this.servicios.update_detalle(this.listaprod).subscribe(y=>{
              if(x != null && x.IdPedido >0){
                const dialogRef = this.dialog.open(EldialogComponent, {
                  maxWidth: '100vw',
                  minWidth: '40%',
                  panelClass: 'my-panel',
                  data: {  
                    tipo:0,mensaje:"Pedido editado con exito."          
                  }                
                });
                this.dialogRef.close();
                this.servicios.cerrarventanas.next(true);
              }else{
                const dialogRef = this.dialog.open(EldialogComponent, {
                  maxWidth: '100vw',
                  minWidth: '40%',
                  panelClass: 'my-panel',
                  data: {  
                    tipo:0,mensaje:"Error al modificar el pedido."          
                  }
                });
              }
            })
          }else{
            const dialogRef = this.dialog.open(EldialogComponent, {
              maxWidth: '100vw',
              minWidth: '40%',
              panelClass: 'my-panel',
              data: {  
                tipo:0,mensaje:"Error al modificar el pedido."          
              }
            });
          }
        })
      }else{
        let envio1={
          Valor:this.total,
          Cantidad:this.cantidadT,
          Fecha2:new Date(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500')),
          Estado:"Modificado",
          Direccion:this.direccion,
          Observacion:this.observacion,
          Celular:this.Celular,
          Nombre:this.nombres,
          Efectivo:0,
          TipoPago:1,
          EsMesa:false,
          Mesa:0,
          Usuario: this.servicios.getsession().Id,
          Descuento:this.esdecun,
          Servicio:this.esservicio,
          Sede:1,
          Id:ellistaenvio[0].Pedido,
          ValorNeto:this.subtotal,
          ValServicio:this.servicio,
          ValDescuento : this.eldescuval
        }
        if(this.estranfere){
          envio1.TipoPago=2;
        }

        this.servicios.update_pedido(envio1).subscribe(x =>{
          if(x != null && x.IdPedido >0){             
            //this.listaprod = this.listaprod.filter( y => y.Cantidad!=0);
            this.listaprod.forEach(element => {
              element.IdDetalle= (element.IdDetalle == undefined)?null:element.IdDetalle,
              element.Pedido = this.elpedido,
              element.Producto = (element.Producto == undefined)?element.Id:element.Producto

            });    
            this.servicios.update_detalle(this.listaprod).subscribe(y=>{
              if(x != null && x.IdPedido >0){
                const dialogRef = this.dialog.open(EldialogComponent, {
                  maxWidth: '100vw',
                  minWidth: '40%',
                  panelClass: 'my-panel',
                  data: {  
                    tipo:0,mensaje:"Pedido editado con exito."          
                  }                
                });
                this.dialogRef.close();
                this.servicios.cerrarventanas.next(true);
              }else{
                const dialogRef = this.dialog.open(EldialogComponent, {
                  maxWidth: '100vw',
                  minWidth: '40%',
                  panelClass: 'my-panel',
                  data: {  
                    tipo:0,mensaje:"Error al modificar el pedido."          
                  }
                });
              }
            })
          }else{
            const dialogRef = this.dialog.open(EldialogComponent, {
              maxWidth: '100vw',
              minWidth: '40%',
              panelClass: 'my-panel',
              data: {  
                tipo:0,mensaje:"Error al modificar el pedido."          
              }
            });
          }
        })
      }                
      
    }else{
      
      if(!this.escliente2){
        let envio1={
          Valor:this.total,
          Cantidad:this.cantidadT,
          Fecha2:new Date(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500')),
          Estado:"Creado",
          Direccion:"",
          Observacion:this.observacion,
          Celular:"",
          Nombre:"",
          Efectivo:0,
          TipoPago:1,
          EsMesa:true,
          Mesa:this.lamesa,
          Usuario: this.servicios.getsession().Id,
          Descuento:this.esdecun,
          Servicio:this.esservicio,
          Sede:1,
          ValorNeto:this.subtotal,
          ValServicio:this.servicio,
          ValDescuento : this.eldescuval
        }
        if(this.estranfere){
          envio1.TipoPago=2;
        }
        
        this.servicios.savePedido(envio1).subscribe(x =>{
          if(x != null && x.IdPedido >0){
            this.listaprod.forEach(element => {
              element.Producto=element.Id,
              element.Pedido=x.IdPedido
            });
  
            //this.listaprod = this.listaprod.filter( y => y.Cantidad!=0);
  
            this.servicios.save_detalle(this.listaprod).subscribe(y=>{
              if(x != null && x.IdPedido >0){
                const dialogRef = this.dialog.open(EldialogComponent, {
                  maxWidth: '100vw',
                  minWidth: '40%',
                  panelClass: 'my-panel',
                  data: {  
                    tipo:0,mensaje:"Pedido creado con exito."          
                  }                
                });
                this.dialogRef.close();
                this.servicios.cerrarventanas.next(true);
              }else{
                const dialogRef = this.dialog.open(EldialogComponent, {
                  maxWidth: '100vw',
                  minWidth: '40%',
                  panelClass: 'my-panel',
                  data: {  
                    tipo:0,mensaje:"Error al crear el pedido."          
                  }
                });
              }
            })
          }else{
            const dialogRef = this.dialog.open(EldialogComponent, {
              maxWidth: '100vw',
              minWidth: '40%',
              panelClass: 'my-panel',
              data: {  
                tipo:0,mensaje:"Error al crear el pedido."          
              }
            });
          }
        })
      }else{
        let envio1={
          Valor:this.total,
          Cantidad:this.cantidadT,
          Fecha2:new Date(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500')),
          Estado:"Creado",
          Direccion:this.direccion,
          Observacion:this.observacion,
          Celular:this.Celular,
          Nombre:this.nombres,
          Efectivo:0,
          TipoPago:1,
          EsMesa:false,
          Mesa:0,
          Usuario: this.servicios.getsession().Id,
          Descuento:this.esdecun,
          Servicio:this.esservicio,
          Sede:1,
          ValorNeto:this.subtotal,
          ValServicio:this.servicio,
          ValDescuento : this.eldescuval
        }
        if(this.estranfere){
          envio1.TipoPago=2;
        }
        
        this.servicios.savePedido(envio1).subscribe(x =>{
          if(x != null && x.IdPedido >0){
            this.listaprod.forEach(element => {
              element.Producto=element.Id,
              element.Pedido=x.IdPedido
            });
  
            //this.listaprod = this.listaprod.filter( y => y.Cantidad!=0);
  
            this.servicios.save_detalle(this.listaprod).subscribe(y=>{
              if(x != null && x.IdPedido >0){

                
                const dialogRef = this.dialog.open(EldialogComponent, {
                  maxWidth: '100vw',
                  minWidth: '40%',
                  panelClass: 'my-panel',
                  data: {  
                    tipo:0,mensaje:"Pedido creado con exito."          
                  }                
                });
                this.dialogRef.close();
                this.servicios.cerrarventanas.next(true);
              }else{
                const dialogRef = this.dialog.open(EldialogComponent, {
                  maxWidth: '100vw',
                  minWidth: '40%',
                  panelClass: 'my-panel',
                  data: {  
                    tipo:0,mensaje:"Error al crear el pedido."          
                  }
                });
              }
            })
          }else{
            const dialogRef = this.dialog.open(EldialogComponent, {
              maxWidth: '100vw',
              minWidth: '40%',
              panelClass: 'my-panel',
              data: {  
                tipo:0,mensaje:"Error al crear el pedido."          
              }
            });
          }
        })
      }                
      
    }
    
  }


  dividirpago(){
    this.pagodivide = !this.pagodivide;
    if(this.pagodivide){
      this.textobotondivide ="Cancelar division"
      this.listaprod2 = new Array<any>();
      this.listapagodivid= new Array<any>();
      this.listaprod.forEach(x =>{
        let subentrada = {
          Cantidad: x.Cantidad
          ,Celular: x.Celular
          ,Direccion: x.Direccion
          ,Efectivo: x.Efectivo
          ,Id: x.Id
          ,IdDetalle: x.IdDetalle
          ,IdTipo: x.IdTipo
          ,Mesa: x.Mesa
          ,Nombre: x.Nombre
          ,NombreCompleto: x.NombreCompleto
          ,NombreTipo: x.NombreTipo
          ,Nombres: x.Nombres
          ,Observacion: x.Observacion
          ,Pedido: x.Pedido
          ,Precio: x.Precio
          ,Producto: x.Producto
          ,Tipo: x.Tipo
          ,esFactura: x.esFactura
          ,total: x.total
        }     
        this.listaprod2.push(subentrada);
      })
      this.editserf();
    }else{
      this.textobotondivide ="Dividir pago"   
      this.editservicio=false; 
      this.esservi();  
    }
  }


  dividirmoneda(){
    this.moneda = !this.moneda;
    this.totalmoneda = this.total;
    
  }

  pagarmoneda(){
   
    let ellistaenvio = this.servicios.getcanasta();      
    let envio = {IdPedido:Number(ellistaenvio[0].Pedido),Valor:Number(this.elvalormoneda),TipoPago:0,Fecha:new Date(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500'))}
    if(this.esefect){
      envio.TipoPago=1;
    }else if(this.estranfere){
      envio.TipoPago=2;
    }else{
      envio.TipoPago=0;
    }

    this.servicios.save_pagodivido(envio).subscribe(x =>{
      if(x != null && x.IdPedido >0){
        
        this.MensajeError="";
        this.totalmoneda = Number(this.totalmoneda )- Number(this.elvalormoneda)
        this.elvalormoneda=0;
      }else{
        this.MensajeError="Algo sucedio contactese con el administrador o vuelva a intentarlo."
      }
    });
   
  }
  quitardivide(entrada:any){
    
    this.listaprod2 = this.listaprod2.filter(x => x.IdDetalle != entrada.IdDetalle)
    if(entrada.Cantidad -1 >0){
        entrada.Cantidad = entrada.Cantidad-1;
        this.listaprod2.push(entrada)
    }

    let variable = this.listaproddiv.find(x => x.IdDetalle == entrada.IdDetalle)
    if(variable != null){
      variable.Cantidad = variable.Cantidad+1;
      this.listaproddiv = this.listaproddiv.filter(x => x.IdDetalle != entrada.IdDetalle)
      this.listaproddiv.push(variable)
    }else{
      let subentrada = {
        Cantidad: 1
        ,Celular: entrada.Celular
        ,Direccion: entrada.Direccion
        ,Efectivo: entrada.Efectivo
        ,Id: entrada.Id
        ,IdDetalle: entrada.IdDetalle
        ,IdTipo: entrada.IdTipo
        ,Mesa: entrada.Mesa
        ,Nombre: entrada.Nombre
        ,NombreCompleto: entrada.NombreCompleto
        ,NombreTipo: entrada.NombreTipo
        ,Nombres: entrada.Nombres
        ,Observacion: entrada.Observacion
        ,Pedido: entrada.Pedido
        ,Precio: entrada.Precio
        ,Producto: entrada.Producto
        ,Tipo: entrada.Tipo
        ,esFactura: entrada.esFactura
        ,total: entrada.total
      }     
      this.listaproddiv.push(subentrada)
    }
    

    this.totaldivide=0;
    this.listaproddiv.forEach(x =>{
      this.totaldivide += x.Cantidad*x.Precio
    })
  }
  quitardivide2(entrada:any){
    

    let variable = this.listaprod.find(x => x.IdDetalle == entrada.IdDetalle)

    this.listaproddiv = this.listaproddiv.filter(x => x.IdDetalle != entrada.IdDetalle)
    this.listaprod2 = this.listaprod2.filter(x => x.IdDetalle != entrada.IdDetalle)
    this.listaprod2.push(variable)

    this.totaldivide=0;
    this.listaproddiv.forEach(x =>{
      this.totaldivide += x.Cantidad*x.Precio
    })
  }


  liberardivide(){

    let ellistaenvio = this.servicios.getcanasta();      
    let envio = {IdPedido:Number(ellistaenvio[0].Pedido),Valor:Number(this.totaldivide),TipoPago:0,Fecha:new Date(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500'))}
    if(this.esefect2){
      envio.TipoPago=1;
    }else if(this.estranfe2){
      envio.TipoPago=2;
    }else{
      envio.TipoPago=0;
    }

    this.totaldivide=0;
    this.listaproddiv=new Array<any>();
    this.listapagodivid.push(envio);
  }

}
