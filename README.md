node-mocker
===========

# How to Install
```
npm install -g http://ghe.amb.ca.local/furuya-kaoru/node-mocker/tarball/master
```

# How to Use
```sh
node node-mocker
```
# Admin Page
you can use to manage the following functions.
 - data management
 - WebSocket monitoring

## default port
8080

## url
http://localhost:8080/

# HTTP Interface
## default port
18080

## save data
POST http://localhost:18080/data/{dataName}/{key}?json={ \"name\" : \"value\"}

## get data
GET http://localhost:18080/data/{dataName}/{key}

## list data
GET http://localhost:18080/data/{dataName}/{key}?startWith=true

## delete data
DELETE http://localhost:18080/data/{dataName}/{key}

# WebSocket Interface
## defult port
28080

## connect
you should connect before send message.
```js
this.conn = new WebSocket('ws://' + host + ':' + port, []);
this.conn.onopen = function() {
    this.conn.onmessage = function (e) {
      console.log('WebSocket message: ' + e.data);
    };
};
```

## save data
```json
{ 
  "header" : {
    "func" : "data_save",
    "resFunc" : "res_data_save",
    "dataName" : "testdata",
    "key" : "1"
  },
  "json" : "{ \"message\" : \"save test data.\" }"
}
```

## get data
```json
{ 
  "header" : {
    "func" : "data_get",
    "resFunc" : "res_data_get",
    "dataName" : "testdata",
    "key" : "1"
  }
}
```

## list data
```json
{ 
  "header" : {
    "func" : "data_list",
    "resFunc" : "res_data_list",
    "dataName" : "testdata",
    "key" : "1"
  }
}
```

## delete data
```json
{ 
  "header" : {
    "func" : "data_delete",
    "resFunc" : "res_data_delete",
    "dataName" : "testdata",
    "key" : "1"
  }
}
```

## join to room
```json
{ 
  "header" : {
    "func" : "join",
    "userId" : "1",
    "roomId" : "1"
  }
}
```

## leave on room
```json
{ 
  "header" : {
    "func" : "leave",
    "userId" : "1",
    "roomId" : "1"
  }
}
```

## unicast
```json
{ 
  "header" : {
    "func" : "unicast",
    "userId" : "1"
  },
  "json" : "{ \"message\" : \"message for 1\" }"
}
```

## broadcast for room
```json
{ 
  "header" : {
    "func" : "broadcast",
    "roomId" : "1"
  },
  "json" : "{ \"message\" : \"message for room\" }"
}
```

## broadcast for all
```json
{ 
  "header" : {
    "func" : "broadcast"
  },
  "json" : "{ \"message\" : \"message for all\" }"
}
```
