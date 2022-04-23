import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MainComponent } from './pages/main/main.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { DialogScheduleComponent } from './pages/main/dialog-schedule/dialog-schedule.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { ConfirmationDialogComponent } from './pages/main/dialog-schedule/confirmation-dialog/confirmation-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchedulesComponent } from './pages/schedules/schedules.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    DialogScheduleComponent,
    ConfirmationDialogComponent,
    SchedulesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],

  bootstrap: [AppComponent],
})
export class AppModule {}
