🌑 🌒 🌓 🌔 🌕 🌖 🌗 🌘 🌑
==================

This HTML page and javascript draw an `svg` picture of the moon that tries to match the current 
actual phase of the moon.  Also uses unicode emoji moons in the `<title>` element.  A new `svg` will
be calculated every day; but there are only 8 emoji moons.

Phase of the moon
-----------------
Ben Daglish
 * http://www.ben-daglish.net/moon.shtml
 * http://www.ben-daglish.net/lunar/lunar.js

"A little while ago the task of calculating lunar phases came to mind. After investigating the various algorithms out there, I collected together this little bunch, (mainly wrapped inside complete 'show all the phases for a year' programs), and hacked them about a bit to work nicely with Javascript . They are presented here for your edification, delight and ripping off."

This javascript was modified into a function that returns a number between 0 and 1 representing how 
far through the lunar cycle we are.  0 and 1 are both new moons, 0.5 is the full moon.

Moon Rise and Moon Set
-----------------
Keith Burnett
 * http://web.archive.org/web/20100409090517/http://bodmas.org/astronomy/riset.html

This is a translation of a set of routines from Montenbruck and Pfleger's
Astonomy on the Computer 2nd english ed - see chapter 3.8 the sunset progrm


Background image of stars
----------------

 * http://1-background.com/stars_1.htm

© StarFields [1] 1998 - 2012. All Rights Reserved.
You are very welcome to use my background images on your website
or blog free of charge. All other uses, please contact StarFields [2] for
permission. 

 * [1] http://starfields.ws/
 * [2] http://1-background.com/contact/


Julian date
----------

 * http://stackoverflow.com/questions/11759992/calculating-jdayjulian-day-in-javascript
 * http://jsfiddle.net/gkyYJ/
 * http://stackoverflow.com/users/965051/adeneo


SVG
---
uses the `A` command in `<path>` http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands

```xml
<svg width="98%" height="98%" xmlns="http://www.w3.org/2000/svg" version="1.1">
      <svg id="moon" viewBox="0 0 200 200">
            <!-- black background of moon is path class="moonback" -->
            <path class="moonback" d="m100,0 a20,20 0 1,1 0,150 a20,20 0 1,1 0,-150"></path>
            <path class="moon" d="m100,0 a0.40078440694886197,20 0 1,1 0,150 a20,20 0 1,1 0,-150"></path>
            <!--                             ^                       ^                  ^
               this cycles between 0 and 20 -+                       |                  |
                            4 times a month                          +------------------+
                                                                     |
                                                                     these arc-sweep options cycle
                                                                     1,0 --  0,0 --  1,1 -- 0,0 
            -->
      </svg>
</svg>
```

Logic notes
----------

Here is where I was figuring out the logic of the program https://gist.github.com/3680124#file_phase_notes.txt


jsfiddle
--------

 * <http://jsfiddle.net/tGmDh/1/>
 * <http://jsfiddle.net/tGmDh/2/>
 * <http://jsfiddle.net/tGmDh/3/>
 * <http://jsfiddle.net/tGmDh/4/>
 * <http://jsfiddle.net/tGmDh/5/>
 * <http://jsfiddle.net/tGmDh/6/>
 * <http://jsfiddle.net/tGmDh/7/>
 * <http://jsfiddle.net/tGmDh/8/>


