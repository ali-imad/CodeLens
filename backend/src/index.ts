import express, { Response, Request } from "express";
import bodyParser from "body-parser";

// Define types for Code Sample and Test entities
interface CodeSample {
  id: number;             // 1-indexed id
  code: string;           // code snippet
  description: string;    // description of the code snippet
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
const mockData: CodeSample[] = [
  {
    id: 1,
    code: "const foo = () => console.log('Hello World!')",
    description: "Prints 'Hello World!' to the console",
  },
  {
    id: 2,
    code: "const foo = (a, b) => a * b",
    description: "Multiplies two numbers and returns the result",
  },
];

// Initialize the code samples array with mock data
const codeSamples: CodeSample[] = [
  ...mockData
];

// Counter to keep track of the code sample IDs
let codeSampleIdCounter: number = (codeSamples).length + 1;

// Get all code samples
app.get("/code-samples", (_: Request, res: Response) => {
  return res.json(codeSamples)
});

// Get a code sample by ID
app.get("/code-samples/:id", (req: Request<{ id: string }>, res: Response) => {
  const id: number = parseInt(req.params.id);
  return res.json(codeSamples[id - 1])
});

// Create a new code sample
app.post("/code-samples", (req: Request, res: Response) => {
  const newCodeSample: CodeSample = req.body; // get the new code sample from the request body
  newCodeSample.id = codeSampleIdCounter++;   // increment the id counter and assign it to the new code sample
  codeSamples.push(newCodeSample);            // add the new code sample to the codeSamples array
  res.status(201).json(newCodeSample);
});

// Update a code sample by ID
app.put("/code-samples/:id", (req: Request<{ id: string }>, res: Response) => {
  const id: number = parseInt(req.params.id);
  const index: number = codeSamples.findIndex((sample) => sample.id === id);
  if (index === -1) {
    res.status(404).send("Code Sample not found");
  } else {
    codeSamples[index] = { ...codeSamples[index], ...req.body };  // update the code sample with the new data
    res.json(codeSamples[index]);
  }
});

// Delete a code sample by ID
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
