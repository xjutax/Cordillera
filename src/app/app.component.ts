import { ThisReceiver } from '@angular/compiler';
import { Component } from '@angular/core';
import { ServiciosService } from 'src/shared/services/servicios.service';
const config = require("./../assets/Data/AppSettings.json");

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(private elservicio:ServiciosService){    
    this.elservicio.LosServicios=config;    
  }
}
