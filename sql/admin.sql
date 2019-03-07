CREATE TABLE IF NOT EXISTS `users` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `first_name` text NOT NULL,
  `last_name` text NOT NULL,
  `email` VARCHAR(320) NOT NULL,
  `mob_no` int(11) NOT NULL,
  `user_name` varchar(40) NOT NULL,
  `password` varchar(32) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

INSERT INTO users(first_name,last_name,email,mob_no,user_name,password) VALUES ('Jichael','Mefferies','admin@netsoc.co',1234567890,'my_own_username','admin');