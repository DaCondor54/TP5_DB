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
  @ViewChild("newScientificNameConsumed") newScientificNameConsumed: ElementRef<HTMLSelectElement>;

  public birds: BirdSpecies[] = [];
  public birdStatus: SpeciesStatus[] = [SpeciesStatus.Unthreatened, SpeciesStatus.MinorConcern, SpeciesStatus.Vulnerable]
  public duplicateError: boolean = false;
  public errorMessage: string = '';
  public showModal: boolean = false;

  public constructor(private communicationService: CommunicationService) {}

  public ngOnInit(): void {
    this.getBirds();
  }

  public getBirds(): void {
    this.communicationService.getBirds().subscribe((birds: BirdSpecies[]) => {
      birds.forEach(bird => bird.scientificNameConsumed = bird.scientificNameConsumed ? bird.scientificNameConsumed : '' );
      this.birds = birds;
    });
  }

  public insertBird(): void {
    const bird: BirdSpecies = {
      scientificName: this.newScientificName.nativeElement.innerText,
      commonName: this.newCommonName.nativeElement.innerText,
      speciesStatus: this.newSpeciesStatus.nativeElement.value,
      scientificNameConsumed: this.newScientificNameConsumed.nativeElement.value
    };

    this.communicationService.insertBird(bird).subscribe({
      next: (res: number) => {
        if (res > 0) {
          this.communicationService.filter("update");
        }
        this.refresh();
        this.duplicateError = res === -1;
      },
      error: (error: Error) => {
        this.errorMessage = error.message;
        this.showModal = true;
      }
    });
  }

  private refresh() {
    this.getBirds();
    this.newScientificName.nativeElement.innerText = "";
    this.newCommonName.nativeElement.innerText = "";
    this.newSpeciesStatus.nativeElement.value = SpeciesStatus.Unthreatened;
    this.newScientificNameConsumed.nativeElement.value = '';
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

  public updateBird(i: number) {
    this.communicationService.updateBird(this.birds[i]).subscribe((res: number) => {
      this.refresh();
    });
  }

  public trackByFunc(index: number, bird: BirdSpecies) {
    return bird ? bird.scientificName : undefined;
  }
}
