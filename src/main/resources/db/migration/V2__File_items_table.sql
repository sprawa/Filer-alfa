CREATE TABLE file_items
(
  id int PRIMARY KEY AUTO_INCREMENT,
  owner varchar(255),
  file_name varchar(255),
  root_id int,
  folder boolean NOT NULL,
  FOREIGN KEY (owner) REFERENCES users(email),
  FOREIGN KEY (root_id) REFERENCES file_items(id)
)

