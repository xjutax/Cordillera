import { Component, OnInit,Inject  } from '@angular/core';
import { MatDialog,MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EldialogComponent } from 'src/app/componentes/eldialog/eldialog.component';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/Animated";

import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import { ServiciosService } from 'src/shared/services/servicios.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {

  public lafechaS:string="";
  public lafecha:Date= new Date(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500'));
  public lafechaR:Date= new Date(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500'));
  public tipobusqueda:number=0;
  public losproductos:Array<any>=new Array<any>();
  public losproductosT:Array<any>=new Array<any>();
  public losmonedas:Array<any>=new Array<any>();
  public losproductos2:Array<any>=new Array<any>();
  public losproductos3:Array<any>=new Array<any>();
  public losarticulos:Array<any>=new Array<any>();
  public lascategorias:Array<any>=new Array<any>();
  public lassalidas:Array<any>=new Array<any>();
  
  public fechabase2:Date=new Date(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500'));
  public fecha1:string="";
  public fecha2:string="";

  public TotalFinal:number=0;
  public SubTotalFinal:number=0;
  public SalidasFinal:number=0;
  public EfectivoFinal:number=0;
  public TarjetaFinal:number=0;
  public Transferenciafinal : number =0;
  constructor(private servicios:ServiciosService,public dialog: MatDialog) { 
    this.lafechaS=this.lafecha.getDate()+" "+this.lafecha.toLocaleString('default', { month: 'long' });
    this.lafecha = new Date(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss','en-US','-0500'))
    this.lafechaS=this.lafecha.getDate()+" "+this.lafecha.toLocaleString('default', { month: 'long' });
  }

  ngOnInit(): void {
    this.servicios.tocoventas.subscribe(x=>{      
      this.consultaryarmar();
    })
    
  }

  consultaryarmar(){
    this.SalidasFinal=0;
    this.losproductos2 = new Array<any>();
    this.losproductos3 = new Array<any>();
    this.lassalidas= new Array<any>();
    
    this.SalidasFinal  = 0
    this.SubTotalFinal = 0
    this.TotalFinal    = 0
    this.EfectivoFinal = 0
    this.TarjetaFinal  = 0
    this.Transferenciafinal=0;
    this.fechabase2 = new Date(this.lafecha);
    
    this.fechabase2.setDate(this.lafecha.getDate()+1);
    this.fecha1 = this.lafecha.getFullYear()+"-"+ (this.lafecha.getMonth()+1)+"-"+this.lafecha.getDate()+"T00:00:00"
    this.fecha2 = this.fechabase2.getFullYear()+"-"+ (this.fechabase2.getMonth()+1)+"-"+this.fechabase2.getDate()+"T00:00:00"
    
    this.servicios.listar_ventas(this.tipobusqueda,this.fecha1,this.fecha2).subscribe(x =>{
      this.servicios.listar_salidaventas(this.tipobusqueda,this.fecha1,this.fecha2).subscribe(yy =>{
        this.servicios.listar_pagomonedas(this.tipobusqueda,this.fecha1,this.fecha2).subscribe(yyy =>{
          this.lassalidas=yy;
          this.losproductos = x
          this.losproductosT = x
          this.losmonedas=yyy;
          this.losproductos.forEach(element => {
            element.Hora=element.Hora.toString().substring(0,4)+"0",
            element.Precio = Number(element.Precio)
          });    
          
          this.SalidasFinal = this.lassalidas.reduce((sum, current) => sum + Number(current.Valor), 0)
          this.SubTotalFinal = this.losproductos.reduce((sum, current) => sum + (current.Cantidad*current.Precio), 0)


          this.losproductos.forEach( ele =>{
            this.losproductos2.push({ NombreProducto:ele.NombreProducto,NombreTipo:ele.NombreTipo,Cantidad:ele.Cantidad,Precio:ele.Precio  })
          })
          this.losproductos.forEach( ele =>{
            this.losproductos3.push({ NombreProducto:ele.NombreProducto,NombreTipo:ele.NombreTipo,Cantidad:ele.Cantidad,Precio:ele.Precio  })
          })
          this.armargrilla();

          
          this.losmonedas.forEach(element => {
            if(this.losproductosT.find(x=>x.Id==element.IdPedido)){
              this.losproductosT=this.losproductosT.filter(x =>x.Id != element.IdPedido && x.IdProducto !="")
            }           
          });  
          
          this.TotalFinal = this.SubTotalFinal - this.SalidasFinal
          this.EfectivoFinal = this.losproductosT.filter(y => y.TipoPago=="1").reduce((sum, current) => sum + (current.Cantidad*current.Precio), 0)
          this.TarjetaFinal = this.losproductosT.filter(y => y.TipoPago=="0").reduce((sum, current) => sum + (current.Cantidad*current.Precio), 0)
          this.Transferenciafinal = this.losproductosT.filter(y => y.TipoPago=="2").reduce((sum, current) => sum + (current.Cantidad*current.Precio), 0)

          this.EfectivoFinal += Number(this.losmonedas.filter(y => y.TipoPago=="1").reduce((sum, current) => sum + (Number(current.Valor)), 0))
          this.TarjetaFinal += Number(this.losmonedas.filter(y => y.TipoPago=="0").reduce((sum, current) => sum + (Number(current.Valor)), 0))
          this.Transferenciafinal += Number(this.losmonedas.filter(y => y.TipoPago=="2").reduce((sum, current) => sum + (Number(current.Valor)), 0))

          this.losarticulos =this.losproductos2.reduce((acc, item) => {  
            let accItem = acc.find((ai:any) => ai.NombreProducto == item.NombreProducto)        
            if(accItem){
                accItem.Cantidad = Number(item.Cantidad) + Number(accItem.Cantidad)
                accItem.Precio = Number(accItem.Cantidad) * Number(item.Precio)         
            }else{
              acc.push(item)
            }      
            return acc;
          },[])

          this.lascategorias =this.losproductos3.reduce((acc, item) => {  
            let accItem = acc.find((ai:any) => ai.NombreTipo == item.NombreTipo)        
            if(accItem){
                accItem.Cantidad = Number(item.Cantidad) + Number(accItem.Cantidad)
                accItem.Precio = Number(accItem.Cantidad) * Number(item.Precio)         
            }else{
              acc.push(item)
            }      
            return acc;
          },[])
        });        
      });                  
    })
  }

  atras(){
    if(this.tipobusqueda==0){
      this.lafecha.setDate(this.lafecha.getDate()-1);
      this.lafechaS=this.lafecha.getDate()+" "+this.lafecha.toLocaleString('default', { month: 'long' });
    }
    if(this.tipobusqueda==1){
      this.lafecha.setMonth(this.lafecha.getMonth()-1);
      this.lafechaS= this.lafecha.toLocaleString('default', { month: 'long' });
    }
    if(this.tipobusqueda==2){
      this.lafecha.setFullYear(this.lafecha.getFullYear()-1);
      this.lafechaS= this.lafecha.getFullYear()+"";
    }
    this.consultaryarmar();
  }

  adelante(){
    if(this.tipobusqueda==0){
      this.lafecha.setDate(this.lafecha.getDate()+1);
      this.lafechaS=this.lafecha.getDate()+" "+this.lafecha.toLocaleString('default', { month: 'long' });
    }  
    if(this.tipobusqueda==1){
      this.lafecha.setMonth(this.lafecha.getMonth()+1);
      this.lafechaS=this.lafecha.toLocaleString('default', { month: 'long' });
    }  
    if(this.tipobusqueda==2){
      this.lafecha.setFullYear(this.lafecha.getFullYear()+1);
      this.lafechaS= this.lafecha.getFullYear()+"";
    }
    this.consultaryarmar();
  }

  abrirtipof(){
    const dialogRef = this.dialog.open(EldialogComponent, {
      panelClass: 'my-panel',
      data: {    
        tipo:1     
      }
    });
    dialogRef.afterClosed().subscribe(result => {     
      this.tipobusqueda=result.otro;
      if(this.tipobusqueda==0){
        this.lafecha.setDate(this.lafecha.getDate());
        this.lafechaS=this.lafecha.getDate()+" "+this.lafecha.toLocaleString('default', { month: 'long' });
      }  
      if(this.tipobusqueda==1){
        this.lafecha.setMonth(this.lafecha.getMonth());
        this.lafechaS=this.lafecha.toLocaleString('default', { month: 'long' });
      }  
      if(this.tipobusqueda==2){
        this.lafecha.setFullYear(this.lafecha.getFullYear());
        this.lafechaS= this.lafecha.getFullYear()+"";
      }
      this.consultaryarmar();
    });
  }

  ngAfterViewInit (){
    this.consultaryarmar();
    
  }

  armargrilla(){
    
    am4core.useTheme(am4themes_animated);

// Create chart instance
var chart = am4core.create("chartdiv", am4charts.XYChart);

// Add data
let eldata = Array<any>();
this.losproductos.forEach( x =>{
  let xx = x.Hora as string;
  eldata.push({ "category": x.Hora,
  "value": x.Precio})
})

chart.data = eldata


// Create axes
var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "category";
categoryAxis.renderer.grid.template.location = 0;
//categoryAxis.renderer.minGridDistance = 30;

var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

// Create series
var series = chart.series.push(new am4charts.ColumnSeries());
series.dataFields.valueY = "value";
series.dataFields.categoryX = "category";

series.columns.template.events.on("hit", function(ev) {
  
});
  }

  armarlistaarticulos(){
    
  }

}
