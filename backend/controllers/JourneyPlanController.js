const db = require('../db');

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

exports.getJourneyPlansByUserId = (req, res) => {
  const userId = req.userId; 
  const query = 'SELECT * FROM journey_plans WHERE user_id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching journey plans:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    results.forEach(plan => {
      plan.start_date = formatDate(plan.start_date);
      plan.end_date = formatDate(plan.end_date);
      plan.journey_plan_locations = JSON.parse(plan.journey_plan_locations); 
      plan.list_of_activities = JSON.parse(plan.list_of_activities); 
    });

    res.json(results);
  });
};

exports.getJourneyPlanById = (req, res) => {
  const { id } = req.params;
  const userId = req.userId; 
  const query = 'SELECT * FROM journey_plans WHERE id = ? AND user_id = ?';

  db.query(query, [id, userId], (err, results) => {
    if (err) {
      console.error("Error fetching journey plan:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Journey plan not found or unauthorized" });
    }

    const plan = results[0];
    plan.start_date = formatDate(plan.start_date);
    plan.end_date = formatDate(plan.end_date);
    plan.journey_plan_locations = JSON.parse(plan.journey_plan_locations); 
    plan.list_of_activities = JSON.parse(plan.list_of_activities); 
    res.json(plan);
  });
};

exports.createJourneyPlan = (req, res) => {
  const userId = req.userId;
  const { journey_plan_name, journey_plan_locations, start_date, end_date, list_of_activities, description } = req.body;

  const query = 'INSERT INTO journey_plans (user_id, journey_plan_name, journey_plan_locations, start_date, end_date, list_of_activities, description) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [
    userId,
    journey_plan_name,
    JSON.stringify(journey_plan_locations),
    start_date,
    end_date,
    JSON.stringify(list_of_activities),
    description
  ], (err, result) => {
    if (err) {
      console.error("Error creating journey plan:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(201).json({
      id: result.insertId,
      user_id: userId,
      journey_plan_name,
      journey_plan_locations,
      start_date,
      end_date,
      list_of_activities,
      description
    });
  });
};

exports.updateJourneyPlan = (req, res) => {
  const userId = req.userId;
  const { journey_plan_name, journey_plan_locations, start_date, end_date, list_of_activities, description } = req.body;
  const journeyPlanId = req.params.id;

  const query = 'UPDATE journey_plans SET journey_plan_name = ?, journey_plan_locations = ?, start_date = ?, end_date = ?, list_of_activities = ?, description = ? WHERE id = ? AND user_id = ?';
  db.query(query, [
    journey_plan_name,
    JSON.stringify(journey_plan_locations),
    start_date,
    end_date,
    JSON.stringify(list_of_activities),
    description,
    journeyPlanId,
    userId
  ], (err, result) => {
    if (err) {
      console.error("Error updating journey plan:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Journey plan not found or unauthorized" });
    }
    res.json({ message: "Journey plan updated successfully" });
  });
};


exports.deleteJourneyPlan = (req, res) => {
  const userId = req.userId;
  const journeyPlanId = req.params.id;

  const query = 'DELETE FROM journey_plans WHERE id = ? AND user_id = ?';
  db.query(query, [journeyPlanId, userId], (err, result) => {
    if (err) {
      console.error("Error deleting journey plan:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Journey plan not found or unauthorized" });
    }
    res.json({ message: "Journey plan deleted successfully" });
  });
};
