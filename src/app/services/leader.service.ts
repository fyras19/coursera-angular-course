import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }

  getLeaderes(): Observable<Leader[]>{
    return of(LEADERS).pipe(delay(2000));
  }

  getLeader(id: string): Observable<Leader>{
    return of(LEADERS.filter((leader: Leader) => leader.id === id)[0]).pipe(delay(2000));
  }

  getFeaturedLeader(): Observable<Leader>{
    return of(LEADERS.filter((leader: Leader) => leader.featured)[0]).pipe(delay(2000));
  }
}
