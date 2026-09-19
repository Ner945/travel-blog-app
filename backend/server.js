const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/UserRoutes');
const travelLogRoutes = require('./routes/TravelLogRoutes');
const journeyPlanRoutes = require('./routes/JourneyPlanRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/travel-logs', travelLogRoutes);
app.use('/api/journey-plans', journeyPlanRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something broke!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
