-- Up

CREATE TABLE Users ( 
  user_id CHAR(36) PRIMARY KEY,
  username TEXT NOT NULL,
  exercise_time INTEGER,
  workouts_finished INTEGER
);

CREATE TABLE Tags(
  tag_name TEXT PRIMARY KEY
);

CREATE TABLE Playlist(
  playlist_id  CHAR(36) PRIMARY KEY,
  title TEXT NOT NULL,
  created_by CHAR(36) NOT NULL,
  sets INTEGER NOT NULL,
  exercise_rest_time INTEGER NOT NULL,
  rest_sets_time INTEGER NOT NULL,
  duration_string TEXT,
  FOREIGN KEY (created_by) REFERENCES Users(user_id)

);

CREATE TABLE Pictures(
  picture_id CHAR(36) PRIMARY KEY,
  url TEXT NOT NULL,
  alt_text TEXT
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
  tag_name TEXT NOT NULL,
  FOREIGN KEY (playlist_id) REFERENCES Playlist(playlist_id),
  FOREIGN KEY (tag_name) REFERENCES Tags(tag_name),
  PRIMARY KEY (tag_name,playlist_id)
);

CREATE TABLE ActivityTagRelation(
  activity_id CHAR(36) NOT NULL,
  tag_name TEXT NOT NULL,
  FOREIGN KEY (activity_id) REFERENCES Activities(activity_id),
  FOREIGN KEY (tag_name) REFERENCES Tags(tag_name),
  PRIMARY KEY (tag_name,activity_id)
);

CREATE TABLE PictureActivitiesRelation(
  picture_id CHAR(36) NOT NULL,
  activity_id CHAR(36) NOT NULL,
  FOREIGN KEY (activity_id) REFERENCES Activities(activity_id),
  FOREIGN KEY (picture_id) REFERENCES Picture(picture_id),
  PRIMARY KEY (picture_id,activity_id)
);

CREATE TABLE PlaylistActivityRelation(
  playlist_id CHAR(36) NOT NULL,
  activity_id CHAR(36) NOT NULL,
  orderNumber INTEGER NOT NULL,
  FOREIGN KEY (activity_id) REFERENCES Activities(activity_id),
  FOREIGN KEY (playlist_id) REFERENCES Playlist(playlist_id),
  PRIMARY KEY (activity_id,playlist_id,orderNumber)
);

INSERT INTO Users (user_id, username,workouts_finished,exercise_time) VALUES
( 'd7dcf380-33a3-4cb4-94c2-0323f18be441',"user1",0,0),
('4028fb15-c6eb-4401-822e-c06da852fc66',"user2",0,0),
("65f855e2-01c6-4f6a-8f63-7bd807e26517","user3",0,0);

INSERT INTO Playlist (playlist_id,title,created_by,sets,exercise_rest_time,rest_sets_time) VALUES
("c4bc911f-01d6-499f-8f17-8b973d44f7b8","playlist 1",'d7dcf380-33a3-4cb4-94c2-0323f18be441',2,10,20);

INSERT INTO Activities (activity_id,title,description,duration,created_by)
VALUES ("b91db615-17a0-4c34-acbe-e064a325e981","High Knees","bring your knees up",60,'server'),
("65620c6a-6a3c-420c-9257-8061760fb3e4","jumping jacks","jump and spread your arms out",60,'server'),
("a275347b-4785-4b47-90a6-8a0430d61004","burpees","do a pushup jump up and repeat",60,'server'),
("f7c91bdd-2629-4b31-bff8-5331d2890fc9","Jump Squats","start in a squat position and jump",60,'server');
-- ("f7c91bdd-2629-4b31-bff8-5331d2890fc9","Jump Squats","rest",60,'server');

INSERT INTO pictures(picture_id , URL, alt_text)
VALUES ("high-knee","./server/photos/high-knee.gif","high knee animation"),
("jumping-jack","./server/photos/jumping-jack.gif","jumping jack animation"),
("burpee","./server/photos/burpee.gif","burpee jack animation"),
("squat-jump","./server/photos/squat-jumps.gif","squat jump animation");

INSERT INTO Tags(tag_name)
VALUES ("Full-body"),
("hips"),
("glutes"),
("quads"),
("hamstrings"),
("cardio"),
("beginner"),
("core"),
("triceps"),
("chest"),
("calves"),
("intermediate");

INSERT INTO PictureActivitiesRelation(picture_id,activity_id)
VALUES ("jumping-jack","65620c6a-6a3c-420c-9257-8061760fb3e4"),
("high-knee","b91db615-17a0-4c34-acbe-e064a325e981"),
("burpee","a275347b-4785-4b47-90a6-8a0430d61004"),
("squat-jump","f7c91bdd-2629-4b31-bff8-5331d2890fc9");

INSERT INTO ActivityTagRelation(tag_name,activity_id)
VALUES ("Full-body","65620c6a-6a3c-420c-9257-8061760fb3e4"),
("cardio","65620c6a-6a3c-420c-9257-8061760fb3e4"),
("beginner","65620c6a-6a3c-420c-9257-8061760fb3e4"),
("intermediate","a275347b-4785-4b47-90a6-8a0430d61004"),
("intermediate","f7c91bdd-2629-4b31-bff8-5331d2890fc9"),
("glutes","f7c91bdd-2629-4b31-bff8-5331d2890fc9"),
("glutes","a275347b-4785-4b47-90a6-8a0430d61004"),
("quads","f7c91bdd-2629-4b31-bff8-5331d2890fc9"),
("beginner","b91db615-17a0-4c34-acbe-e064a325e981"),
("hips","b91db615-17a0-4c34-acbe-e064a325e981"),
("glutes","b91db615-17a0-4c34-acbe-e064a325e981"),
("hamstrings","b91db615-17a0-4c34-acbe-e064a325e981"),
("hamstrings","a275347b-4785-4b47-90a6-8a0430d61004"),
("triceps","a275347b-4785-4b47-90a6-8a0430d61004"),
("chest","a275347b-4785-4b47-90a6-8a0430d61004"),
("calves","a275347b-4785-4b47-90a6-8a0430d61004"),
("core","a275347b-4785-4b47-90a6-8a0430d61004");


INSERT INTO PlaylistActivityRelation (activity_id,playlist_id,orderNumber) VALUES 
("65620c6a-6a3c-420c-9257-8061760fb3e4",'c4bc911f-01d6-499f-8f17-8b973d44f7b8',1),
("b91db615-17a0-4c34-acbe-e064a325e981",'c4bc911f-01d6-499f-8f17-8b973d44f7b8',0);

INSERT INTO UserPlaylistRelation (user_id,playlist_id) VALUES
("d7dcf380-33a3-4cb4-94c2-0323f18be441","c4bc911f-01d6-499f-8f17-8b973d44f7b8");

INSERT INTO UserActivityRelation (user_id,activity_id) VALUES
("d7dcf380-33a3-4cb4-94c2-0323f18be441","b91db615-17a0-4c34-acbe-e064a325e981"),
("d7dcf380-33a3-4cb4-94c2-0323f18be441","65620c6a-6a3c-420c-9257-8061760fb3e4"),
("d7dcf380-33a3-4cb4-94c2-0323f18be441","f7c91bdd-2629-4b31-bff8-5331d2890fc9");
("d7dcf380-33a3-4cb4-94c2-0323f18be441","a275347b-4785-4b47-90a6-8a0430d61004");




-- Down

DROP TABLE Activities;
DROP TABLE Playlist;
DROP TABLE Tags;
DROP TABLE Users;
DROP TABLE ActivityTagRelation;
DROP TABLE PlaylistTagRelation;
DROP TABLE UserActivityRelation;
DROP TABLE UserPlaylistRelation;
