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
  user_id CHAR(36) NOT NULL,
  activity_id CHAR(36) NOT NULL,
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

CREATE TABLE PlaylistActivityRelation(
  playlist_id CHAR(36) NOT NULL,
  activity_id CHAR(36) NOT NULL,
  orderNumber INTEGER NOT NULL,
  FOREIGN KEY (activity_id) REFERENCES Activities(activity_id),
  FOREIGN KEY (playlist_id) REFERENCES Playlist(playlist_id),
  PRIMARY KEY (activity_id,playlist_id,orderNumber)
);

INSERT INTO Users (user_id, username) VALUES
( 'd7dcf380-33a3-4cb4-94c2-0323f18be441',"user1"),
('4028fb15-c6eb-4401-822e-c06da852fc66',"user2"),
("65f855e2-01c6-4f6a-8f63-7bd807e26517","user3");

INSERT INTO Playlist (playlist_id,title,created_by) VALUES
("c4bc911f-01d6-499f-8f17-8b973d44f7b8","playlist 1",'d7dcf380-33a3-4cb4-94c2-0323f18be441');

INSERT INTO Activities (activity_id,title,description,duration,created_by)
VALUES ("b91db615-17a0-4c34-acbe-e064a325e981","squat","squats",60,'d7dcf380-33a3-4cb4-94c2-0323f18be441'),
("65620c6a-6a3c-420c-9257-8061760fb3e4","rest","rest",60,'d7dcf380-33a3-4cb4-94c2-0323f18be441');

INSERT INTO PlaylistActivityRelation (activity_id,playlist_id,orderNumber) VALUES 
("65620c6a-6a3c-420c-9257-8061760fb3e4",'c4bc911f-01d6-499f-8f17-8b973d44f7b8',1),
("b91db615-17a0-4c34-acbe-e064a325e981",'c4bc911f-01d6-499f-8f17-8b973d44f7b8',0);

INSERT INTO UserPlaylistRelation (user_id,playlist_id) VALUES
("d7dcf380-33a3-4cb4-94c2-0323f18be441","c4bc911f-01d6-499f-8f17-8b973d44f7b8");

INSERT INTO UserActivityRelation (user_id,activity_id) VALUES
("d7dcf380-33a3-4cb4-94c2-0323f18be441","b91db615-17a0-4c34-acbe-e064a325e981"),
("d7dcf380-33a3-4cb4-94c2-0323f18be441","65620c6a-6a3c-420c-9257-8061760fb3e4");
-- Down

DROP TABLE Activities;
DROP TABLE Playlist;
DROP TABLE Tags;
DROP TABLE Users;
DROP TABLE ActivityTagRelation;
DROP TABLE PlaylistTagRelation;
DROP TABLE UserActivityRelation;
DROP TABLE UserPlaylistRelation;
