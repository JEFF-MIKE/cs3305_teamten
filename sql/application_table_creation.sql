DROP TABLE IF EXISTS applications;
CREATE TABLE applications(
applicant_id VARCHAR(10) NOT NULL,
application_id INT AUTO_INCREMENT,
time_of_submission VARCHAR(50),
amount_requested VARCHAR(10),
file_name VARCHAR(30),
cover_note VARCHAR(1000),
approved TINYINT(1),
submission_version INT(1),
group_id VARCHAR(10) NOT NULL,

PRIMARY KEY(application_id)
);