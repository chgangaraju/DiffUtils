test('changeText()', function() {
	var div1 = document.createElement("div");
	div1.innerHTML = "+";
	div1.id = 'id1';
	document.body.appendChild(div1);
	div1.style.display = 'none';
	var div2 = document.createElement("div");
	div2.innerHTML = "-";
	div2.id = 'id2';
	document.body.appendChild(div2);
	div1.style.display = 'none';
	equal(changeText(div1.id), '-', '+ is changed as -');
	equal(changeText(div2.id), '+', '- is changed as +');
});
test('blocking()', function() {
	var div1 = document.createElement("div");
	div1.innerHTML = "";
	div1.id = 'id3';
	div1.style.display = 'none';
	document.body.appendChild(div1);
	var div2 = document.createElement("div");
	div2.innerHTML = "";
	div2.id = 'id4';
	div2.style.display = 'block';
	document.body.appendChild(div2);
	equal(blocking(div1.id), 'block', 'none is changed as block');
	equal(blocking(div2.id), 'none', 'block is changed as none');
});
test('decideDelta()', function() {
	equal(decideDelta({
		'size1' : 0,
		'size2' : 1
	}), 'addDelta', 'decideDelta');
	equal(decideDelta({
		'size1' : 1,
		'size2' : 0
	}), 'deleteDelta', 'decideDelta');
	equal(decideDelta({
		'size1' : 1,
		'size2' : 1
	}), 'changeDelta', 'decideDelta');
});
test('changeDelta()', function() {
	ok(changeDelta(), 'changeDelta');
});
test('addDelta()', function() {
	ok(addDelta(), 'addDelta');
});
test('deleteDelta()', function() {
	ok(deleteDelta(), 'deleteDelta');
});
test('printResult()', function() {
	ok(printResult(), 'printResult');
});