--SELECT * FROM 'educationDROP' TABLE IF EXISTS 'education';
CREATE TABLE 'education' (
  degree VARCHAR(255) NOT NULL,
  field_of_study VARCHAR(255) NOT NULL,
  institution VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  year_of_degree_award DATE NOT NULL
);

--SELECT * FROM 'employment'
DROP TABLE IF EXISTS 'employment';
CREATE TABLE 'employment' (
  company_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  years DATE NOT NULL
);

--SELECT * FROM 'professional_societies'
DROP TABLE IF EXISTS 'professional_societies';
CREATE TABLE 'professional_societies' (
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  name_of_society VARCHAR(255) NOT NULL,
  type_of_membership VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL
);

--SELECT * FROM 'awards'
DROP TABLE IF EXISTS 'awards';
CREATE TABLE 'awards' (
  year DATE NOT NULL,
  awarding_body VARCHAR(255) NOT NULL,
  details_of_award VARCHAR(255) NOT NULL,
  team_member_name VARCHAR(255) NOT NULL
);

--SELECT * FROM 'funding_diversification'
DROP TABLE IF EXISTS 'funding_diversification';
CREATE TABLE 'funding_diversification' (
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  amount_of_funding INT NOT NULL,
  funding_body VARCHAR(255) NOT NULL,
  funding_programme VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL,
  primary_attribution VARCHAR(255) NOT NULL
);

--SELECT * FROM 'team_members'
DROP TABLE IF EXISTS 'team_members';
CREATE TABLE 'team_members' (
  start_date_with_team DATE NOT NULL,
  departure_date DATE NOT NULL,
  name VARCHAR(255) NOT NULL,
  position_within_the_team VARCHAR(255) NOT NULL,
  primary_attribution VARCHAR(255) NOT NULL
);

--SELECT * FROM 'impacts'
DROP TABLE IF EXISTS 'impacts';
CREATE TABLE 'impacts' (
  impact_title VARCHAR(255) NOT NULL,
  impact_category VARCHAR(255) NOT NULL,
  primary_beneficiary VARCHAR(255) NOT NULL,
  primary_attribution VARCHAR(255) NOT NULL
);

--SELECT * FROM 'innovation_and_commercialisation'
DROP TABLE IF EXISTS 'innovation_and_commercialisation';
CREATE TABLE 'innovation_and_commercialisation' (
  year DATE NOT NULL,
  type VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  primary_attribution VARCHAR(255) NOT NULL
);

--SELECT * FROM 'publications'
DROP TABLE IF EXISTS 'publications';
CREATE TABLE 'publications' (
  publication_year DATE NOT NULL,
  publication_type INT NOT NULL, --INT because only one of select options
  title VARCHAR(255) NOT NULL,
  journal_name VARCHAR(255) NOT NULL,
  publication_status INT NOT NULL, --INT because only one of select options
  doi VARCHAR(20) NOT NULL,
  primary_attribution VARCHAR(255) NOT NULL
);

--SELECT * FROM 'presentations'
DROP TABLE IF EXISTS 'presentations';
CREATE TABLE 'presentations' (
  year DATE NOT NULL,
  title_of_presentation VARCHAR(255) NOT NULL,
  event_type INT NOT NULL, --INT because only one of select options
  organising_body VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  primary_attribution VARCHAR(255) NOT NULL
);

--SELECT * FROM 'academic_collaborations'
DROP TABLE IF EXISTS 'academic_collaborations';
CREATE TABLE 'academic_collaborations' (
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  name_of_institution VARCHAR(255) NOT NULL,
  department_within_institution VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  name_of_collaborator VARCHAR(255) NOT NULL,
  primary_goal_of_collaboration INT NOT NULL, --INT because only one of select options
  frequency_of_interaction INT NOT NULL,
  primary_attribution VARCHAR(255) NOT NULL
);

--SELECT * FROM 'non_academic_collaborations'
DROP TABLE IF EXISTS 'non_academic_collaborations';
CREATE TABLE 'non_academic_collaborations' (
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  name_of_institution VARCHAR(255) NOT NULL,
  department_within_institution VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  name_of_collaborator VARCHAR(255) NOT NULL,
  primary_goal_of_collaboration INT NOT NULL, --INT because only one of select options
  frequency_of_interaction INT NOT NULL,
  primary_attribution VARCHAR(255) NOT NULL
);

--SELECT * FROM 'conferences'
DROP TABLE IF EXISTS 'conferences';
CREATE TABLE 'conferences' (
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  title VARCHAR(255) NOT NULL,
  event_type INT NOT NULL, --INT because only one of select options
  role VARCHAR(255) NOT NULL,
  location_of_event VARCHAR(255) NOT NULL,
  primary_attribution VARCHAR(255) NOT NULL
);

--SELECT * FROM 'communications_overview'
DROP TABLE IF EXISTS 'communications_overview';
CREATE TABLE 'communications_overview' (
  year DATE NOT NULL,
  number_of_public_lectures INT NOT NULL,
  number_of_visits INT NOT NULL,
  number_of_media_interactions INT NOT NULL
);

--SELECT * FROM 'sfi_funding_ratio'
DROP TABLE IF EXISTS 'sfi_funding_ratio';
CREATE TABLE 'sfi_funding_ratio' (
  year DATE NOT NULL,
  percentage_of_annual_spend INT NOT NULL
);

--SELECT * FROM 'education_and_public_engagement'
DROP TABLE IF EXISTS 'education_and_public_engagement';
CREATE TABLE 'education_and_public_engagement' (
  name_of_project VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  activity_type INT NOT NULL, --INT because only one of select options
  project_topic INT NOT NULL, --INT because only one of select options
  target_geographical_area INT NOT NULL, --INT because only one of select options
  primary_attribution VARCHAR(255) NOT NULL
);
