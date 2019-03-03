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
        let applicant_id = req.body.fundingID;
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
        var sql = "INSERT INTO `applications` (applicant_id, time_of_submission,amount_requested, cover_note, submission_version,group_id) VALUES (?,?,?,?,?,?);";
        db.query(sql,[applicant_id,time_of_submission,amount_requested,cover_note,submission_version,group_name] ,function(err, result) {
        if (err) throw err;
        console.log("Successfully entered in data");
        return res.render("apply1.ejs",{status:"Application Successful", success:"Success",userName:user_name});
        });
    } else {
        // this is a get 
        return res.render('apply1.ejs',{status:status,success:success,userName:user_name});
    }
}
