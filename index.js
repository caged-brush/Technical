import express from "express";
import bodyParser from "body-parser";

const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage for employees
var employees = [];

// Employee CRUD operations
app.get("/employees", (req, res) => {
  res.json(employees);
});

app.post("/employees", (req, res) => {
  const newEmployee = {
    id: employees.length + 1,
    name: req.body.name,
    role: req.body.role,
    status: req.body.status,
  };

  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

//search for employee by name and by id
app.get("/employees/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const employee = employees.find((emp) => emp.id === id);
  if (!employee) {
    res.status(404).json({ error: "Employee not found" });
  } else {
    res.json(employee);
  }
});

app.get("/employees/:name", (req, res) => {
  const name = req.params.name;
  const employee = employees.find((emp) => emp.name === name);
  if (!employee) {
    res.status(404).json({ error: "Employee not found" });
  } else {
    res.json(employee);
  }
  console.log(name);
});
app.put("/employees/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, role, status } = req.body;
  const employeeIndex = employees.findIndex((emp) => emp.id === id);
  if (employeeIndex === -1) {
    res.status(404).json({ error: "Employee not found" });
  } else {
    employees[employeeIndex] = new Employee(id, name, role, status);
    res.json(employees[employeeIndex]);
  }
});

app.delete("/employees/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const employeeIndex = employees.findIndex((emp) => emp.id === id);
  if (employeeIndex === -1) {
    res.status(404).json({ error: "Employee not found" });
  } else {
    employees.splice(employeeIndex, 1);
    res.status(204).send();
  }
});

// Role assignment
app.patch("/employees/:id/role", (req, res) => {
  const id = parseInt(req.params.id);
  const avaliableRole = ["manager", "developer", "design", "scrum master"];
  var includesRole = avaliableRole.includes(req.body.role);
  const employee = employees.find((emp) => emp.id === id);
  if (!includesRole) {
    res.status(404).json({ error: "Role not found" });
  } else {
    const role = {
      id: id,
      name: req.body.newName || employee.name,
      role: req.body.role || employee.role,
      status: req.body.status || employee.status,
    };
    const employeeIndex = employees.findIndex((emp) => emp.id === id);
    employees[employeeIndex] = role;
    res.json(role);
  }
});

// Admin dashboard for total role and total employees
app.get("/admin/employee", (req, res) => {
  const totalEmployees = employees.length;
  res.json({ totalEmployees });
});

app.get("/admin/roles", (req, res) => {
  const totalRoles = ["manager", "developer", "design", "scrum master"].length;
  res.json({ totalRoles });
});

// Status updates
app.patch("/employees/:id/status", (req, res) => {
  const id = parseInt(req.params.id);
  const employee = employees.find((emp) => emp.id === id);
  const newStatus = {
    id: id,
    name: req.body.name || employee.name,
    role: req.body.role || employee.role,
    status: req.body.status || employee.status,
  };
  const findIndex = employees.findIndex((emp) => emp.id === id);
  employees[findIndex] = newStatus;
  res.json(newStatus);
});

app.listen(port, (req, res) => {
  console.log("Now listening in port 3000");
});
