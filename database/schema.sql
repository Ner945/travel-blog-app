-- Travel Blog App database schema
-- Reconstructed from the application's existing Node/Express backend queries.

CREATE DATABASE IF NOT EXISTS travel_blog
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE travel_blog;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS travel_logs (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  post_date DATE NOT NULL,
  tags TEXT NOT NULL,
  PRIMARY KEY (id),
  KEY idx_travel_logs_user_id (user_id),
  CONSTRAINT fk_travel_logs_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS journey_plans (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  journey_plan_name VARCHAR(255) NOT NULL,
  journey_plan_locations TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  list_of_activities TEXT NOT NULL,
  description TEXT NOT NULL,
  PRIMARY KEY (id),
  KEY idx_journey_plans_user_id (user_id),
  CONSTRAINT fk_journey_plans_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
