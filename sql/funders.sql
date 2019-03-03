/*  Table for funders when they have approved or denied an 
    application. It gets stored here with a reason as to why.
*/

DROP TABLE IF EXISTS funders_response;

CREATE TABLE funders_response (
    funder_response_id INT(5) PRIMARY KEY AUTO INCREMENT,
    funder_id INT(5),
    application_id INT(5),
    decision ENUM("YES","NO"),
    reason VARCHAR(50)
);
