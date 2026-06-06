import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkModal } from './link-modal';

describe('LinkModal', () => {
  let component: LinkModal;
  let fixture: ComponentFixture<LinkModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
