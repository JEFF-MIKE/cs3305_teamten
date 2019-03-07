exports.getUserActions = (req,res) => {
    if (req.session.user_id === undefined && req.session.user_name === undefined){
        return res.send("Hello please stop trying to fuck with this");
    } else {
        res.render("userActions.ejs",{userName: req.session.user_name});
    }
}