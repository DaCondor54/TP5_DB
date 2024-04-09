import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BirdSpecies } from './bird-species.component';

describe('HotelComponent', () => {
  let component: BirdSpecies;
  let fixture: ComponentFixture<BirdSpecies>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BirdSpecies ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BirdSpecies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
