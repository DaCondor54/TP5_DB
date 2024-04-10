import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { CommunicationService } from "./communication.service";
import { AppComponent } from "./app.component";
import { BirdPageComponent } from './bird-page/bird-page.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [CommunicationService],
  bootstrap: [AppComponent],
  declarations: [
    BirdPageComponent,
    AppComponent
  ],
})
export class AppModule { }
