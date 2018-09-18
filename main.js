const JSON_API = "/json"
const FILE_API = "/private"
const HOME = "/";
var base = HOME;
var parent = HOME;
function init() {
    var param = new URLSearchParams(location.search);
    var path = param.get("p");
    get(path ? path : HOME);
}
function get(path) {
    var dirs = path.split("/");
    base = dirs.slice(0, -1).join("/") + "/";
    parent = dirs.slice(0, -2).join("/") + "/";
    var wd_name = decodeURIComponent(dirs.slice(-2)[0]);
    if (path == "/") wd_name = "File browser";
    $("nav h1").text(wd_name);
    $.getJSON(JSON_API + path)
    .done(data => {
	$("main").empty();
	if (path != "/")
	    add_item({
		type:"parent",
		name: "Go to parent dir",
	    });
	data.forEach(add_item);
    }).fail((jqXHR, textStatus, errorThrown) => {
	$("ul").append(`<p>An error occured: ${jqXHR.status} ${errorThrown}</p>`);
	$("ul").append(`<p><a href='?p=${HOME}'>retrun to home</a></p>`);
    });
}
function add_item(item) {
    var icon = "";
    var href = "";
    switch (item.type) {
    case "parent": icon = "fas fa-angle-left";
	console.log(parent);
	href = `?p=${parent}`;
	break;
    case "directory": icon = "fas fa-folder";
	var path = base + encodeURIComponent(item.name) + "/";
	href = `?p=${path}`;
	break;
    case "file": icon = "far fa-file";
	href = FILE_API + base + encodeURIComponent(item.name);
	break;
    }
    var a = $("<a>", {href: href, class: "list-group-item list-group-item-action"})
	.addClass(item.type)
	.append($("<i>", {class: icon, style:"width:16px;"}))
	.append($("<div>", {class: "ml-2 d-inline", text:item.name}));
    $("main").append(a);
}
