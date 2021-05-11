import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  commentForm: FormGroup;
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  newComment: Comment;
  errMess: string;
  @ViewChild('fform') commentFormDirective;

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required': 'Author name is required',
      'minlength': 'Author name must be at least 2 characters long',
    },
    'comment': {
      'required': 'Comment is required'
    }
  };

  constructor(private dishService: DishService,
    private location: Location,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    @Inject('BaseURL') private baseURL) {
    this.createForm();
    this.newComment = {
      author: '',
      date: new Date().toISOString(),
      comment: '',
      rating: 5
    }
  }

  ngOnInit(): void {
    this.dishService.getDishIds()
      .subscribe((ids: string[]) => this.dishIds = ids);
    this.route.params
      .pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
      .subscribe((dish) => {
        this.dish = dish;
        this.setPrevNext(dish.id);
      },
        errmess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId: string): void {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(index - 1 + this.dishIds.length) % this.dishIds.length];
    this.next = this.dishIds[(index + 1 + this.dishIds.length) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

  createForm(): void {
    this.commentForm = this.fb.group({
      'author': ['', [Validators.required, Validators.minLength(2)]],
      'rating': 5,
      'comment': ['', Validators.required]
    });

    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanges(data));

    this.onValueChanges();
  }

  onSubmit(): void {
    this.newComment.author = this.commentForm.value.author;
    this.newComment.comment = this.commentForm.value.comment;
    this.newComment.rating = this.commentForm.value.rating;
    this.newComment.date = new Date().toISOString();
    this.dish.comments.push(this.newComment);
    this.commentFormDirective.resetForm();
    this.commentForm.reset({
      'author': '',
      'rating': 5,
      'comment': ''
    });
  }

  onValueChanges(data?): void {
    if (!this.commentForm) return;
    console.log(this.formErrors);
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && control.invalid) {
          const messages = this.validationMessages[field];
          for (const message in messages) {
            if (control.errors.hasOwnProperty(message))
              this.formErrors[field] += messages[message] + ' ';
          }
        }
      }
    }
  }

}
