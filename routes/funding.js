function fetchCalls(data,callback){
    // function for getting SQL data of active calls for proposals
    let sql = "SELECT * FROM calls where active_status = 1"
    db.query(sql, (err,rows) => {
        if (err){
            callback(err,null);
        } else {
            console.log(rows[0]);
            console.log("This is id of call from table:" + rows[0].call_id);
            callback(null,rows[0]);
        }
    });
}
