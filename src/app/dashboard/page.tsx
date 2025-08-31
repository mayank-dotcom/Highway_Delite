"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth, signOutOTP } from "@/lib/auth-hook"


interface Note {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])
  const [notesLoading, setNotesLoading] = useState(false)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set())
  const [editForm, setEditForm] = useState<{ title: string; content: string }>({ title: '', content: '' })

  useEffect(() => {
    if (isLoading) return 
    if (!isAuthenticated) {
      window.location.href = "/signin-otp" 
    }
  }, [isAuthenticated, isLoading])

  useEffect(() => {
    if (user?.email) {
      fetchUserData()
      fetchNotes()
    }
  }, [user])

  const fetchUserData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      if (data.success) {
        const currentUser = data.users.find((userData: any) => userData.email === user?.email)
        setUserData(currentUser)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchNotes = async () => {
    setNotesLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/notes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setNotes(data.notes)
      } else {
        console.error('Failed to fetch notes:', data.error)
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setNotesLoading(false)
    }
  }

  const createNote = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: `Note ${notes.length + 1}`,
          content: 'Start writing your note here...',
        }),
      })
      const data = await response.json()
      if (data.success) {
        setNotes([data.note, ...notes]) 
        
        setExpandedNotes(prev => new Set([...prev, data.note.id]))
        setEditingNote(data.note.id)
        setEditForm({ title: data.note.title, content: data.note.content })
      } else {
        console.error('Failed to create note:', data.error)
      }
    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  const deleteNote = async (noteId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setNotes(notes.filter(note => note.id !== noteId))
        setExpandedNotes(prev => {
          const newSet = new Set(prev)
          newSet.delete(noteId)
          return newSet
        })
        if (editingNote === noteId) {
          setEditingNote(null)
        }
      } else {
        console.error('Failed to delete note:', data.error)
      }
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const updateNote = async (noteId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      })
      const data = await response.json()
      if (data.success) {
        setNotes(notes.map(note => 
          note.id === noteId ? data.note : note
        ))
        setEditingNote(null)
        setEditForm({ title: '', content: '' })
      } else {
        console.error('Failed to update note:', data.error)
      }
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  const startEditing = (note: Note) => {
    setEditingNote(note.id)
    setEditForm({ title: note.title, content: note.content })
  }

  const cancelEditing = () => {
    setEditingNote(null)
    setEditForm({ title: '', content: '' })
  }

  const toggleNoteExpansion = (noteId: string) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(noteId)) {
        newSet.delete(noteId)
      } else {
        newSet.add(noteId)
      }
      return newSet
    })
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null 
  }

  return (
    <main className="min-h-screen bg-gray-50">

      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 max-w-4xl mx-auto lg:px-8">
          <div className="flex justify-between items-center">
      
            <div className="flex items-center gap-3">
              <img src="/hdlogo.png" alt="HD Logo" className="h-6 w-6" />
              <h1 className="text-lg font-semibold text-black">Dashboard</h1>
            </div>

      
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3">
                              {user?.image && (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="h-8 w-8 rounded-full"
                />
              )}
              <div className="text-sm">
                <p className="font-medium text-black">{user?.name}</p>
                <p className="text-gray-600 text-xs">{user?.email}</p>
              </div>
              </div>
              <button
                onClick={() => signOutOTP()}
                className="text-blue-600 text-sm font-medium hover:text-blue-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      
      <div className="px-4 py-6 max-w-4xl mx-auto lg:px-8">
        
        <div className="mb-6 md:hidden">
          <h2 className="text-xl font-semibold text-black mb-1">
            Welcome, {user?.name?.split(' ')[0] || 'User'}!
          </h2>
          <p className="text-sm text-gray-600">
            Email: {user?.email}
          </p>
        </div>

        
        <div className="hidden md:block mb-8">
          <h2 className="text-2xl font-bold text-black mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h2>
          <p className="text-gray-600">
            Manage your notes and stay organized.
          </p>
        </div>

        
        <button
          onClick={createNote}
          className="w-full md:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg font-medium mb-6 hover:bg-blue-700 transition-colors"
        >
          Create Note
        </button>

        
        <div>
          <h3 className="text-lg font-semibold text-black mb-4">Notes</h3>
          
          {notesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading notes...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {editingNote === note.id ? (
                          <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full text-lg font-semibold text-black border-b border-gray-300 focus:border-blue-500 focus:outline-none pb-1"
                            placeholder="Note title"
                          />
                        ) : (
                          <h4 className="text-lg font-semibold text-black cursor-pointer" onClick={() => toggleNoteExpansion(note.id)}>
                            {note.title}
                          </h4>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(note.updatedAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {editingNote === note.id ? (
                          <>
                            <button
                              onClick={() => updateNote(note.id)}
                              className="text-green-600 hover:text-green-700 p-1"
                              title="Save changes"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="text-gray-600 hover:text-gray-700 p-1"
                              title="Cancel editing"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(note)}
                              className="text-blue-600 hover:text-blue-700 p-1"
                              title="Edit note"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteNote(note.id)}
                              className="text-red-600 hover:text-red-700 p-1"
                              title="Delete note"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  
                  {expandedNotes.has(note.id) && (
                    <div className="p-4 pt-0">
                      {editingNote === note.id ? (
                        <textarea
                          value={editForm.content}
                          onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                          className="w-full min-h-[120px] text-gray-700 border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:outline-none resize-y"
                          placeholder="Write your note content here..."
                        />
                      ) : (
                        <div className="min-h-[120px] text-gray-700 whitespace-pre-wrap">
                          {note.content}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {notes.length === 0 && !notesLoading && (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg mb-2">No notes yet</p>
                  <p className="text-sm">Create your first note to get started!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
