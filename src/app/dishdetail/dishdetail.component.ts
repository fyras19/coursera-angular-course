import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  dish: Dish;
  id: string;

  constructor(private dishService: DishService,
    private location: Location, 
    private route: ActivatedRoute) {
    this.id = this.route.snapshot.params['id'];
    this.dishService.getDish(this.id).then((dish) => this.dish = dish);
  }

  ngOnInit(): void {
  }

  goBack(): void {
    this.location.back();
  }

}
