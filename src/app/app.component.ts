import { Component, OnInit } from '@angular/core';
import { debounceTime, map, Subject, Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'my-app',
  template: `
  <form>
  <p>
    <input type="text" id="searchBox6" />
  </p>

  <p>
    suggestion:
    
  </p>
  <p>
      {{ suggestedOutput }}
    </p>
</form>
`,
})
export class AppComponent implements OnInit {
  suggestedOutput: string;

  public keyUp = new Subject<KeyboardEvent>();
  private subscription: Subscription;
  dictionary: string[] = [
    'a',
    'abandon',
    'ability',
    'able',
    'abortion',
    'about',
    'above',
    'abroad',
    'absence',
    'absolute',
    'absolutely',
    'absorb',
    'abuse',
    'academic',
    'accept',
    'access',
    'accident',
    'accompany',
  ];

  wordsNotInDictionary: string[] = [];

  constructor() {}

  ngOnInit(): void {
    const searchBox6 = document.getElementById('searchBox6');
    const keyup6$ = fromEvent(searchBox6, 'keyup');
    keyup6$
      .pipe(
        map((i: any) => i.currentTarget.value),
        debounceTime(500)
      )
      .subscribe((x) => {
        let wordInput = x;

        //split the x into words.
        //Take the latest word.
        const wordArray = wordInput.split(' ');

        if (wordArray.length > 0) {
          this.suggestedOutput = '';
          wordInput = wordArray[wordArray.length - 1];
        }

        //Find word in dictionary.
        const dictionarySuggestion = this.dictionaryWordFinder(wordInput)[0];

        //find word in cache
        const cacheSuggestion = this.noneDictionaryWordFinder(wordInput)[0];
 
        console.log('My input word: ' + wordInput);
        console.info('dictionary suggestion', dictionarySuggestion);
        console.info('non dictionary suggestion', cacheSuggestion);

        //Condition 1: If empty, offer no suggestion.
        if (wordInput === '') {
          this.suggestedOutput = null;
        }
        //Condition 2: Choose to default to dictionary
        else if (dictionarySuggestion !== undefined) {
          this.suggestedOutput = dictionarySuggestion;
        } else if (cacheSuggestion !== undefined) {
          //Condition 3: Choose to default to words that are not in dictionary,
          // but were typed previously by user.
          this.suggestedOutput = cacheSuggestion;
        } else {
          //Condtion 4: save typed word to cache.
          this.wordsNotInDictionary.unshift(wordInput);
        }
         console.log(this.wordsNotInDictionary);
      });
  }

  private dictionaryWordFinder(wordInput: string): string[] {
    return this.dictionary.filter((l) => l.indexOf(wordInput) > -1);
  }

  private noneDictionaryWordFinder(wordInput: string): string[] {
    return this.wordsNotInDictionary.filter((l) => l.indexOf(wordInput) > -1);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
