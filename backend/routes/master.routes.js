"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const customer_controller_1 = require("../controllers/customer.controller");
const master_controller_1 = require("../controllers/master.controller");
const occasion_controller_1 = require("../controllers/occasion.controller");
const occurrence_controller_1 = require("../controllers/occurrence.controller");
const template_controller_1 = require("../controllers/template.controller");
const system_controller_1 = require("../controllers/system.controller");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
exports.router = router;
router.post('/managers', master_controller_1.MasterController.createManager);
router.get('/customers/csv', customer_controller_1.CustomerController.getCustomersCSV);
router.post('/registrations/new', master_controller_1.MasterController.createCustomerRegistration);
router.put('/registrations/edit', master_controller_1.MasterController.updateCustomerRegistration);
router.delete('/registrations/cancel', master_controller_1.MasterController.cancelCustomerRegistration);
router.delete('/customers/:customerId', customer_controller_1.CustomerController.delete);
router.post('/registrations', master_controller_1.MasterController.getCustomerRegistration);
router.put('/registrations', master_controller_1.MasterController.confirmRegistration);
router.post('/occasions', occasion_controller_1.OccasionController.create);
router.get('/events/list', occasion_controller_1.OccasionController.listBasic);
router.get('/events/detail/:occasionId', occasion_controller_1.OccasionController.basicInfo);
router.get('/occasions/overview', occasion_controller_1.OccasionController.overview);
router.get('/occasions/:occasionId/schedule', occasion_controller_1.OccasionController.getEventScheduleSimple);
router.post('/occasions/:occasionId/csv', occasion_controller_1.OccasionController.downloadEventCSV);
router.get('/occasions/:occasionId', occasion_controller_1.OccasionController.getEventDetailed);
router.put('/occasions/:occasionId', occasion_controller_1.OccasionController.update);
router.delete('/occasions/:occasionId', occasion_controller_1.OccasionController.delete);
router.get('/occurrences/:occurrenceId', occurrence_controller_1.OccurrenceController.find);
router.put('/occurrences/:occurrenceId', occurrence_controller_1.OccurrenceController.update);
router.post('/occurrences', occurrence_controller_1.OccurrenceController.editOccurrences);
router.delete('/occurrences/:occurrenceId', occurrence_controller_1.OccurrenceController.delete);
router.post('/templates', template_controller_1.TemplateController.create);
router.get('/templates', template_controller_1.TemplateController.browse);
router.get('/templates/:occasionId', template_controller_1.TemplateController.find);
router.put('/templates/:occasionId', template_controller_1.TemplateController.update);
router.delete('/templates/:occasionId', template_controller_1.TemplateController.delete);
router.get('/settings', system_controller_1.SystemSettingController.getSystemSettings);
router.get('/settings/:key', (0, express_validator_1.param)('key').isString(), system_controller_1.SystemSettingController.getSystemSettings);
router.put('/settings/:key', (0, express_validator_1.param)('key').isString(), system_controller_1.SystemSettingController.setSystemSettings);
router.delete('/settings/:key', (0, express_validator_1.param)('key').isString(), system_controller_1.SystemSettingController.deleteSettings);
