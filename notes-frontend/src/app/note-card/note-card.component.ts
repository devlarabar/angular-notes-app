import { Component, ViewChild, ElementRef, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [RouterModule, MatCardModule],
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.css'
})
export class NoteCardComponent {

  @Input("title") title: string;
  @Input("body") body: string;
  @Input("link") link: string;

  @Output("delete") deleteEvent: EventEmitter<void> = new EventEmitter<void>;

  @ViewChild("truncator", { static: true }) truncator: ElementRef<HTMLElement>;
  @ViewChild("bodyText", { static: true }) bodyText: ElementRef<HTMLElement>;

  constructor(private renderer: Renderer2) { }

  //ngOnInit() { }

  ngOnInit() {
    if (typeof window !== "undefined") {
      // If no overflow, hide truncator
      let style = window.getComputedStyle(this.bodyText.nativeElement, null)
      let viewableHeight = parseInt(style.getPropertyValue("height"), 10)

      if (this.bodyText.nativeElement.scrollHeight > viewableHeight) {
        this.renderer.setStyle(this.truncator.nativeElement, 'display', 'block');
      } else {
        this.renderer.setStyle(this.truncator.nativeElement, 'display', 'none');
      }
    }
  }

  onXButtonClick() {
    this.deleteEvent.emit()
  }

}
