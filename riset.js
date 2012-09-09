// source: http://web.archive.org/web/20100409090517/http://bodmas.org/astronomy/riset.html
// This is a translation of a set of routines from Montenbruck and Pfleger's
// Astonomy on the Computer 2nd english ed - see chapter 3.8 the sunset progrm
//

//
//	*** Main loop removed ***
//

//
//  *** Functions go here - mostly adapted from Montenbruck and Pfleger section 3.8 ***
//

function hrsmin(hours) {
//
//	takes decimal hours and returns a string in hhmm format
//
	var hrs, h, m, dum;
	hrs = Math.floor(hours * 60 + 0.5)/ 60.0;
	h = Math.floor(hrs);
	m = Math.floor(60 * (hrs - h) + 0.5);
	dum = h*100 + m;
	//
	// the jiggery pokery below is to make sure that two minutes past midnight
	// comes out as 0002 not 2. Javascript does not appear to have 'format codes'
	// like C
	//
	if (dum < 1000) dum = "0" + dum;
	if (dum <100) dum = "0" + dum;
	if (dum < 10) dum = "0" + dum;
	return dum;
	}


function ipart(x) {
//
//	returns the integer part - like int() in basic
//
	var a;
	if (x> 0) {
	    a = Math.floor(x);
		}
	else {
		a = Math.ceil(x);
		}
	return a;
	}


function frac(x) {
//
//	returns the fractional part of x as used in minimoon and minisun
//
	var a;
	a = x - Math.floor(x);
	if (a < 0) a += 1;
	return a;
	}

//
// round rounds the number num to dp decimal places
// the second line is some C like jiggery pokery I
// found in an OReilly book which means if dp is null
// you get 2 decimal places.
//
   function round(num, dp) {
//   dp = (!dp ? 2: dp);
   return Math.round (num * Math.pow(10, dp)) / Math.pow(10, dp);
    }


function range(x) {
//
//	returns an angle in degrees in the range 0 to 360
//
	var a, b;
	b = x / 360;
	a = 360 * (b - ipart(b));
	if (a  < 0 ) {
		a = a + 360
		}
	return a
	}


function mjd(day, month, year, hour) {
//
//	Takes the day, month, year and hours in the day and returns the
//  modified julian day number defined as mjd = jd - 2400000.5
//  checked OK for Greg era dates - 26th Dec 02
//
	var a, b;
	if (month <= 2) {
		month = month + 12;
		year = year - 1;
		}
	a = 10000.0 * year + 100.0 * month + day;
	if (a <= 15821004.1) {
		b = -2 * Math.floor((year + 4716)/4) - 1179;
		}
	else {
		b = Math.floor(year/400) - Math.floor(year/100) + Math.floor(year/4);
		}
	a = 365.0 * year - 679004.0;
	return (a + b + Math.floor(30.6001 * (month + 1)) + day + hour/24.0);
	}

function caldat(mjd) {
//
//	Takes mjd and returns the civil calendar date in Gregorian calendar
//  as a string in format yyyymmdd.hhhh
//  looks OK for Greg era dates  - not good for earlier - 26th Dec 02
//
	var calout;
	var b, d, f, jd, jd0, c, e, day, month, year, hour;
	jd = mjd + 2400000.5;
	jd0 = Math.floor(jd + 0.5);
	if (jd0 < 2299161.0) {
		c = jd0 + 1524.0;
		}
	else {
		b = Math.floor((jd0 - 1867216.25) / 36524.25);
		c = jd0 + (b - Math.floor(b/4)) + 1525.0;
		}
	d = Math.floor((c - 122.1)/365.25);
	e = 365.0 * d + Math.floor(d/4);
	f = Math.floor(( c - e) / 30.6001);
	day = Math.floor(c - e + 0.5) - Math.floor(30.6001 * f);
	month = f - 1 - 12 * Math.floor(f/14);
	year = d - 4715 - Math.floor((7 + month)/10);
	hour = 24.0 * (jd + 0.5 - jd0);
	hour = hrsmin(hour);
	calout = round(year * 10000.0 + month * 100.0 + day + hour/10000, 4);
	return calout + ""; //making sure calout is a string
	}


function quad(ym, yz, yp) {
//
//	finds the parabola throuh the three points (-1,ym), (0,yz), (1, yp)
//  and returns the coordinates of the max/min (if any) xe, ye
//  the values of x where the parabola crosses zero (roots of the quadratic)
//  and the number of roots (0, 1 or 2) within the interval [-1, 1]
//
//	well, this routine is producing sensible answers
//
//  results passed as array [nz, z1, z2, xe, ye]
//
	var nz, a, b, c, dis, dx, xe, ye, z1, z2, nz;
	var quadout = new Array;

	nz = 0;
	a = 0.5 * (ym + yp) - yz;
	b = 0.5 * (yp - ym);
	c = yz;
	xe = -b / (2 * a);
	ye = (a * xe + b) * xe + c;
	dis = b * b - 4.0 * a * c;
	if (dis > 0)	{
		dx = 0.5 * Math.sqrt(dis) / Math.abs(a);
		z1 = xe - dx;
		z2 = xe + dx;
		if (Math.abs(z1) <= 1.0) nz += 1;
		if (Math.abs(z2) <= 1.0) nz += 1;
		if (z1 < -1.0) z1 = z2;
		}
	quadout[0] = nz;
	quadout[1] = z1;
	quadout[2] = z2;
	quadout[3] = xe;
	quadout[4] = ye;
	return quadout;
	}


function lmst(mjd, glong) {
//
//	Takes the mjd and the longitude (west negative) and then returns
//  the local sidereal time in hours. Im using Meeus formula 11.4
//  instead of messing about with UTo and so on
//
	var lst, t, d;
	d = mjd - 51544.5
	t = d / 36525.0;
	lst = range(280.46061837 + 360.98564736629 * d + 0.000387933 *t*t - t*t*t / 38710000);
	return (lst/15.0 + glong/15);
	}


function minisun(t) {
//
//	returns the ra and dec of the Sun in an array called suneq[]
//  in decimal hours, degs referred to the equinox of date and using
//  obliquity of the ecliptic at J2000.0 (small error for +- 100 yrs)
//	takes t centuries since J2000.0. Claimed good to 1 arcmin
//
	var p2 = 6.283185307, coseps = 0.91748, sineps = 0.39778;
	var L, M, DL, SL, X, Y, Z, RHO, ra, dec;
	var suneq = new Array;

	M = p2 * frac(0.993133 + 99.997361 * t);
	DL = 6893.0 * Math.sin(M) + 72.0 * Math.sin(2 * M);
	L = p2 * frac(0.7859453 + M / p2 + (6191.2 * t + DL)/1296000);
	SL = Math.sin(L);
	X = Math.cos(L);
	Y = coseps * SL;
	Z = sineps * SL;
	RHO = Math.sqrt(1 - Z * Z);
	dec = (360.0 / p2) * Math.atan(Z / RHO);
	ra = (48.0 / p2) * Math.atan(Y / (X + RHO));
	if (ra <0 ) ra += 24;
	suneq[1] = dec;
	suneq[2] = ra;
	return suneq;
	}


function minimoon(t) {
//
// takes t and returns the geocentric ra and dec in an array mooneq
// claimed good to 5' (angle) in ra and 1' in dec
// tallies with another approximate method and with ICE for a couple of dates
//
	var p2 = 6.283185307, arc = 206264.8062, coseps = 0.91748, sineps = 0.39778;
	var L0, L, LS, F, D, H, S, N, DL, CB, L_moon, B_moon, V, W, X, Y, Z, RHO;
	var mooneq = new Array;

	L0 = frac(0.606433 + 1336.855225 * t);	// mean longitude of moon
	L = p2 * frac(0.374897 + 1325.552410 * t) //mean anomaly of Moon
	LS = p2 * frac(0.993133 + 99.997361 * t); //mean anomaly of Sun
	D = p2 * frac(0.827361 + 1236.853086 * t); //difference in longitude of moon and sun
	F = p2 * frac(0.259086 + 1342.227825 * t); //mean argument of latitude

	// corrections to mean longitude in arcsec
	DL =  22640 * Math.sin(L)
	DL += -4586 * Math.sin(L - 2*D);
	DL += +2370 * Math.sin(2*D);
	DL +=  +769 * Math.sin(2*L);
	DL +=  -668 * Math.sin(LS);
	DL +=  -412 * Math.sin(2*F);
	DL +=  -212 * Math.sin(2*L - 2*D);
	DL +=  -206 * Math.sin(L + LS - 2*D);
	DL +=  +192 * Math.sin(L + 2*D);
	DL +=  -165 * Math.sin(LS - 2*D);
	DL +=  -125 * Math.sin(D);
	DL +=  -110 * Math.sin(L + LS);
	DL +=  +148 * Math.sin(L - LS);
	DL +=   -55 * Math.sin(2*F - 2*D);

	// simplified form of the latitude terms
	S = F + (DL + 412 * Math.sin(2*F) + 541* Math.sin(LS)) / arc;
	H = F - 2*D;
	N =   -526 * Math.sin(H);
	N +=   +44 * Math.sin(L + H);
	N +=   -31 * Math.sin(-L + H);
	N +=   -23 * Math.sin(LS + H);
	N +=   +11 * Math.sin(-LS + H);
	N +=   -25 * Math.sin(-2*L + F);
	N +=   +21 * Math.sin(-L + F);

	// ecliptic long and lat of Moon in rads
	L_moon = p2 * frac(L0 + DL / 1296000);
	B_moon = (18520.0 * Math.sin(S) + N) /arc;

	// equatorial coord conversion - note fixed obliquity
	CB = Math.cos(B_moon);
	X = CB * Math.cos(L_moon);
	V = CB * Math.sin(L_moon);
	W = Math.sin(B_moon);
	Y = coseps * V - sineps * W;
	Z = sineps * V + coseps * W
	RHO = Math.sqrt(1.0 - Z*Z);
	dec = (360.0 / p2) * Math.atan(Z / RHO);
	ra = (48.0 / p2) * Math.atan(Y / (X + RHO));
	if (ra <0 ) ra += 24;
	mooneq[1] = dec;
	mooneq[2] = ra;
	return mooneq;
	}


function sin_alt(iobj, mjd0, hour, glong, cglat, sglat) {
//
//	this rather mickey mouse function takes a lot of
//  arguments and then returns the sine of the altitude of
//  the object labelled by iobj. iobj = 1 is moon, iobj = 2 is sun
//
	var mjd, t, ra, dec, tau, salt, rads = 0.0174532925;
	var objpos = new Array;
	mjd = mjd0 + hour/24.0;
	t = (mjd - 51544.5) / 36525.0;
	if (iobj == 1) {
		objpos = minimoon(t);
				}
	else {
		objpos = minisun(t);
		}
	ra = objpos[2];
	dec = objpos[1];
	// hour angle of object
	tau = 15.0 * (lmst(mjd, glong) - ra);
	// sin(alt) of object using the conversion formulas
	salt = sglat * Math.sin(rads*dec) + cglat * Math.cos(rads*dec) * Math.cos(rads*tau);
	return salt;
	}


function find_sun_and_twi_events_for_date(mjd, tz, glong, glat) {
//
//	this is my attempt to encapsulate most of the program in a function
//	then this function can be generalised to find all the Sun events.
//
//
	var sglong, sglat, date, ym, yz, above, utrise, utset, j;
	var yp, nz, rise, sett, hour, z1, z2, iobj, rads = 0.0174532925;
	var quadout = new Array;
	var sinho = new Array;
	var   always_up = " ****";
	var always_down = " ....";
	var outstring = "";
//
//	Set up the array with the 4 values of sinho needed for the 4
//      kinds of sun event
//
	sinho[0] = Math.sin(rads * -0.833);		//sunset upper limb simple refraction
	sinho[1] = Math.sin(rads *  -6.0);		//civil twi
	sinho[2] = Math.sin(rads * -12.0);		//nautical twi
	sinho[3] = Math.sin(rads * -18.0);		//astro twi
	sglat = Math.sin(rads * glat);
	cglat = Math.cos(rads * glat);
	date = mjd - tz/24;
//
//	main loop takes each value of sinho in turn and finds the rise/set
//      events associated with that altitude of the Sun
//
	for (j = 0; j < 4; j++) {
		rise = false;
		sett = false;
		above = false;
		hour = 1.0;
		ym = sin_alt(2, date, hour - 1.0, glong, cglat, sglat) - sinho[j];
		if (ym > 0.0) above = true;
		//
		// the while loop finds the sin(alt) for sets of three consecutive
		// hours, and then tests for a single zero crossing in the interval
		// or for two zero crossings in an interval or for a grazing event
		// The flags rise and sett are set accordingly
		//
		while(hour < 25 && (sett == false || rise == false)) {
			yz = sin_alt(2, date, hour, glong, cglat, sglat) - sinho[j];
			yp = sin_alt(2, date, hour + 1.0, glong, cglat, sglat) - sinho[j];
			quadout = quad(ym, yz, yp);
			nz = quadout[0];
			z1 = quadout[1];
			z2 = quadout[2];
			xe = quadout[3];
			ye = quadout[4];

			// case when one event is found in the interval
			if (nz == 1) {
				if (ym < 0.0) {
					utrise = hour + z1;
					rise = true;
					}
				else {
					utset = hour + z1;
					sett = true;
					}
				} // end of nz = 1 case

			// case where two events are found in this interval
			// (rare but whole reason we are not using simple iteration)
			if (nz == 2) {
				if (ye < 0.0) {
					utrise = hour + z2;
					utset = hour + z1;
					}
				else {
					utrise = hour + z1;
					utset = hour + z2;
					}
				} // end of nz = 2 case

			// set up the next search interval
			ym = yp;
			hour += 2.0;

			} // end of while loop
			//
			// now search has completed, we compile the string to pass back
			// to the main loop. The string depends on several combinations
			// of the above flag (always above or always below) and the rise
			// and sett flags
			//

			if (rise == true || sett == true ) {
				if (rise == true) outstring += " " + hrsmin(utrise);
				else outstring += " ----";
				if (sett == true) outstring += " " + hrsmin(utset);
				else outstring += " ----";
				}
			else {
				if (above == true) outstring += always_up + always_up;
				else outstring += always_down + always_down;
				}
		} // end of for loop - next condition

		return outstring;
	}

function find_moonrise_set(mjd, tz, glong, glat) {
//
//	Im using a separate function for moonrise/set to allow for different tabulations
//  of moonrise and sun events ie weekly for sun and daily for moon. The logic of
//  the function is identical to find_sun_and_twi_events_for_date()
//
	var sglong, sglat, date, ym, yz, above, utrise, utset, j;
	var yp, nz, rise, sett, hour, z1, z2, iobj, rads = 0.0174532925;
	var quadout = new Array;
	var sinho;
	var   always_up = "****";
	var always_down = "....";
	var out = [];

	sinho = Math.sin(rads * 8/60);		//moonrise taken as centre of moon at +8 arcmin
	sglat = Math.sin(rads * glat);
	cglat = Math.cos(rads * glat);
	date = mjd - tz/24;
		rise = false;
		sett = false;
		above = false;
		hour = 1.0;
		ym = sin_alt(1, date, hour - 1.0, glong, cglat, sglat) - sinho;
		if (ym > 0.0) above = true;
		while(hour < 25 && (sett == false || rise == false)) {
			yz = sin_alt(1, date, hour, glong, cglat, sglat) - sinho;
			yp = sin_alt(1, date, hour + 1.0, glong, cglat, sglat) - sinho;
			quadout = quad(ym, yz, yp);
			nz = quadout[0];
			z1 = quadout[1];
			z2 = quadout[2];
			xe = quadout[3];
			ye = quadout[4];

			// case when one event is found in the interval
			if (nz == 1) {
				if (ym < 0.0) {
					utrise = hour + z1;
					rise = true;
					}
				else {
					utset = hour + z1;
					sett = true;
					}
				} // end of nz = 1 case

			// case where two events are found in this interval
			// (rare but whole reason we are not using simple iteration)
			if (nz == 2) {
				if (ye < 0.0) {
					utrise = hour + z2;
					utset = hour + z1;
					}
				else {
					utrise = hour + z1;
					utset = hour + z2;
					}
				}

			// set up the next search interval
			ym = yp;
			hour += 2.0;

			} // end of while loop

			if (rise == true || sett == true ) {
				if (rise == true) out[0] = hrsmin(utrise);
				else out[0] = "----";
				if (sett == true) out[1] = hrsmin(utset);
				else out[1] = "----";
				}
			else {
				if (above == true) out = [ always_up, always_up ];
				else out = [ always_down, always_down ];
				}

		return out;
	}
