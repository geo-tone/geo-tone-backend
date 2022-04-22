DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

CREATE TABLE users(
  user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO
  users(username, password_hash)
VALUES
  ('space-lady', '123456');

CREATE TABLE profiles(
  profile_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  bio TEXT NOT NULL,
  avatar TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

INSERT INTO
  profiles(user_id, username, bio, avatar)
VALUES
  (
    '1',
    'space-lady',
    'paragon of outsider music, inspiration of tones',
    'https://media2.fdncms.com/portmerc/imager/u/original/19330747/1505926068-music-ttd-paveladyspacelady-terriloewenthal-2.jpg'
  );

CREATE TABLE projects(
  project_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL,
  title TEXT NOT NULL DEFAULT 'untitled',
  volume SMALLINT NOT NULL DEFAULT -12,
  bpm SMALLINT NOT NULL DEFAULT 120,
  channels TEXT [] NOT NULL DEFAULT ARRAY [ '{ "id": 0, "type": "synth", "osc": "sine", "steps": [null, null, null, null, null, null, null, null], "volume": -5, "reverb": 0.5 }' ],
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

INSERT INTO
  projects(user_id)
VALUES
  ('1'); 
