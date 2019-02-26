exports.fetchCalls = (data,callback) => {
    // function for getting SQL data of active calls for proposals
    let sql = "SELECT * FROM calls WHERE active_status = 1;";
    db.query(sql, (err,rows) => {
        if (err) throw err; 
        // check if rows even returns anything with length
        if (rows.length){
            //callback(null,rows[0]);
            // ^^^ Callback should not be used here.
            // callbacks are used when you need multiple SQL statements
            // in a query executed one by one as opposed to once.
            // Rows is a list of objects, where each attribute is a column of the table
            // reviewApplication has a bunch of example codes.
            console.log("This is what rows looks like:\n", rows);
            console.log(rows[0].call_id);
            // the above goes to the first index in rows, and prints the value stored 
            // in call_id
        } else {
            // no calls are made, lets give the people viewing a status saying there's nothing
            // happening for now

        }
    });
}
