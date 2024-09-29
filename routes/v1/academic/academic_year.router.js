const express = require('express');
const academic_yearRouter = express.Router();
// middleware
const isAdmin = require('../../../middlewares/is_admin');
const isLoggedIn = require('../../../middlewares/is_logged_in');
const { getAcademicYearsController, createAcademicYearController, getAcademicYearController, updateAcademicYearController, deleteAcademicYearController } = require('../../../controllers/academic/academic_year.controller');

academic_yearRouter.route('/academic-years')
 .get( isLoggedIn, isAdmin, getAcademicYearsController)
 .post( isLoggedIn, isAdmin, createAcademicYearController)
academic_yearRouter.route('/academic-years/:id')
 .get( isLoggedIn, isAdmin, getAcademicYearController)
 .patch( isLoggedIn, isAdmin, updateAcademicYearController)
 .delete( isLoggedIn, isAdmin, deleteAcademicYearController)
module.exports = academic_yearRouter;
