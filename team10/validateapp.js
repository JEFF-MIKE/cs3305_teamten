function submitValidation() {

    var x, text;
    
    var name = document.forms["appForm"]["name"].value;
    if (name == "") {
        text = "This field is empty. Please put in your full name."
    } else {
        text = "Input OK"
    }
    document.getElementById("demo1").innerHTML = text;
}
