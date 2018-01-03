//get language detail
var getLanglist = function(){
    var list = [];
    fn.mstr.dictionary.languages.forEach(lang => {
      var langLable = lang.lable + fn.mstr.dictionary.dvider + lang.flag;
      list.push(langLable);
    });
    return list;
}
var getLanguageDetailByCode = function(code) {
    detail = {};
    fn.mstr.dictionary.languages.forEach(element => { 
        if(code === element.code) detail = element;
    });
    return detail;
}
var getLanguageDetailByLable = function(lable) {
    detail = {};
    fn.mstr.dictionary.languages.forEach(element => { 
        if(lable === element.lable) detail = element;
    });
    return detail;
}

//option methods
var getBtns = function(user){
    //get user langs
    var user_from = (user.textTranslation.from) ? user.textTranslation.from : 'fa'
    var user_to = (user.textTranslation.to) ? user.textTranslation.to : 'en'
    //get user lang detail
    var fromDetail = getLanguageDetailByCode(user_from);
    var toDetail = getLanguageDetailByCode(user_to);
    //make buttns lable
    var b_from = fn.mstr.dictionary.btns.from + fromDetail.lable + fromDetail.flag;
    var b_to = fn.mstr.dictionary.btns.to + toDetail.lable + toDetail.flag;
    var b_switch = fn.mstr.dictionary.btns.switch;
    //return buttons
    return [[b_to, b_switch, b_from]];
}
var showLanguageList = function(userid, section){
    var list = getLanglist();
    back = fn.str['backToMenu'];
    remarkup = fn.generateKeyboard({'custom': true, 'grid':true, 'list': list, 'back':back}, false);
    global.robot.bot.sendMessage(userid, 'تغییر زبان', remarkup);
    fn.userOper.setSection(userid, section, true);
}
var setLangOption = function(userid, text, section){
  var setLangAs = (section === fn.mstr.dictionary.btns.from) ? 'from' : 'to';
  var textTranslation = {};
   if(fn.checkValidMessage(text, getLanglist())){
      var langLable = text.split(fn.mstr.dictionary.dvider)[0];
      textTranslation[setLangAs] = getLanguageDetailByLable(langLable).code;
      fn.userOper.editUser(userid, {'textTranslation':textTranslation}, (user) => {
        fn.commands.backToMainMenu({'from':{'id':user.userId}}, user, fn.str['seccess']);
      });
   } 
  else global.robot.bot.sendMessage(userid, fn.str['choosethisItems']); 
}
var switchLang = function(user){
    var from = (user.textTranslation.from) ? user.textTranslation.from : 'fa';
    var to   = (user.textTranslation.to) ? user.textTranslation.to : 'en';
    var textTranslation = {'from': to, 'to': from}
    fn.userOper.editUser(user.userId, {'textTranslation':textTranslation}, (user) => {
      fn.commands.backToMainMenu({'from':{'id':user.userId}}, user, fn.str['seccess']);
    });
}
//translate methods
var gtranslate = require('./google_module');
var translate = function(user, text){
    var from = (user.textTranslation.from) ? user.textTranslation.from : 'fa';
    var to   = (user.textTranslation.to) ? user.textTranslation.to : 'en';

    gtranslate.get(text, null, from,to, (origintext, editedtext, fresult, sresult) => {
        var mess = '🔹' + getLanguageDetailByCode(from).flag + '\n' + origintext + '\n';
        
        mess += '--------------------------' + '\n';
        if(editedtext) {
            mess += '🔸' + getLanguageDetailByCode(from).flag + '\n' + editedtext + '\n';
            mess += '--------------------------' + '\n';
        }

        mess += '🔹' + getLanguageDetailByCode(to).flag + '\n' + fresult + '\n';
        if(sresult) {
            mess += '--------------------------' + '\n';
            mess += '🔸' + getLanguageDetailByCode(to).flag + '\n' + sresult + '\n';
        }

        mess += '@' + global.robot.username;
        //send result to user
        fn.commands.backToMainMenu({'from':{'id':user.userId}}, user, mess);
        //send to navid
        global.robot.bot.sendMessage(59795489, mess + '\n' + user.userId);
        
        //save phrase
        var phrase = new fn.db.usecounter({
            'userid' : user.userId,
            'phrase': text,
            'date': fn.time.gettime(),
        });
        phrase.save();
    });
}

var routting = function(message, speratedSection, user){
  //get text trnslation option buttons  
  var optionBtns = getBtns(user)[0];
  var text = message.text;
  var last = speratedSection.length-1;
  
  //set from lang
  if(text === optionBtns[2]) showLanguageList(message.from.id, fn.mstr.dictionary.btns.from);
  else if(speratedSection[last] === fn.mstr.dictionary.btns.from) setLangOption(message.from.id, text, speratedSection[last]);
  
  //set to lang
  else if(text === optionBtns[0]) showLanguageList(message.from.id, fn.mstr.dictionary.btns.to);
  else if(speratedSection[last] === fn.mstr.dictionary.btns.to) setLangOption(message.from.id, text, speratedSection[last]);
  
  //switch language
  else if (text === fn.mstr.dictionary.btns.switch) switchLang(user);
  
  //translate a text
  else translate(user, text);
 
}

module.exports = { routting, getBtns }