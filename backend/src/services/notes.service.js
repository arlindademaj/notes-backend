import { Note } from "../models/note.model.js";

export const createNote = async (content) => {
  const note = new Note({ content });
  return await note.save();
};

export const getAllNotes = async () => {
  return await Note.find();
};

export const getNoteById = async (id) => {
  return await Note.findById(id);
};

export const updateNote = async (id, data) => {
  return await Note.findByIdAndUpdate(
    id,
    {
      ...data,
      updatedAt: new Date(),
    },
    {
      new: true,
    },
  );
};

export const deleteNote = async (id) => {
  return await Note.findByIdAndDelete(id);
};
