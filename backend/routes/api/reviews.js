const express = require('express');
const { requireAuth } = require('../utils/auth');
const { User, Review, Spot } = require('../db/models');
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const router = express.Router();







module.exports = router;
