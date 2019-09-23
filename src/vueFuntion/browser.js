const isIE = (num) => {
  if (arguments.length == 0) {
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
      return true;
    } else {
      return false;
    }
  }
  var browser = navigator.appName;
  var b_version = navigator.appVersion;
  var version = b_version.split(";");
  var trim_Version = version[1].replace(/[ ]/g, "");
  var version_num = 0;
  if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE6.0") {
    version_num = 6;
  } else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE7.0") {
    version_num = 7;
  } else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE8.0") {
    version_num = 8;
  } else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE9.0") {
    version_num = 9;
  }
  return version_num == num ? true : false;
}
export default {
  isIE
}
