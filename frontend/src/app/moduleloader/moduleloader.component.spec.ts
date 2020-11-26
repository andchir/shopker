import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModuleloaderComponent } from './moduleloader.component';

describe('ModuleloaderComponent', () => {
  let component: ModuleloaderComponent;
  let fixture: ComponentFixture<ModuleloaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleloaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
