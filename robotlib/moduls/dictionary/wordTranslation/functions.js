//option methods
var getBtns = function(user){
    var wordTranslation = (user.wordTranslation) ? user.wordTranslation : fn.mstr.dictionary.btns.wordTransType['simple'].k;
    var simplekey = fn.mstr.dictionary.btns.wordTransType['simple'].k;
    var premiumkey = fn.mstr.dictionary.btns.wordTransType['premium'].k;
    var b_simple = fn.mstr.dictionary.btns.wordTransType['simple'].l + fn.mstr.dictionary.dvider;
    var b_premium = fn.mstr.dictionary.btns.wordTransType['premium'].l + fn.mstr.dictionary.dvider;

    b_simple += (wordTranslation === simplekey) ? '✅' : '⬜️';
    b_premium += (wordTranslation === premiumkey) ? '✅' : '⬜️';
    
    //return buttons
    return [[b_premium, b_simple]];
}
var getkeyOptionByName = function(name){
    if(name === fn.mstr.dictionary.btns.wordTransType['simple'].l) return fn.mstr.dictionary.btns.wordTransType['simple'].k;
    else if(name === fn.mstr.dictionary.btns.wordTransType['premium'].l) return fn.mstr.dictionary.btns.wordTransType['premium'].k;
}
var setOption = function(user, text){

    var option = text.split(fn.mstr.dictionary.dvider)[0];
    var keyOption = getkeyOptionByName(option);

    fn.userOper.editUser(user.userId, {'wordTranslation':keyOption}, (user) => {
      fn.commands.backToMainMenu({'from':{'id':user.userId}}, user);
    });
}

//translate methods
var simple = require('./urbanDictionary');
var premium = '';

var routting = function(message, speratedSection, user){
  //get text trnslation option buttons  
  var optionBtns = getBtns(user)[0];
  var text = message.text;
  var last = speratedSection.length-1;
  
  //set option
  //fn.checkValidMessage(text, getBtns(user)[0]
  if (text === getBtns(user)[0][1]) setOption(user, text);
  else if (text === getBtns(user)[0][0]) {
      global.robot.bot.sendMessage(message.from.id, 'این بخش در دست طراحی است، وقتی کامل ساخته شد من خودم بهت خبر میدم ☺️');
      fn.commands.backToMainMenu({'from':{'id':user.userId}}, user);
  }
  
  //translate a word
  else if(!user.wordTranslation || user.wordTranslation === fn.mstr.dictionary.btns.wordTransType['simple'].k) simple.translate(user, text);
  //else if(user.wordTranslation === fn.mstr.dictionary.btns.wordTransType['premium'].k) translate(user, text);
 
}

module.exports = { routting, getBtns }