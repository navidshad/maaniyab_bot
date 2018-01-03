var googletrans = require('google-translate-api');

var get = function(orginText, editedtext, from, to, callback){
    var textToTranslate = (editedtext) ? editedtext : orginText;
    var firstresult = null;
    var secondresult = null
    googletrans(textToTranslate, {'from': from, 'to': to}).then(res => {
        firstresult = res.text;
        if(res.from.text.didYouMean) {
            //correcting
            get(orginText, res.from.text.value, from, to, (o, e, f, s) => {
                secondresult = f;
                if(callback) callback(o, e, firstresult, secondresult);
            });
        }
        else {
            if(callback) callback(orginText, editedtext, firstresult, null);
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