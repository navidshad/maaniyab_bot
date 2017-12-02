module.exports = function(message, speratedSection){
    //console.log(message.photo);

    if(speratedSection[1] === fn.str.settingsItems['post']['name']){
        console.log('post upload');
        fn.post.upload(message, speratedSection);
    }

}