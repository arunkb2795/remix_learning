import { json, redirect } from "@remix-run/node";
import NewNote from "~/components/NewNote";
import NoteList from "~/components/NoteList";
import { getStoredNotes, storeNotes } from "~/data/notes";
import newNoteStyles from "~/components/NewNote.css";
import noteListStyles from "~/components/NoteList.css";
import { useCatch, useLoaderData } from "@remix-run/react";

export default function NotesPage() {
  const notes = useLoaderData();
  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export async function loader() {
  const notes = await getStoredNotes();
  if (!notes || notes.length === 0) {
    throw json(
      { message: "Could not find any notes..." },
      {
        status: 404,
        statusText: "Not Found",
      }
    );
  }
  return json(notes);
}

export async function action({ request }) {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);
  if (noteData.title.trim().length < 5) {
    return { message: "Invalid title -must be at least 5 characters long." };
  }
  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();
  const updatedNotes = existingNotes.concat(noteData);
  await storeNotes(updatedNotes);
  // await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000));
  return redirect("/notes");
}

export function meta() {
  return { 
    title: 'All Notes',
    description:'Manage your notes with ease'
  }
}

export function CatchBoundary() {
  const caughtResponse = useCatch();
  const message = caughtResponse.data?.message || "data not found.";
  return (
    <main>
      <NewNote/>
      <p className="info-message">{message}</p>
    </main>
  );
}

export function links() {
  return [
    { rel: "stylesheet", href: newNoteStyles },
    { rel: "stylesheet", href: noteListStyles },
  ];
}
