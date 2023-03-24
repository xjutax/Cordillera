import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input'
import { NgxPrintModule } from 'ngx-print';
import { HttpClientModule } from '@angular/common/http';
import { ContenedorComponent } from './admin/contenedor/contenedor.component';
import { VentasComponent } from './admin/ventas/ventas.component';
import { MatTabsModule } from '@angular/material/tabs';
import { EldialogComponent } from './componentes/eldialog/eldialog.component';
import { MatDialogModule,MatDialogRef  } from '@angular/material/dialog';
import { AdminPedidosComponent } from './admin/admin-pedidos/admin-pedidos.component';
import { PedidoProductosComponent } from './componentes/pedido-productos/pedido-productos.component';
import { CanastaComponent } from './componentes/canasta/canasta.component';
import { GrancanastaComponent } from './componentes/grancanasta/grancanasta.component';
import { SalidasComponent } from './admin/salidas/salidas.component';
import { TurnosComponent } from './admin/turnos/turnos.component';
import { AdminproductosComponent } from './admin/adminproductos/adminproductos.component';
import { HistorialComponent } from './admin/historial/historial.component';
import { ConfiguracionComponent } from './admin/configuracion/configuracion.component';
import { AdminusuComponent } from './admin/adminusu/adminusu.component';
import { MeseroComponent } from './admin/mesero/mesero.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ContenedorComponent,    
    VentasComponent,
    EldialogComponent,
    AdminPedidosComponent,
    PedidoProductosComponent,
    CanastaComponent,
    GrancanastaComponent,
    SalidasComponent,
    TurnosComponent,
    AdminproductosComponent,
    HistorialComponent,
    ConfiguracionComponent,
    AdminusuComponent,
    MeseroComponent
    
    
  ],
  imports: [
     
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatInputModule,NgxPrintModule,HttpClientModule,MatTabsModule, NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents:[EldialogComponent]
})
export class AppModule { }
