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
    if (path != "/") document.title = "File browser - " + wd_name;
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
    case "other": icon = "fas fa-question-circle";
	break;
    }
    var a = $("<a>", {href: href, class: "list-group-item list-group-item-action"})
	.addClass(item.type)
	.append($("<i>", {class: "text-center", style:"width:16px;"}).addClass(icon))
	.append($("<div>", {class: "ml-2 d-inline", text:item.name}));
    if (item.size) a.append($("<div>", {class: "float-right", text:prettyBytes(item.size)}))
    $("main").append(a);
}

/*
Formats the given number using `Number#toLocaleString`.
- If locale is a string, the value is expected to be a locale-key (for example: `de`).
- If locale is true, the system default locale is used for translation.
- If no value for locale is specified, the number is returned unmodified.
*/
const UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const toLocaleString = (number, locale) => {
    let result = number;
    if (typeof locale === 'string') {
	result = number.toLocaleString(locale);
    } else if (locale === true) {
	result = number.toLocaleString();
    }
    return result;
};
const prettyBytes = (number, options) => {
    if (!Number.isFinite(number)) {
	throw new TypeError(`Expected a finite number, got ${typeof number}: ${number}`);
    }
    options = Object.assign({}, options);
    if (options.signed && number === 0) {
	return ' 0 B';
    }
    const isNegative = number < 0;
    const prefix = isNegative ? '-' : (options.signed ? '+' : '');
    if (isNegative) {
	number = -number;
    }
    if (number < 1) {
	const numberString = toLocaleString(number, options.locale);
	return prefix + numberString + ' B';
    }
    const exponent = Math.min(Math.floor(Math.log10(number) / 3), UNITS.length - 1);
    number = Number((number / Math.pow(1000, exponent)).toPrecision(3));
    const numberString = toLocaleString(number, options.locale);
    const unit = UNITS[exponent];
    return prefix + numberString + ' ' + unit;
};
