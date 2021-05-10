import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor() { }

  getDishes(): Dish[]{
    return DISHES;
  }

  getDish(id: string): Dish{
    return DISHES.filter((dish: Dish) => dish.id === id)[0]; 
  }

  getFeaturedDish(): Dish{
    return DISHES.filter((dish: Dish) => dish.featured)[0];
  }
}
