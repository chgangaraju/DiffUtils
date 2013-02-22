function changeText(id) {
	var symbol = document.getElementById(id).innerHTML;
	return (symbol == '+') ? '-' : '+';
}
function blocking(nr) {
	return (document.getElementById(nr).style.display == 'none') ? 'block'
			: 'none';

}
function decideDelta(result) {
	if (result['size1'] == 0) {
		return 'addDelta';
	} else if (result['size2'] == 0) {
		return 'deleteDelta';
	} else {
		return 'changeDelta';
	}
}
function changeDelta(result) {
	return true;
}
function addDelta(result) {
	return true;
}
function deleteDelta(result) {
	return true;

}
function printResult(result) {
	return true;
}
