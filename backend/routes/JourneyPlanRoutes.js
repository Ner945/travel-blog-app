const express = require('express');
const router = express.Router();
const journeyPlanController = require('../controllers/JourneyPlanController');
const authenticateToken = require('../middleware/authMiddleware');

//GET journey plans for authenticated user
router.get('/', authenticateToken, journeyPlanController.getJourneyPlansByUserId);

//GET a journey plan by ID
router.get('/:id', authenticateToken, journeyPlanController.getJourneyPlanById);

//POST create new journey plan
router.post('/', authenticateToken, journeyPlanController.createJourneyPlan);

//PUT update existing journey plan
router.put('/:id', authenticateToken, journeyPlanController.updateJourneyPlan);

//DELETE a journey plan
router.delete('/:id', authenticateToken, journeyPlanController.deleteJourneyPlan);

module.exports = router;
