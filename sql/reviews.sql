DROP TABLE IF EXISTS reviews;

DROP TABLE IF EXISTS reviews;

CREATE TABLE reviews_v1 (
    review_id INT(5) AUTO_INCREMENT,
    applicant_id INT(5),
    application_id INT(5),
    reviewer_id INT(5),
    funder_id INT(5),
    review_text TEXT,
    call_id INT(5),
    is_draft BOOLEAN
);
/*
CREATE TABLE reviews (
    review_id INT(5) AUTO_INCREMENT,
    applicant_id INT(5) NOT NULL,
    application_id INT(5) NOT NULL,
    reviewer_id INT(5) NOT NULL,
    funder_id INT(5) NOT NULL,
    review_text TEXT NOT NULL,
    call_id INT(5) NOT NULL
    is_draft BOOLEAN
);

 Everything in this table needs to not be null!*/
