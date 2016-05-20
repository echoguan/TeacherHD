// <reference path="plugins/cordova-plugin-mfp-push/typings/mfppush.d.ts"/>
var appCtrl = angular.module('starter.controllers', [])

  appCtrl.controller('LoginCtrl', function($scope, $state, Auth, $ionicPopup) {
    // alert("LoginCtrl执行");
    $scope.loginData = {};
    
    showAlert = function (title, message) {
      var alertPopup = $ionicPopup.alert({
        title : title,
        template : message
      });
    }
    
    $scope.doLogin = function() {
      // alert("aaa1122dd");
      if( !angular.isDefined($scope.loginData.username) || !angular.isDefined($scope.loginData.password) || $scope.loginData.username.trim() == "" || $scope.loginData.password.trim() == "") {
        showAlert("登录失败","用户名或密码不能为空！");
        return;
      } else {
        // alert("22进来了吗？？！！:");
        var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/loginConfirm/" + $scope.loginData.username + "/" + $scope.loginData.password;
        var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
        req.send().then(function(resp){
          if(resp.responseText == 'Success'){
            // alert("33进来了吗？？！！:");
            var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/getStudentID/" + $scope.loginData.username;
            var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
            req.send().then(function(resp){
              // alert("进来了吗？？！！:");
              $scope.studentID = resp.responseText;
              // alert("$scope.loginData.username:"+$scope.loginData.username);
              // alert("$scope.studentID:"+$scope.studentID);
              Auth.setUser(
                {
                  username1 : $scope.loginData.username
                },
                {
                  userID : $scope.studentID
                }
              );
              $state.go('tab.account', null, {
                reload: true
              });
            });

            
          } else if(resp.responseText == 'PasswordWrong'){
            showAlert("登录失败","密码错误！");
          } else if(resp.responseText == 'NameWrong'){
            showAlert("登录失败","用户名不存在！");
          }
        });
      }
    };
  })
  
  appCtrl.controller('RegisterCtrl', function($scope, $state, Auth, $ionicPopup) {
    // alert("RegisterCtrl执行");
    
    $scope.registerData = {};
    
    showAlert = function (title, message) {
      var alertPopup = $ionicPopup.alert({
        title : title,
        template : message
      });
    }
    
    $scope.register = function() {
      if(!angular.isDefined($scope.registerData.username) || !angular.isDefined($scope.registerData.password) || !angular.isDefined($scope.registerData.repeatPassword) 
          || $scope.registerData.username.trim() == "" || $scope.registerData.password.trim() == "" || $scope.registerData.repeatPassword.trim() == ""){
        showAlert("注册失败","不能有空项！");
        return;
      } else if($scope.registerData.password != $scope.registerData.repeatPassword) {
        showAlert("注册失败","两次密码不一致！");
      } else {
        var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/registerStudent/" + $scope.registerData.username + "/" + $scope.registerData.password;
        var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
        req.send().then(function(resp){
          alert("aaaaaaaaaaaaaaaaaaa"+resp);
        });
      }
    };
  })

  appCtrl.controller('LessonsCtrl', function($scope, MFPInit, Auth, $ionicPopup) {
    // alert("LessonsCtrl执行");
    
    $scope.$on('$ionicView.enter', function() {
      MFPInit.then(function() { WL.Analytics.log({ AppView: 'Lesson' }, "visit lesson view"); console.log("lesson view enter") });
    });
    
    showAlert = function (title, message) {
      var alertPopup = $ionicPopup.alert({
        title : title,
        template : message
      });
    }
    
    var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/getAllLesson";
    var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
    req.send().then(function(resp){
      $scope.lessons = JSON.parse(resp.responseText);
      // alert("1req-lesson:" + $scope.lessons);
    });
    
    
    $scope.addFavorite = function(lesson) {
      $scope.userID = Auth.getUserID().userID;
      // alert("我要订阅它！！"+$scope.userID+"--"+lesson.id);
      //http://localhost:9080/mfp/api/adapters/JavaSQL/API/isCollect/1/1
      var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/isCollect/"+ lesson.id +"/"+ $scope.userID;
      var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
      req.send().then(function(resp){
        // alert("resp.responseText:" + resp.responseText);
        if(resp.responseText>0) {
          // alert("您已订阅过该课程");
          showAlert("提示","您已订阅过该课程，可直接在个人主页已订阅课程中查看该课程。");
        } else {
          // alert("您可以订阅该课程啦");
          //http://localhost:9080/mfp/api/adapters/JavaSQL/API/collectLesson/2/4
          var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/collectLesson/"+ lesson.id +"/"+ $scope.userID;
          var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
          req.send().then(function(resp){
            // alert("111resp.status:" + resp.status);
            if(resp.status == 200){
              showAlert("订阅成功","订阅成功，您现在可直接在个人主页已订阅课程中查看该课程。");
            } else {
              showAlert("订阅失败","订阅失败，请重试");
              // alert("订阅失败，请重试");
            }
          });
        }
      });
      
    };

    // $scope.lessons = Lessons.all();
    // alert("2ctrl-lesson:"+$scope.lesson);
    // $scope.remove = function(lesson) {
    //   Lessons.remove(lesson);
    // };
  })

  appCtrl.controller('LessonDetailCtrl', function($scope, $stateParams, MFPInit) {
    // alert("1-LessonDetailCtrl执行");
    $scope.$on('$ionicView.enter', function() {
      MFPInit.then(function() { WL.Analytics.log({ AppView: 'Lesson Details' }, "visit Lesson Details view"); console.log("lesson details view enter") });
    });
    
      
    var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/getAllLesson";
    var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
    req.send().then(function(resp){
      $scope.lessons = JSON.parse(resp.responseText);
      for (var i = 0; i < $scope.lessons.length; i++) {
        // alert("7你进到循环里了吗？"+$scope.lessons.length);
        if (($scope.lessons[i].id-1) === parseInt($stateParams.lessonId-1)) {
          // alert("你进到if里了吗？");
          // alert("lessons[i]:"+$scope.lessons[i]);
          $scope.lesson = $scope.lessons[i];
        }
      }
    });
  })

  appCtrl.controller('AccountCtrl', function($scope, MFPInit, $state, Auth) {
    // alert("AccountCtrl执行");
    $scope.username = Auth.getUser().username1;
    $scope.userID = Auth.getUserID().userID;
    $scope.$on('$ionicView.enter', function() {
      MFPInit.then(function() { WL.Analytics.log({ AppView: 'Account' }, "visit Account view"); console.log("account view enter") });
    });
    $scope.settings = {
      enableFriends: true
    };
    
    $scope.logout = function() {
      Auth.logout();
      $state.go('login');
    };
    
    // //http://localhost:9080/mfp/api/adapters/JavaSQL/API/getMyCollectLesson/4
    // var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/getMyCollectLesson/"+$scope.userID;
    // var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
    // req.send().then(function(resp){
    //   $scope.myLessons = JSON.parse(resp.responseText);
    //   // alert("1req-lesson:" + $scope.lessons);
    // });
  });
  
  appCtrl.controller('MyLessonsCtrl', function($scope, MFPInit, Auth, $ionicPopup) {
    // alert("MyLessonsCtrl执行");
    $scope.$on('$ionicView.enter', function() {
      MFPInit.then(function() { WL.Analytics.log({ AppView: 'My Lessons' }, "visit My Lessons view"); console.log("my lessons view enter") });
    });
    
    $scope.userID = Auth.getUserID().userID;
    
    //http://localhost:9080/mfp/api/adapters/JavaSQL/API/getMyCollectLesson/4
    var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/getMyCollectLesson/"+$scope.userID;
    var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
    req.send().then(function(resp){
      $scope.myLessons = JSON.parse(resp.responseText);
      // alert("1req-lesson:" + $scope.lessons);
    });
    
    
    showAlert = function (title, message) {
      var alertPopup = $ionicPopup.alert({
        title : title,
        template : message
      });
    }
    
    //http://localhost:9080/mfp/api/adapters/JavaSQL/API/deleteCollect/2/4
    $scope.removeCollect = function(lesson) {
      // alert("取消订阅");
      $scope.userID = Auth.getUserID().userID;
      // alert("我要取消订阅它！！"+$scope.userID+"--"+lesson.id);
      var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/deleteCollect/"+ lesson.id +"/"+ $scope.userID;
      var req = new WLResourceRequest(adapterURL, WLResourceRequest.DELETE);
      req.send().then(function(resp){
        // alert("111resp.status:" + resp.status);
        if(resp.status == 200){
          showAlert("成功","取消订阅该课程成功。");
          var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/getMyCollectLesson/"+$scope.userID;
          var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
          req.send().then(function(resp){
            $scope.myLessons = JSON.parse(resp.responseText);
          });
        } else {
          showAlert("失败","取消订阅失败，请重试");
        }
      });
    }
  });
  
  
  appCtrl.controller('NoticeCtrl', function($scope, $stateParams, MFPInit) {
    alert("NoticeCtrl执行");
  });
    
  appCtrl.controller('MyCommentsCtrl', function($scope, $stateParams, MFPInit) {
    // alert("MyCommentsCtrl执行");
  });
  
  appCtrl.controller('myCollectLessonDetailCtrl', function($scope, $stateParams, MFPInit, Auth) {
    // alert("myCollectLessonDetailCtrl执行");
    $scope.$on('$ionicView.enter', function() {
      MFPInit.then(function() { WL.Analytics.log({ AppView: 'Lesson Details' }, "visit Lesson Details view"); console.log("lesson details view enter") });
    });
    
    $scope.userID = Auth.getUserID().userID;  
    var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/getMyCollectLesson/"+$scope.userID;
    var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
    req.send().then(function(resp){
      $scope.myLessons = JSON.parse(resp.responseText);
      for (var i = 0; i < $scope.myLessons.length; i++) {
        if (($scope.myLessons[i].id-1) === parseInt($stateParams.lessonId-1)) {
          $scope.lesson = $scope.myLessons[i];
        }
      }
    });
    
  });

  