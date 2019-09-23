export default (str) => {
    let tmp = "";
    if(!str) return '';
    let isString = typeof str === 'string';
    let newStr =  isString ? str : JSON.stringify(str);
    for (let i = 0; i < newStr.length; i++) {
        if(newStr.charCodeAt(i) === 12288){
            tmp += String.fromCharCode(newStr.charCodeAt(i)-12256);
        } else if (newStr.charCodeAt(i) > 65248 && newStr.charCodeAt(i) < 65375) {
            tmp += String.fromCharCode(newStr.charCodeAt(i) - 65248);
        } else {
            tmp += String.fromCharCode(newStr.charCodeAt(i));
        }
    }
    tmp = tmp.replace(/ /g, '');
    return  isString ? tmp : JSON.parse(tmp);
}
