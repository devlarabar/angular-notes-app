import { Component, ViewChild, ElementRef, NgModule } from '@angular/core';
import { NoteCardComponent } from '../../note-card/note-card.component';
import { Note } from '../../shared/note.model';
import { NotesService } from '../../shared/notes.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

interface countObj {
  [key: number]: number
}

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [NoteCardComponent, CommonModule, RouterModule, MatInputModule, MatIconModule],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.css',
  animations: [
    trigger('itemAnim', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('100ms', style({ opacity: 0 }))
      ])
    ]),
  ]
})
export class NotesListComponent {
  notes: Note[] = new Array<Note>()
  filteredNotes: Note[] = new Array<Note>()

  @ViewChild("filterInput") filterInputElRef: ElementRef

  constructor(private notesService: NotesService) { }

  ngOnInit() {
    // Retrieve all notes from NotesService
    this.notes = this.notesService.getAll()
    this.filteredNotes = this.filterNotes("")
  }

  deleteNote(note: Note) {
    let noteId = this.notesService.getId(note)
    this.notesService.delete(noteId)
    this.filterNotes(this.filterInputElRef.nativeElement.value)
  }

  filterNotes(query: string) {
    query = query.toLowerCase().trim()
    let allResults: Note[] = new Array<Note>()
    let terms: string[] = query.split(" ")
    terms = this.removeDuplicateSearchTerms(terms)
    terms.forEach(term => {
      let results: Note[] = this.getRelevantNotes(term)
      allResults = [...allResults, ...results]
    })
    let uniqueResults = this.removeDuplicateNotes(allResults)
    this.filteredNotes = uniqueResults
    // Sort by relevance
    this.sortByRelevance(allResults) // More dupes = higher relevance
    return this.filteredNotes
  }

  removeDuplicateNotes(arr: Array<Note>): Array<Note> {
    let uniqueResults: Set<Note> = new Set<Note>
    arr.forEach(val => uniqueResults.add(val))
    return Array.from(uniqueResults)
  }

  removeDuplicateSearchTerms(arr: Array<any>): Array<any> {
    let uniqueResults: Set<any> = new Set<any>()
    arr.forEach(val => uniqueResults.add(val))
    return Array.from(uniqueResults)
  }

  getRelevantNotes(query: string): Array<Note> {
    query = query.toLowerCase().trim()
    let relevantNotes = this.notes.filter(note => {
      return (note.body && note.body.toLowerCase().includes(query)) || note.title.toLowerCase().includes(query)
    })
    return relevantNotes
  }

  sortByRelevance(searchResults: Note[]) {
    let noteCountObj: countObj = {} // k:v => NoteId:number (note:count)
    searchResults.forEach(note => {
      let noteId = this.notesService.getId(note)
      if (noteCountObj[noteId]) {
        noteCountObj[noteId]++
      } else {
        noteCountObj[noteId] = 1
      }
    })
    this.filteredNotes = this.filteredNotes.sort((a: Note, b: Note) => {
      let aId = this.notesService.getId(a)
      let bId = this.notesService.getId(b)
      let aCount = noteCountObj[aId]
      let bCount = noteCountObj[bId]
      return bCount - aCount
    })
  }

  generateNoteUrl(note: Note) {
    let noteId = this.notesService.getId(note)
    return noteId.toString()
  }
}
