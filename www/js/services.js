angular.module('starter.services', ['ngCookies'])

.factory('Auth', function($cookieStore) {
  var _user = $cookieStore.get('starter.user');
  var _userID = $cookieStore.get('starter.userID');
  var setUser = function(user, userID) {
    _user = user;
    _userID = userID;
    $cookieStore.put('starter.user', _user);
    $cookieStore.put('starter.userID', _userID);
    // for(var i in userID){
    //   alert(i+"---!----"+userID[i]);
    // }
    // alert("_user"+_user);
    // alert("_userID"+_userID);
  }
  
  return {
    setUser : setUser,
    isLoggedIn : function() {
      return _user ? true : false;
    },
    getUser : function() {
      // alert("getUser"+_user.username1);
      return _user;
    },
    getUserID : function() {
      // alert("getUserID"+_userID.userID);
      // for(var i in _userID){
      //   alert(i+"-------"+_userID[i]);
      // }
      return _userID;
    },
    logout : function() {
      $cookieStore.remove('starter.user');
      //!!!!!!!!!!!
      _user = null;
    }
  }
})

// .factory('Lessons', function() {
    
    // alert("!!!!");
    // Might use a resource here that returns a JSON array
    
    // var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/getLesson";
    // var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
    // req.send().then(function(resp){
    //   // alert("resp:" + resp.responseText);
    //   var lessons = JSON.parse(resp.responseText);
    //   alert("lesson1:" + lessons);
    // });
    
    // alert("我能出来吗1");
    
    // var lessons = [
    //     {
    //       "lessontable_name": "高等数学",
    //       "lessontable_key": "数学",
    //       "lessontable_description": "大学基础数学课程，提高逻辑思维和分析解决问题能力。",
    //       "id": "1"
    //     },
    //     {
    //       "lessontable_name": "大学生就业",
    //       "lessontable_key": "就业",
    //       "lessontable_description": "指导大学生就业与工作",
    //       "id": "2"
    //     },
    //     {
    //       "lessontable_name": "大学体育",
    //       "lessontable_key": "体育",
    //       "lessontable_description": "大学基础课程，进行体育锻炼，增强身体素质。",
    //       "id": "3"
    //     }
    // ];
    
    // alert("我能出来吗2");
    // alert("lesson2:" + lessons);

    // return {
      // all: function() {
      //   // alert("all:"+ lessons);
      //   return lessons;
        
      // },
      // remove: function(lesson) {
      //   // alert("我能出来吗-return-remove");
      //   lessons.splice(lessons.indexOf(lesson), 1);
      // },
      // get: function(lessonId) {
      //   // alert("我能出来吗-return-get");
      //   for (var i = 0; i < lessons.length; i++) {
      //     if ((lessons[i].id-1) === parseInt(lessonId)) {
      //       return lessons[i];
      //     }
      //   }
      //   return null;
      // }
    // };
  // });