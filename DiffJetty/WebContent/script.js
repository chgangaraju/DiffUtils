var json1, json2, context;
var output = '';
var before_context = true;
var reduced_context = false;
function callServlet() {
	var input1 = document.getElementById('diff_file1_box').value;
	var input2 = document.getElementById('diff_file2_box').value;
	context = parseInt(document.getElementById('context').value);
	var in1 = input1.split('\n');
	var in2 = input2.split('\n');
	json1 = JSON.stringify(in1);
	json2 = JSON.stringify(in2);
	ajax();
}
function ajax() {
	var xmlhttp;
	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
	} else {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			output = '';
			printResult(xmlhttp.responseText);
		}
	};
	xmlhttp.open("POST", "http://localhost:7501/embed/DiffJetty", true);
	xmlhttp.setRequestHeader("Content-Type",
			"application/x-www-form-urlencoded");
	xmlhttp
			.send("input1=" + json1 + "&input2=" + json2 + "&context="
					+ context);
}
var next = 0, previous = 0, property = 0, index = 0;
var hide_expand_start = false;
var expand_from = 0, expand_to = 0;
function printResult(result) {
	var obj = JSON.parse(result);
	reduced_context = false;
	startContext(obj);
	// expand lines at end--no change
	if (property > 0) {//atleast one change
		index++;
		if(expand_from+1< obj[property - 1]['json2'].length)
		output += "<a id='div" + index+ "'onclick = \"javascript:blocking('next_div" + index+ "');changeText(id)\">-</a>"
				+ obj[property - 1]['json2'][expand_from + 1] + "<strong><br>";
		output += "<div id='next_div" + index + "'>";
		for ( var j = expand_from + 2; j < obj[property - 1]['json2'].length; j++)
			output += obj[property - 1]['json2'][j] + "<br>";
		output += "</div></strong>";
	} else { //no changes
		json1 = JSON.parse(json1);
		output += "<a id='div" + index+ "' onclick = \"javascript:blocking('next_div" + index+ "');changeText(id)\">-</a>"
				+ 'NO CHANGE....TWO FILES ARE EQUAL..' + "<strong><br>";
		output += "<div id='next_div" + index + "'>";
		for ( var i = 0; i < json1.length; i++)
			output += json1[i] + '<br>';
		output += "</div></strong>";
	}
	document.getElementById('diff_output_box').innerHTML = output;
}
function startContext(obj){
	for (property = 0; property < obj.length; property++) {
		expand_to = parseInt(obj[property]['first1']);
		// expand_lines at starting
		if ((expand_to > context)) {
			if (!hide_expand_start) {
				index++;
				output += "<a id='div" + index+ "' onclick = \"javascript:blocking('next_div" + index+ "');changeText(id)\">-</a>"
						+ obj[property]['json2'][expand_from + 1]+ "<strong><br>";
				output += "<div id='next_div" + index + "'>";
				for ( var j = expand_from + 2; j < expand_to - context; j++)
					output += obj[property]['json2'][j] + "<br>";
				output += "</div>";
			}
		}
		hide_expand_start = false;
		if (property - 1 > 0)
			previous = parseInt(obj[property - 1]['last1']);
		if (property + 1 < obj.length)
			next = parseInt(obj[property + 1]['first1']);
		expand_from = parseInt(obj[property]['first1']) + context;
		// diff lines
		decideDelta(obj[property]);
		next = 0;
		previous = parseInt(obj[property]['last1']);
	}
}
function decideDelta(result) {
	if (result['size1'] == 0) {
		addDelta(result);
	} else if (result['size2'] == 0) {
		deleteDelta(result);
	} else {
		changeDelta(result);
	}
}
function changeDelta(result) {
	// context lines
	printContext(result);
	// diff lines--no change
	for ( var i = parseInt(result['first1']); i <= parseInt(result['last1']); i++)
		output += "<font color=\"red\"> < " + result['json1'][i]+ " </font> </br>";
	output += "-------</br>";
	for ( var i = parseInt(result['first2']); i <= parseInt(result['last2']); i++)
		output += "<font color=\"green\"> > " + result['json2'][i]+ "</font></br>";
	// context
	if (parseInt(result['last2']) + parseInt(context) < result['json2'].length) {
		var i = parseInt(result['last2']) + 1;
		if ((next == 0) || (next - context > i)) { // print context lines
			for (i = parseInt(result['last2']) + 1; i <= parseInt(result['last2'])+ context; i++) {
				output += result['json2'][i] + "</br>";
			}
			if (next - context <= i) {
				reduced_context = true;
				hide_expand_start = true;
			}
		} else { // print reduced context lines
			for (i = parseInt(result['last2']) + 1; i < next; i++) {
				output += result['json2'][i] + "</br>";
				before_context = false;
				hide_expand_start = true;
			}
		}
	}
}
function printContext(result){
	if (before_context) {
		if (reduced_context) {
			for ( var i = previous + context + 1; i < result['first1']; i++)
				output += result['json1'][i] + "</br>";
		} else {
			if ((parseInt(result['first1']) - context) > 0) {
				for ( var i = parseInt(result['first1']) - context; i < parseInt(result['first1']); i++) {
					output += result['json1'][i] + "</br>";
				}
			} else {
				for ( var i = 0; i < parseInt(result['first1']); i++) {
					output += result['json1'][i] + "</br>";
				}
			}
		}
	}
	before_context = true;
	reduced_context = false;
}
function addDelta(result) {
	// context lines
	printContext(result);
	expand_from=parseInt(result['last2']) + context;
	// diff lines--no change
	for ( var i = parseInt(result['first2']); i <= parseInt(result['last2']); i++) {
		output += "<font color=\"green\"> + " + result['json2'][i]
				+ "</font></br>";
	}
	// context lines
	if (parseInt(result['last2']) + parseInt(context) < result['json2'].length) {
		var i = parseInt(result['last2']) + 1;
		if ((next == 0) || (next - context > i)) { // print context lines
			for (i = parseInt(result['last2']) + 1; i <= parseInt(result['last2'])
					+ context; i++) {
				output += result['json2'][i] + "</br>";
			}
			if (next - context <= i) {
				reduced_context = true;
				hide_expand_start = true;
			}
		} else { // print reduced context lines
			for (i = parseInt(result['last2']) + 1; i < next; i++) {
				output += result['json2'][i] + "</br>";
				before_context = false;
				hide_expand_start = true;
			}
		}
	}
}
function deleteDelta(result) {
	// context lines
	printContext(result);
	// diff lines--no change
	for ( var i = parseInt(result['first1']); i <= parseInt(result['last1']); i++) {
		output += "<font color=\"red\"> - " + result['json1'][i]+ " </font> </br>";
	}
	// context lines
	if (parseInt(result['last1']) + parseInt(context) < result['json2'].length) {
		var i = parseInt(result['last1']) + 1;
		if ((next == 0) || (next - context > i)) { // print context lines
			for (i = parseInt(result['last1']) + 1; i <= parseInt(result['last1'])+ context; i++) {
				output += result['json1'][i] + "</br>";
			}
			if (next - context <= i) {
				reduced_context = true;
				hide_expand_start = true;
			}
		} else { // print reduced context lines
			for (i = parseInt(result['last1']) + 1; i < next; i++) {
				output += result['json1'][i] + "</br>";
				before_context = false;
				hide_expand_start = true;
			}
		}
	}
	else
		hide_expand_start = true;
		
}
function blocking(nr) {
	displayNew = (document.getElementById(nr).style.display == 'none') ? 'block'
			: 'none';
	document.getElementById(nr).style.display = displayNew;
}
function changeText(id) {
	var symbol = document.getElementById(id).innerHTML;
	document.getElementById(id).innerHTML = (symbol == '+') ? '-' : '+';
}
function readFirstFile(evt) {
	var f = evt.target.files[0];
	var tokens = f.name.split('.');
	var extension = tokens[tokens.length - 1];

	if (extension.match("txt") || extension.match("java")) {
		if (f) {
			var r = new FileReader();
			r.onload = function(e) {
				document.getElementById("diff_file1_box").value = e.target.result;
			};
			r.readAsText(f);
		} else {
			alert("Failed to load file");
		}
	} else {
		alert("Unsupported file format");
	}
}
function readSecondFile(evt) {
	var f = evt.target.files[0];
	var tokens = f.name.split('.');
	var extension = tokens[tokens.length - 1];
	if (extension.match("txt") || extension.match("java")) {
		if (f) {
			var r = new FileReader();
			r.onload = function(e) {
				document.getElementById('diff_file2_box').value = e.target.result;
			};
			r.readAsText(f);
		} else {
			alert("Failed to load file");
		}
	} else {
		alert("Unsupported file format");
	}
}