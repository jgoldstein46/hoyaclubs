const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const Role = require('_helpers/role');
const applicationService = require('./application.service');
const accountService = require('../accounts/account.service');

// routes
router.get('/', authorize(), getAll);
router.get('/user/:id', authorize(), getByUserId);
router.post('/', authorize(Role.Org), createSchema, create);
// router.put('/:id', authorize(), updateSchema, update);
router.delete('/:appId', authorize(), _delete);
router.get('/app/:id', authorize(), getByAppId); 

module.exports = router;

function createSchema(req, res, next) {
    const schema = Joi.object({
        orgName: Joi.string().required(), 
        // orgId: Joi.string().required(), 
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
                questionType: Joi.string().required(), 
                required: Joi.bool().required()
            })
        )
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    applicationService.create(req.user.id, req.body)
        .then(application => res.json(application))
        .catch(next);
}

function getAll(req, res, next) {
    applicationService.getAll()
        .then(applications => res.json(applications))
        .catch(next);
}

function getByAppId(req, res, next) {
    applicationService.getById(req.params.id)
        .then(application => res.json(application))
        .catch(next); 
}

function getByUserId(req, res, next) {
    // users can get their own account and admins can get any account
    if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    accountService.getById(req.params.id)
        .then(account => account ? account : res.sendStatus(404))
        .then(account => applicationService.getByOrgId(account.id))
        .then(applications => res.json(applications))
        .catch(next);
    
}

function _delete(req, res, next) {
    // users can delete their own applications and admins can delete any applications
    applicationService.getById(req.params.appId)
        .then(application => {
            if (application.orgId !== req.user.id && req.user.role !== Role.Admin) {
                return res.status(401).json({ message: 'Unauthorized' });
            } else {
                return application; 
            }
        })
        .then(() => applicationService.delete(req.params.appId))
        .then(() => res.json({ message: 'Application deleted successfully' }))
        .catch(next);

}