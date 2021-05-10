import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;

  constructor(private dishService: DishService,
    private location: Location,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.dishService.getDishIds().subscribe((ids: string[]) => this.dishIds = ids);
    this.route.params
      .pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe((dish) => {
        this.dish = dish;
        this.setPrevNext(dish.id);
      });
  }

  setPrevNext(dishId: string): void {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(index - 1 + this.dishIds.length) % this.dishIds.length];
    this.next = this.dishIds[(index + 1 + this.dishIds.length) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

}
