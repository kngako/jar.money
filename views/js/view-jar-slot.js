function copyURI(event, stuff) {
    var $temp = $("<input>");
    $("body").append($temp);
    var text = $("#jar-uri").text();
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();

    Materialize.toast('Copied ' + text, 4000);

    event.preventDefault();
} 

function openURI(event) {
    var link = $("#jar-link").attr('href');
    console.log("Trying: " + link);
    var current = location.href;
    if(!current.endsWith("?_=no_client")) {
        current += "?_=no_client";
    }
    try {
        location.href = link;
        console.log("The Magic: " + link);
    } catch(error) {
        console.error("Error: ", error);
        
        console.log("Location: ", current);

        location.href = current;
        
        
    }

    event.preventDefault();
} 


$(document).ready(function(){
    console.log("Document ready");
    if(!location.href.endsWith("?_=no_client"))
        openURI();
    else {
        Materialize.toast('Please Download Payment Client', 4000);
    }
});