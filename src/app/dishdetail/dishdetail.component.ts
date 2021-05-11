import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { trigger, style, animate, state, transition } from '@angular/animations';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility', [
      state('shown', style({
        transform: 'scale(1.0)',
        opacity: 1
      })),
      state('hidden', style({
        transform: 'scale(0.5)',
        opacity: 0
      })),
      transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]
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
  dishCopy: Dish;
  visibility = 'shown';

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
      .pipe(switchMap((params: Params) => {
        this.visibility = 'hidden';
        return this.dishService.getDish(params['id']);
      }))
      .subscribe((dish) => {
        this.dish = dish;
        this.dishCopy = dish;
        this.setPrevNext(dish.id);
        this.visibility = 'shown';
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
    this.dishCopy.comments.push(this.newComment);
    this.dishService.putDish(this.dishCopy)
      .subscribe((dish: Dish) => {
        this.dish = dish;
        this.dishCopy = dish;
      },
        errmess => {
          this.dish = null;
          this.dishCopy = null;
          this.errMess = <any>errmess;
        })
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
