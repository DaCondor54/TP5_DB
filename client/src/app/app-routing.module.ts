import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { BirdSpecies } from "./bird-species/bird-species.component";

const routes: Routes = [
  { path: "app", component: BirdSpecies },
  { path: "bird-species", component: BirdSpecies },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }