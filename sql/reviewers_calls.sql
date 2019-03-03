DROP TABLE IF EXISTS reviewers_calls;

CREATE TABLE IF NOT EXISTS reviewers_calls (
    row_id INT(5) PRIMARY KEY AUTO_INCREMENT,
    call_id INT(5),
    reviewer_id INT(5)
);

/*  can have multiple call_id and reviewer_ids. 
    Table used for validating what reviewer can 
    review what calls.
*/
