// http://stackoverflow.com/questions/11759992/calculating-jdayjulian-day-in-javascript
// http://jsfiddle.net/gkyYJ/
// http://stackoverflow.com/users/965051/adeneo
Date.prototype.getJulian = function() {
    return ((this / 86400000) - (this.getTimezoneOffset() / 1440) + 2440587.5);
};

// http://www.ben-daglish.net/moon.shtml
function moon_day(today) {
    var GetFrac = function(fr) {
        return (fr - Math.floor(fr));
    };
    var thisJD = today.getJulian();
    var year = today.getFullYear();
    var degToRad = 3.14159265 / 180;
    var K0, T, T2, T3, J0, F0, M0, M1, B1, oldJ;
    K0 = Math.floor((year - 1900) * 12.3685);
    T = (year - 1899.5) / 100;
    T2 = T * T;
    T3 = T * T * T;
    J0 = 2415020 + 29 * K0;
    F0 = 0.0001178 * T2 - 0.000000155 * T3 + (0.75933 + 0.53058868 * K0) - (0.000837 * T + 0.000335 * T2);
    M0 = 360 * (GetFrac(K0 * 0.08084821133)) + 359.2242 - 0.0000333 * T2 - 0.00000347 * T3;
    M1 = 360 * (GetFrac(K0 * 0.07171366128)) + 306.0253 + 0.0107306 * T2 + 0.00001236 * T3;
    B1 = 360 * (GetFrac(K0 * 0.08519585128)) + 21.2964 - (0.0016528 * T2) - (0.00000239 * T3);
    var phase = 0;
    var jday = 0;
    while (jday < thisJD) {
        var F = F0 + 1.530588 * phase;
        var M5 = (M0 + phase * 29.10535608) * degToRad;
        var M6 = (M1 + phase * 385.81691806) * degToRad;
        var B6 = (B1 + phase * 390.67050646) * degToRad;
        F -= 0.4068 * Math.sin(M6) + (0.1734 - 0.000393 * T) * Math.sin(M5);
        F += 0.0161 * Math.sin(2 * M6) + 0.0104 * Math.sin(2 * B6);
        F -= 0.0074 * Math.sin(M5 - M6) - 0.0051 * Math.sin(M5 + M6);
        F += 0.0021 * Math.sin(2 * M5) + 0.0010 * Math.sin(2 * B6 - M6);
        F += 0.5 / 1440;
        oldJ = jday;
        jday = J0 + 28 * phase + Math.floor(F);
        phase++;
    }

    // 29.53059 days per lunar month
    return (((thisJD - oldJ) / 29.53059));
}

function phase_junk(phase) {
    var sweep = [];
    var mag;
    // the "sweep-flag" and the direction of movement change every quarter moon
    // zero and one are both new moon; 0.50 is full moon
    if (phase <= 0.25) {
        sweep = [ 1, 0 ];
        mag = 20 - 20 * phase * 4
    } else if (phase <= 0.50) { 
        sweep = [ 0, 0 ];
        mag = 20 * (phase - 0.25) * 4
    } else if (phase <= 0.75) {
        sweep = [ 1, 1 ];
        mag = 20 - 20 * (phase - 0.50) * 4
    } else if (phase <= 1) {
        sweep = [ 0, 1 ];
        mag = 20 * (phase - 0.75) * 4
    } else { 
        exit; 
    }
    var unicode_moon;
    if (phase <= 0.0625 || phase > 0.9375) {
        unicode_moon = "\uD83C\uDF11";
    } else if (phase <= 0.1875) {
        unicode_moon = "\uD83C\uDF12";
    } else if (phase <= 0.3125) {
        unicode_moon = "\uD83C\uDF13";
    } else if (phase <= 0.4375) {
        unicode_moon = "\uD83C\uDF14";
    } else if (phase <= 0.5625) {
        unicode_moon = "\uD83C\uDF15";
    } else if (phase <= 0.6875) {
        unicode_moon = "\uD83C\uDF16";
    } else if (phase <= 0.8125) {
        unicode_moon = "\uD83C\uDF17";
    } else if (phase <= 0.9375) {
        unicode_moon = "\uD83C\uDF18";
    }
    // IE does not work with .innnerHTML'ing the title
    // http://stackoverflow.com/questions/12114477/how-do-i-correctly-insert-unicode-in-an-html-title-using-javascript
    // document.getElementsByTagName("title")[0].innerHTML = document.title + '  &#x' + unicode_moon + ";";
    // http://stackoverflow.com/questions/3059166/does-string-fromcharcodedecimal-value-in-javascript-supports-extended-characte
    document.title = document.title + " " + unicode_moon;
    var svg = document.getElementById("moon");
	if (svg != false && svg != null) {
    // http://stackoverflow.com/questions/654112/how-do-you-detect-support-for-vml-or-svg-in-a-browser/5493614#5493614
    // https://github.com/Modernizr/Modernizr/blob/master/modernizr.js
    function supportsSVG() {
      return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect;
    }
    function supportsVML() {
        if (typeof supportsVml.supported == "undefined") {
            var a = document.body.appendChild(document.createElement('div'));
            a.innerHTML = '<v:shape id="vml_flag1" adj="1" />';
            var b = a.firstChild;
            b.style.behavior = "url(#default#VML)";
            supportsVml.supported = b ? typeof b.adj == "object": true;
            a.parentNode.removeChild(a);
        }
        return supportsVml.supported;
    }
    if (supportsSVG()) {  
      // http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
      var d = "m100,0 ";
      d = d + "a" + mag + ",20 0 1," + sweep[0] + " 0,150 ";
      d = d + "a20,20 0 1," + sweep[1] + " 0,-150";
      // http://www.i-programmer.info/programming/graphics-and-imaging/3254-svg-javascript-and-the-dom.html
      var xmlns = "http://www.w3.org/2000/svg";
      var path = document.createElementNS(xmlns, 'path');
      var back = document.createElementNS(xmlns, 'path');
      back.setAttribute('class', 'moonback');
      back.setAttribute('d', "m100,0 a20,20 0 1,1 0,150 a20,20 0 1,1 0,-150");
      path.setAttribute('class', 'moon');
      path.setAttribute('d', d);
      svg.setAttribute('height', window.screen.availHeight * 0.8);
      svg.setAttribute('width', window.screen.availWidth * 0.8);
      svg.appendChild(back);
      svg.appendChild(path);
    } else if (supportsVML()) {
      // http://vectorconverter.svn.sourceforge.net/viewvc/vectorconverter/trunk/svg2vml.xsl?revision=2&view=markup
      // http://stackoverflow.com/questions/7677145/calling-xslt-from-javascript
      // this will be IE almost always anyways, so could use IE specific xslt
    }
	}
}

phase_junk(moon_day(new Date()));
