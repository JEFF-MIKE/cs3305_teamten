DROP TABLE IF EXISTS `roles`;

CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(5) NOT NULL ,
  `researcher` ENUM('YES','NO') NOT NULL,
  `reviewer` ENUM ('YES','NO') NOT NULL,
  `funder` ENUM('YES','NO') NOT NULL,
  `admin` ENUM('YES','NO') NOT NULL,
  FOREIGN KEY(id) 
  REFERENCES users(id)
) ENGINE=InnoDB;
/* 
Foreign keys: A value in users must exist for this SQL query to work.
*/

INSERT INTO `roles` (id,researcher,reviewer,funder,admin) VALUES (4,'YES','YES','YES','YES');


