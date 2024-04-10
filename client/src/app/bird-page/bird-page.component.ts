import { Component, ElementRef, ViewChild } from "@angular/core";
import { BirdSpecies, SpeciesStatus } from "../../../../common/tables/BirdSpecies";
import { CommunicationService } from "../communication.service";


@Component({
  selector: 'app-bird-page',
  templateUrl: './bird-page.component.html',
  styleUrls: ['./bird-page.component.css']
})
export class BirdPageComponent {
  @ViewChild("newScientificName") newScientificName: ElementRef;
  @ViewChild("newCommonName") newCommonName: ElementRef;
  @ViewChild("newSpeciesStatus") newSpeciesStatus: ElementRef;
  @ViewChild("newScientificNameConsumed") newScientificNameConsumed: ElementRef;

  public birds: BirdSpecies[] = [];
  public birdStatus: SpeciesStatus[] = [SpeciesStatus.Unthreatened, SpeciesStatus.MinorConcern, SpeciesStatus.Vulnerable]
  public duplicateError: boolean = false;

  public constructor(private communicationService: CommunicationService) {}

  public ngOnInit(): void {
    this.getBirds();
  }

  public getBirds(): void {
    this.communicationService.getBirds().subscribe((hotels: BirdSpecies[]) => {
      console.log(hotels);
      this.birds = hotels;
    });
  }

  public insertBird(): void {
    const hotel: BirdSpecies = {
      scientificName: this.newScientificName.nativeElement.innerText,
      commonName: this.newCommonName.nativeElement.innerText,
      speciesStatus: this.newSpeciesStatus.nativeElement.innerText,
      scientificNameConsumed: this.newScientificNameConsumed.nativeElement.innerText
    };

    this.communicationService.insertBird(hotel).subscribe((res: number) => {
      if (res > 0) {
        this.communicationService.filter("update");
      }
      this.refresh();
      this.duplicateError = res === -1;
    });
  }

  private refresh() {
    this.getBirds();
    this.newScientificName.nativeElement.innerText = "";
    this.newCommonName.nativeElement.innerText = "";
    this.newSpeciesStatus.nativeElement.innerText = "";
    this.newScientificNameConsumed.nativeElement.innerText = "";
  }

  public deleteBird(hotelNb: string) {
    this.communicationService.deleteBird(hotelNb).subscribe((res: number) => {
      this.refresh();
    });
  }

  public changeBirdCommonName(event: any, i:number){
    const editField = event.target.textContent;
    this.birds[i].commonName = editField;
  }

  public changeSpeciesStatus(event: Event, i:number){
    const cell = event.target as HTMLTableCellElement;
    console.log(cell.textContent)
    // const editField = cell.textContent ?? 'Vulnérable';
    this.birds[i].speciesStatus = SpeciesStatus.Vulnerable;
  }

  public changeConsumed(event: Event, i:number){
    const cell = event.target as HTMLTableCellElement;
    console.log(cell.textContent)
    // const editField = cell.textContent ?? 'Vulnérable';
    this.birds[i].speciesStatus = SpeciesStatus.Vulnerable;
  }

  public updateBird(i: number) {
    this.communicationService.updateBird(this.birds[i]).subscribe((res: number) => {
      this.refresh();
    });
  }

  public trackByFunc(index: number, bird: BirdSpecies) {
    return bird ? bird.scientificName : undefined;
  }
}
