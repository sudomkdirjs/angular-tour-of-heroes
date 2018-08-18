import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
// import 'rxjs/add/operator/map';

import { Hero } from '../hero';
import { HEROES } from '../mock-heroes';
import { HeroService } from '../hero.service';


@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit, OnDestroy {
  heroes: Hero[];
  dtOptions: DataTables.Settings = {};

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.getHeroes();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }


  getHeroes(): void {
    this.heroService.getHeroes()
    .subscribe(heroes => this.setHeroes(heroes));
  }

  setHeroes(heroes: Hero[]) {
    this.heroes = heroes;
    // Calling the DT trigger to manually render the table
    this.dtTrigger.next();
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        // this.heroes.push(hero);
        this.heroes = this.heroes.concat(hero);
        // this.dtTrigger.next();
      });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
    // this.dtTrigger.next();
  }

}