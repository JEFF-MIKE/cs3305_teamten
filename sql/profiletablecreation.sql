
--SELECT * FROM education;
CREATE TABLE IF NOT EXISTS education (
  degree VARCHAR(255) NOT NULL,
  field_of_study VARCHAR(255) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  year_of_degree_award DATE NOT NULL
);

--SELECT * FROM employment;
CREATE TABLE IF NOT EXISTS employment (
  company_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  years DATE NOT NULL
);

--SELECT * FROM professional_societies;
CREATE TABLE IF NOT EXISTS professional_societies (
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  name_of_society VARCHAR(255) NOT NULL,
  type_of_membership VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL
);

--SELECT * FROM awards;
CREATE TABLE IF NOT EXISTS awards (
  year DATE NOT NULL,
  awarding_body VARCHAR(255) NOT NULL,
  details_of_award VARCHAR(255) NOT NULL,
  team_member_name VARCHAR(255) NOT NULL
);

--SELECT * FROM funding_diversification;
CREATE TABLE IF NOT EXISTS funding_diversification (
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  amount_of_funding INT NOT NULL,
  funding_body VARCHAR(255) NOT NULL,
  funding_programme VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL,
  primary_attribution VARCHAR(255) NOT NULL
);

--SELECT * FROM team_members;
CREATE TABLE IF NOT EXISTS team_members (
  start_date_with_team DATE NOT NULL,
  departure_date DATE NOT NULL,
  name VARCHAR(255) NOT NULL,
  position_within_the_team VARCHAR(255) NOT NULL,
  primary_attribution VARCHAR(255) NOT NULL
);

--SELECT * FROM impacts;
CREATE TABLE IF NOT EXISTS impacts (
  impact_title VARCHAR(255) NOT NULL,
  impact_category VARCHAR(255) NOT NULL,
  primary_beneficiary VARCHAR(255) NOT NULL,
  primary_attribution VARCHAR(255) NOT NULL
);

--SELECT * FROM innovation_and_commercialisation;
CREATE TABLE IF NOT EXISTS innovation_and_commercialisation (
  year DATE NOT NULL,
  type VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  primary_attribution VARCHAR(255) NOT NULL
);

--SELECT * FROM publications;
CREATE TABLE IF NOT EXISTS publications (
  publication_year DATE NOT NULL,
  publication_type ENUM ("Refereed original article", "Refereed review article", "Refereed conference paper", "Book", "Technical report") NOT NULL,
  title VARCHAR(255) NOT NULL,
  journal_name VARCHAR(255) NOT NULL,
  publication_status ENUM ("Published", "In press") NOT NULL,
  doi VARCHAR(20) NOT NULL,
  primary_attribution VARCHAR(255) NOT NULL
);

--SELECT * FROM presentations;
CREATE TABLE IF NOT EXISTS presentations (
  year DATE NOT NULL,
  title_of_presentation VARCHAR(255) NOT NULL,
  event_type ENUM ("Conference", "Invited seminar", "Keynote") NOT NULL,
  organising_body VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  primary_attribution VARCHAR(255) NOT NULL
);

--SELECT * FROM academic_collaborations;
CREATE TABLE IF NOT EXISTS academic_collaborations (
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  name_of_institution VARCHAR(255) NOT NULL,
  department_within_institution VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  name_of_collaborator VARCHAR(255) NOT NULL,
  primary_goal_of_collaboration ENUM ("Access to software etc", "Training and career development", "Joint publication", "Startup development", "License development", "Building networks and relationships") NOT NULL,
  frequency_of_interaction INT NOT NULL,
  primary_attribution VARCHAR(255) NOT NULL
);

--SELECT * FROM non_academic_collaborations;
CREATE TABLE IF NOT EXISTS non_academic_collaborations (
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  name_of_institution VARCHAR(255) NOT NULL,
  department_within_institution VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  name_of_collaborator VARCHAR(255) NOT NULL,
  primary_goal_of_collaboration ENUM ("Access to software etc", "Training and career development", "Joint publication", "Startup development", "License development", "Building networks and relationships") NOT NULL,
  frequency_of_interaction INT NOT NULL,
  primary_attribution VARCHAR(255) NOT NULL
);

--SELECT * FROM conferences;
CREATE TABLE IF NOT EXISTS conferences (
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  title VARCHAR(255) NOT NULL,
  event_type ENUM ("Conference", "Workshop", "Seminar") NOT NULL,
  role VARCHAR(255) NOT NULL,
  location_of_event VARCHAR(255) NOT NULL,
  primary_attribution VARCHAR(255) NOT NULL
);

--SELECT * FROM communications_overview;
CREATE TABLE IF NOT EXISTS communications_overview (
  year DATE NOT NULL,
  number_of_public_lectures INT NOT NULL,
  number_of_visits INT NOT NULL,
  number_of_media_interactions INT NOT NULL
);

--SELECT * FROM sfi_funding_ratio;
CREATE TABLE IF NOT EXISTS sfi_funding_ratio (
  year DATE NOT NULL,
  percentage_of_annual_spend INT NOT NULL
);

--SELECT * FROM education_and_public_engagement;
CREATE TABLE IF NOT EXISTS education_and_public_engagement (
  name_of_project VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  activity_type ENUM ("Public event", "In-class activities", "Career experience programme", "Other ") NOT NULL,
  project_topic ENUM ("Science", "Math", "Engineering", "Technology", "Space related", "Other") NOT NULL,
  target_geographical_area ENUM ("Local", "National", "International") NOT NULL,
  primary_attribution VARCHAR(255) NOT NULL
);
