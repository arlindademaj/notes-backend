import { useState, useEffect, useRef } from "react";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const editorRef = useRef(null);

  const API_URL = "http://localhost:3000";

  const getNotes = async () => {
    try {
      const res = await fetch(`${API_URL}/notes`);
      const data = await res.json();
      setNotes(data);
      if (data.length && !activeNote) {
        setActiveNote(data[0]);
        setTimeout(() => {
          editorRef.current.innerText = data[0].content;
        }, 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  const saveNote = async () => {
    const content = editorRef.current.innerText.trim();
    if (!content) return;

    await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    getNotes();
  };

  const handleSelect = (note) => {
    setActiveNote(note);
    editorRef.current.innerText = note.content;
  };

  const handleAnalyze = async () => {
    const content = editorRef.current.innerText;
    if (!content.trim()) return;

    setLoading(true);
    setResult(null);

    const res = await fetch(`${API_URL}/notes/ai-process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="h-screen flex bg-[#f2f2f7] text-[#1c1c1e]">
      {/* Sidebar */}
      <div className="w-80 bg-[#f7f7fa] border-r border-gray-200 flex flex-col">
        <div className="px-5 py-4 text-xl font-semibold">Notes</div>

        <div className="flex-1 overflow-y-auto">
          {notes.map((n) => (
            <div
              key={n._id}
              onClick={() => handleSelect(n)}
              className={`px-5 py-4 cursor-pointer transition rounded-lg mx-2 mb-1 
                ${
                  activeNote?._id === n._id
                    ? "bg-white shadow-sm"
                    : "hover:bg-gray-200/60"
                }`}
            >
              <p className="text-sm font-medium line-clamp-1">{n.content}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                {n.content}
              </p>
            </div>
          ))}
        </div>

        <div className="p-3">
          <button
            onClick={() => {
              setActiveNote(null);
              editorRef.current.innerText = "";
            }}
            className="w-full bg-[#ffd60a] py-2 rounded-xl font-medium"
          >
            New Note
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        <div className="px-6 py-4 bg-[#fdfdfd] border-b border-gray-200 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {activeNote ? "Note" : "New Note"}
          </span>

          <div className="flex gap-4 text-sm">
            <button onClick={handleAnalyze} className="text-indigo-500">
              Analyze
            </button>

            <button onClick={saveNote} className="text-blue-500">
              Save
            </button>
          </div>
        </div>

        {/* Writing Area */}
        <div className="flex-1 overflow-y-auto flex justify-center">
          <div className="w-full max-w-2xl px-6 py-10">
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className="outline-none text-[20px] leading-9 min-h-[300px]"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              }}
            />
          </div>
        </div>

        {/* AI Panel */}
        {(loading || result) && (
          <div className="border-t border-gray-200 bg-[#f9f9fb] p-5 text-sm">
            {loading && <p className="text-gray-500">Analyzing...</p>}

            {result && (
              <div className="space-y-3">
                <div>
                  <strong>Summary</strong>
                  <p className="text-gray-600">{result.summary}</p>
                </div>

                <div>
                  <strong>Key Points</strong>
                  <ul className="list-disc ml-5">
                    {result.key_points.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
