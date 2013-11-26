function clearColumn(targetId) {
    var table = document.getElementById(targetId);
    if (table.tagName !== 'TABLE') {
        alert('target is not table. id = ' + targetId);
    }
    
    for (var i = 1; i < table.rows.length; i++ ) {  
        table.deleteRow(i);
    }  
}

function addColumn(targetId, cell1Value, cell2Value) {
    var table = document.getElementById(targetId);
    if (table.tagName !== 'TABLE') {
        alert('target is not table. id = ' + targetId);
    }
    //console.log(arguments);
    
    var row = table.insertRow(-1);//-1 : 末尾に追加
    for (var i = 1; i < arguments.length; i++) {
        var cell = row.insertCell(-1);//-1 : 末尾に追加
        cell.appendChild(document.createTextNode(arguments[i]));
    }
}

function addMenu(targetId, text, link) {
    var list = document.getElementById(targetId);
    if (list.tagName !== 'UL') {
        alert('target is not UL. id = ' + targetId);
    }
    
    var newTxt = document.createTextNode(text);
    var newAnchor = document.createElement("a");
    newAnchor.appendChild(newTxt);
    newAnchor.setAttribute("href", link);
    var newLi = document.createElement("li");
    newLi.appendChild(newAnchor);
    list.appendChild(newLi);
}

function clearMenu(targetId) {
    var list = document.getElementById(targetId);
    if (list.tagName !== 'UL') {
        alert('target is not UL. id = ' + targetId);
    }
    
    var num = list.childNodes.length;
    for (var i = 0; i < num; i++) {
        list.removeChild(list.childNodes[0]);
    }
}

function deleteMonitorDiv(targetId, id) {
    var div = document.getElementById(targetId);
    if (div.tagName !== 'DIV') {
        alert('targetTable is not div. id = ' + targetId);
    }
    
    var target = document.getElementById(id);
    if (target) {
        div.removeChild(target);
    }
}

function addMonitorDiv(targetId, id) {
    var div = document.getElementById(targetId);
    if (div.tagName !== 'DIV') {
        alert('targetTable is not div. id = ' + targetId);
    }
    
    var target = document.getElementById(id);
    if (!target) {
        target = document.createElement("div");
        target.setAttribute("id", id);
        target.setAttribute("style", "display:none");
        var newTxt = document.createTextNode(id);
        var title = document.createElement("p");
        title.appendChild(newTxt);
        target.appendChild(title);
        div.appendChild(target);
    }
}

function addMonitorMessage(targetId, text, color) {
    var target = document.getElementById(targetId);
    if (!target) {
        console.error('target is not found. targetId = ' + targetId);
        return;
    }
    
    var newP = document.createElement("p");
    var newTxt = document.createTextNode(text);
    newP.appendChild(newTxt);
    newP.setAttribute("style", 'color:' + color);
    target.appendChild(newP);
}

function changeDisplay(targetId, visible) {
    var dis = 'block';
    if (!visible) {
        dis = 'none';
    }

    document.getElementById(targetId).style.display = dis;
}

function toggleDiv(parentId, targetId) {
    var children = document.getElementById(parentId).getElementsByTagName('div');
    for (var i = 0; i < children.length; i++) {
        var id = children[i].id;
        if (id) {
            if (id == targetId) {
                changeDisplay(id, true);
            } else {
                changeDisplay(id, false);
            }
        }
    }
}

function toLocaleString(time) {
    var date = new Date(time);
    return [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
        ].join( '/' ) + ' '
        + date.toLocaleTimeString();
}
