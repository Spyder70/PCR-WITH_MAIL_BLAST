"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const db = require('../../db');
const middleware_1 = require("../config/middleware");
const customer_routes_1 = require("./customer.routes");
const master_routes_1 = require("./master.routes");
const constants_1 = require("../config/constants");
const system_controller_1 = require("../controllers/system.controller");
const entry_controller_1 = require("../controllers/entry.controller");
const apiLimiter_1 = require("../utility/apiLimiter");
const router = (0, express_1.Router)();
const nodemailer = require('nodemailer');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
exports.router = router;
router.use('/u', middleware_1.checkCustomer, customer_routes_1.router);
router.post('/signup', entry_controller_1.EntryController.CustomerSignup);
router.post('/reset', entry_controller_1.EntryController.CustomerResetPassword);
router.post('/token', entry_controller_1.EntryController.ConsumeToken);
router.post('/email', apiLimiter_1.tokenBruteforce.getMiddleware({ key: function (req, res, next) { next(req.body.username); } }), (req, res, next) => { res.locals.tokenType = 'new'; next(); }, entry_controller_1.EntryController.RequestToken);
router.post('/forgot', apiLimiter_1.tokenBruteforce.getMiddleware({ key: function (req, res, next) { next(req.body.username); } }), (req, res, next) => { res.locals.tokenType = 'forgot'; next(); }, entry_controller_1.EntryController.RequestToken);
router.post('/auth', apiLimiter_1.loginBruteforce.getMiddleware({ key: function (req, res, next) { next(req.body.username); } }), entry_controller_1.EntryController.MasterLogin);
router.post('/login', apiLimiter_1.loginBruteforce.getMiddleware({ key: function (req, res, next) { next(req.body.username); } }), entry_controller_1.EntryController.CustomerLogin);
router.use('/logout', entry_controller_1.EntryController.Logout);
router.use('/master', middleware_1.checkMaster, master_routes_1.router);
router.get('/auth', (req, res) => {
    if (req.session.user?.managerId) {
        res.send({ role: 'manager' });
    }
    else if (req.session.user?.customerId) {
        res.send({ role: 'customer' });
    }
    else {
        res.sendStatus(constants_1.SESSION_ERROR);
    }
});
router.get('/sess', (req, res) => {
    if (req.session.user?.managerId) {
        res.send({ managerId: req.session.user.managerId, role: 'manager' });
    }
    else if (req.session.user?.customerId) {
        res.send({ customerId: req.session.user.customerId, role: 'customer' });
    }
    else {
        res.sendStatus(constants_1.SESSION_ERROR);
    }
});
router.get('/settings', system_controller_1.SystemSettingController.getPublicSettings);

////////////////////+++++++++++ Mail Blast Starts

router.get('/customers', async (req, res) => {
    try {
      const [data] = await db.query(`
        SELECT 
          firstName, 
          lastName,
          telephone, 
          email
        FROM 
          CUSTOMERS;
      `);
      
      res.send(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'kowapcrsystemgroups@gmail.com',
      pass: 'nyyk fjra yisp kjbj'
    }
  });
  
  router.post('/send-bulk-email', async (req, res) => {
    try {
      const { subject, message } = req.body;
  
      // Fetch recipient data from the database
      const [data] = await db.query(`
        SELECT email, lastName, firstName FROM CUSTOMERS;
      `);
  
      const emailList = data;
  
      // Send personalized emails
      for (const { email, lastName, firstName } of emailList) {
        const mailOptions = {
          from: 'kowapcrsystemgroups@gmail.com',
          to: email, // Change this to the customer's email address
          subject: subject,
          html: `<p>Hello Dear<br>${lastName} ${firstName},<br><br> ${message}</p>`
        };
  
        // Send email
        await transporter.sendMail(mailOptions);
      }
  
      res.send('Bulk email sent successfully!');
    } catch (error) {
      console.error('Error sending bulk email:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  ////////////////////+++++++++++ Mail Blast Ends