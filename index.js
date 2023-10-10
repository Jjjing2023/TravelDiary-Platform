import express from "express";
import cors from "cors";
import userRouter from "./routing/user-routes.js";
import postRouter from "./routing/post-routes.js";
import path from "path";
import { fileURLToPath } from "url";

// Convert the current module file URL to a path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// middleware
app.use(cors());
app.use("/user", userRouter);
app.use("/posts", postRouter);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
