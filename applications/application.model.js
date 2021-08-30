const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    email: { type: String, required: false },
    orgName: { type: String, required: true },
    position: { type: String, required: true },
    created: { type: Date, default: Date.now },
    updated: Date,
    due: { type: Date, required: true },
    description: { type: String, required: false }, 
    orgId: { type: String, required: true },
    questions: { type: Array, required: false }
});

schema.set('toJSON', {
    // virtuals: true,
    versionKey: false,
    // transform: function (doc, ret) {
    //     // remove these props when object is serialized
    //     delete ret._id;
    //     delete ret.passwordHash;
    // }
});

module.exports = mongoose.model('Application', schema);

