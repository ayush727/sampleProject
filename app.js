if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express			= require('express');
const mongoose			= require('mongoose');
const app				= express();
const bodyParser        = require('body-parser');
const User              = require('./model/user');

// Setting up mongoose connection to the database
mongoose.connect("mongodb://localhost:27017/bmi_calculator", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
    useCreateIndex: true
});

app.use(express.urlencoded({ extended: false }))
app.use(express.json());

// Functions

// Function to determine the category based on the BMI
function determineCategory(BMI) {
    if(BMI < 18.5) return 'Underweight'
    if(BMI >= 18.5 && BMI <25 ) return 'Normal weight'
    if(BMI >= 25 && BMI <30 ) return 'Overweight'
    if(BMI >= 30 && BMI <35 ) return 'Moderately obese'
    if(BMI >= 35 && BMI <40 ) return 'Severely obese'
    if(BMI >= 40 ) return 'Very obese'
}

// Function to determine the risk based on the BMI
function determineRisk(BMI) {
    if(BMI < 18.5) return 'Malnutrition risk'
    if(BMI >= 18.5 && BMI <25 ) return 'Low risk'
    if(BMI >= 25 && BMI <30 ) return 'Enhanced risk'
    if(BMI >= 30 && BMI <35 ) return 'Medium risk'
    if(BMI >= 35 && BMI <40 ) return 'High risk'
    if(BMI >= 40 ) return 'Very high risk'
}

// ROUTES
app.get('/', (req, res) => {
	res.status(200).json("BMI_Calculator");
});

// For adding a new record to the database and calculating the required 3 parameters for the particular record
app.post('/calculatebmi', async (req, res) => {
    if(!req.body.Gender || !req.body.Height || !req.body.Weight) return res.status(400).json({'error':'Field required'})
    let gender = req.body.Gender;
	let heightInM = +(Math.round((req.body.Height/100) + "e+2")  + "e-2");
    let weight = req.body.Weight;
    let BMI = +(Math.round((weight/(heightInM*heightInM)) + "e+2")  + "e-2");
    try {
        const newUser = await User.create({
            "Gender": req.body.Gender ,
            "HeightCm": req.body.Height,
            "WeightKg": req.body.Weight,
            "BMI": BMI,
            "BMI_Category": determineCategory(BMI),
            "Health_Risk" : determineRisk(BMI)
        })
        return res.status(200).json(newUser);
    } catch (error) {
        return res.status(500).json({ 'error' : 'Incorrect entry'})
    }
    
});


// For calculating the required values for all the records in the database
app.post('/usersbmi', (req, res) => {
    User.find({}, (err, docs) => {
        if(err) return err
        if(docs.length != 0) {
            docs.forEach(doc => {
                let heightInM = +(Math.round((doc.HeightCm/100) + "e+2")  + "e-2");
                let weight = doc.WeightKg;
                let BMI = +(Math.round((weight/(heightInM*heightInM)) + "e+2")  + "e-2");
                doc.BMI = BMI;
                doc.BMI_Category = determineCategory(BMI);
                doc.Health_Risk = determineRisk(BMI);
                doc.save();
            });
            res.status(200).json(docs);
        }
        else res.status(400).json('No documents present')
    })
});


// For calculating the count of category passed in the URL parameter
app.get('/count/:category', (req, res) => {
    User.countDocuments({BMI_Category : req.params.category}, (err, count) => {
        if(err) res.status(500).send(err);
        if(!count) {
            if(req.params.category == 'Underweight' || req.params.category == 'Normal weight' || req.params.category == 'Moderately obese' || req.params.category == 'Severely obese' || req.params.category == 'Very obese' )
                return res.status(404).json({ 'error' : 'No user under specified category' });
            else
                return res.status(400).json({ 'error' : 'Invalid category' });
        }
        if(count) res.json({ 'Count' : count });
    })
});

// Connecting to the port
app.listen(3000, () => {
	console.log("Listening on port 3000");
});

module.exports = app;