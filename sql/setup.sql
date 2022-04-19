-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS channels CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

CREATE TABLE users(
  user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profiles(
  profile_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  bio TEXT NOT NULL,
  avatar TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (username) REFERENCES users(username)
  ON DELETE CASCADE
);


CREATE TABLE projects(
  project_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL,
  title TEXT NOT NULL,
  volume SMALLINT NOT NULL,
  bpm SMALLINT NOT NULL,
  channels TEXT [] NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
  ON DELETE CASCADE
);

CREATE TABLE channels(
  channel_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
  project_id BIGINT NOT NULL, 
  title TEXT NOT NULL, 
  instrument JSON NOT NULL, 
  fx JSON NOT NULL, 
  steps TEXT [] NOT NULL, 
  FOREIGN KEY (project_id) REFERENCES projects(project_id)
  ON DELETE CASCADE
);

INSERT INTO users(username, password_hash)
VALUES ('space-lady', '123456'); 

INSERT INTO profiles(user_id, username, bio, avatar)
VALUES ('1', 'space-lady', 'paragon of outsider music, inspiration of tones', 'https://media2.fdncms.com/portmerc/imager/u/original/19330747/1505926068-music-ttd-paveladyspacelady-terriloewenthal-2.jpg'); 

INSERT INTO projects(title, volume, bpm, channels, user_id)
VALUES ('our seeded project', 0, 90, ARRAY ['{ "id": 0, "type": "synth", "osc": "sine", "steps": [null, null, null, null, null, null, null, null], "volume": -5, "reverb": 0.5 }'], '1'); 

INSERT INTO channels(project_id, title, instrument, fx, steps)
VALUES ('1', 'channel title', '{ "osc": "sine" }', '{ "reverb": 0.01 }', '{ "C4", "D4" }');