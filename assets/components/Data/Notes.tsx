import ReactQuill from "react-quill";
import { NoteType } from "../../interfaces/EntityTypes/NoteType";
import { Button, Col, List } from "rsuite";
import { useState } from "react";
import { http_methods } from "../../Functions/HTTPMethods";
import FluidText from "../Text/FluidText";

type NotesType = { notes: NoteType[]; postUrl: string };

export default function Notes({ notes, postUrl }: NotesType) {
  const [newNote, setNewNote] = useState<string>("");
  const [notesInside, setNotes] = useState(notes);

  const addNote = () => {
    setNewNote("");
    http_methods.post<NoteType>(postUrl, { text: newNote }).then((note) => {
      setNotes([note, ...notesInside]);
    });
  };

  return (
    <>
      <Col
        style={{
          width: "100%",
          paddingLeft: "15px",
          paddingRight: "15px",
          marginBottom: "25px",
        }}
      >
        <h3>Add note</h3>
        <ReactQuill
          value={newNote}
          onChange={setNewNote}
          theme="snow"
          style={{ marginBottom: "15px" }}
        ></ReactQuill>
        <Button
          appearance="ghost"
          color="blue"
          onClick={addNote}
          disabled={newNote.length < 3}
        >
          Submit message
        </Button>
      </Col>
      <Col style={{ width: "100%", paddingLeft: "15px", paddingRight: "15px" }}>
        <List bordered>
          {notesInside
            .sort((e1, e2) =>
              new Date(e1.createdAt.date) < new Date(e2.createdAt.date) ? 1 : 0
            )
            .map((note, index) => {
              let date = new Date(note.createdAt.date);
              return (
                <List.Item key={index}>
                  <h6 style={{ display: "inline" }}>{`${note.user.name}`} </h6>
                  <p
                    style={{
                      display: "inline",
                      color: "#777",
                      marginLeft: ".2rem",
                    }}
                  >{`${date.toLocaleDateString("pl")} ${date.toLocaleTimeString(
                    "pl"
                  )}`}</p>
                  <FluidText dangerouslySetInnerHTML={{ __html: note.text }} />
                </List.Item>
              );
            })}
        </List>
      </Col>
    </>
  );
}
