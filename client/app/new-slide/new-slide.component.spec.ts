import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSlideComponent } from './new-slide.component';

describe('NewSlideComponent', () => {
  let component: NewSlideComponent;
  let fixture: ComponentFixture<NewSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSlideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
