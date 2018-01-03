fn = global.fn;

var registerId = function(id, flag, regCallback){
    var tempuser = {};
    fn.userOper.checkProfile(id, (user) => {
        isAdmin = false;
        var newAdminList = []
        global.robot.adminWaitingList.forEach(function(admin) {
            if(admin === flag.username)
                isAdmin = true;
            else{newAdminList.push(admin);}
        }, this);
        global.robot.adminWaitingList = newAdminList;

        if(!user){
            var newuser = new fn.db.user({
                userId  : id,
                'username'  : flag.username,
                'fullname'  : flag.fullname,
                'section'   : fn.str['mainMenu'],
                'isAdmin'   : isAdmin,
                'isCompelet': true,
                'dictype'   : fn.mstr.dictionary.btns.types['text']
            });
            //set invitor id
            if(flag.invitor) newuser.invitorId = flag.invitor;
            newuser.save(() => {
                console.log('user has been registered');
            });
            tempuser = newuser;
        }
        else{
            user.section = fn.str['mainMenu'];
            user.isCompelet = true;
            user.fullname = flag.fullname;
            user.username = flag.username;

            if(user.isAdmin === true){
                isAdmin = user.isAdmin;
            }
            else{
                user.isAdmin = isAdmin;
            }
            user.save();
            tempuser = user;
        }
        regCallback(tempuser);
    });
}

var editUser = function(userId,profile,ssCallBack){
    fn.userOper.checkProfile(userId, (user) => {
        if(profile.isCompelet) user.isCompelet = true;
        if(profile.fullname) user.fullname = profile.fullname;
        if(profile.phone) user.phone = profile.phone;
        if(profile.textTranslation) {
            console.log(profile);
            if(profile.textTranslation.from) user.textTranslation.from = profile.textTranslation.from;
            if(profile.textTranslation.to)   user.textTranslation.to   = profile.textTranslation.to;          
        } 
        if(profile.dictype) user.dictype = profile.dictype;
        user.save((e) => { 
            if(e) console.log(e);
            if(ssCallBack) ssCallBack(user); 
        });
    });
}

var checkProfile = function(id, callback){
    fn.db.user.findOne({'userId':id}).exec((e, user) => {
        if(user && callback) callback(user);
        else if(callback) callback(null);
    });
}

var setSection = function(userId, section, additiveKey, ssCallBack){
    fn.userOper.checkProfile(userId, (user) => {
        if (!user) return;
        else if(additiveKey){
            if(user.section.includes(section)){
                //console.log('section added already');
                var sperateSection = user.section.split('/');
                var newSections = '';
                for(var i=0; i<sperateSection.length; i++){
                    if(i>0)
                        newSections += '/';
                    newSections += sperateSection[i];
                    if(sperateSection[i] === section)
                        break;
                }
                user.section = newSections;
            }
            else{
                //console.log('section wasnt added already', section);
                user.section += '/' + section;
            }
        }
        else{user.section = section;}
        user.save(() => {
            if(ssCallBack) 
                ssCallBack();
        });
    });
}

var addAdminToWaintingList = function(username){
    global.robot.adminWaitingList.push(username);
    console.log('an admin was aded', username, global.robot.adminWaitingList);
}

module.exports = {
    registerId, checkProfile, 
    setSection, editUser,
    addAdminToWaintingList,
}
