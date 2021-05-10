import { Injectable } from '@angular/core';

import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }

  getLeaderes(): Promise<Leader[]>{
    return Promise.resolve(LEADERS);
  }

  getLeader(id: string): Promise<Leader>{
    return Promise.resolve(LEADERS.filter((leader: Leader) => leader.id === id)[0]); 
  }

  getFeaturedLeader(): Promise<Leader>{
    return Promise.resolve(LEADERS.filter((leader: Leader) => leader.featured)[0]);
  }
}
