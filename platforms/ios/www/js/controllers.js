// <reference path="plugins/cordova-plugin-mfp-push/typings/mfppush.d.ts"/>
var appCtrl = angular.module('starter.controllers', [])
  
  //登录界面控制器
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
        var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/teacherLoginConfirm/" + $scope.loginData.username + "/" + $scope.loginData.password;
        adapterURL = encodeURI(encodeURI(adapterURL));
        var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
        req.send().then(function(resp){
          if(resp.responseText == 'Success'){
            // alert("33进来了吗？？！！:");
            var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/getTeacherID/" + $scope.loginData.username;
            adapterURL = encodeURI(encodeURI(adapterURL));
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
  
  
  //注册界面控制器
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
        var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/isTeacherName/"+ $scope.registerData.username;
        adapterURL = encodeURI(encodeURI(adapterURL));
        var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
        req.send().then(function(resp){
          // alert("resp.responseText:" + resp.responseText);
          if(resp.responseText>0) {
            showAlert("注册失败","该用户名已存在，请重新填写");
          } else {
            var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/registerTeacher/" + $scope.registerData.username + "/" + $scope.registerData.password;
            adapterURL = encodeURI(encodeURI(adapterURL));
            var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
            req.send().then(function(resp){
              if(resp.status == 200){
                showAlert("注册成功","注册成功，您现在可以使用本账号登录了");
                $state.go('login');
              } else {
                showAlert("注册失败","注册失败，请重试");
              }
            });
          }
        });
      }
    };
  })

  //课程列表界面控制器
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


  //课程详细页控制器
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


  //个人主页控制器
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
  
  
  //已订阅课程控制器
  appCtrl.controller('MyLessonsCtrl', function($scope, MFPInit, Auth, $ionicPopup) {
    // alert("MyLessonsCtrl执行");
    $scope.$on('$ionicView.enter', function() {
      MFPInit.then(function() { WL.Analytics.log({ AppView: 'My Lessons' }, "visit My Lessons view"); console.log("my lessons view enter") });
    });
    
    showAlert = function (title, message) {
      var alertPopup = $ionicPopup.alert({
        title : title,
        template : message
      });
    }
    
    $scope.userID = Auth.getUserID().userID;
    
    $scope.removeLesson = function(lesson) {
      // alert("删除课程");
      $scope.userID = Auth.getUserID().userID;
      // alert("我要取消订阅它！！"+$scope.userID+"--"+lesson.id);
      var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/deleteLesson/"+ lesson.id;
      var req = new WLResourceRequest(adapterURL, WLResourceRequest.DELETE);
      req.send().then(function(resp){
        // alert("111resp.status:" + resp.status);
        if(resp.status == 200){
          showAlert("成功","删除该课程成功。");
          var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/getTeacherLesson/"+$scope.userID;
          var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
          req.send().then(function(resp){
            $scope.myLessons = JSON.parse(resp.responseText);
            // alert("1req-lesson:" + $scope.lessons);
          });
        } else {
          showAlert("失败","删除课程失败，请重试");
        }
      });
    }
    
    //http://localhost:9080/mfp/api/adapters/JavaSQL/API/getMyCollectLesson/4
    var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/getTeacherLesson/"+$scope.userID;
    var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
    req.send().then(function(resp){
      $scope.myLessons = JSON.parse(resp.responseText);
      // alert("1req-lesson:" + $scope.lessons);
    });
  });
  
  //课程-订阅-公告区控制器
  appCtrl.controller('NoticeCtrl', function($scope, $stateParams, MFPInit, Auth, $ionicPopup) {
    // alert("NoticeCtrl执行");

    // alert("parseInt($stateParams.lessonId):" + parseInt($stateParams.lessonId));
    
    showAlert = function (title, message) {
      var alertPopup = $ionicPopup.alert({
        title : title,
        template : message
      });
    }

    $scope.noticeData = {};
    $scope.userID = Auth.getUserID().userID;
    
    $scope.addNotice = function(){
      // alert("111111111" + $scope.questionData.comment);
      // alert("提问：" + $scope.questionData.title +"-"+ $scope.questionData.description +"-"+ $scope.userID +"-"+ parseInt($stateParams.lessonId));
      
      //http://localhost:9080/mfp/api/adapters/JavaSQL/API/addQuestion/
      if( !angular.isDefined($scope.noticeData.notice) || $scope.noticeData.notice.trim() == "") {
        showAlert("失败","公告内容不能为空！");
        return;
      } else {
        // alert("加评论吧");
        var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/addNotice/"+ parseInt($stateParams.lessonId) +"/"+ $scope.userID +"/"+ $scope.noticeData.notice;
        adapterURL = encodeURI(encodeURI(adapterURL));
        var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
        // alert("adapterURL" + adapterURL);
        req.send().then(function(resp){
            // alert("111resp.status:" + resp.status);
            if(resp.status == 200){
              showAlert("成功","公告发布成功！");
              $scope.noticeData.notice = null;
              var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/getLessonNotice/"+parseInt($stateParams.lessonId);
              var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
              req.send().then(function(resp){
                $scope.notices = JSON.parse(resp.responseText);
                // alert("1req-lesson:" + $scope.lessons);
              });
            } else {
              showAlert("失败","公告发布失败，请重试！");
            }
        });
      }
    }
    
    //http://localhost:9080/mfp/api/adapters/JavaSQL/API/getLessonNotice/1
    var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/getLessonNotice/"+parseInt($stateParams.lessonId);
    var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
    req.send().then(function(resp){
      $scope.notices = JSON.parse(resp.responseText);
      // alert("1req-lesson:" + $scope.lessons);
    });
  });
  
  //课程-订阅-提问区控制器
  appCtrl.controller('LessonCommentCtrl', function($scope, $stateParams, MFPInit) {
    // alert("LessonCommentCtrl执行");
    
    // http://localhost:9080/mfp/api/adapters/JavaSQL/API/getLessonQuestion/1
    var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/getLessonQuestion/"+parseInt($stateParams.lessonId);
    var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
    req.send().then(function(resp){
      $scope.questions = JSON.parse(resp.responseText);
      // alert("1req-lesson:" + $scope.lessons);
    });
  });
  
  //课程-订阅-提问详情控制器
  appCtrl.controller('LessonCommentDetailCtrl', function($scope, $stateParams, MFPInit, Auth, $ionicPopup) {
    // alert("LessonCommentDetailCtrl执行");

    // alert("parseInt($stateParams.questionId):" + parseInt($stateParams.questionId));
    
    showAlert = function (title, message) {
      var alertPopup = $ionicPopup.alert({
        title : title,
        template : message
      });
    }

    $scope.questionData = {};
    $scope.userID = Auth.getUserID().userID;
    
    $scope.addComment = function(){
      // alert("111111111" + $scope.questionData.comment);
      // alert("提问：" + $scope.questionData.title +"-"+ $scope.questionData.description +"-"+ $scope.userID +"-"+ parseInt($stateParams.lessonId));
      
      //http://localhost:9080/mfp/api/adapters/JavaSQL/API/addQuestion/
      if( !angular.isDefined($scope.questionData.comment) || $scope.questionData.comment.trim() == "") {
        showAlert("失败","评论内容不能为空！");
        return;
      } else {
        // alert("加评论吧");
        var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/addComment/"+ parseInt($stateParams.questionId) +"/"+ $scope.userID +"/"+ $scope.questionData.comment;
        adapterURL = encodeURI(encodeURI(adapterURL));
        var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
        // alert("adapterURL" + adapterURL);
        req.send().then(function(resp){
            // alert("111resp.status:" + resp.status);
            if(resp.status == 200){
              showAlert("成功","您已评论成功！");
              $scope.questionData.comment = null;
              var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/getQuestionComment/"+parseInt($stateParams.questionId);
              var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
              req.send().then(function(resp){
                $scope.comments = JSON.parse(resp.responseText);
                // alert("resp.responseText:" + resp.responseText);
              });
            } else {
              showAlert("失败","评论失败，请重试！");
            }
        });
      }
    }
    
    //http://localhost:9080/mfp/api/adapters/JavaSQL/API/getOneQuestion/1
    var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/getOneQuestion/"+parseInt($stateParams.questionId);
    var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
    req.send().then(function(resp){
      $scope.question = JSON.parse(resp.responseText);
      // alert("resp.responseText:" + resp.responseText);
    });
    
    //http://localhost:9080/mfp/api/adapters/JavaSQL/API/getOneQuestion/1
    var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/getQuestionComment/"+parseInt($stateParams.questionId);
    var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
    req.send().then(function(resp){
      $scope.comments = JSON.parse(resp.responseText);
      // alert("resp.responseText:" + resp.responseText);
    });
  });
  
  //我的提问控制器
  appCtrl.controller('AddLessonCtrl', function($scope, $stateParams, MFPInit, Auth, $ionicPopup,$state) {
    // alert("AddLessonCtrl执行");
    
    showAlert = function (title, message) {
      var alertPopup = $ionicPopup.alert({
        title : title,
        template : message
      });
    }

    $scope.lessonData = {};
    $scope.userID = Auth.getUserID().userID;
    
    $scope.addLesson = function(){
      // alert("添加课程");
      
      // alert("参数：" + $scope.lessonData.title +"-"+ $scope.lessonData.description +"-"+ $scope.lessonData.key +"-"+ $scope.userID);
      
      if( !angular.isDefined($scope.lessonData.title) || !angular.isDefined($scope.lessonData.description) || $scope.lessonData.title.trim() == "" || $scope.lessonData.description.trim() == "" || !angular.isDefined($scope.lessonData.key) || $scope.lessonData.key.trim() == "") {
        showAlert("提醒","不能有空项！");
        return;
      } else {
        var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/isLessonName/"+ $scope.lessonData.title;
        adapterURL = encodeURI(encodeURI(adapterURL));
        var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
        req.send().then(function(resp){
          // alert("resp.responseText:" + resp.responseText);
          if(resp.responseText>0) {
            showAlert("注册失败","该用户名已存在，请重新填写");
          } else {
            var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/addLesson/"+ $scope.lessonData.title +"/"+ $scope.lessonData.description +"/"+ $scope.lessonData.key +"/"+ $scope.userID;
            adapterURL = encodeURI(encodeURI(adapterURL));
            var req = new WLResourceRequest(adapterURL, WLResourceRequest.GET);
            // alert("adapterURL" + adapterURL);
            req.send().then(function(resp){
                // alert("111resp.status:" + resp.status);
                if(resp.status == 200){
                  showAlert("成功","课程已经发布成功！");
                  $scope.lessonData.title = null;
                  $scope.lessonData.description = null;
                  $scope.lessonData.key = null;
                  $state.go('tab.account', null, {
                    reload: true
                  });
                } else {
                  showAlert("失败","课程发布失败，请重试！");
                }
            }); 
          }
          
        }); 
        
      }
    }
    
  });
  
  
  //订阅-课程详细页控制器
  appCtrl.controller('myCollectLessonDetailCtrl', function($scope, $stateParams, MFPInit, Auth) {
    // alert("myCollectLessonDetailCtrl执行");
    $scope.$on('$ionicView.enter', function() {
      MFPInit.then(function() { WL.Analytics.log({ AppView: 'Lesson Details' }, "visit Lesson Details view"); console.log("lesson details view enter") });
    });
    
    $scope.userID = Auth.getUserID().userID;  
    var adapterURL = "http://localhost:9080/mfp/api/adapters/JavaSQL/API/getTeacherLesson/"+$scope.userID;
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

  