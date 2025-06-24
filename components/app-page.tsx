'use client'

import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mic, Share2, Trash2, Download, Save, Plus, Menu } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface Note {
  id: string
  title: string
  description: string
}

export function AppPage() {
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', title: 'Note 1', description: 'Description for Note 1' },
    { id: '2', title: 'Note 2', description: 'Description for Note 2' },
  ])
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0])
  const [isRecording, setIsRecording] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleNewNote = () => {
    const newNote = { id: uuidv4(), title: 'New Note', description: '' }
    setNotes([newNote, ...notes])
    setSelectedNote(newNote)
    setIsSidebarOpen(false)
  }

  const handleNoteSelect = (note: Note) => {
    setSelectedNote(note)
    setIsSidebarOpen(false)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedNote) {
      const updatedNote = { ...selectedNote, title: e.target.value }
      setSelectedNote(updatedNote)
      updateNoteInList(updatedNote)
    }
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedNote) {
      const updatedNote = { ...selectedNote, description: e.target.value }
      setSelectedNote(updatedNote)
      updateNoteInList(updatedNote)
    }
  }

  const updateNoteInList = (updatedNote: Note) => {
    setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note))
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId))
    if (selectedNote?.id === noteId) {
      setSelectedNote(notes.length > 1 ? notes[0] : null)
    }
  }

  const handleSaveNote = () => {
    console.log('Saving note:', selectedNote)
  }

  const handleDownloadNote = () => {
    if (selectedNote) {
      const blob = new Blob([JSON.stringify(selectedNote)], { type: 'application/json' })
      const href = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = href
      link.download = `${selectedNote.title}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleAudioTranscription = () => {
    setIsRecording(!isRecording)
    if (isRecording) {
      setTimeout(() => {
        if (selectedNote) {
          const updatedNote = {
            ...selectedNote,
            description: selectedNote.description + ' Transcribed audio content.'
          }
          setSelectedNote(updatedNote)
          updateNoteInList(updatedNote)
        }
        setIsRecording(false)
      }, 3000)
    }
  }

  const handleShare = () => {
    if (selectedNote) {
      setShareUrl(`https://yournotes.app/note/${selectedNote.id}`)
    }
  }

  const renderSidebar = () => (
    <div className="space-y-2">
      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={handleNewNote}
      >
        <Plus className="mr-2 h-4 w-4" /> New Note
      </Button>
      {notes.map(note => (
        <Button
          key={note.id}
          variant={selectedNote?.id === note.id ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleNoteSelect(note)}
        >
          {note.title}
        </Button>
      ))}
    </div>
  )

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 border-b">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Notes</SheetTitle>
              <SheetDescription>Select a note or create a new one.</SheetDescription>
            </SheetHeader>
            {renderSidebar()}
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-bold">Notes App</h1>
        <div className="w-8" /> {/* Spacer for alignment */}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 border-r border-border p-4 overflow-y-auto">
          {renderSidebar()}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {selectedNote ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <Input
                  value={selectedNote.title}
                  onChange={handleTitleChange}
                  className="text-2xl font-bold"
                  placeholder="Title"
                />
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="icon" onClick={handleSaveNote}>
                    <Save className="h-4 w-4" />
                    <span className="sr-only">Save note</span>
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleDownloadNote}>
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download note</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleAudioTranscription}
                    className={isRecording ? "animate-pulse" : ""}
                  >
                    <Mic className="h-4 w-4" />
                    <span className="sr-only">Record audio</span>
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={handleShare}>
                        <Share2 className="h-4 w-4" />
                        <span className="sr-only">Share note</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Share Note</DialogTitle>
                        <DialogDescription>
                          Copy the link below to share this note:
                        </DialogDescription>
                      </DialogHeader>
                      <Input value={shareUrl} readOnly />
                      <DialogFooter>
                        <Button onClick={() => navigator.clipboard.writeText(shareUrl)}>
                          Copy Link
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete note</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your note.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteNote(selectedNote.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <Textarea
                value={selectedNote.description}
                onChange={handleDescriptionChange}
                className="min-h-[200px]"
                placeholder="Description"
              />
            </div>
          ) : (
            <p className="text-center mt-8">Select a note to view and edit</p>
          )}
        </div>
      </div>
    </div>
  )
}