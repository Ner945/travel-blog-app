-- Sample data for the Travel Blog App
-- Run database/schema.sql first.
-- Demo login:
--   Username: demo
--   Password: demo1234

USE travel_blog;

START TRANSACTION;

-- Create the demo user if it does not already exist.
-- The stored password is a bcrypt hash for: demo1234
INSERT INTO users (username, password, email, address)
VALUES (
  'demo',
  '$2b$10$F7Vcg1s0eTnww.OMmj7p7.aD0lLOI6yzFkDeRduBBvAL8Mt1V9F9K',
  'demo@travelblog.local',
  'Dublin'
)
ON DUPLICATE KEY UPDATE
  id = LAST_INSERT_ID(id),
  password = VALUES(password),
  email = VALUES(email),
  address = VALUES(address);

SET @demo_user_id = (
  SELECT id
  FROM users
  WHERE username = 'demo'
  LIMIT 1
);

-- Make the script safe to run more than once by replacing the demo user's sample data.
DELETE FROM travel_logs WHERE user_id = @demo_user_id;
DELETE FROM journey_plans WHERE user_id = @demo_user_id;

INSERT INTO travel_logs
  (user_id, title, description, start_date, end_date, post_date, tags)
VALUES
(
  @demo_user_id,
  'Weekend in Galway',
  'Spent a weekend exploring Galway city, walking along Salthill Promenade and visiting the Latin Quarter.',
  '2026-06-12',
  '2026-06-14',
  '2026-06-15',
  '["Ireland", "Galway", "Weekend", "City Break"]'
),
(
  @demo_user_id,
  'Trip to Edinburgh',
  'Visited Edinburgh for a few days and explored the Old Town, Edinburgh Castle and Arthur''s Seat.',
  '2026-04-03',
  '2026-04-07',
  '2026-04-09',
  '["Scotland", "Edinburgh", "Sightseeing", "City Break"]'
),
(
  @demo_user_id,
  'Killarney Road Trip',
  'Drove to Killarney and spent a few days exploring the national park, lakes and surrounding Kerry countryside.',
  '2025-08-18',
  '2025-08-22',
  '2025-08-24',
  '["Ireland", "Kerry", "Road Trip", "Nature"]'
),
(
  @demo_user_id,
  'Barcelona Summer Trip',
  'A summer trip to Barcelona including the Gothic Quarter, Sagrada Familia, Park Guell and a day at the beach.',
  '2025-07-05',
  '2025-07-11',
  '2025-07-13',
  '["Spain", "Barcelona", "Summer", "Beach", "Sightseeing"]'
);

INSERT INTO journey_plans
  (
    user_id,
    journey_plan_name,
    journey_plan_locations,
    start_date,
    end_date,
    list_of_activities,
    description
  )
VALUES
(
  @demo_user_id,
  'Amsterdam Weekend',
  '["Amsterdam", "Jordaan", "Museumplein"]',
  '2026-10-16',
  '2026-10-19',
  '["Canal tour", "Rijksmuseum", "Explore Jordaan", "Food market"]',
  'A long weekend in Amsterdam with sightseeing, museums and time exploring the city.'
),
(
  @demo_user_id,
  'Italian City Trip',
  '["Rome", "Florence", "Pisa"]',
  '2027-04-05',
  '2027-04-12',
  '["Visit the Colosseum", "Vatican Museums", "Explore Florence", "Leaning Tower of Pisa"]',
  'A one-week trip travelling through several Italian cities by train.'
),
(
  @demo_user_id,
  'Wild Atlantic Way',
  '["Galway", "Cliffs of Moher", "Dingle", "Killarney"]',
  '2027-06-10',
  '2027-06-16',
  '["Coastal drive", "Hiking", "Photography", "Visit local towns"]',
  'A road trip following part of the Wild Atlantic Way along the west coast of Ireland.'
);

COMMIT;
