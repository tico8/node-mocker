//XMLHttpRequestオブジェクト生成
function createXMLHttpRequest() {
    //Win ie用
    if (window.ActiveXObject) {
        try {
            //MSXML2以降用
            return new ActiveXObject("Msxml2.XMLHTTP") //[1]'
        } catch (e) {
            try {
                //旧MSXML用
                return new ActiveXObject("Microsoft.XMLHTTP") //[1]'
            } catch (e2) {
                return null
            }
        }
    } else if (window.XMLHttpRequest) {
        //Win ie以外のXMLHttpRequestオブジェクト実装ブラウザ用
        return new XMLHttpRequest() //[1]'
    } else {
        return null
    }
}

function getData(host, port, dataName, key, callback) {

    var url = 'http://' + host + ':' + port + '/data';
    if (dataName) {
        url = url + '/' + dataName;
        
        if (key) {
            url = url + '/' + key;
        }
    }
    var request = createXMLHttpRequest();
    request.open("GET", url, true);
    
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            var json = decodeURI(request.responseText);
            if (request.status == 200) {
                // 受信完了時の処理
                callback && callback(null, json);
            } else {
                console.error('Error :' 
                        + ' httpStatus = ' + request.status
                        + ' response = ' + json
                );
                callback && callback(json, null);
            }
        }
    }
    
    request.send("");
}

function listData(host, port, dataName, key, callback) {

    var url = 'http://' + host + ':' + port + '/data';
    if (dataName) {
        url = url + '/' + dataName;
        
        if (key) {
            url = url + '/' + key;
        }
    }
    url = url + '?type=startWith';
    var request = createXMLHttpRequest();
    request.open("GET", url, true);
    
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            var json = decodeURI(request.responseText);
            if (request.status == 200) {
                // 受信完了時の処理
                callback && callback(null, json);
            } else {
                console.error('Error :' 
                        + ' httpStatus = ' + request.status
                        + ' response = ' + json
                );
                callback && callback(json, null);
            }
        }
    }
    
    request.send("");
}

function saveData(host, port, dataName, key, json, callback) {

    var url = 'http://' + host + ':' + port + '/data/' + dataName + '/' + key;
    var params = 'json=' + encodeURIComponent(json);
    var request = createXMLHttpRequest();
    request.open("POST", url, true);
    
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            var json = decodeURI(request.responseText);
            if (request.status == 200) {
                // 受信完了時の処理
                callback && callback(null, json);
            } else {
                console.error('Error :' 
                        + ' httpStatus = ' + request.status
                        + ' response = ' + json
                );
                callback && callback(json, null);
            }
        }
    }
    
    request.send(params);
}

function deleteData(host, port, dataName, key, callback) {

    var url = 'http://' + host + ':' + port + '/data/' + dataName + '/' + key;
    var request = createXMLHttpRequest();
    request.open('DELETE', url, true);
    
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            var json = decodeURI(request.responseText);
            if (request.status == 200) {
                // 受信完了時の処理
                callback && callback(null, json);
            } else {
                console.error('Error :' 
                        + ' httpStatus = ' + request.status
                        + ' response = ' + json
                );
                callback && callback(json, null);
            }
        }
    }
    
    request.send();
}