const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    email: { type: String, required: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }, 
    position: { type: String, required: true },
    created: { type: Date, default: Date.now },
    updated: Date,
    due: { type: Date, required: true },
    description: { type: String, required: false }, 
    orgId: { type: String, required: true },
    orgName: { type: String, required: true }, 
    questions: { type: Array, required: false },
    userId: { type: String, required: true },
    appId: { type: String, required: true }
});

schema.set('toJSON', {
    versionKey: false,
    
});

module.exports = mongoose.model('Submission', schema);