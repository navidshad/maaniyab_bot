var googletrans = require('google-translate-api');

var get = function(orginText, editedtext, from, to, callback){
    var textToTranslate = (editedtext) ? editedtext : orginText;
    googletrans(textToTranslate, {'from': from, 'to': to}).then(res => {
        var result = '';
        if(res.from.text.didYouMean) {
            //correcting
            get(orginText, res.from.text.value, from, to, (t, e, r) => {
                if(callback) callback(t, e, r);
            });
        }
        else {
            result = res.text;
            if(callback) callback(orginText, editedtext, result);
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