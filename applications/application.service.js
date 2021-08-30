// const config = require('config.json');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const crypto = require("crypto");
// const sendEmail = require('_helpers/send-email');
const db = require('_helpers/db');
// const Role = require('_helpers/role');

module.exports = {
    create,
    getAll,
    getByOrgName,
    getById,
    getByOrgId,
    delete: _delete
};

async function create(orgId, params) {
    // console.log("This is the new application: " + JSON.stringify({ orgId: orgId, ...params })); 
    const application = new db.Application({ orgId: orgId, ...params });

    // save application 
    await application.save();
    return basicDetails(application);
}

async function getAll() {
    const applications = await db.Application.find();
    return applications.map(x => basicDetails(x));
}

async function getByOrgName(orgName) {
    // console.log("This is the orgName: " + orgName); 
    const applications = await db.Application.find().where('orgName').equals(orgName); 
    // console.log("In getByOrgName, these are the applications " + applications); 
    return applications.map(x => basicDetails(x)); 
}

async function getByOrgId(orgId) {
    // console.log("This is the orgName: " + orgName); 
    const applications = await db.Application.find().where('orgId').equals(orgId); 
    // console.log("In getByOrgName, these are the applications " + applications); 
    return applications.map(x => basicDetails(x)); 
}

async function getById(id) {
    // console.log("this is the app id: " + id); 
    const application = await getApplication(id);
    // console.log("This is the application: " + JSON.stringify(application)); 
    return basicDetails(application);
}

async function _delete(id) { 
    const application = await getApplication(id);
    await application.remove();
}

async function getApplication(id) {
    if (!db.isValidId(id)) throw 'Application not found';
    const application = await db.Application.findById(id);
    if (!application) throw 'Application not found';
    return application;
}

function basicDetails(application) {
    // console.log("In basicDetails this is the account " + JSON.stringify(account))
    const { id, orgName, email, position, created, updated, due, questions, orgId, description } = application;
    // console.log("In basic details this is the created : " + created); 
    return { id, orgName, email, position, description, created, updated, due, questions, orgId };
}
