var show = function(message){
    var text = message.text;
    fn.db.post.findOne({'name': text}).exec((e, post) =>{
        if(post){
            var description = post.description + '\n @' +  global.robot.username;
            switch (post.type) {
                case fn.mstr.post.types['text'].name:
                    global.robot.bot.sendMessage(message.from.id, description);
                    break;
                case fn.mstr.post.types['file'].name:
                    global.robot.bot.sendDocument(message.chat.id, post.fileid, {caption : description});                
                    break;
        
                case fn.mstr.post.types['photo'].name:
                    global.robot.bot.sendPhoto(message.chat.id,post.photoid, {caption : description});
                    break;
        
                case fn.mstr.post.types['sound'].name:
                    global.robot.bot.sendAudio(message.chat.id,post.audioid, {caption : description});        
                    break;
        
                case fn.mstr.post.types['video'].name:
                    global.robot.bot.sendVideo(message.chat.id,post.videoid, {caption : description});                
                    break;
                    
                case fn.mstr.post.types['ticket'].name:
                    break;
            }
        }
        else global.robot.bot.sendMessage(message.from.id, fn.str['choosethisItems']);
    });
}
module.exports = {show}