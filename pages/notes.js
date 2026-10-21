import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const NOTES_STORAGE_KEY = "daynote-notes";

export default function NotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [draft, setDraft] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem("notes-app-authenticated") !== "true") {
      router.replace("/");
      return;
    }

    try {
      const savedNotes = JSON.parse(window.localStorage.getItem(NOTES_STORAGE_KEY) || "[]");
      if (!Array.isArray(savedNotes)) {
        throw new Error("Saved notes must be a list.");
      }
      setNotes(savedNotes);
      setIsReady(true);
    } catch (error) {
      console.error("Could not load saved notes.", error);
      setNotes([]);
      setIsReady(true);
    }
  }, [router]);

  function saveNotes(nextNotes) {
    setNotes(nextNotes);
    window.localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(nextNotes));
  }

  function handleAddNote(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) {
      return;
    }

    saveNotes([{ id: `${Date.now()}-${Math.random()}`, text }, ...notes]);
    setDraft("");
  }

  function handleDeleteNote(id) {
    saveNotes(notes.filter((note) => note.id !== id));
  }

  function handleLogout() {
    window.localStorage.removeItem("notes-app-authenticated");
    router.push("/");
  }

  if (!isReady) {
    return <main className="loading-screen">Opening your notes...</main>;
  }

  return (
    <main className="notes-layout">
      <header className="notes-header">
        <a className="brand notes-brand" href="/" aria-label="Daynote home">
          <span className="brand-mark">d</span>
          <span>daynote</span>
        </a>
        <button className="logout-button" onClick={handleLogout} type="button">
          Log out <span aria-hidden="true">↗</span>
        </button>
      </header>

      <section className="notes-content">
        <span className="eyebrow">YOUR PERSONAL NOTEBOOK</span>
        <h1>A place for your thoughts.</h1>
        <p className="notes-intro">Capture the little things before they slip away.</p>

        <form className="note-composer" onSubmit={handleAddNote}>
          <label className="visually-hidden" htmlFor="new-note">
            Write a new note
          </label>
          <textarea
            id="new-note"
            onChange={(event) => setDraft(event.target.value)}
            placeholder="What’s on your mind?"
            rows="4"
            value={draft}
          />
          <div className="composer-footer">
            <span>Only you can see your notes on this device.</span>
            <button className="primary-button add-button" type="submit">
              Add note <span aria-hidden="true">+</span>
            </button>
          </div>
        </form>

        <div className="notes-heading">
          <h2>Your notes</h2>
          <span>{notes.length} {notes.length === 1 ? "note" : "notes"}</span>
        </div>

        {notes.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">✳</span>
            <h3>Your page is a blank canvas.</h3>
            <p>Add a note above to get started.</p>
          </div>
        ) : (
          <ul className="note-list">
            {notes.map((note) => (
              <li className="note-card" key={note.id}>
                <p>{note.text}</p>
                <button
                  aria-label="Delete note"
                  className="delete-button"
                  onClick={() => handleDeleteNote(note.id)}
                  type="button"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      <footer className="notes-footer">A little more clarity, one note at a time.</footer>
    </main>
  );
}
