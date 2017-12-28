module.exports = function(message, speratedSection){

    //post
    if(speratedSection[1] === fn.mstr['post']['name']){
        console.log('post upload');
        fn.m.post.upload(message, speratedSection);
    }

}