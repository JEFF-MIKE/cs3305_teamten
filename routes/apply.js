exports.storeApplications = (req,res) => {
    let status = "";
    let success = ""
    let user_name =  '';
    if (req.session.user_name !== undefined){
        user_name = req.session.user_name;
    }
    console.log("FUNCTION EXECUTED")

    /*
    const express = require('express')
    const app = express()

    app.use(express.urlencoded({ extended: true }));
    */

    if (req.method === "POST"){
        console.log("POST PART EXECUTED");
        // this is when you submit data
        let name = req.body.name;
        let applicant_id = req.body.fundingID;
        let call_id = 45;
        let time_of_submission = new Date();
        let submission_version = 1;
        let amount_requested = req.body.amount_requested;
        /*let file_name = req.body.input_file_now;*/
        let cover_note = req.body.cover_note;
        console.log("YOUR COVER NOTE IS: "+ cover_note)
        let group_name = req.body.group_name;
    /*
    app.post('store_applications.js', (req, res) => {
        const applicant_id = req.body.fundingID
        const time_of_submission = new Date();
        const submission_version = 1
        const amount_requested = req.body.amount_requested
        const file_name = req.body.input_file_now
        const cover_note = req.body.cover_note
        const group_name = req.body.group_name
        res.end()
    })
    */
    var application_id;
    var sql1 = "SELECT MAX(application_id) FROM applications";
    db.query(sql1, function(err, result, fields){
        if (err) throw err;
        application_id = result[0].application_id + 1;
    });

    var sql2 = "INSERT INTO `applications` (applicant_id, call_id, time_of_submission,amount_requested, cover_note, submission_version,group_id) VALUES (?,?,?,?,?,?,?);";
    db.query(sql2,[applicant_id, call_id, time_of_submission,amount_requested,cover_note,submission_version,group_name] ,function(err, result) {
    if (err) throw err;
        console.log("Successfully entered in data");

        var sql3 = 'SELECT * FROM users WHERE id = (SELECT funder_user_id FROM calls WHERE call_id = (SELECT call_id FROM applications WHERE application_id = "'+ application_id + '"))';
        db.query(sql3, function(err, result, fields){
        if (err) throw err;
            console.log(result);
            var email = result[0].email;
            var first_name = result[0].first_name;
            console.log(email);
            console.log(first_name);

            var message = 'Hello, '+ first_name +'.' + '\n' + 'A researcher named '+ name +' has just applied for a proposal that you are reviewing.' + '\n\n' + 'You can view the application at the link below.' + '\n' + 'https://team10.netsoc.co/application' + '\n' + 'Kind Regards,' + '\n' + 'Science Foundation Ireland';
            var subject = "New Application from SFI";

            sendEmail(email, subject, message);
        });

        status = "Thank you for submitting your application. It has been sent to the reviewers and they will be in touch with you soon."
        return res.render("apply1.ejs",{status:status, success:"",userName:user_name});
        });
    } else {
        // this is a get 
        return res.render('apply1.ejs',{status:status,success:success,userName:user_name});
    }

    //Provide functionality to email the funder that this proposal is related to
    

}
    
