var botan = require('botanio')(global.confige.yandexKey);

var track = function(message, comment){
    // botan.track(message, comment, (error, response, body) =>{
    //     if(error) console.log(error);
    // });
}

module.exports = {
    track
}