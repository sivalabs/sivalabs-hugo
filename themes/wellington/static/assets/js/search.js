
function searchSite(e) {
    e.preventDefault();
    var q = document.getElementById("query");
    window.location = "https://www.google.com/search?q="+encodeURIComponent(q.value)+"+site%3Asivalabs.in"
    return false;
}