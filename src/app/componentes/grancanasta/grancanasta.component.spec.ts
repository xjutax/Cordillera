import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrancanastaComponent } from './grancanasta.component';

describe('GrancanastaComponent', () => {
  let component: GrancanastaComponent;
  let fixture: ComponentFixture<GrancanastaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrancanastaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrancanastaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
