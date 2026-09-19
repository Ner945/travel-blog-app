const db = require('../db');

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

exports.getTravelLogsByUserId = (req, res) => {
  const userId = req.userId;
  const query = 'SELECT * FROM travel_logs WHERE user_id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching travel logs:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    results.forEach(log => {
      log.start_date = formatDate(log.start_date);
      log.end_date = formatDate(log.end_date);
      log.post_date = formatDate(log.post_date);
      log.tags = JSON.parse(log.tags);
    });

    res.json(results);
  });
};

exports.getTravelLogById = (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const query = 'SELECT * FROM travel_logs WHERE id = ? AND user_id = ?';

  db.query(query, [id, userId], (err, results) => {
    if (err) {
      console.error("Error fetching travel log:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Travel log not found or unauthorized" });
    }

    const log = results[0];
    log.start_date = formatDate(log.start_date);
    log.end_date = formatDate(log.end_date);
    log.post_date = formatDate(log.post_date);
    log.tags = JSON.parse(log.tags);

    res.json(log);
  });
};

exports.createTravelLog = (req, res) => {
  const userId = req.userId;
  const { title, description, start_date, end_date, post_date, tags } = req.body;

  const query = 'INSERT INTO travel_logs (user_id, title, description, start_date, end_date, post_date, tags) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [
    userId,
    title,
    description,
    start_date,
    end_date,
    post_date,
    JSON.stringify(tags)
  ], (err, result) => {
    if (err) {
      console.error("Error creating travel log:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(201).json({
      id: result.insertId,
      user_id: userId,
      title,
      description,
      start_date,
      end_date,
      post_date,
      tags
    });
  });
};


exports.updateTravelLog = (req, res) => {
  const userId = req.userId;
  const { title, description, start_date, end_date, post_date, tags } = req.body;
  const travelLogId = req.params.id;

  const query = 'UPDATE travel_logs SET title = ?, description = ?, start_date = ?, end_date = ?, post_date = ?, tags = ? WHERE id = ? AND user_id = ?';
  db.query(query, [
    title,
    description,
    start_date,
    end_date,
    post_date,
    JSON.stringify(tags),
    travelLogId,
    userId
  ], (err, result) => {
    if (err) {
      console.error("Error updating travel log:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Travel log not found or unauthorized" });
    }
    res.json({ message: "Travel log updated successfully" });
  });
};


exports.deleteTravelLog = (req, res) => {
  const userId = req.userId;
  const travelLogId = req.params.id;

  const query = 'DELETE FROM travel_logs WHERE id = ? AND user_id = ?';
  db.query(query, [travelLogId, userId], (err, result) => {
    if (err) {
      console.error("Error deleting travel log:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Travel log not found or unauthorized" });
    }
    res.json({ message: "Travel log deleted successfully" });
  });
};
