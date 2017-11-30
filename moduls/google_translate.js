var googletrans = require('google-translate-api');

var get = function(text, from, to, callback){
    googletrans(text, {'from': from, 'to': to}).then(res => {
        var result = '';
        if(res.from.text.didYouMean) result = res.from.text.value;
        else result = res.text;
        if(callback) callback(result);
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