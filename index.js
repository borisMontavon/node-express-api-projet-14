const express = require("express");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const employeeSchema = new Schema({
    firstName: String,
    lastName: String,
    serializedBirthDate: String,
    serializedStartDate: String,
    street: String,
    zipCode: String,
    city: String,
    state: String,
    department: String
});

const employeesModel = mongoose.model("employees", employeeSchema);

// Database
const url = "mongodb://localhost:27017/HRNet";
let db;

try {
	mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

	db = mongoose.connection;

	db.on("error", console.error.bind(console, "MongoDB connection error:"));
} catch (err) {
	console.error(err);

	return;
}

// Initialize app
const app = express();

// Middleware
app.use(express.json());

app.use((req, res, next) => {
	res.append('Access-Control-Allow-Origin', ['*']);
	res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.append('Access-Control-Allow-Headers', 'Content-Type');

	next();
});

// Récupération de tous les employés
app.get("/employees", (req, res) => {
	try {
		employeesModel.find({}, (err, items) => {
			if (err) {
				console.error(err);

				res.status(500).json("Error when fetching employees");

				return;
			}

			res.status(200).json({"employees": items});
		});
	} catch (err) {
		console.error(err);

		res.status(500).json("Error when fetching employees");
	}
});

// Création d'un nouvel employé
app.post("/newEmployee", (req, res) => {
	try {
		employeesModel.create(
			{
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				serializedBirthDate: req.body.serializedBirthDate,
				serializedStartDate: req.body.serializedStartDate,
				street: req.body.street,
				zipCode: req.body.zipCode,
				city: req.body.city,
				state: req.body.state,
				department: req.body.department
			},
			(err, result) => {
				if (err) {
					console.error(err);

					res.status(500).json("Error when inserting new employee");

					return;
				}

				res.status(201).json({ok: true});
			}
		)
	} catch (err) {
		console.error(err);

		res.status(500).json("Error when inserting new employee");
	}
});

app.listen(8080, () => console.log("Listening"));
