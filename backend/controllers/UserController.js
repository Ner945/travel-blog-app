const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const hashLvl = 10;


exports.registerUser = (req, res) => {
  const { username, password, email, address } = req.body;
  if (!username || !password || !email || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  bcrypt.hash(password, hashLvl, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    const query = 'INSERT INTO users (username, password, email, address) VALUES (?, ?, ?, ?)';
    db.query(query, [username, hashedPassword, email, address], (err, result) => {
      if (err) {
        console.error("Error registering user:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.status(201).json({
        id: result.insertId,
        username,
        email,
        address
      });
    });
  });
};

exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("Error during login:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '999h' }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          address: user.address
        }
      });
    });
  });
};

exports.getUserDetails = (req, res) => {
  const userId = req.params.id;

  const query = 'SELECT id, username, email, address FROM users WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user details:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(results[0]);
  });
};

exports.updateUser = (req, res) => {
  const userId = req.params.id;
  const { username, email, address } = req.body;

  if (!username || !email || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = 'UPDATE users SET username = ?, email = ?, address = ? WHERE id = ?';
  db.query(query, [username, email, address, userId], (err, result) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User updated successfully" });
  });
};

exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  });
};
