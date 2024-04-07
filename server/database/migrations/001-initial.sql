-- Up

CREATE TABLE Users ( 
  user_id CHAR(36) PRIMARY KEY,
  username TEXT NOT NULL
);

CREATE TABLE Tags(
  tags_id CHAR(36) PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE Playlist(
  playlist_id  CHAR(36) PRIMARY KEY,
  title TEXT NOT NULL,
  created_by CHAR(36) NOT NULL,
  FOREIGN KEY (created_by) REFERENCES Users(user_id)
);

CREATE TABLE Activities(
  activity_id CHAR(36) PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  created_by CHAR(36) NOT NULL,
  FOREIGN KEY (created_by) REFERENCES Users(user_id)
);

CREATE TABLE UserActivityRelation (
  activity_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  FOREIGN KEY (activity_id) REFERENCES Activities(activity_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  PRIMARY KEY (user_id,activity_id)
);

CREATE TABLE UserPlaylistRelation(
  user_id CHAR(36) NOT NULL,
  playlist_id CHAR(36) NOT NULL,
  FOREIGN KEY (playlist_id) REFERENCES Playlist(playlist_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  PRIMARY KEY (user_id,playlist_id)
);

CREATE TABLE PlaylistTagRelation(
  playlist_id CHAR(36) NOT NULL,
  tags_id CHAR(36) NOT NULL,
  FOREIGN KEY (playlist_id) REFERENCES Playlist(playlist_id),
  FOREIGN KEY (tags_id) REFERENCES Tags(tags_id),
  PRIMARY KEY (playlist_id,tags_id)
);

CREATE TABLE ActivityTagRelation(
  activity_id CHAR(36) NOT NULL,
  tags_id CHAR(36) NOT NULL,
  FOREIGN KEY (activity_id) REFERENCES Activities(activity_id),
  FOREIGN KEY (tags_id) REFERENCES Tags(tags_id),
  PRIMARY KEY (activity_id,tags_id)
);

INSERT INTO Users (user_id, username) VALUES
( 'd7dcf380-33a3-4cb4-94c2-0323f18be441',"user1"),
('4028fb15-c6eb-4401-822e-c06da852fc66',"user2"),
("65f855e2-01c6-4f6a-8f63-7bd807e26517","user3");


-- Down

DROP TABLE Activities;
DROP TABLE Playlist;
DROP TABLE Tags;
DROP TABLE Users;
DROP TABLE ActivityTagRelation;
DROP TABLE PlaylistTagRelation;
DROP TABLE UserActivityRelation;
DROP TABLE UserPlaylistRelation;
