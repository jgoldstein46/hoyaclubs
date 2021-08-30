const db = require('_helpers/db');
// const Role = require('_helpers/role');

module.exports = {
    create,
    getAll,
    getByOrgId,
    getByAppId,
    // getById,
    // getByOrgId,
    // delete: _delete
};

async function create(userId, params) {
    // console.log("This is the new application: " + JSON.stringify({ orgId: userId, ...params })); 
    const sub = new db.Submission({ userId: userId, ...params });

    // save application 
    await sub.save();
    return basicDetails(sub);
}

async function getAll() {
    const sub = await db.Submission.find();
    return sub.map(x => basicDetails(x));
}

async function getByOrgId(orgId) {
    // console.log("This is the orgName: " + orgName); 
    const sub = await db.Submission.find().where('orgId').equals(orgId); 
    // console.log("In getByOrgName, these are the applications " + applications); 
    return sub.map(x => basicDetails(x)); 
}

async function getByAppId(appId) {
    // console.log("This is the orgName: " + orgName); 
    const subs = await db.Submission.find().where('appId').equals(appId); 
    // console.log("In getByOrgName, these are the applications " + applications); 
    return subs.map(x => basicDetails(x)); 
}

function basicDetails(sub) {
    // console.log("In basicDetails this is the account " + JSON.stringify(account))
    const { id, orgName, email, position, created, updated, due, questions, orgId, description, firstName, lastName, userId, orgEmail, appId } = sub;
    // console.log("In basic details this is the created : " + created); 
    return { id, orgName, email, position, description, created, updated, due, questions, orgId , firstName, lastName, userId, orgEmail, appId };
}

