import express, { Response, Request } from "express";
import bodyParser from "body-parser";

// Define types for Code Sample and Test entities
interface CodeSample {
  id: number;
  code: string;
  description: string;
}

// Initialize Express app
const app = express();
const PORT: number = parseInt(process.env["PORT"] || "3000");

// Middleware
app.use(bodyParser.json());

// Routes
app.get("/", (res: Response) => {
  res.send("Welcome to CodeLens API");
});

// Code Samples Routes
const codeSamples: CodeSample[] = [];
let codeSampleIdCounter: number = 1;

app.get("/code-samples", (res: Response) => {
  res.json(codeSamples);
});

app.post("/code-samples", (req: Request, res: Response) => {
  const newCodeSample: CodeSample = req.body;
  newCodeSample.id = codeSampleIdCounter++;
  codeSamples.push(newCodeSample);
  res.status(201).json(newCodeSample);
});

app.put("/code-samples/:id", (req: Request<{ id: string }>, res: Response) => {
  const id: number = parseInt(req.params.id);
  const index: number = codeSamples.findIndex((sample) => sample.id === id);
  if (index === -1) {
    res.status(404).send("Code Sample not found");
  } else {
    codeSamples[index] = { ...codeSamples[index], ...req.body };
    res.json(codeSamples[index]);
  }
});

app.delete(
  "/code-samples/:id",
  (req: Request<{ id: string }>, res: Response) => {
    const id: number = parseInt(req.params.id);
    const index: number = codeSamples.findIndex((sample) => sample.id === id);
    if (index === -1) {
      res.status(404).send("Code Sample not found");
    } else {
      codeSamples.splice(index, 1);
      res.sendStatus(204);
    }
  }
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
