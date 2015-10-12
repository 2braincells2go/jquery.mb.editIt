/*___________________________________________________________________________________________________________________________________________________
 _ jquery.mb.components                                                                                                                             _
 _                                                                                                                                                  _
 _ file: demo.js                                                                                                                                    _
 _ last modified: 09/10/15 23.19                                                                                                                    _
 _                                                                                                                                                  _
 _ Open Lab s.r.l., Florence - Italy                                                                                                                _
 _                                                                                                                                                  _
 _ email: matteo@open-lab.com                                                                                                                       _
 _ site: http://pupunzi.com                                                                                                                         _
 _       http://open-lab.com                                                                                                                        _
 _ blog: http://pupunzi.open-lab.com                                                                                                                _
 _ Q&A:  http://jquery.pupunzi.com                                                                                                                  _
 _                                                                                                                                                  _
 _ Licences: MIT, GPL                                                                                                                               _
 _    http://www.opensource.org/licenses/mit-license.php                                                                                            _
 _    http://www.gnu.org/licenses/gpl.html                                                                                                          _
 _                                                                                                                                                  _
 _ Copyright (c) 2001-2015. Matteo Bicocchi (Pupunzi);                                                                                              _
 ___________________________________________________________________________________________________________________________________________________*/

if (!('boxShadow' in document.body.style)) {
	document.body.setAttribute('class', 'noBoxShadow');
}

document.body.addEventListener("click", function(e) {
	var target = e.target;
	if (target.tagName === "INPUT" &&
		target.getAttribute('class').indexOf('liga') === -1) {
		target.select();
	}
});

(function() {
	var fontSize = document.getElementById('fontSize'),
		testDrive = document.getElementById('testDrive'),
		testText = document.getElementById('testText');
	function updateTest() {
		testDrive.innerHTML = testText.value || String.fromCharCode(160);
		if (window.icomoonLiga) {
			window.icomoonLiga(testDrive);
		}
	}
	function updateSize() {
		testDrive.style.fontSize = fontSize.value + 'px';
	}
	fontSize.addEventListener('change', updateSize, false);
	testText.addEventListener('input', updateTest, false);
	testText.addEventListener('change', updateTest, false);
	updateSize();
}());
