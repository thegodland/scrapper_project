const instagram = require('./instagram');

(async ()=>{

    await instagram.initialize();
    await instagram.login();
    // await instagram.getFollowing();
    await instagram.getFollowers();
    // debugger;

})();