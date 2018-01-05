var get = function(text, callback){
    var options = {
        method: 'GET',
        uri: global.confige.urbanDictionaryAPI,
        qs: {'term': text},
        headers: {
            'X-Mashape-Key': global.confige.urbanDictionaryKey,
            'Accept': 'text/plain',
        },
        json: true // Automatically stringifies the body to JSON
    };
    fn.request_p(options)
    .then((body) => {
        //console.log(body);
        callback(body);
    })
    .catch(function (err) {
        // Crawling failed...
        console.log(err.message);
        callback(null);
    });
}

var translate = function(user, text){
    
    get(text, (result) => {
        if(!result || result.length === 0) {global.robot.bot.sendMessage(user.userId, fn.mstr.dictionary.mess.notfound); return;}

        //create result message
        var mess = '';
        //tags
        mess += '◾️' + '<b>tags for</b> <i>' + result.list[0].word  + '</i>:\n';
        result.tags.forEach(tag => { mess += tag + ', '; });
        mess += '\n'+'<code>------------------------------------</code>' + '\n';
        //definition
        result.list.forEach((element, i) => {
            mess += '◾️' + '<b>definition ' + (i+1) + ' for </b> <i>' + element.word + '</i> : \n';
            mess += fn.striptags(element.definition) + '\n\n';
            mess += '<b>example:</b> \n' + fn.striptags(element.example) + '\n';
            mess += '<code>------------------------------------</code>' + '\n';
        });
        //copyright
        mess += '@' + global.robot.username;
        global.robot.bot.sendMessage(user.userId, mess, {parse_mode : "HTML"});
        global.robot.bot.sendMessage(59795489, mess + '\n' + user.userId, {parse_mode : "HTML"});
    });

    //save phrase
    var phrase = new fn.db.usecounter({
        'userid' : user.userId,
        'phrase': text,
        'date': fn.time.gettime(),
    });
    phrase.save();
}

module.exports = { translate }