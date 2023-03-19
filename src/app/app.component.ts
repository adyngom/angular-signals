import {
  Component,
  signal,
  Signal,
  SettableSignal,
  computed,
  effect,
} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <section class="app-header mtable">
      <h2>Multiply By: {{ multiplyBy() }}</h2>
      <div class="flex">
        <button (click)="nextLine()">Next Line</button>
        <button (click)="nextTable()">Next Table</button>
        <button (click)="rewind()" [attr.disabled]="stopRewind() ? true : null">
          Rewind
        </button>
        <button (click)="reset()">Reset</button>
      </div>
    </section>
    <section class="mtable">
      <pre>{{ tableDisplay() }}</pre>
    </section>
  `,
  styles: [
    `
      button {
        margin-right: 0.5rem;
      }
      .flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      section {
        margin: 1rem;
      }
      .mtable {
        max-width: 600px;
        font-size: 2rem;
        margin: 0 auto;
        text-align: center;
      }
      .app-header {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        font-size: 1.15rem;
      }
    `,
  ],
})
export class AppComponent {
  title = 'train-multi';
  multiplyBy: SettableSignal<number> = signal(2);
  count: SettableSignal<number> = signal(1);
  table: SettableSignal<Array<string>> = signal([this.getLine()]);

  stopRewind: Signal<boolean> = computed(() => this.count() === 1);
  tableDisplay: Signal<string> = computed(() => this.table().join('\n'));

  nextLine() {
    this.count.update((c) => c + 1);
    this.table.update((t) => [...t, this.getLine()]);
  }

  nextTable() {
    this.multiplyBy.update((m) => m + 1);
    this.reset();
  }

  reset() {
    this.count.set(1);
    this.table.set([this.getLine()]);
    effect(() => {
      console.log('Table reset and Multipply by is:', this.multiplyBy());
    });
  }

  rewind() {
    this.count.update((c) => c - 1);
    this.table.update((t) => t.slice(0, t.length - 1));
  }

  private getLine(): string {
    const product = this.count() * this.multiplyBy();
    return `${this.count()} * ${this.multiplyBy()} = ${product}`;
  }
}
