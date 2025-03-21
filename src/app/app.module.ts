import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { FormsModule } from '@angular/forms';
import { ContractsComponent } from './employeeDash/contracts/contracts.component';
import { AddHolidayRequestComponent } from './employeeDash/add-holiday-request/add-holiday-request.component';
import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule,FullCalendarModule ,FormsModule],
  // providers: [
  //   AuthService,
  //   {
  //     provide: HTTP_INTERCEPTORS,
  //     useClass: AuthInterceptor,
  //     multi: true,
  //   },
  // ],
  bootstrap: [AppComponent],
})
export class AppModule {}
