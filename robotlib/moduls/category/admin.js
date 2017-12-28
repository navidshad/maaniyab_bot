//primarly
var get  = function(callback){
    fn.db.category.find({}).exec((er, cats) => {
        global.robot.category = [{'name':fn.mstr.category.maincategory, 'parent':'.'}];
        if(cats) cats.forEach(function(element) {
           global.robot.category.push({'name':element.name, 'parent': element.parent, 'order':element.order});
       }, this); 

       if(callback) callback();
    });
}

var checkInValidCat = function(text, custom){
    var isvalid = false;
    if(custom) {
        custom.forEach(function(element) {
            if(element === text) 
                isvalid = true;
        }, this);
    }
    else{
        //category
        if(text === fn.mstr.category.maincategory) isvalid = true;
        else{
            global.robot.category.forEach(function(element) {
                if(element.name === text) 
                    isvalid = true;
            }, this);
        }
    }

    return isvalid;
}  

var showRoot = function(message, speratedSection){
    fn.userOper.setSection(message.from.id, fn.mstr.category['name'] + '/' + fn.mstr.category.maincategory, true);
    showCategoryDir(message.from.id, fn.mstr.category.maincategory, speratedSection);
}

//additional
var showCategoryDir = function(userid,catname, speratedSection){
    var parent;
    //parent
    if(catname === fn.mstr.category.maincategory) parent = '';
    else{
        for(var i =0; i<speratedSection.length; i++){
            if(speratedSection[i] === catname) parent = speratedSection[i-1];
        }
    }

    var list = [fn.mstr.category.categoryoptions[0], fn.mstr.category.categoryoptions[1]];
    var back = (catname === fn.mstr.category.maincategory) ? fn.str.goToAdmin['back'] : fn.mstr.category['backtoParent'] + ' از "' + catname + '" به ' + ' - ' + parent;

    fn.db.category.find({'parent':catname}).exec((e, cats) => {
        if(cats && cats.length > 0) cats.forEach(function(element) { list.push(element.order + ' - ' + element.name); }, this);
        global.robot.bot.sendMessage(userid, catname, 
        fn.generateKeyboard({'custom': true, 'grid':true, 'list': list, 'back':back}, false));                
    });
}

var createcategory = function(name, speratedSection, userid){
    //create new category
    var newcategory = new fn.db.category({
        'name': name,
        'parent': speratedSection[speratedSection.length-2],
        'order':1,
    });
    newcategory.save(() => {showCategoryDir(userid, newcategory.parent, speratedSection); global.fn.updateBotContent(); });
}

var deleteCategory = require('./delete');

var createcategoryMess = function(userId, category, option){
    //create callback keyboard
    var detailArr = [];
    
    var fn_name         = fn.mstr.category['queryCategory'] + '-' + fn.mstr.category['queryCategoryName'] + '-' + category._id;
    var fn_parent       = fn.mstr.category['queryCategory'] + '-' + fn.mstr.category['queryCategoryParent'] + '-' + category._id;
    var fn_description  = fn.mstr.category['queryCategory'] + '-' + fn.mstr.category['queryCategoryDescription'] + '-' + category._id;
    var fn_delete       = fn.mstr.category['queryCategory'] + '-' + fn.mstr.category['queryDelete'] + '-' + category._id;
    var fn_order        = fn.mstr.category['queryCategory'] + '-' + fn.mstr.category['queryOrder'] + '-' + category._id;    
    var fn_close        = fn.mstr.category['queryCategory'] + '-close';
    
    detailArr.push([ 
        {'text': 'دسته مادر', 'callback_data': fn_parent},
        {'text': 'توضیح', 'callback_data': fn_description},
        {'text': 'نام', 'callback_data': fn_name}
    ]);

    detailArr.push([
        {'text': 'حذف', 'callback_data': fn_delete},
        {'text': 'بستن', 'callback_data': fn_close},
        {'text': 'اولویت', 'callback_data': fn_order},
    ]);


   //create message
   var description='...', 
   title    = category.name, 
   parent = category.parent, 
   order = category.order,
   publish  = fn.str['NotPublished'] + ' منتشر نشده.';

   if(category.description) description = category.description;
   publish = (category.publish) ? fn.str['Published'] : fn.str['NotPublished'] + ' منتشر شده.';

   var text = 'اطلاعات مطلب' + '\n' +
   'ــــــــــــــــــــــــــــــــ' + '\n' +
   '⏺ ' + 'عنوان: ' + title + '\n' +
   '⏺ ' + 'دسته مادر: ' + parent + '\n' +
   '⏺ ' + 'اولویت: ' + order + '\n' +
   '⏺ ' + 'توضیحات: ' + '\n' +
   'ــــــــــــــــــــــــــــــــ' + '\n' +
   description + '\n' + 
   'ــــــــــــــــــــــــــــــــ' + '\n' + 
   '⚠️' + 'برای ویرایش مطلب از دکمه های پیوست شده استفاده کنید.';

   //global.robot.bot.sendMessage(userId, fn.str['seccess'], fn.generateKeyboard({section:fn.str.goTocategory[0]}, false));    
   //showcategoryList(userId);
   global.robot.bot.sendMessage(userId, text, {"reply_markup" : {"inline_keyboard" : detailArr}});
}

var editcategory = function(id, detail, userId, speratedSection, ecCallBack){
    //console.log('edit a category', id);
    fn.db.category.findOne({"_id": id}, function(err, category){

        fn.userOper.setSection(userId, fn.str.maincategory, true);
        if(category){
            if(detail.name) category.name = detail.name;
            if(detail.parent) category.parent = detail.parent;
            if(detail.description) category.description = detail.description;
            if(detail.order) category.order = detail.order;

            category.save(() => {
                //get new category
                global.fn.updateBotContent(() => {
                    createcategoryMess(userId, category);
                    showCategoryDir(userId, category.parent, speratedSection); 
                });
                              
                if(ecCallBack) ecCallBack();
            });
        }
        else{
            global.robot.bot.sendMessage(userId, 'این دسته بندی دیگر وجود ندارد', fn.generateKeyboard({section:fn.str['goTocategory']}));
        }
    });
}

//routting
var routting = function(message, speratedSection){
    var text = message.text;
    var last = speratedSection.length-1;
    var catname = (text.split(' - ')[1]) ? text.split(' - ')[1] : text;
    //show category root
    if(text === fn.mstr.category['name'] || text === fn.mstr.category['back']){
        console.log('root gategory');
        showRoot(message, speratedSection);
    }
    
    //back to a category
    else if(text.includes(fn.str['back']) || text.includes(fn.str['escapEdit']) && text.split(' - ')[1]){
        console.log('back to category', text);
        var catname = text.split(' - ')[1];
        fn.userOper.setSection(message.from.id, catname, true);
        showCategoryDir(message.from.id, catname, speratedSection);
    }

    //go to specific cat
    else if(checkInValidCat(catname) && checkInValidCat(speratedSection[last])){
        console.log('go to category', catname);
        speratedSection.push(catname);
        fn.userOper.setSection(message.from.id, catname, true);
        showCategoryDir(message.from.id, catname, speratedSection);
    }
    
    //add new 
    else if(text === fn.mstr.category.categoryoptions[1] && checkInValidCat(speratedSection[last])){
        var mess = fn.mstr.category.categoryoptions[1];
        var back = fn.str['back'] + ' - ' + speratedSection[last];
        
        fn.userOper.setSection(message.from.id, mess, true);        
        global.robot.bot.sendMessage(message.from.id, mess, fn.generateKeyboard({'section': back}, true));
    }
    else if(speratedSection[last] === fn.mstr.category.categoryoptions[1]){
        var parent = speratedSection[last-2];
        var grandparent = speratedSection[last-3];
        console.log('create category', text);
        if(checkInValidCat(text)) global.robot.bot.sendMessage(message.from.id, fn.mstr.post.scErrors[2]);
        else if(fn.checkValidMessage(text)) global.robot.bot.sendMessage(message.from.id, fn.str['chooseOtherText']);
        else{
            fn.db.category.findOne({'name': text}).exec((e, category) => {
                if(!category){ 
                    fn.userOper.setSection(message.from.id, speratedSection[last-1], true);
                    createcategory(text, speratedSection, message.from.id);
                }
                else global.robot.bot.sendMessage(message.from.id, fn.mstr.post.scErrors[0]);
            });
        }
    }

    //edit mode
    else if(text === fn.mstr.category.categoryoptions[0] && checkInValidCat(speratedSection[last])){            
        console.log('choose a category to delete');
        var catlist = [];
        deleteCategory.find({'parent': speratedSection[last]}).map((i) => { catlist.push(i.name) });

        if(catlist.length > 0){
            var back = fn.str['escapEdit'] + ' - ' + speratedSection[last];
            fn.userOper.setSection(message.from.id, fn.mstr.category.categoryoptions[0], true);                    
            global.robot.bot.sendMessage(message.from.id, 'انتخاب کنید', fn.generateKeyboard({'custom': true, 'grid':true, 'list': catlist, 'back':back}, false));
        }
        else global.robot.bot.sendMessage(message.from.id, 'در اینجا گزینه ای برای ویرایش وجود ندارد.');
    }
    else if(speratedSection[last] === fn.mstr.category.categoryoptions[0]){
        console.log('get deletting category');
        var catlist = [];
        deleteCategory.find({'parent': speratedSection[last-1]}).map((i) => { catlist.push(i.name) });
        if(!checkInValidCat(text, catlist)) {global.robot.bot.sendMessage(message.from.id, fn.str['choosethisItems']); return;}
        else {
            //fn.userOper.setSection(message.from.id, speratedSection[last-1], true);                                
            //deleteCategory.clear(text, () => {showCategoryDir(message.from.id, speratedSection[last-1], speratedSection)});            
            fn.db.category.findOne({'name':text}).exec((e, cat) => {
                createcategoryMess(message.from.id, cat);
            });
        }
    }

    //edit name
    else if(speratedSection[last-1] === fn.mstr.category.edit['name']){
        if(checkInValidCat(text)) global.robot.bot.sendMessage(message.from.id, fn.mstr.post.scErrors[2]);
        else if(fn.checkValidMessage(text)) global.robot.bot.sendMessage(message.from.id, fn.str['chooseOtherText']);
        else{
            fn.db.category.findOne({'_id': speratedSection[last]}).exec((e, category) => {
                if(category) editcategory(speratedSection[last], {'name': text}, message.from.id, speratedSection);
                else global.robot.bot.sendMessage(message.from.id,  fn.str['chooseOtherText']);
            });
        }
    }

    //edit decription
    else if (speratedSection[last-1] === fn.mstr.category.edit['description'])
        editcategory(speratedSection[last], {'description': text}, message.from.id, speratedSection);

    //edit parent
    else if (speratedSection[last-1] === fn.mstr.category.edit['parent']){
        var cat = text.split(' - ')[1];
        if(fn.m.category.checkInValidCat(cat)){
            editcategory(speratedSection[last], {'parent': cat}, message.from.id, speratedSection);
        }else global.robot.bot.sendMessage(message.from.id, fn.str['choosethisItems']);
    }

    //edit order
    else if(speratedSection[last-1] === fn.mstr.category.edit['order']){
        if(parseFloat(text) || text === 0) editcategory(speratedSection[last], {'order': text}, message.from.id, speratedSection);        
        else global.robot.bot.sendMessage(message.from.id, fn.mstr.category.edit['order']);        
    }

}

module.exports = { get, routting, checkInValidCat, deleteCategory }