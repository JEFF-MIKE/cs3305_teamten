

DROP TABLE IF EXISTS education;
CREATE TABLE IF NOT EXISTS education (
  education_degree VARCHAR(255) NOT NULL,
  education_field_of_study VARCHAR(255) NOT NULL,
  education_institution VARCHAR(255) NOT NULL,
  education_location VARCHAR(255) NOT NULL,
  education_year_of_degree_award DATE NOT NULL,
  PRIMARY KEY (user_id)
);


DROP TABLE IF EXISTS employment;
CREATE TABLE IF NOT EXISTS employment (
  employment_company_name VARCHAR(255) NOT NULL,
  employment_location VARCHAR(255) NOT NULL,
  employment_years DATE NOT NULL,
  PRIMARY KEY (user_id)
);


DROP TABLE IF EXISTS professional_societies;
CREATE TABLE IF NOT EXISTS professional_societies (
  professional_societies_start_date DATE NOT NULL,
  professional_societies_end_date DATE NOT NULL,
  professional_societies_name_of_society VARCHAR(255) NOT NULL,
  professional_societies_type_of_membership VARCHAR(255) NOT NULL,
  professional_societies_status VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id)
);


DROP TABLE IF EXISTS awards;
CREATE TABLE IF NOT EXISTS awards (
  awards_year DATE NOT NULL,
  awards_awarding_body VARCHAR(255) NOT NULL,
  awards_details_of_award VARCHAR(255) NOT NULL,
  awards_team_member_name VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id)
);


DROP TABLE IF EXISTS funding_diversification;
CREATE TABLE IF NOT EXISTS funding_diversification (
  funding_diversification_start_date DATE NOT NULL,
  funding_diversification_end_date DATE NOT NULL,
  funding_diversification_amount_of_funding INT NOT NULL,
  funding_diversification_funding_body VARCHAR(255) NOT NULL,
  funding_diversification_funding_programme VARCHAR(255) NOT NULL,
  funding_diversification_status VARCHAR(255) NOT NULL,
  funding_diversification_primary_attribution VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id)
);


DROP TABLE IF EXISTS team_members;
CREATE TABLE IF NOT EXISTS team_members (
  team_members_start_date_with_team DATE NOT NULL,
  team_members_departure_date DATE NOT NULL,
  team_members_name VARCHAR(255) NOT NULL,
  team_members_position_within_the_team VARCHAR(255) NOT NULL,
  team_members_primary_attribution VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id)
);


DROP TABLE IF EXISTS impacts;
CREATE TABLE IF NOT EXISTS impacts (
  impacts_impact_title VARCHAR(255) NOT NULL,
  impacts_impact_category VARCHAR(255) NOT NULL,
  impacts_primary_beneficiary VARCHAR(255) NOT NULL,
  impacts_primary_attribution VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id)
);


DROP TABLE IF EXISTS innovation_and_commercialisation;
CREATE TABLE IF NOT EXISTS innovation_and_commercialisation (
  innovation_and_commercialisation_year DATE NOT NULL,
  innovation_and_commercialisation_type VARCHAR(255) NOT NULL,
  innovation_and_commercialisation_title VARCHAR(255) NOT NULL,
  innovation_and_commercialisation_primary_attribution VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id)
);


DROP TABLE IF EXISTS publications;
CREATE TABLE IF NOT EXISTS publications (
  publications_publication_year DATE NOT NULL,
  publications_publication_type ENUM ("Refereed original article", "Refereed review article", "Refereed conference paper", "Book", "Technical report") NOT NULL,
  publications_title VARCHAR(255) NOT NULL,
  publications_journal_name VARCHAR(255) NOT NULL,
  publications_publication_status ENUM ("Published", "In press") NOT NULL,
  publications_doi VARCHAR(20) NOT NULL,
  publications_primary_attribution VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id)
);


DROP TABLE IF EXISTS presentations;
CREATE TABLE IF NOT EXISTS presentations (
  presentations_year DATE NOT NULL,
  presentations_title_of_presentation VARCHAR(255) NOT NULL,
  presentations_event_type ENUM ("Conference", "Invited seminar", "Keynote") NOT NULL,
  presentations_organising_body VARCHAR(255) NOT NULL,
  presentations_location VARCHAR(255) NOT NULL,
  presentations_primary_attribution VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id)
);


DROP TABLE IF EXISTS academic_collaborations;
CREATE TABLE IF NOT EXISTS academic_collaborations (
  academic_collaborations_start_date DATE NOT NULL,
  academic_collaborations_end_date DATE NOT NULL,
  academic_collaborations_name_of_institution VARCHAR(255) NOT NULL,
  academic_collaborations_department_within_institution VARCHAR(255) NOT NULL,
  academic_collaborations_location VARCHAR(255) NOT NULL,
  academic_collaborations_name_of_collaborator VARCHAR(255) NOT NULL,
  academic_collaborations_primary_goal_of_collaboration ENUM ("Access to software etc", "Training and career development", "Joint publication", "Startup development", "License development", "Building networks and relationships") NOT NULL,
  academic_collaborations_frequency_of_interaction INT NOT NULL,
  academic_collaborations_primary_attribution VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id)
);


DROP TABLE IF EXISTS non_academic_collaborations;
CREATE TABLE IF NOT EXISTS non_academic_collaborations (
  non_academic_collaborations_start_date DATE NOT NULL,
  non_academic_collaborations_end_date DATE NOT NULL,
  non_academic_collaborations_name_of_institution VARCHAR(255) NOT NULL,
  non_academic_collaborations_department_within_institution VARCHAR(255) NOT NULL,
  non_academic_collaborations_location VARCHAR(255) NOT NULL,
  non_academic_collaborations_name_of_collaborator VARCHAR(255) NOT NULL,
  non_academic_collaborations_primary_goal_of_collaboration ENUM ("Access to software etc", "Training and career development", "Joint publication", "Startup development", "License development", "Building networks and relationships") NOT NULL,
  non_academic_collaborations_frequency_of_interaction INT NOT NULL,
  non_academic_collaborations_primary_attribution VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id)
);


DROP TABLE IF EXISTS conferences;
CREATE TABLE IF NOT EXISTS conferences (
  conferences_start_date DATE NOT NULL,
  conferences_end_date DATE NOT NULL,
  conferences_title VARCHAR(255) NOT NULL,
  conferences_event_type ENUM ("Conference", "Workshop", "Seminar") NOT NULL,
  conferences_role VARCHAR(255) NOT NULL,
  conferences_location_of_event VARCHAR(255) NOT NULL,
  conferences_primary_attribution VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id)
);


DROP TABLE IF EXISTS communications_overview;
CREATE TABLE IF NOT EXISTS communications_overview (
  communications_overview_year DATE NOT NULL,
  communications_overview_number_of_public_lectures INT NOT NULL,
  communications_overview_number_of_visits INT NOT NULL,
  communications_overview_number_of_media_interactions INT NOT NULL,
  PRIMARY KEY (user_id)
);


DROP TABLE IF EXISTS sfi_funding_ratio;
CREATE TABLE IF NOT EXISTS sfi_funding_ratio (
  sfi_funding_ratio_year DATE NOT NULL,
  sfi_funding_ratio_percentage_of_annual_spend INT NOT NULL,
  PRIMARY KEY (user_id)
);


DROP TABLE IF EXISTS education_and_public_engagement;
CREATE TABLE IF NOT EXISTS education_and_public_engagement (
  education_and_public_engagement_name_of_project VARCHAR(255) NOT NULL,
  education_and_public_engagement_start_date DATE NOT NULL,
  education_and_public_engagement_end_date DATE NOT NULL,
  education_and_public_engagement_activity_type ENUM ("Public event", "In-class activities", "Career experience programme", "Other ") NOT NULL,
  education_and_public_engagement_project_topic ENUM ("Science", "Math", "Engineering", "Technology", "Space related", "Other") NOT NULL,
  education_and_public_engagement_target_geographical_area ENUM ("Local", "National", "International") NOT NULL,
  education_and_public_engagement_primary_attribution VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id)
);
