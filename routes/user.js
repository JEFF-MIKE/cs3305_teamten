/*
-------------------------- When profile link is clicked, call this. -----------------------
*/
/*
function queryRoles(number){
    // A function which takes an input
    // "id" and returns an object containing roles
    //e.g. researcher:"Y"
    //     reviewer: "N" etc
    //otherwise object returns null
    let roleSelect=`SELECT * FROM roles WHERE id = ${number}`;
    db.query(roleSelect,(err,result) => {
        console.log(result);
        let admin = "";
        let researcher = "";
        let reviewer = "";
        let funder = "";
        let returnObject = {};
        console.log("Entering query function");
        if (result.length){
            // now make object
            // shorthand if else: var = condition ? true : false
            //result[0].admin === "YES" ? returnObject.admin = "Y" : returnObject.admin = "N";
            if (result[0].admin === "YES"){
                returnObject.admin = "Y";
            } else {
                returnObject.admin = "N";
            }
            console.log(returnObject.admin);
            result[0].researcher === "YES" ? returnObject.researcher = "Y" : returnObject.researcher = "N";
            result[0].reviewer === "YES" ? returnObject.reviewer = "Y" : returnObject.reviewer = "N";
            result[0].funder === "YES" ? returnObject.funder = "Y" : returnObject.funder = "N";
            console.log(returnObject);
            return returnObject;
        } else{
            return null;
        }
        });
}
*/

function fetchId(data,callback){
    // callback function for grabbing ID from table when creating user account.
    let sql = "SELECT id FROM users where email = ?;"
    db.query(sql,data.email, (err,rows) => {
        if (err){
            callback(err,null);
        } else {
            console.log(rows[0]);
            console.log("This is id from table:" + rows[0].id);
            callback(null,rows[0].id);
        }
    });
}

function insertRoles(data,callback){
    // callback function for inserting into roles table on account creation.
    let sql = "INSERT INTO `roles` (id,researcher,reviewer,funder,admin) VALUES (?,?,?,?,?);";
    // data is an object of roles mapped to yes or no
    db.query(sql,[data.tempUserID, data.researcher ,data.reviewer, data.funder, data.admin],(err,rows) => {
        if (err){
            callback(err,null);
        } else {
            // it's an insert, it's completed.
            callback(null,"Completed");
        }
    });
}

function selectRoles(data,callback){
    /*
    Callback function for checking to see if the user should be able
    to view a certain website or not. Data is id.
    */
   let sql = "SELECT * FROM `roles` where id = ?";
   db.query(sql,data,(err,rows) => {
       if (err){
           callback(err,null);
       } else{
           let retObj = {
               admin: rows[0].admin,
               reviewer: rows[0].reviewer,
               researcher: rows[0].researcher,
               funder: rows[0].funder
           };
           callback(null,retObj);
       }
   });
}

exports.editProfile = (req, res) => {
  if (req.method === "GET"){
    // session details.
    let userID = req.session.user_id;
    let userName = req.session.user_name;

    if (userID === undefined){
        let string = encodeURIComponent('0');
        res.redirect("/?errorStatus=" + string);
        return;
    } else{
      let message = "";
      return res.render('editProfile.ejs',{
        message: message
      });
    }
  }
  else if (req.method === "POST") {

    // get the body
    let post  = req.body;
    // grab form data
    let first_name = post.first_name;
    let last_name = post.last_name;
    let email = post.email;
    let degree = post.degree;
    let field = post.field;
    let institution = post.institution;
    let location = post.location;
    let title = post.title;
    let journal_name = post.journal_name;

    let userID = req.session.user_id;
    let userName = req.session.user_name;

    if (userID === undefined){
        let string = encodeURIComponent('0');
        res.redirect("/?errorStatus=" + string);
        return;
    } else{

        // function for getting SQL data of active calls for proposals
        let sql = "UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE id = ?; UPDATE education SET degree = ?, field_of_study = ?, institution = ?, location = ? WHERE user_id = ?; UPDATE publications SET title = ?, journal_name = ? WHERE user_id = ?;";
        db.query(sql, [first_name, last_name, email, userID, degree, field_of_study, institution, location, userID, title, journal_name, userID], (err,rows) => {
            let message = "Successfuly updated profile!";
            if (err) throw err;
            if (rows.length) {
              return res.render('editProfile.ejs',{
                message: message
              });
            }
        });
      }
    }
}


exports.profile=(req,res) =>{
    // session details.
    let userID = req.session.user_id;
    let userName = req.session.user_name;

    // user must be logged in to view their own profile.
    if (userID === undefined){
        let string = encodeURIComponent('0');
        res.redirect("/?errorStatus=" + string);
        return;
    } else{
        // they are logged in, display their profile details.
        // first, escape with array, sub with question marks
        console.log("ID is " + userID);
        var sql="SELECT first_name, last_name, user_name, email, mob_no FROM users WHERE id=?;SELECT * FROM roles WHERE id=?;SELECT * FROM education WHERE user_id = ?;SELECT * FROM employment WHERE user_id = ?;SELECT * FROM professional_societies WHERE user_id = ?;SELECT * FROM awards WHERE user_id = ?;SELECT * FROM funding_diversification WHERE user_id = ?;SELECT * FROM team_members WHERE user_id = ?;SELECT * FROM impacts WHERE user_id = ?;SELECT * FROM innovation_and_commercialisation WHERE user_id = ?;SELECT * FROM publications WHERE user_id = ?;SELECT * FROM presentations WHERE user_id = ?;SELECT * FROM academic_collaborations WHERE user_id = ?;SELECT * FROM non_academic_collaborations WHERE user_id = ?;SELECT * FROM conferences WHERE user_id = ?;SELECT * FROM communications_overview WHERE user_id = ?;SELECT * FROM sfi_funding_ratio WHERE user_id = ?;SELECT * FROM education_and_public_engagement WHERE user_id = ?;"
        db.query(sql,[userID, userID, userID, userID, userID, userID, userID, userID, userID, userID, userID, userID, userID, userID, userID, userID, userID, userID], (err,results) => {
            // declare variables and return inside this function
            let errorFlag = false;
            let fname = "";
            let lname = "";
            let user_name = "";
            let mobile = "";
            let email = "";
            let admin = "";
            let researcher = "";
            let reviewer = "";
            let funder = "";

            let education_degree = ""
            let education_field_of_study = ""
            let education_institution = ""
            let education_location = ""
            let education_year_of_degree_award = ""

            let employment_company_name = ""
            let employment_location = ""
            let employment_years = ""

            let professional_societies_start_date = ""
            let professional_societies_end_date = ""
            let professional_societies_name_of_society = ""
            let professional_societies_type_of_membership = ""
            let professional_societies_status = ""

            let awards_year = ""
            let awards_awarding_body = ""
            let awards_details_of_award = ""
            let awards_team_member_name = ""

            let funding_diversification_start_date = ""
            let funding_diversification_end_date = ""
            let funding_diversification_amount_of_funding = ""
            let funding_diversification_funding_body = ""
            let funding_diversification_funding_programme = ""
            let funding_diversification_status = ""
            let funding_diversification_primary_attribution = ""

            let team_members_start_date_with_team = ""
            let team_members_departure_date = ""
            let team_members_name = ""
            let team_members_position_within_the_team = ""
            let team_members_primary_attribution = ""

            let impacts_impact_title = ""
            let impacts_impact_category = ""
            let impacts__beneficiary = ""
            let impacts_primary_attribution = ""

            let innovation_and_commercialisation_year = ""
            let innovation_and_commercialisation_type = ""
            let innovation_and_commercialisation_title = ""
            let innovation_and_commercialisation_primary_attribution = ""

            let publications_publication_year = ""
            let publications_publication_type = ""
            let publications_title = ""
            let publications_journal_name = ""
            let publications_publication_status = ""
            let publications_doi = ""
            let publications_primary_attribution = ""

            let presentations_year = ""
            let presentations_title_of_presentation = ""
            let presentations_event_type = ""
            let presentations_organising_body = ""
            let presentations_location = ""
            let presentations_primary_attribution = ""

            let academic_collaborations_start_date = ""
            let academic_collaborations_end_date = ""
            let academic_collaborations_name_of_institution = ""
            let academic_collaborations_department_within_institution = ""
            let academic_collaborations_location = ""
            let academic_collaborations_name_of_collaborator = ""
            let academic_collaborations__goal_of_collaboration = ""
            let academic_collaborations_frequency_of_interaction = ""
            let academic_collaborations_primary_attribution = ""

            let non_academic_collaborations_start_date = ""
            let non_academic_collaborations_end_date = ""
            let non_academic_collaborations_name_of_institution = ""
            let non_academic_collaborations_department_within_institution = ""
            let non_academic_collaborations_location = ""
            let non_academic_collaborations_name_of_collaborator = ""
            let non_academic_collaborations__goal_of_collaboration = ""
            let non_academic_collaborations_frequency_of_interaction = ""
            let non_academic_collaborations_primary_attribution = ""

            let conferences_start_date = ""
            let conferences_end_date = ""
            let conferences_title = ""
            let conferences_event_type = ""
            let conferences_role = ""
            let conferences_location_of_event = ""
            let conferences_primary_attribution = ""

            let communications_overview_year = ""
            let communications_overview_number_of_public_lectures = ""
            let communications_overview_number_of_visits = ""
            let communications_overview_number_of_media_interactions = ""

            let sfi_funding_ratio_year = ""
            let sfi_funding_ratio_percentage_of_annual_spend = ""

            let education_and_public_engagement_name_of_project = ""
            let education_and_public_engagement_start_date = ""
            let education_and_public_engagement_end_date = ""
            let education_and_public_engagement_activity_type = ""
            let education_and_public_engagement_project_topic = ""
            let education_and_public_engagement_target_geographical_area = ""
            let education_and_public_engagement_primary_attribution = ""

            if (err) throw err;
            if(results[0].length){
                // grabs data from users table
               console.log(results[0][0].first_name);
               fname = results[0][0].first_name;
               lname = results[0][0].last_name;
               user_name = results[0][0].user_name;
               mobile = results[0][0].mob_no;
               console.log(mobile + "In scope");
            } else {
                errorFlag = true;
            }
            if (results[1].length){
                // grabs data from roles table
                console.log(results[1][0].researcher);
                results[1][0].researcher === "YES" ? researcher = "Y" : researcher = "N";
                results[1][0].reviewer === "YES" ? reviewer = "Y" : reviewer = "N";
                results[1][0].funder === "YES" ? funder = "Y" : funder = "N";
                results[1][0].admin === "YES" ? admin = "Y" : admin = "N";
            } else {
                errorFlag = true;
            }
            if(results[2].length){
              education_degree = results[2][0].degree;
              education_field_of_study = results[2][0].field_of_study;
              education_institution = results[2][0].institution;
              education_location = results[2][0].location;
              education_year_of_degree_award = results[2][0].year_of_degree_award;
            } else {
                errorFlag = true
            }

            if(results[3].length){
              employment_company_name = results[3][0].company_name;
              employment_location = results[3][0].location;
              employment_years = results[3][0].years;
            } else {
                errorFlag = true
            }

            if(results[4].length){
              professional_societies_start_date = results[4][0].start_date;
              professional_societies_end_date = results[4][0].end_date;
              professional_societies_name_of_society = results[4][0].name_of_society;
              professional_societies_type_of_membership = results[4][0].type_of_membership;
              professional_societies_status = results[4][0].status;
            } else {
                errorFlag = true
            }

            if(results[5].length){
              awards_year = results[5][0].year;
              awards_awarding_body = results[5][0].awarding_body;
              awards_details_of_award = results[5][0].details_of_award;
              awards_team_member_name = results[5][0].team_member_name;
            } else {
                errorFlag = true
            }

            if(results[6].length){
              funding_diversification_start_date = results[6][0].start_date;
              funding_diversification_end_date = results[6][0].end_date;
              funding_diversification_amount_of_funding = results[6][0].amount_of_funding;
              funding_diversification_funding_body = results[6][0].funding_body;
              funding_diversification_funding_programme = results[6][0].funding_programme;
              funding_diversification_status = results[6][0].status;
              funding_diversification_primary_attribution = results[6][0].primary_attribution;
            } else {
                errorFlag = true
            }

            if(results[7].length){
              team_members_start_date_with_team = results[7][0].start_date_with_team;
              team_members_departure_date = results[7][0].departure_date;
              team_members_name = results[7][0].name;
              team_members_position_within_the_team = results[7][0].position_within_the_team;
              team_members_primary_attribution = results[7][0].primary_attribution;
            } else {
                errorFlag = true
            }

            if(results[8].length){
              impacts_impact_title = results[8][0].impact_title;
              impacts_impact_category = results[8][0].impact_category;
              impacts_primary_beneficiary = results[8][0].primary_beneficiary;
              impacts_primary_attribution = results[8][0].primary_attribution;
            } else {
                errorFlag = true
            }

            if(results[9].length){
              innovation_and_commercialisation_year = results[9][0].year;
              innovation_and_commercialisation_type = results[9][0].type;
              innovation_and_commercialisation_title = results[9][0].title;
              innovation_and_commercialisation_primary_attribution = results[9][0].primary_attribution;
            } else {
                errorFlag = true
            }

            if(results[10].length){
              publications_publication_year = results[10][0].publication_year;
              publications_publication_type = results[10][0].publication_type;
              publications_title = results[10][0].title;
              publications_journal_name = results[10][0].journal_name;
              publications_publication_status = results[10][0].publication_status;
              publications_doi = results[10][0].doi;
              publications_primary_attribution = results[10][0].primary_attribution;
            } else {
                errorFlag = true
            }

            if(results[11].length){
              presentations_year = results[11][0].year;
              presentations_title_of_presentation = results[11][0].title_of_presentation;
              presentations_event_type = results[11][0].event_type;
              presentations_organising_body = results[11][0].organising_body;
              presentations_location = results[11][0].location;
              presentations_primary_attribution = results[11][0].primary_attribution;
            } else {
                errorFlag = true
            }

            if(results[12].length){
              academic_collaborations_start_date = results[12][0].start_date;
              academic_collaborations_end_date = results[12][0].end_date;
              academic_collaborations_name_of_institution = results[12][0].name_of_institution;
              academic_collaborations_department_within_institution = results[12][0].department_within_institution;
              academic_collaborations_location = results[12][0].location;
              academic_collaborations_name_of_collaborator = results[12][0].name_of_collaborator;
              academic_collaborations_primary_goal_of_collaboration = results[12][0].primary_goal_of_collaboration;
              academic_collaborations_frequency_of_interaction = results[12][0].frequency_of_interaction;
              academic_collaborations_primary_attribution = results[12][0].primary_attribution;
            } else {
                errorFlag = true
            }

            if(results[13].length){
              non_academic_collaborations_start_date = results[13][0].start_date;
              non_academic_collaborations_end_date = results[13][0].end_date;
              non_academic_collaborations_name_of_institution = results[13][0].name_of_institution;
              non_academic_collaborations_department_within_institution = results[13][0].department_within_institution;
              non_academic_collaborations_location = results[13][0].location;
              non_academic_collaborations_name_of_collaborator = results[13][0].name_of_collaborator;
              non_academic_collaborations_primary_goal_of_collaboration = results[13][0].primary_goal_of_collaboration;
              non_academic_collaborations_frequency_of_interaction = results[13][0].frequency_of_interaction;
              non_academic_collaborations_primary_attribution = results[13][0].primary_attribution;
            } else {
                errorFlag = true
            }

            if(results[14].length){
              conferences_start_date = results[14][0].start_date;
              conferences_end_date = results[14][0].end_date;
              conferences_title = results[14][0].title;
              conferences_event_type = results[14][0].event_type;
              conferences_role = results[14][0].role;
              conferences_location_of_event = results[14][0].location_of_event;
              conferences_primary_attribution = results[14][0].primary_attribution;
            } else {
                errorFlag = true
            }

            if(results[15].length){
              communications_overview_year = results[15][0].year;
              communications_overview_number_of_public_lectures = results[15][0].number_of_public_lectures;
              communications_overview_number_of_visits = results[15][0].number_of_visits;
              communications_overview_number_of_media_interactions = results[15][0].number_of_media_interactions;
            } else {
                errorFlag = true
            }

            if(results[16].length){
              sfi_funding_ratio_year = results[16][0].year;
              sfi_funding_ratio_percentage_of_annual_spend = results[16][0].percentage_of_annual_spend;
            } else {
                errorFlag = true
            }

            if(results[17].length){
              education_and_public_engagement_name_of_project = results[17][0].name_of_project;
              education_and_public_engagement_start_date = results[17][0].start_date;
              education_and_public_engagement_end_date = results[17][0].end_date;
              education_and_public_engagement_activity_type = results[17][0].activity_type;
              education_and_public_engagement_project_topic = results[17][0].project_topic;
              education_and_public_engagement_target_geographical_area = results[17][0].target_geographical_area;
              education_and_public_engagement_primary_attribution = results[17][0].primary_attribution;
            } else {
                errorFlag = true
            }
        if (errorFlag === false) {
            console.log(mobile + "Out of scope: this is mobile number out of scope");
            res.render("profile.ejs",{
                                    fname: fname,
                                    lname: lname,
                                    user_name: user_name,
                                    mobile: mobile,
                                    email: email,
                                    admin: admin,
                                    researcher: researcher,
                                    reviewer: reviewer,
                                    funder: funder,
                                    userName: userName,

                                    education_degree: education_degree,
                                    education_field_of_study: education_field_of_study,
                                    education_institution: education_institution,
                                    education_location: education_location,
                                    education_year_of_degree_award: education_year_of_degree_award,

                                    employment_company_name: employment_company_name,
                                    employment_location: employment_location,
                                    employment_years: employment_years,

                                    professional_societies_start_date: professional_societies_start_date,
                                    professional_societies_end_date: professional_societies_end_date,
                                    professional_societies_name_of_society: professional_societies_name_of_society,
                                    professional_societies_type_of_membership: professional_societies_type_of_membership,
                                    professional_societies_status: professional_societies_status,

                                    awards_year: awards_year,
                                    awards_awarding_body: awards_awarding_body,
                                    awards_details_of_award: awards_details_of_award,
                                    awards_team_member_name: awards_team_member_name,

                                    funding_diversification_start_date: funding_diversification_start_date,
                                    funding_diversification_end_date: funding_diversification_end_date,
                                    funding_diversification_amount_of_funding: funding_diversification_amount_of_funding,
                                    funding_diversification_funding_body: funding_diversification_funding_body,
                                    funding_diversification_funding_programme: funding_diversification_funding_programme,
                                    funding_diversification_status: funding_diversification_status,
                                    funding_diversification_primary_attribution: funding_diversification_primary_attribution,

                                    team_members_start_date_with_team: team_members_start_date_with_team,
                                    team_members_departure_date: team_members_departure_date,
                                    team_members_name: team_members_name,
                                    team_members_position_within_the_team: team_members_position_within_the_team,
                                    team_members_primary_attribution: team_members_primary_attribution,

                                    impacts_impact_title: impacts_impact_title,
                                    impacts_impact_category: impacts_impact_category,
                                    impacts__beneficiary: impacts__beneficiary,
                                    impacts_primary_attribution: impacts_primary_attribution,

                                    innovation_and_commercialisation_year: innovation_and_commercialisation_year,
                                    innovation_and_commercialisation_type: innovation_and_commercialisation_type,
                                    innovation_and_commercialisation_title: innovation_and_commercialisation_title,
                                    innovation_and_commercialisation_primary_attribution: innovation_and_commercialisation_primary_attribution,

                                    publications_publication_year: publications_publication_year,
                                    publications_publication_type: publications_publication_type,
                                    publications_title: publications_title,
                                    publications_journal_name: publications_journal_name,
                                    publications_publication_status: publications_publication_status,
                                    publications_doi: publications_doi,
                                    publications_primary_attribution: publications_primary_attribution,

                                    presentations_year: presentations_year,
                                    presentations_title_of_presentation: presentations_title_of_presentation,
                                    presentations_event_type: presentations_event_type,
                                    presentations_organising_body: presentations_organising_body,
                                    presentations_location: presentations_location,
                                    presentations_primary_attribution: presentations_primary_attribution,

                                    academic_collaborations_start_date: academic_collaborations_start_date,
                                    academic_collaborations_end_date: academic_collaborations_end_date,
                                    academic_collaborations_name_of_institution: academic_collaborations_name_of_institution,
                                    academic_collaborations_department_within_institution: academic_collaborations_department_within_institution,
                                    academic_collaborations_location: academic_collaborations_location,
                                    academic_collaborations_name_of_collaborator: academic_collaborations_name_of_collaborator,
                                    academic_collaborations__goal_of_collaboration: academic_collaborations__goal_of_collaboration,
                                    academic_collaborations_frequency_of_interaction: academic_collaborations_frequency_of_interaction,
                                    academic_collaborations_primary_attribution: academic_collaborations_primary_attribution,

                                    non_academic_collaborations_start_date: non_academic_collaborations_start_date,
                                    non_academic_collaborations_end_date: non_academic_collaborations_end_date,
                                    non_academic_collaborations_name_of_institution: non_academic_collaborations_name_of_institution,
                                    non_academic_collaborations_department_within_institution: non_academic_collaborations_department_within_institution,
                                    non_academic_collaborations_location: non_academic_collaborations_location,
                                    non_academic_collaborations_name_of_collaborator: non_academic_collaborations_name_of_collaborator,
                                    non_academic_collaborations__goal_of_collaboration: non_academic_collaborations__goal_of_collaboration,
                                    non_academic_collaborations_frequency_of_interaction: non_academic_collaborations_frequency_of_interaction,
                                    non_academic_collaborations_primary_attribution: non_academic_collaborations_primary_attribution,

                                    conferences_start_date: conferences_start_date,
                                    conferences_end_date: conferences_end_date,
                                    conferences_title: conferences_title,
                                    conferences_event_type: conferences_event_type,
                                    conferences_role: conferences_role,
                                    conferences_location_of_event: conferences_location_of_event,
                                    conferences_primary_attribution: conferences_primary_attribution,

                                    communications_overview_year: communications_overview_year,
                                    communications_overview_number_of_public_lectures: communications_overview_number_of_public_lectures,
                                    communications_overview_number_of_visits: communications_overview_number_of_visits,
                                    communications_overview_number_of_media_interactions: communications_overview_number_of_media_interactions,

                                    sfi_funding_ratio_year: sfi_funding_ratio_year,
                                    sfi_funding_ratio_percentage_of_annual_spend: sfi_funding_ratio_percentage_of_annual_spend,

                                    education_and_public_engagement_name_of_project: education_and_public_engagement_name_of_project,
                                    education_and_public_engagement_start_date: education_and_public_engagement_start_date,
                                    education_and_public_engagement_end_date: education_and_public_engagement_end_date,
                                    education_and_public_engagement_activity_type: education_and_public_engagement_activity_type,
                                    education_and_public_engagement_project_topic: education_and_public_engagement_project_topic,
                                    education_and_public_engagement_target_geographical_area: education_and_public_engagement_target_geographical_area,
                                    education_and_public_engagement_primary_attribution: education_and_public_engagement_primary_attribution  });
        } else {
            let string = encodeURIComponent('2');
            res.redirect("/?errorStatus=" + string);
            }
        });
    }
}

/*
------------------------- When login link is clicked, call this -------------------------------
*/
exports.login=(req,res) => {
    // first,check to see if they are logged in.
    let userID = req.session.userId;
    let status = "";
    if (userID !== undefined){
        var string =encodeURIComponent('1');
        res.redirect("/?errorStatus="+string);
        return;
    }
    // now check if the request was GET or POST
    if (req.method == "POST") {
        // get the body
        let post  = req.body;
        // grab form data
        let email= post.email;
        let pass= post.password;
        let sql="SELECT id, first_name, last_name, user_name FROM `users` WHERE `email`=? and password = ?;";
        db.query(sql, [email,pass],(err,results) => {
           if(results.length){
              req.session.user_id = results[0].id; // set their userID here.
              let x = results[0].id; // need this for the sql query
              //session data used for cosmetic stuff.
              req.session.first_name = results[0].first_name;
              req.session.last_name = results[0].last_name;
              req.session.user_name= results[0].user_name
              console.log(results[0].id);
              console.log(results[0].first_name + " Logged in!");
                res.redirect("/index");
              }
              else{
                console.log("Yep, this error message came up!");
                status = 'Error! Either your username or password are incorrect';
                res.render('login.ejs',{status:status});
             }
    });} else {
        // it's a get. Render normally
        res.render("login.ejs",{status:status});
    }
}

/* ---------------------------- Register Tab *****************************/
exports.register=(req,res) =>{
    let userID = req.session.user_ID;
    if (userID !== undefined){
        // already logged in, see above
        var string =encodeURIComponent('1');
        res.redirect("/?errorStatus="+string);
        return;
    }
    let username="";
    let email="";
    let fname="";
    let lname="";
    let mob_no="";
    let generalErr = "";
    let fnameErr = "";
    let lnameErr="";
    let usernameError="";
    let emailError = "";
    let passwordErr="";
    let mob_noErr = "";
    if (req.method=="POST"){
        // PASSWORD WILL BE LOOKED AT ONCE OTHER WEBSITE FEATURES ARE DONE.
        let post = req.body;
        // each variable will need to be checked before added to the database.
        username = post.user_name;
        email = post.email;
        fname=post.fname;
        lname=post.lname;
        mob_no=post.mobile;
        // declare password for this if block.
        let password=post.password;
        let otherPassword=post.otherPassword;
        let passwordErr="";
        let errorFlag=false;
        let regexp = new RegExp("[0-9+]");
        console.log(fname);
        if (fname.length < 3 || fname.length > 32){
            fnameErr+="First name must have a length between 2 and 32\n";
            errorFlag = true;
        }
        if (lname.length < 2 && lname.length > 32){
            lnameErr+="Last name must have a length between 2 and 32\n";
            errorFlag = true;
        }
        if (regexp.test(mob_no) === false){
            mob_noErr += "Please only enter digits for phone number\n";
            errorFlag = true;
        }
        if (password != otherPassword){
            passwordErr += "Your passwords did not match, please re-enter them!\n";
            errorFlag = true;
        }
        if(errorFlag === false){
            var sql = "INSERT INTO users(first_name,last_name,email,mob_no,user_name,password) VALUES (?,?,?,?,?,?);";
            // role by default is currently being done.
            // sql += "INSERT INTO roles(admin,researcher,funder,reviewer) VALUES('NO','YES','NO','NO');"
            var query = db.query(sql,[fname,lname,email,mob_no,username,password],(err, result) => {
               if (err) throw err;
               //var tempUserID = null;
               message = "Your account has been created! Please login now." ;
               

               var e_message = 'Hello, '+ fname +'. Thank you for creating an account with Science Foundation Ireland.\n You can log in at the link here: https://team10.netsoc.co/login';
               var subject = "Thank you for registering with SFI";

               sendEmail(email, subject, e_message);
                


               let idData = {email: email};
               fetchId(idData,(err,id_num) => {
                if (err){
                    console.log(err);
                    res.send(err);
                } else {
                    let rolesData = {
                        admin:"NO",
                        researcher: "YES",
                        reviewer: "NO",
                        funder: "NO",
                        tempUserID: id_num
                    };
                    insertRoles(rolesData,(err,content) => {
                        if (err){
                            console.log("Error occured in roles data!");
                            return res.render(err);
                        } else {
                         console.log("Successfully inserted roles into database");
                        }
                    });
                }
              //console.log("Temp user ID is: " + tempUserID);
               });
               /*
               let rolesData = {
                   admin:"NO",
                   researcher: "YES",
                   reviewer: "NO",
                   funder: "NO",
                   tempUserID: tempUserID
               };
               */
               /*
               insertRoles(rolesData,(err,content) => {
                   if (err){
                       console.log("Error occured in roles data!");
                       return res.render(err);
                   } else {
                    console.log("Successfully inserted roles into database");
                   }
               });
               */
               //console.log("This is temp user ID: " + tempUserID);
               var string =encodeURIComponent('1');
               return res.redirect("/?successStatus="+string);
            });
        } else{
            generalErr="Errors detected!";
            return res.render("register.ejs",{ generalErr:generalErr,
                                        user_name:username,
                                        fname: fname,
                                        lname: lname,
                                        email: email,
                                        mob_no: mob_no,
                                        fnameErr:fnameErr,
                                        lnameErr:lnameErr,
                                        usernameError:usernameError,
                                        emailError:emailError,
                                        passwordErr:passwordErr,
                                        mob_noErr: mob_noErr
                                    });
        }
    } else {
        // it's a Get. Render normally.
        return res.render("register.ejs",{ generalErr:generalErr,
            user_name:username,
            fname: fname,
            lname: lname,
            email:email,
            mob_no: mob_no,
            fnameErr:fnameErr,
            lnameErr:lnameErr,
            usernameError:usernameError,
            emailError:emailError,
            passwordErr:passwordErr,
            mob_noErr: mob_noErr
        });
    }
}


/****************************  logout block ********************************/
exports.logout=(req,res)=>{
    var userID = req.session.user_id;
    // user must be logged in to view their own profile.
    if (userID === undefined){
        let string = encodeURIComponent('4');
        res.redirect("/?errorStatus=" + string);
        return;
    }
    req.session.destroy((err) => {
        if (err) throw err;
        var string = encodeURIComponent('2');
        res.redirect("/?successStatus="+string);
        return;
    });
}

/**************************** apply for founding ********************************/
exports.apply=(req, res) => {
    if (req.session.user_id === undefined && req.session.user_name === undefined){
        res.send("You must be logged in to continue...");
    }
    if (req.method=="POST"){
        let post = req.body

        // for table ------ applications_v1
        // let id = ; auto_incresed
        // var myDate = new Date();
        // let name_of_application = post.name_of_application; // need to add a form in apply.ejs
        // let time_of_submission = myDate.toLocaleString();
        // let commen = post.comment;
        // let file_name = "tmp";
        // let user_ID = req.session.userId;

//
        var myDate = new Date();
        let name_of_application = "test"; // need to add a form in apply.ejs
        let time_of_submission = myDate.toLocaleString();
        let commen = "commenTest";
        let file_name = "tmp";
        let user_ID = req.session.userId;
//



        let sql = "insert into applications_v1(name_of_application,time_of_submission,commen,file_name,user_ID) value(?,?,?,?,?)";
        db.query(sql, [name_of_application,time_of_submission,commen,file_name,user_ID], (err, result) => {
            if(err) throw err;
            console.log(result);
            res.send('database for application created...');
        });

    } else {
        return res.render("apply.ejs");
    }
}

/**************************** group and memebers add ********************************/

/*
database name : group_member_relationship
groupName
memberName
*/
exports.group_members_add=(req, res) => {
    if (req.method=="POST") {
        let post = req.body;
        let groupName = post.groupName;
        let memberName = post.memberName;

        // find two Id and send them into table groups_memberships
        // write sentence
        sql_find_groupID = "select group_id from groups where group_name=?";
        sql_find_memberID = "select id from users where user_name=?";

        // function error1() {
        // return {err: 1, msg: "Error: Cannot find info about this group name..."};
        // }
        // function error2() {
        // return {err: 2, msg: "Error: Cannot find info about this member name..."};
        // }


        db.query(sql_find_groupID,[groupName], (err1, result1) => {
            if(result1.length == 0) {
                console.log("Yep, this error message came up!");
                status = 'Error! your group name is not exist';
                return res.render('group_member_add.ejs',{status:status});
            }
            console.log(result1[0].group_id);
            db.query(sql_find_memberID,[memberName], (err2, result2) => {
            if(result2.length == 0) {
                console.log("Yep, this error message came up!");
                status = 'Error! your member name is not exist';
                return res.render('group_member_add.ejs',{status:status});
            }
            console.log(result2[0].id);
            var sql = "insert into groups_memberships(group_id, user_id) value(?,?)";
                db.query(sql, [result1[0].group_id, result2[0].id], (err, result) => {
                    if(err) throw err;
                    console.log(result);

                    var sql_find_all_group_name = "Select group_name From groups Where group_id in ( select  group_id from groups_memberships where user_id=?)";
                    db.query(sql_find_all_group_name, result2[0].id, (err, result3) => {
                        if(err) throw err;
                        console.log(result3);
                        res.send(result3);

                    });


                });
            });
        });
    } else {
        status=""
        return res.render("group_member_add.ejs",{status:status});
    }
}



/**************************** group and memebers delete ********************************/


exports.group_members_delete=(req, res) => {
    if (req.method=="POST") {
        let post = req.body;
        let groupName = post.groupName;
        let memberName = post.memberName;

        //
        sql_find_groupID = "select group_id from groups where group_name=?";
        sql_find_memberID = "select id from users where user_name=?";

        db.query(sql_find_groupID,[groupName], (err1, result1) => {
            // not find error
            if(result1.length == 0) {
                console.log("Yep, this error message came up!");
                status = 'Error! your group name is not exist';
                return res.render('group_member_delete.ejs',{status:status});
            }

            console.log(result1[0].group_id);
            db.query(sql_find_memberID,[memberName], (err2, result2) => {
                //not find error
                if(result2.length == 0) {
                    console.log("Yep, this error message came up!");
                    status = 'Error! your member name is not exist';
                    return res.render('group_member_delete.ejs',{status:status});
                }

                console.log(result2[0].id);

                sql = "delete from groups_memberships where group_id="+result1[0].group_id+" and user_id="+result2[0].id
                db.query(sql, (err, result) => {
                    if(err) {
                        status = "Error! no relationship between them";
                        return res.render('group_member_delete.ejs',{status:status});
                    }
                    console.log(result);

                    var sql_find_all_group_name = "Select group_name From groups Where group_id in ( select  group_id from groups_memberships where user_id=?)";
                    db.query(sql_find_all_group_name, result2[0].id, (err, result3) => {
                        if(err) throw err;
                        console.log(result3);
                        res.send(result3)

                    });


                });
            });
        });



    } else {
        status=""
        return res.render("group_member_delete.ejs",{status:status});
    }
}
