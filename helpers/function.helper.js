module.exports= {

    createToken: () => {
        token = '';
        initString = '0123456789qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
        for(i = 1; i <= 40; i++){
            position = Math.floor((Math.random() * (initString.length - 1)) + 1);
            token = token + initString.substr(position,1);
        }
        return token;
    }

}