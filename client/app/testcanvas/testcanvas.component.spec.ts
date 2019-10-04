import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestcanvasComponent } from './testcanvas.component';

describe('TestcanvasComponent', () => {
  let component: TestcanvasComponent;
  let fixture: ComponentFixture<TestcanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestcanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestcanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
