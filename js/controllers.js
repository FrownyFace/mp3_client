var demoControllers = angular.module('demoControllers', ['ngCookies']);

demoControllers.controller('FirstController', ['$scope', 'CommonData'  , function($scope, CommonData) {
  $scope.data = "";
   $scope.displayText = ""

  $scope.setData = function(){
    CommonData.setData($scope.data);
    $scope.displayText = "Data set"

  };

}]);

demoControllers.controller('SecondController', ['$scope', 'CommonData' , function($scope, CommonData) {
  $scope.data = "";

  $scope.getData = function(){
    $scope.data = CommonData.getData();

  };

}]);
demoControllers.controller('LlamaListController', ['$scope', '$http', 'Llamas', '$window' , function($scope, $http,  Llamas, $window) {
  Llamas.get().success(function(data){
    $scope.llamas = data;
  });
}]);

demoControllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;
  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url;
    $scope.displayText = "URL set";
  };
}]);
demoControllers.controller('UserListController', ['$scope', '$http', 'Users','User','Task', '$window' ,'$location', function($scope, $http,  Users,User,Task, $window,$location) {
  Users.get().success(function(data){
    $scope.users = data.data;
  });
  $scope.delete = function(user){
    Users.delete(user._id).success(function(data){
      var thing = user.pendingTasks;
      for(var i=0;i<thing.length;i++){
        var uns = 'assignedUser=&assignedUserName=unassigned';
        Task.edit(thing[i],uns).success(function(data){
          //
        });
      }
      Users.get().success(function(data){
        $scope.users = data.data;
      });
    })
  }
  $scope.detail = function(user){
    User.user = user;
    $location.path("/userdetail");
  }
  $scope.addUser = function(){
    console.log("ADDUSER");
    $location.path("/useradd");
  }
}]);
demoControllers.controller('TaskListController', ['$scope', '$http', 'Tasks', 'Task', '$window' ,'$location', function($scope, $http,  Tasks, Task, $window,$location) {
  $scope.count = 0;

  $scope.select = ['Name','Assigned User','Date Created','Deadline'];
  $scope.sort = 'Name';
  $scope.sortf = '';
  $scope.comp =''
  $scope.ascc = 1;
  $scope.revs = 0;
  $scope.$watch('[count,sort,revs,ascc]',function(){

    //console.log("CHANGE");
    //All-Completed-Pending
    if($scope.revs==1) $scope.comp = '"completed":"true"';
    else if($scope.revs==2) $scope.comp = '"completed":"false"';
    else $scope.comp='';
    //Next-Previoous
    Tasks.count().success(function(data){
      $scope.total = data.data;
      $scope.countf = ($scope.count+10)/10;
      $scope.totalf = $scope.total/10;
    });
    if($scope.count<=0){
      $scope.count = 0;
      $scope.p=1;
    }else{
      $scope.p=0;
    }
    if($scope.count >= $scope.total-10){
      $scope.count = $scope.total-10;
      $scope.n=1;
    }else{
      $scope.n=0;
    }
    //Sorting
    //console.log($scope.sort);
    switch($scope.sort){
      case 'Name': $scope.sortf = '"name":'+$scope.ascc;break
      case 'Assigned User': $scope.sortf = '"assignedUserName":'+$scope.ascc;break;
      case 'Date Created': $scope.sortf = '"dateCreated":'+$scope.ascc;break;
      case 'Deadline': $scope.sortf = '"deadline":'+$scope.ascc;break;
      default: $scope.sortf = '';
    }
    //Finish
    Tasks.get($scope.count,$scope.sortf,$scope.comp).success(function(data){
      $scope.tasks = data.data;
    });
  });
  $scope.delete = function(task){
    Tasks.delete(task._id).success(function(data){
      Tasks.get($scope.count,$scope.sortf,$scope.comp).success(function(data){
        $scope.tasks = data.data;
      });
    })
  }
  $scope.detail = function(task){
    Task.task = task;
    $location.path("/taskdetail");
  }
  $scope.addTask = function(){
    $location.path("/taskadd");
  }
  /*Tasks.get($scope.count,$scope.sort).success(function(data){
    $scope.tasks = data.data;
  });*/
}]);
demoControllers.controller('TaskDetailController', ['$scope', '$http', 'Task', '$window' ,'$location','$cookies', function($scope, $http, Task, $window,$location,$cookies) {
  //$cookies.put('task','hihihi');
  //console.log($cookies.get('task'));
  //console.log($window.sessionStorage.task);
  if(Task.task)
    $window.sessionStorage.task=JSON.stringify(Task.task);
  else
    Task.task = JSON.parse($window.sessionStorage.task);
  $scope.task = Task.task;
  $scope.message = Task.message;
  $scope.edit = function(){
    $location.path("/taskedit");
  }
  $scope.$on("$destroy",function(){
    Task.message = '';
  });
}]);
demoControllers.controller('TaskEditController', ['$scope', '$http', 'Task','User', '$window' ,'$location', function($scope, $http, Task,User, $window,$location) {
  var task = Task.task;
  $scope.name = task.name;
  $scope.desc = task.description;
  $scope.dead = task.deadline;
  Task.getUserList().success(function(data){
    $scope.userlist = data.data;
  })
  Task.getUser(task.assignedUser).success(function(data){
    $scope.user = data.data;
    $scope.olduser = data.data;
    //console.log($scope.user);
  })
  $scope.btn = task.completed;

  $scope.edit = function(){
    //var str = '{"name":"'+$scope.name+'","description":"'+$scope.desc+'","deadline":"'+$scope.dead+'","assignedUser":"'+$scope.user+'","completed":"'+$scope.btn+'"}';
    //console.log(str);
    //str = JSON.parse(str);
    var obj;
    var id,username,pend,str;
    obj = $scope.olduser;
    id = obj._id;
    pend = obj.pendingTasks;
    pend.splice(pend.indexOf(task._id),1);
    str = 'pendingTasks='+pend;
    User.edit(id,str).success(function(data){
      console.log(data.data);
    })
    if($scope.user==null){
      id = '';
      username = 'unassigned'
    }else{
      obj = JSON.parse($scope.user);
      id = obj._id;
      username = obj.name;
      str = '';
      pend = obj.pendingTasks;
      pend.splice(0,0,task._id);
      for (var i = 0; i < pend.length; i++) {
        str = str+'pendingTasks[]='+pend[i];
        if (i != pend.length-1) str = str+'&'
      }
      //console.log(str);
      User.edit(id,str).success(function(data){
        console.log(data.data);
      })
    }

    //var id = $scope.user._id;
    //console.log(id);
    str = 'name='+$scope.name+'&description='+$scope.desc+'&deadline='+$scope.dead+'&assignedUser='+id+'&assignedUserName='+username+'&completed='+$scope.btn;
    //console.log(str);
    Task.edit(task._id,str).success(function(data){
      //console.log(data);
      Task.message = data.message;
      Task.task = data.data;
      $location.path("/taskdetail");
    });
  }
}]);
demoControllers.controller('UserDetailController', ['$scope', '$http', 'User','Tasks','Task', '$window' ,'$location','$route', function($scope, $http, User,Tasks,Task, $window,$location,$route) {
  if(User.user)
    $window.sessionStorage.user=JSON.stringify(User.user);
  else
    User.user = JSON.parse($window.sessionStorage.user);
  $scope.user = User.user;
  $scope.message = User.message;
  var user = User.user;
  $scope.pend = [];
  $scope.comp = [];

  User.get(user._id).success(function(data){
    for(var i=0;i<data.data.pendingTasks.length;i++){
      Task.get(data.data.pendingTasks[i]).success(function(data2){
        if(data2.data.completed) $scope.comp.push(data2.data);
        else $scope.pend.push(data2.data);
      })
    }
  });
  $scope.complete = function(task){
    //console.log(task);
    var arr = 'completed=true';
    Task.edit(task._id,arr).success(function(data){
      $scope.message = data.message;
      $route.reload();
    })
  }
  $scope.toggle = function(){
    $scope.show = !$scope.show;
  }
  $scope.$on("$destroy",function(){
    User.message = '';
  });
}]);
demoControllers.controller('UserAddController', ['$scope', '$http','User', '$window' ,'$location', function($scope, $http, User, $window,$location) {
  $scope.name='name';
  $scope.email='email';
  $scope.add = function(){
    var str = 'name='+$scope.name+'&email='+$scope.email;
    User.add(str).success(function(data){
      User.message = data.message;
      User.user = data.data;
      $location.path("/userdetail");
    })
  }
}]);
demoControllers.controller('TaskAddController', ['$scope', '$http', 'Task','User', '$window' ,'$location', function($scope, $http, Task,User, $window,$location) {
  $scope.name='name';
  $scope.desc='description';
  $scope.dead;
  $scope.user;
  $scope.comp;
  Task.getUserList().success(function(data){
    $scope.userlist = data.data;
  })
  $scope.add = function(){
    var obj;
    var id,username,str,pend;
    if($scope.user==null){
      id = '';
      username = 'unassigned';
    }else{
      obj = JSON.parse($scope.user);
      id = obj._id;
      username = obj.name;
    }
    str = 'name='+$scope.name+'&description='+$scope.desc+'&deadline='+$scope.dead+'&assignedUser='+id+'&assignedUserName='+username+'&completed='+$scope.btn;
    Task.add(str).success(function(data){
      str = '';
      pend = obj.pendingTasks;
      pend.splice(0,0,data.data._id);
      for (var i = 0; i < pend.length; i++) {
        str = str+'pendingTasks[]='+pend[i];
        if (i != pend.length-1) str = str+'&'
      }
      User.edit(id,str).success(function(data){
        //console.log(data.data);
      })
      Task.message = data.message;
      Task.task = data.data;
      $location.path("/taskdetail");
    });
  }
}]);
