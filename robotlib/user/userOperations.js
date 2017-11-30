fn = global.fn;

var registerId = function(id, flag, regCallback){
    fn.db.user.findOne({"userId": id}, 'section isAdmin', function(err, user1){
        isAdmin = false;
        var newAdminList = []
        global.robot.adminWaitingList.forEach(function(admin) {
            if(admin === flag.username)
                isAdmin = true;
            else{newAdminList.push(admin);}
        }, this);
        global.robot.adminWaitingList = newAdminList;

        if(!user1){
            var newuser = new fn.db.user({
                'userId'  : id,
                'username': flag.username,
                'fullname': flag.fullname,
                'section' : fn.str['mainMenu'],
                'isAdmin' : isAdmin,
                'isCompelet':true,
                'diclang': fn.str.moduleButtons.dictionary['to_en'],
                'dictype': fn.str.moduleButtons.dictionary['trans_text']
            });
            //set invitor id
            if(flag.invitor) newuser.invitorId = flag.invitor;
            newuser.save(() => {
                if(regCallback) regCallback(isAdmin);
            });
        }
        else{
            user1.section = fn.str['mainMenu'];
            user1.isCompelet = true;
            user1.fullname = flag.fullname;
            user1.username = flag.username;

            if(user1.isAdmin === true){
                isAdmin = user1.isAdmin;
            }
            else{
                user1.isAdmin = isAdmin;
            }
            console.log(user1);
            user1.save(() => {
                if(regCallback) regCallback(isAdmin);
            });
        }
    });
}

var editUser = function(userId,profile,ssCallBack){
    fn.db.user.findOne({"userId": userId}, function(err, user){
        if(user){
            if(profile.isCompelet) user.isCompelet = true;
            if(profile.fullname) user.fullname = profile.fullname;
            if(profile.phone) user.phone = profile.phone;
            if(profile.diclang) user.diclang = profile.diclang;
            if(profile.dictype) user.dictype = profile.dictype;
            user.save((e) => {
                if(e) console.log(e);
                if(ssCallBack) ssCallBack(user);
            });
        }
    });
}

var checkProfile = function(id, callback){
    fn.db.user.findOne({'userId': id}, 'section isCompelet isAdmin fullname', function(err, user){
        if(user){
            callback(user.section, user.isCompelet, user.isAdmin, user.fullname);
        }
    });
}

var setSection = function(userId, section, additiveKey, ssCallBack){
    fn.db.user.findOne({"userId": userId}, 'section', function(err, user){
        if(user){
            if(additiveKey){
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
        }
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
