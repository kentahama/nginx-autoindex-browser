const JSON_API = "/json"
const FILE_API = ""
const HOME = "/";
function init() {
    var param = new URLSearchParams(location.search);
    var path = param.get("p");
    get(path ? path : HOME);
}
function get(path) {
    var dirs = path.split("/");
    var base = dirs.slice(0, -1).join("/") + "/";
    var parent = dirs.slice(0, -2).join("/") + "/";
    var wd_name = decodeURIComponent(dirs.slice(-2)[0]);
    if (path == "/") wd_name = "File browser";
    $("nav h1").text(wd_name);
    $.getJSON(JSON_API + path)
    .done(data => {
	if (path != "/") add_item("parent", parent, "..");
        var dirs = data.filter(d => d.type == "directory");
	var files = data.filter(d => d.type == "file");
        dirs.forEach(dir => {
	    var path = base + encodeURIComponent(dir.name) + "/";
	    add_item("directory", path, dir.name);
	});	
        files.forEach(file => {
	    var path = base + encodeURIComponent(file.name);
	    add_item("file", path, file.name);
	});
    }).fail((jqXHR, textStatus, errorThrown) => {
	$("ul").append(`<p>An error occured: ${jqXHR.status} ${errorThrown}</p>`);
	$("ul").append(`<p><a href='?p=${HOME}'>retrun to home</a></p>`);
    });
}
function add_item(type, path, text) {
    var icon = "";
    switch (type) {
    case "parent": icon = "fas fa-angle-left"; break;
    case "directory": icon = "fas fa-folder"; break;
    case "file": icon = "fas fa-file"; break;
    }
    var a = $("<a>", {href:`?p=${path}`})
	.append($("<i>", {class: icon, style: "width: 16px;"}))
	.append($("<div>", {class: "ml-2 d-inline", text:text}));
    $("ul").append($("<li>").append(a));
}
