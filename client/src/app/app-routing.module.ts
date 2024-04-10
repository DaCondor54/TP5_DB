import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { BirdPageComponent } from "./bird-page/bird-page.component";

const routes: Routes = [
  { path: "**", component: BirdPageComponent },
  { path: "app", component: AppComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }