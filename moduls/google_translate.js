var googletrans = require('google-translate-api');

var get = function(text, from, to, callback){
    googletrans(text, {'from': from, 'to': to}).then(res => {
        var result = '';
        if(res.from.text.didYouMean) {
            result = res.from.text.value;
            if(callback) callback(text,  result);
            //correcting
            get(res.from.text.value, from, to, (t, r) => {
                if(callback) callback(t, r);
            });
        }
        else {
            result = res.text;
            if(callback) callback(text, result);
        }
        //console.log(res.text);
        //=> Ik spreek Nederlands! 
        //console.log(res.from.text.autoCorrected);
        //=> true 
        //console.log(res.from.text.value);
        //=> I [speak] Dutch! 
        //console.log(res.from.text.didYouMean);
        //=> false 
    }).catch(err => {
        console.error(err);
    });
}

module.exports = {get}