import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminusuComponent } from './adminusu.component';

describe('AdminusuComponent', () => {
  let component: AdminusuComponent;
  let fixture: ComponentFixture<AdminusuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminusuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminusuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
