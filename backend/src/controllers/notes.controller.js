import * as notesService from "../services/notes.service.js";

// Create note
export const createNote = async (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    return res.status(BAD_REQUEST).json({
      error: "Title and content are required",
    });
  }

  const note = await notesService.createNote(content);

  res.status(201).json(note);
};
// Get all notes
export const getAllNotes = async (req, res, next) => {
  const notes = await notesService.getAllNotes();
  res.json(notes);
};

// Get note by ID
export const getNoteById = async (req, res, next) => {
  const id = req.params.id;

  const note = await notesService.getNoteById(id);

  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }

  res.json(note);
};

// Delete note by ID
export const deleteNoteById = async (req, res, next) => {
  const id = req.params.id;
  const deletedNote = await notesService.deleteNote(id);

  if (!deletedNote) {
    return res.status(404).json({ error: "Note not found" });
  }

  res.json({ message: "Note deleted", note: deletedNote });
};

// Update note by ID
export const updateNoteById = async (req, res, next) => {
  const id = req.params.id;
  const updatedNoteByID = await notesService.updateNote(id, req.body);

  if (!updatedNoteByID) {
    return res.status(404).json({ error: "Note not found" });
  }

  res.json({ message: "Note updated", note: updatedNoteByID });
};
