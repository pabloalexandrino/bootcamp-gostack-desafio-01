const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let counter = 0;

function checkId(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);
  if (!project) return res.json({ message: "ID not found." });
  return next();
}

function log(req, res, next) {
  counter++;
  console.log(`Requests: ${counter}`);
  return next();
}

server.post("/projects", log, (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);
  return res.json(projects);
});

server.get("/projects", log, (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkId, log, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id == id);
  project.title = title;
  return res.json(project);
});

server.delete("/projects/:id", checkId, log, (req, res) => {
  const { id } = req.params;
  const project = projects.findIndex(p => p.id == id);
  projects.splice(project, 1);
  return res.json(projects);
});

server.post("/projects/:id/tasks", checkId, log, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;
  const project = projects.find(p => p.id == id);
  project.tasks.push(title);
  return res.json(project);
});

server.listen(4000);
