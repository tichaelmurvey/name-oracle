$(document).ready(function(){
    $("#query").on("input", function() {
        $("#go").attr('href', "/search-amenities/"+$("#query").val());
     });   
});