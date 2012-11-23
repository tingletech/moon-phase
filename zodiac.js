function zodiac_sign(date) {
    // Date to zodiac unicode sign

    // http://stackoverflow.com/questions/3274597/how-would-i-determine-zodiac-astrological-star-sign-from-a-birthday-in-python
   
    // http://stackoverflow.com/questions/1267283/how-can-i-create-a-zerofilled-value-using-javascript
    function zeroFill( number, width ) {
        width -= number.toString().length;
        if ( width > 0 ) {
            return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
        }
        return number + ""; // always return a string
    }

   
    mdd = (date.getMonth() + 1) + zeroFill( date.getDate(), 2);
    // console.log(mdd);
    if (mdd < 120) {
        sign = "\u2651";
    } else if (mdd < 218) {
        sign = "\u2652";
    } else if (mdd < 320) {
        sign = "\u2653";
    } else if (mdd < 420) {
        sign = "\u2648";
    } else if (mdd < 521) {
        sign = "\u2649";
    } else if (mdd < 621) {
        sign = "\u264A";
    } else if (mdd < 722) {
        sign = "\u264B";
    } else if (mdd < 823) {
        sign = "\u264C";
    } else if (mdd < 923) {
        sign = "\u264D";
    } else if (mdd < 1023) {
        sign = "\u264E";
    } else if (mdd < 1122) {
        sign = "\u264F";
    } else if (mdd < 1222) {
        sign = "\u2650";
    } else if (mdd < 1231) {
        sign = "\u2651";
    }
    return sign;
}
