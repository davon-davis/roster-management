import cors from "cors";
import express from "express";

const app = express();
const port = 3002; // Make sure this port doesn't conflict with your Next.js port

app.use(cors());
app.use(express.json());

app.get("/", (req: any, res: any) => {
  res.send("Hello World from Node.js backend!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
