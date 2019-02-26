DROP TABLE IF EXISTS test_profile;

CREATE TABLE test_profile(
    id INT(5) NOT NULL,
    hobby VARCHAR(50),
    animal VARCHAR(50)
);

INSERT INTO test_profile(id,hobby,animal) VALUES (1,"Hiking","Dog")