const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const subService = require('./submission.service');
const accountService = require('../accounts/account.service');
// const { getByOrgId } = require('../applications/application.service');

// routes
router.get('/', authorize(), getAll);
// router.get('/user/:id', authorize(), getByUserId);
router.post('/', authorize([Role.Student, Role.Admin]), createSchema, create);
// router.put('/:id', authorize(), updateSchema, update);
// router.delete('/:appId', authorize(), _delete);
router.get('/app/:id', authorize(), getByAppId); 
router.get('/org/:id', authorize(), getByOrgId); 

module.exports = router;

function createSchema(req, res, next) {
    const schema = Joi.object({
        orgName: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        orgId: Joi.string().required(), 
        appId: Joi.string().required(), 
        position: Joi.string().required(), 
        email: Joi.string().email(),
        description: Joi.string().required(), 
        due:  Joi.date().required(), 
        questions: Joi.array().items(
            Joi.object().keys({
                questionText: Joi.string().required(), 
                options: Joi.array().items(
                    Joi.object().keys({
                        optionText: Joi.string().required()
                    })
                ),
                response: Joi.string(), 
                questionType: Joi.string().required(), 
                required: Joi.bool().required()
            })
        )
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    subService.create(req.user.id, req.body)
        .then(sub => res.json(sub))
        .catch(next);
}

function getAll(req, res, next) {
    subService.getAll()
        .then(sub => res.json(sub))
        .catch(next);
}

function getByOrgId(req, res, next) {
    // users can get their own account and admins can get any account
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    accountService.getById(req.params.id)
        .then(account => account ? account : res.sendStatus(404))
        .then(account => subService.getByOrgId(account.id))
        .then(submissions => res.json(submissions))
        .catch(next);
    
}

function getByAppId(req, res, next) {
    subService.getByAppId(req.params.id)
        .then(subs => res.json(subs))
        .catch(next); 
}