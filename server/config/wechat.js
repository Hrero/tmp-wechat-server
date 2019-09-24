const path = require('path')

module.exports = {
    appid: 'wxf58455f0c5a38d1d', 
    secret: '914d770e7224e980b94ae6727e9c2810',
    accessTokenPath: path.resolve(__dirname, './accessToken.json'), 
    jsapiTicketPath: path.resolve(__dirname, './jsapiTicket.json') 
}