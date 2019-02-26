CREATE TABLE IF NOT EXISTS calls (
    call_id INT AUTO_INCREMENT,
    funder_user_id INT NOT NULL,
    app_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    expiry_date DATE,
    active_status TINYINT(1) NOT NULL,
    is_draft TINYINT(1) NOT NULL,
    description TEXT,
    PRIMARY KEY (call_id)
)
