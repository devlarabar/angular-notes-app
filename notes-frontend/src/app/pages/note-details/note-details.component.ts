import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Note } from '../../shared/note.model';
import { NotesService } from '../../shared/notes.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-note-details',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './note-details.component.html',
  styleUrl: './note-details.component.css'
})
export class NoteDetailsComponent {

  note: Note
  noteId: number
  new: boolean

  constructor(private notesService: NotesService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    // Determine if making new note or editing existing
    this.route.params.subscribe((params: Params) => {
      this.note = new Note()
      if (params['id']) {
        this.note = this.notesService.get(Number(params['id']))
        this.noteId = params['id']
        this.new = false
      } else {
        this.new = true
      }
    })
  }

  onSubmit(form: NgForm) {
    if (this.new) {
      // Save the note using Notes service
      this.notesService.add(form.value)
    } else {
      // Update existing note
      this.notesService.update(this.noteId, form.value.title, form.value.body)
    }
    this.router.navigateByUrl("")
  }

  onCancel() {
    this.router.navigateByUrl("")
  }
}
