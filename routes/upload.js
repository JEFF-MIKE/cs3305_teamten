/* File upload function */

exports.uploadFile = (req,res) => {
    let status = "";
    let success = "";
    // do check to see if they're logged in first
    if (req.method === "POST"){
        if (!req.files) {
            status = "Error! No files were uploaded!"
            return res.render("upload.ejs",{status: status,success:success});
        }
        console.log(req.files);
        let file = req.files.sampleFile;
        let filename = file.name;
        console.log(filename);
        console.log(__dirname + "/../documents/"+filename);
        file.mv(__dirname + "/../documents/" +filename, err => {
            if (err) return res.render("upload.ejs",{status: "An error has occured!",success:success})
            console.log("Banana");
            res.render("upload.ejs",{status: status,success:"Success!"});
        });
    } else{
    // default GET query.
    res.render("upload.ejs",{status:status,success:success});
    }
}