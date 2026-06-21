import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChildDetailsPage } from './child-details.page';

describe('ChildDetailsPage', () => {
  let component: ChildDetailsPage;
  let fixture: ComponentFixture<ChildDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
