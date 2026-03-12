import express from "express";
import notesRouter from "./routes/notes.route.js";

const app = express();

app.use(express.json());
app.use("/notes", notesRouter);

app.get("/", (req, res) => {
  res.send("Hello Arlind");
});

export default app;
