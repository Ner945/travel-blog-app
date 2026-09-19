const express = require('express');
const router = express.Router();
const travelLogController = require('../controllers/TravelLogController');
const authenticateToken = require('../middleware/authMiddleware');

//GET travel logs for authenticated user
router.get('/', authenticateToken, travelLogController.getTravelLogsByUserId);

//GET a travel log by ID
router.get('/:id', authenticateToken, travelLogController.getTravelLogById);

//POST create new travel log
router.post('/', authenticateToken, travelLogController.createTravelLog);

//PUT update existing travel log
router.put('/:id', authenticateToken, travelLogController.updateTravelLog);

//DELETE a travel log
router.delete('/:id', authenticateToken, travelLogController.deleteTravelLog);

module.exports = router;
