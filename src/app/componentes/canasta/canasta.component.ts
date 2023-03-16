import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServiciosService } from 'src/shared/services/servicios.service';
import { GrancanastaComponent } from '../grancanasta/grancanasta.component';

@Component({
  selector: 'app-canasta',
  templateUrl: './canasta.component.html',
  styleUrls: ['./canasta.component.css']
})
export class CanastaComponent implements OnInit {
  public cantidad:number=0;
  public total:number=0;
  constructor(private servicios:ServiciosService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.servicios.tococanasta.subscribe(xx =>{
      let lalista = this.servicios.getcanasta() as Array<any>;
      if(lalista != null){
        this.cantidad = lalista.reduce((sum, current) => sum + Number(current.Cantidad), 0);

        this.total = lalista.reduce((sum, current) => sum + (Number(current.Cantidad)*Number(current.Precio)), 0);
      }
      
    })
  }

  vercanasta(){
    let canasta = this.servicios.getcanasta() as Array<any>;  
    if(canasta != null){
      const dialogRef = this.dialog.open(GrancanastaComponent, {
        maxWidth: '100vw',
        minWidth: '70%',
        panelClass: 'my-panel',
        data: {  
          elenvio:canasta[0]       
        }
      });
    }
    
  }

}
