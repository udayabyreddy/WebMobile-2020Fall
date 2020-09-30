



import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingList } from './shopping-list.component';

describe('SearchRecipeComponent', () => {
  let component: ShoppingList;
  let fixture: ComponentFixture<ShoppingList>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingList ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
