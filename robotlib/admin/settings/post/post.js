var showPostList = function(userid){
    fn.userOper.setSection(userid, fn.str.settingsItems.post['name'], true);
    var list = [fn.str.postOptions];
    var back = fn.str.adminItems.settings['back'];
    var mess = fn.str.settingsItems.post['name'];
    //find
    fn.db.post.find({}).select('name category').sort('-_id').exec((e, cats) => {
        if(cats && cats.length > 0) cats.forEach(function(element) { 
            var itemname = element.category + ' - ' + element.name;
            list.push(itemname); }, this);
        global.robot.bot.sendMessage(userid, mess, fn.generateKeyboard({'custom': true, 'grid':false, 'list': list, 'back':back}, false));        
    });
}

var createpostMess = function(userId, post, option){
        //create callback keyboard
        var detailArr = [];
        var fn_text     = fn.str['queryPost'] + '-' + fn.str['queryPostText'] + '-' + post._id;
        var fn_file     = fn.str['queryPost'] + '-' + fn.str['queryPostFile'] + '-' + post._id;
        var fn_photo    = fn.str['queryPost'] + '-' + fn.str['queryPostPhoto'] + '-' + post._id;
        var fn_sound    = fn.str['queryPost'] + '-' + fn.str['queryPostSound'] + '-' + post._id;
        var fn_video    = fn.str['queryPost'] + '-' + fn.str['queryPostVideo'] + '-' + post._id;
        var fn_upload   = fn.str['queryPost'] + '-' + fn.str['queryUpload'] + '-' + post._id;
        
        var fn_name         = fn.str['queryPost'] + '-' + fn.str['queryPostName'] + '-' + post._id;
        var fn_category     = fn.str['queryPost'] + '-' + fn.str['queryPostCategory'] + '-' + post._id;
        var fn_description  = fn.str['queryPost'] + '-' + fn.str['queryPostDescription'] + '-' + post._id;
        var fn_delete       = fn.str['queryPost'] + '-' + fn.str['queryDelete'] + '-' + post._id;
        var fn_publication  = fn.str['queryPost'] + '-' + fn.str['queryPublication'] + '-' + post._id;
        var fn_order        = fn.str['queryPost'] + '-' + fn.str['queryOrder'] + '-' + post._id;            
        var fn_close        = fn.str['queryPost'] + '-close';

        var tx_text=fn.str.postTypes['text'].icon,
        tx_file=fn.str.postTypes['file'].icon,
        tx_photo=fn.str.postTypes['photo'].icon, 
        tx_sound=fn.str.postTypes['sound'].icon, 
        tx_video=fn.str.postTypes['video'].icon;
        
        console.log(post.type)
        if(post.type === 'text')       tx_text = tx_text + ' ' + fn.str['Published'];
        else if(post.type === 'file')  tx_file = tx_file + ' ' + fn.str['Published'];
        else if(post.type === 'photo') tx_photo = tx_photo + ' ' + fn.str['Published'];
        else if(post.type === 'sound') tx_sound = tx_sound + ' ' + fn.str['Published'];
        else if(post.type === 'video') tx_video = tx_video + ' ' + fn.str['Published'];

        //upload
        var tx_upload = 'آپلود';
        if(post.type === 'file'  && post.fileid)  tx_upload = 'آپلود' + fn.str.postTypes['attached'];
        if(post.type === 'photo' && post.photoid) tx_upload = 'آپلود' + fn.str.postTypes['attached'];
        if(post.type === 'sound' && post.audioid) tx_upload = 'آپلود' + fn.str.postTypes['attached'];
        if(post.type === 'video' && post.videoid) tx_upload = 'آپلود' + fn.str.postTypes['attached']; 

        //publication
        var tx_publication = (post.publish) ? fn.str['Published'] +'منتشر شده' : fn.str['NotPublished'] +'منتشر نشده'

        detailArr.push([
            {'text': tx_text, 'callback_data': fn_text},
            {'text': tx_file, 'callback_data': fn_file},    
            {'text': tx_photo, 'callback_data': fn_photo},
            {'text': tx_sound, 'callback_data': fn_sound},
            {'text': tx_video, 'callback_data': fn_video}
        ]);

        if(post.type !== 'text') detailArr.push([{'text': tx_upload, 'callback_data': fn_upload}]);
        
        detailArr.push([ 
            {'text': 'دسته بندی', 'callback_data': fn_category},
            {'text': 'توضیح', 'callback_data': fn_description},
            {'text': 'نام', 'callback_data': fn_name}
        ]);

        detailArr.push([{'text': 'اولویت', 'callback_data': fn_order}]);

        detailArr.push([
            {'text': 'حذف', 'callback_data': fn_delete},
            {'text': 'بستن', 'callback_data': fn_close},
            {'text': tx_publication, 'callback_data': fn_publication}
        ]);

   
       //create message
       var description='...', 
       title    = post.name, 
       category = post.category, 
       order = post.order,
       publish  = fn.str['NotPublished'] + ' منتشر نشده.';

       if(post.description) description = post.description;
       publish = (post.publish) ? fn.str['Published'] : fn.str['NotPublished'] + ' منتشر شده.';
   
       var text = 'اطلاعات مطلب' + '\n' +
       'ــــــــــــــــــــــــــــــــ' + '\n' +
       '⏺ ' + 'عنوان: ' + title + '\n' +
       '⏺ ' + 'دسته بندی: ' + category + '\n' +
       '⏺ ' + 'اولویت: ' + order + '\n' +
       '⏺ ' + 'وضعیت: ' + publish + '\n' + 
       '⏺ ' + 'توضیحات: ' + '\n' +
       'ــــــــــــــــــــــــــــــــ' + '\n' +
       description + '\n' + 
       'ــــــــــــــــــــــــــــــــ' + '\n' + 
       '⚠️' + 'برای ویرایش مطلب از دکمه های پیوست شده استفاده کنید.';
   
       //global.robot.bot.sendMessage(userId, fn.str['seccess'], fn.generateKeyboard({section:fn.str.goTopost[0]}, false));    
       showPostList(userId);
       global.robot.bot.sendMessage(userId, text, {"reply_markup" : {"inline_keyboard" : detailArr}});
}

var ceatePost = function(message){
    var newpost = new fn.db.post({
        'name': message.text,
        'category': fn.str['maincategory'],
        'order': 1,
        'type': 'text',
        'date': fn.time.gettime(),
        'publish': false
    });
    newpost.save(() => { showPostList(message.from.id); fn.getMainMenuItems();});
}

var editpost = function(id, detail, userId, ecCallBack){
    //console.log('edit a post', id);
    fn.db.post.findOne({"_id": id}, function(err, post){
        fn.userOper.setSection(userId, fn.str.settingsItems.post['name'], true);
        if(post){
            if(detail.name) post.name = detail.name;
            if(detail.category) post.category = detail.category;
            if(detail.description) post.description      = detail.description;
            if(detail.type) post.type            = detail.type;
            if(detail.fileid) post.fileid        = detail.fileid;
            if(detail.photoid) post.photoid      = detail.photoid;
            if(detail.audioid) post.audioid      = detail.audioid;
            if(detail.videoid) post.videoid      = detail.videoid;
            if(detail.thumbLink) post.thumbLink  = detail.thumbLink;
            if(detail.publish){
                if(detail.publish === fn.str['Published']) post.publish = true;
                else if(detail.publish === 'switch') post.publish = !post.publish;
                else post.publish = false;
            }
            if(detail.order) post.order = detail.order;


            post.save(() => {
                global.robot.bot.sendMessage(userId, fn.str['seccess'], fn.generateKeyboard({section:fn.str['goTopost']}));
                createpostMess(userId, post);
                global.fn.category.get();
                if(ecCallBack) 
                    ecCallBack();
            });
        }
        else{
            global.robot.bot.sendMessage(userId, 'این مطلب دیگر وجود ندارد', fn.generateKeyboard({section:fn.str['goTopost']}));
        }
    });
}

var upload = require('./postUpload.js');

var routting = function(message, speratedSection){
    var text = message.text;
    var last = speratedSection.length-1;
    
    //show posts root
    if(text === fn.str.settingsItems.post['name'] || text === fn.str.settingsItems.post['back']) showPostList(message.from.id);

    //create new post
    else if(text === fn.str.postOptions[1]){
        var mess = fn.str['newSCMess'];
        var back = fn.str.settingsItems.post['back'];
        
        fn.userOper.setSection(message.from.id, fn.str.postOptions[1], true);        
        global.robot.bot.sendMessage(message.from.id, mess, fn.generateKeyboard({'section': back}, true));
    }
    else if(speratedSection[last] === fn.str.postOptions[1]){
        if(fn.category.checkInValidCat(text)) global.robot.bot.sendMessage(message.from.id, fn.str.scErrors[0]);
        else if(fn.checkValidMessage(text)) global.robot.bot.sendMessage(message.from.id, fn.str['chooseOtherText']);
        else{
            fn.db.post.findOne({'name': text}).exec((e, post) => {
                if(!post) ceatePost(message);
                else global.robot.bot.sendMessage(message.from.id, fn.str.scErrors[1]);
            });
        }
    }

    //edit name
    else if(speratedSection[last-1] === fn.str.editPost['name']){
        if(fn.category.checkInValidCat(text)) global.robot.bot.sendMessage(message.from.id, fn.str.scErrors[0]);
        else if(fn.checkValidMessage(text)) global.robot.bot.sendMessage(message.from.id, fn.str['chooseOtherText']);
        else{
            fn.db.post.findOne({'name': text}).exec((e, post) => {
                if(!post) editpost(speratedSection[last], {'name': text}, message.from.id);
                else global.robot.bot.sendMessage(message.from.id, fn.str.scErrors[1]);
            });
        }
    }

    //edit decription
    else if (speratedSection[last-1] === fn.str.editPost['description']) 
        editpost(speratedSection[last], {'description': text}, message.from.id);

    //edit category
    else if (speratedSection[last-1] === fn.str.editPost['category']){
        var cat = text.split(' - ')[1];
        if(fn.category.checkInValidCat(cat)){
            editpost(speratedSection[last], {'category': cat}, message.from.id);
        }else global.robot.bot.sendMessage(message.from.id, fn.str['choosethisItems']);
    }

    //edit order
    else if (speratedSection[last-1] === fn.str.editPost['order']) 
        if(parseFloat(text) || text === 0) editpost(speratedSection[last], {'order': text}, message.from.id);
        else global.robot.bot.sendMessage(message.from.id, fn.str.editPost['order']);                

    //choose a post
    else {
        var postname = text.split(' - ')[1];
        fn.db.post.findOne({'name': postname}).exec((e, post) => {
            if(post) createpostMess(message.from.id, post);
            else global.robot.bot.sendMessage(message.from.id, fn.str['choosethisItems']);            
        });
    }
}
module.exports = {routting, editpost, upload}