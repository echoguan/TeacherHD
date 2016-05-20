// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

app.run(function($ionicPlatform, MFPInit) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    MFPInit.then(function(){WL.Logger.ctx({pkg: 'io.ionic'}).debug('mfp and ionic are ready, safe to use WL.* APIs');});
  });
})

app.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    onEnter : function($state, Auth) {
      if(!Auth.isLoggedIn()) {
        $state.go('login');
      }
    }
  })
  
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl',
    cache: false
  })
  .state('register', {
    url: '/register',
    cache: false, 
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  })

  .state('tab.lessons', {
      url: '/lessons',
      cache: false, 
      views: {
        'tab-lessons': {
          templateUrl: 'templates/tab-lessons.html',
          controller: 'LessonsCtrl'
        }
      }
    })
    .state('tab.lesson-detail', {
      url: '/lessons/detail/:lessonId',
      cache: false, 
      views: {
        'tab-lessons': {
          templateUrl: 'templates/lesson-detail.html',
          controller: 'LessonDetailCtrl'
        }
      }
    })
    .state('tab.lesson-notice', {
      url: '/lessons/notice/:lessonId',
      cache: false, 
      views: {
        'tab-lessons': {
          templateUrl: 'templates/lesson-notice.html',
          controller: 'NoticeCtrl'
        }
      }
    })
    
    .state('tab.lesson-comment', {
      url: '/lessons/comment/:lessonId',
      cache: false, 
      views: {
        'tab-lessons': {
          templateUrl: 'templates/lesson-comment.html',
          controller: 'LessonCommentCtrl'
        }
      }
    })
    
    .state('tab.lesson-comment-detail', {
      url: '/lessons/commentDetail/:questionId',
      cache: false, 
      views: {
        'tab-lessons': {
          templateUrl: 'templates/lesson-comment-detail.html',
          controller: 'LessonCommentDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    cache: false, 
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })
   .state('tab.my-lessons', {
      url: '/account/myLessons',
      cache: false, 
      views: {
        'tab-account': {
          templateUrl: 'templates/my-lessons.html',
          controller: 'MyLessonsCtrl'
        }
      }
    })
    
    .state('tab.my-comments', {
      url: '/account/myComments',
      cache: false, 
      views: {
        'tab-account': {
          templateUrl: 'templates/my-comments.html',
          controller: 'MyCommentsCtrl'
        }
      }
    })
    
    
      .state('tab.myCollectLesson-detail', {
        url: '/account/detail/:lessonId',
        cache: false, 
        views: {
          'tab-account': {
            templateUrl: 'templates/myCollectLesson-detail.html',
            controller: 'myCollectLessonDetailCtrl'
          }
        }
      })
      
      .state('tab.collectLesson-notice', {
        url: '/account/notice/:lessonId',
        cache: false, 
        views: {
          'tab-account': {
            templateUrl: 'templates/lesson-notice.html',
            controller: 'NoticeCtrl'
          }
        }
      })
      
      .state('tab.collectLesson-comment', {
        url: '/account/comment/:lessonId',
        cache: false, 
        views: {
          'tab-account': {
            templateUrl: 'templates/collectLesson-comment.html',
            controller: 'LessonCommentCtrl'
          }
        }
      })
      
      .state('tab.collectLesson-comment-detail', {
      url: '/account/commentDetail/:questionId',
      cache: false, 
      views: {
        'tab-account': {
          templateUrl: 'templates/lesson-comment-detail.html',
          controller: 'LessonCommentDetailCtrl'
        }
      }
    })
      

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

}).factory('MFPInit', function($q){
  /* Setup a Promise to allow code to run in other places anytime after MFP CLient SDK is ready
     Example: MFPClientPromise.then(function(){alert('mfp is ready, go ahead and use WL.* APIs')});
  */
  return window.MFPClientDefer.promise;
});

window.Messages = {
  // Add here your messages for the default language.
  // Generate a similar file with a language suffix containing the translated messages.
  // key1 : message1,
};

window.wlInitOptions = {
  // Options to initialize with the WL.Client object.
  // For initialization options please refer to IBM MobileFirst Platform Foundation Knowledge Center.
};

window.MFPClientDefer = angular.injector(['ng']).get('$q').defer();;
window.wlCommonInit = window.MFPClientDefer.resolve;
window.MFPClientDefer.promise.then(function wlCommonInit(){
  // Common initialization code goes here or use the angular service MFPClientPromise
  
  console.log('MobileFirst Client SDK Initilized');
  mfpMagicPreviewSetup();
 });
 
function notificationReceived(message) {
    obj = JSON.parse(message.payload);
    alert("Push received",message.payload);
    /*
    alert("Alert: " + message.alert +
            "\nID: " + obj.nid +
            "\nPayload: " + message.payload );
            */
}; 

function mfpMagicPreviewSetup(){
  var platform;
  //nothing to see here :-), just some magic to make ionic work with mfp preview, similar to ionic serve --lab
  if(WL.StaticAppProps.ENVIRONMENT === 'preview'){
    //running mfp preview (MBS or browser)
    platform = WL.StaticAppProps.PREVIEW_ENVIRONMENT === 'android' ? 'android' : 'ios';
    if(location.href.indexOf('?ionicplatform='+platform) < 0){
      location.replace(location.pathname+'?ionicplatform='+platform);
    }
  } 
}