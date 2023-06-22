import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoterComponent } from './quoter.component';

describe('QuoterComponent', () => {
  let component: QuoterComponent;
  let fixture: ComponentFixture<QuoterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuoterComponent]
    });
    fixture = TestBed.createComponent(QuoterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
