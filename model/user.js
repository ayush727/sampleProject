const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
	{
		Gender: { type: String, required: true },
		HeightCm: { type: Number, required: true },
		WeightKg: { type: Number, required: true },
		BMI: { type: Number},
		BMI_Category: { type: String},
		Health_Risk: { type: String}
	},
	{ collection: 'users' }
)

const model = mongoose.model('UserSchema', UserSchema)

module.exports = model