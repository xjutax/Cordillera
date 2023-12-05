import { formatDate } from '@angular/common';
import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog,MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiciosService } from 'src/shared/services/servicios.service';

@Component({
  selector: 'app-eldialog',
  templateUrl: './eldialog.component.html',
  styleUrls: ['./eldialog.component.css']
})
export class EldialogComponent implements OnInit {
  public opcion:number=1;
  public tipografica:number=0;
  public params:any;
  public MensajeDinamico:string="";
  public elproducto:any;
  public elproductocaja:any;
  public listatipos:Array<any>=new Array<any>();
  public laimagen:any;

  public lacaja:any=null;
  public lacaja2:any=null;
  public mostrarCaja:boolean=false;

  public salidas:number=0;
  public efectivoo:number=0;
  public transfrenciaa:number=0;
  public Tarjetaa:number=0;
  public valservicioo:number=0;
  public valdescuentoo:number=0;
  public valorrealcaja:number=0;
  public descuadree:number=0;

  public ventasnetas:number=0;
  public totallicitado:number=0;
  public ventasbrutas:number=0;

  public losproductos:Array<any>=new Array<any>();
  public losproductosT:Array<any>=new Array<any>();
  public losmonedas:Array<any>=new Array<any>();

  public lacerrarcaja:boolean=false;
  constructor(private servicios:ServiciosService,public dialogRef: MatDialogRef<EldialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {    
    this.params = this.data;  
    this.opcion = this.params.tipo;
    this.MensajeDinamico = this.params.mensaje;
    this.elproducto= this.data.producto;
    this.elproductocaja= this.data.producto;

    this.servicios.GetTiposAll().subscribe(x =>{      
      this.listatipos = x;            
    })
    let lafecha = new Date(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500'));

    this.servicios.getcajahoy(lafecha.getFullYear()+"-"+(lafecha.getMonth()+1)+"-"+lafecha.getDate()+"T00:00:00"
    ,lafecha.getFullYear()+"-"+(lafecha.getMonth()+1)+"-"+lafecha.getDate()+"T23:59:59" ).subscribe(x =>{      
      this.lacaja = x;     
      if(x != null && x.length>0){
        this.mostrarCaja=true;
        this.elproductocaja = x[0];
        
        this.Tarjetaa = this.elproductocaja.Tarjeta
        this.transfrenciaa = this.elproductocaja.Transferencia
        this.valorrealcaja = this.elproductocaja.Efectivo   
        this.efectivoo = this.elproductocaja.Efectivo   
        if(this.elproductocaja.EfectivoReal > 0){
          this.lacerrarcaja = true;
          
          this.totallicitado = this.elproductocaja.TotalLicitado;
          this.ventasbrutas = (this.elproductocaja.VentasBrutas==null)?0:this.elproductocaja.VentasBrutas;
          this.ventasnetas = this.elproductocaja.VentasNetas;
          this.servicios.getcajacierre1(lafecha.getFullYear()+"-"+(lafecha.getMonth()+1)+"-"+lafecha.getDate()+"T00:00:00"
          ,lafecha.getFullYear()+"-"+(lafecha.getMonth()+1)+"-"+lafecha.getDate()+"T23:59:59" ).subscribe(y =>{      
            this.lacaja2 = y;    
            if(y.length>0){
              this.salidas = (y[0].Salidas==null)?0: y[0].Salidas;
            }
           
            this.mostrarCaja=true;
            y.forEach((element2:any) => {
              this.valdescuentoo += Number(element2.ValDescuento)
              this.valservicioo += Number(element2.ValServicio)
             

             
              
            });  
            
            if( Number(this.elproductocaja.EfectivoReal) != Number(this.valorrealcaja)){
              this.descuadree =  Number(this.elproductocaja.EfectivoReal) - Number(this.valorrealcaja)
                if(this.descuadree < 0){
                  this.descuadree = this.descuadree*(-1)
                }
            }
          })
        }
      }
    })
  }

  closecaja(){
    this.dialogRef.close();
  }

  CerrarCaja(){
    this.elproductocaja.Fecha = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500');   
    let lafecha = new Date(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500'));   
    
    let EfectivoFinal =0;
    let TarjetaFinal =0;
    let Transferenciafinal=0;

    let fecha1 =lafecha.getFullYear()+"-"+(lafecha.getMonth()+1)+"-"+lafecha.getDate()+"T00:00:00";
    let fecha2 =lafecha.getFullYear()+"-"+(lafecha.getMonth()+1)+"-"+lafecha.getDate()+"T23:59:59";
    this.servicios.getcajacierre1(fecha1,fecha2 ).subscribe(y =>{      
      this.servicios.listar_ventas(0,fecha1,fecha2).subscribe(x =>{
        this.servicios.listar_salidaventas(0,fecha1,fecha2).subscribe(yy =>{
          this.servicios.listar_pagomonedas(0,fecha1,fecha2).subscribe(yyy =>{          
            this.losproductos = x
            this.losproductosT = x
            this.losmonedas=yyy;
            this.losproductos.forEach(element => {
              element.Hora=element.Hora.toString().substring(0,4)+"0",
              element.Precio = Number(element.Precio)
            });    
                    
            this.losmonedas.forEach(element => {
              if(this.losproductosT.find(x=>x.Id==element.IdPedido)){
                this.losproductosT=this.losproductosT.filter(x =>x.Id != element.IdPedido && x.IdProducto !="")
              }           
            });  
            
            
            EfectivoFinal = this.losproductosT.filter(y => y.TipoPago=="1").reduce((sum, current) => sum + (current.Cantidad*current.Precio), 0)
            TarjetaFinal = this.losproductosT.filter(y => y.TipoPago=="0").reduce((sum, current) => sum + (current.Cantidad*current.Precio), 0)
            Transferenciafinal = this.losproductosT.filter(y => y.TipoPago=="2").reduce((sum, current) => sum + (current.Cantidad*current.Precio), 0)
  
            EfectivoFinal += Number(this.losmonedas.filter(y => y.TipoPago=="1").reduce((sum, current) => sum + (Number(current.Valor)), 0))
            TarjetaFinal += Number(this.losmonedas.filter(y => y.TipoPago=="0").reduce((sum, current) => sum + (Number(current.Valor)), 0))
            Transferenciafinal += Number(this.losmonedas.filter(y => y.TipoPago=="2").reduce((sum, current) => sum + (Number(current.Valor)), 0))
            this.lacaja2 = y;    
            this.salidas = y[0].Salidas   

            y.forEach((element2:any) => {
              
              this.valdescuentoo += Number(element2.ValDescuento)
              this.valservicioo += Number(element2.ValServicio)
              if(element2.TipoPago=="0"){
                this.Tarjetaa = element2.ValorNeto
              }
              if(element2.TipoPago=="1"){
                this.efectivoo = element2.ValorNeto
                this.valorrealcaja = element2.Valor
              }
              if(element2.TipoPago=="2"){
                this.transfrenciaa = element2.ValorNeto
              }             
              
            });  
            
           
            if( Number(this.elproductocaja.EfectivoReal) != Number(this.valorrealcaja)){
              this.descuadree =  Number(this.elproductocaja.EfectivoReal) - Number(this.valorrealcaja)
                if(this.descuadree < 0){
                  this.descuadree = this.descuadree*(-1)
                }
            }

            this.elproductocaja.ValorEfectivo = (EfectivoFinal==null)?0:EfectivoFinal;
            this.elproductocaja.Salidas = (this.salidas==null)?0:this.salidas;
            this.elproductocaja.EfectivoCaja = (EfectivoFinal==null)?0:EfectivoFinal;
            this.elproductocaja.Descuadre = (this.descuadree==null)?0:this.descuadree;
            this.elproductocaja.Descuento =( this.valdescuentoo==null)?0:this.valdescuentoo;
            this.elproductocaja.Impuestos = (this.valservicioo==null)?0:this.valservicioo;

            this.elproductocaja.Tarjeta = (TarjetaFinal==null)?0:TarjetaFinal;
            this.elproductocaja.Transferencia = (Transferenciafinal==null)?0:Transferenciafinal;
            this.elproductocaja.Impresion=false;
            console.log(this.elproductocaja)
            
            this.servicios.save_caja(this.elproductocaja).subscribe( x =>{        
              this.dialogRef.close();
            })
          })
        })
      })
    })
    
    
  }

  handleFileInput(entrada:any){
    this.laimagen = entrada.target.files[0];    
    this.servicios.save_imagen(entrada.target.files[0]).subscribe(x=>{
    })   
  }

  AbrirCaja(){    
    this.elproductocaja.Fecha = formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500');
    this.servicios.save_caja(this.elproductocaja).subscribe( x =>{        
      this.dialogRef.close();
    })
  }

  imprimir(){    
      this.elproducto.Impresion=true;
     
      this.servicios.save_caja(this.elproducto).subscribe( x =>{        
        this.dialogRef.close();
      })
  }
  
  
  aceptarTipoF(){
    this.dialogRef.close({resultado:true,data:this.params,otro:this.tipografica});
  }

  aceptarG(){
    this.dialogRef.close();
  }
  

  ModificarProd(){
    
    if(this.opcion==2){
      if(this.laimagen !=null){
        this.elproducto.Imagen =this.servicios.LosServicios.API+"/assets/img/"+this.laimagen.name;
      }
      this.servicios.update_producto(this.elproducto).subscribe( x =>{        
        this.dialogRef.close();
      })
    }else{     
      this.servicios.update_config(this.elproducto).subscribe( x =>{      
        this.dialogRef.close();
      })
    }   
  }


}
