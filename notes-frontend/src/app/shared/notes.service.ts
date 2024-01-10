import { Injectable } from '@angular/core';
import { Note } from './note.model';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  notes: Note[] = new Array<Note>()

  constructor() { }

  getAll() {
    return this.notes
  }

  get(id: number) {
    // ID is index of requested data in array
    return this.notes[id]
  }

  getId(note: Note) {
    return this.notes.indexOf(note)
  }

  add(note: Note) {
    // Add a note to the notes array and return the ID of the note
    // where ID = Index
    let newLength = this.notes.push(note)
    let index = newLength - 1
    return index
  }

  update(id: number, title: string, body: string) {
    let note = this.notes[id]
    note.title = title
    note.body = body
  }

  delete(id: number) {
    this.notes.splice(id, 1)
  }

}
