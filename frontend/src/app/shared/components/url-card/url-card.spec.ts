import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlCard } from './url-card';

describe('UrlCard', () => {
  let component: UrlCard;
  let fixture: ComponentFixture<UrlCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrlCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrlCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
