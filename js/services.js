// js/services/todos.js
angular.module('demoServices', [])
        .factory('CommonData', function(){
        var data = "";
        return{
            getData : function(){
                return data;
            },
            setData : function(newData){
                data = newData;
            }
        }
    })
    .factory('Llamas', function($http, $window) {
        return {
            get : function() {
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl+'/api/llamas');
            }
        }
    })
    .factory('Users', function($http, $window) {
        var factory = {};
        var baseUrl = $window.sessionStorage.baseurl;
        factory.get=function() {
          return $http.get(baseUrl+'/api/users');
        }
        factory.delete=function(id){
          return $http.delete(baseUrl+'/api/users/'+id);
        }
        return factory;
    })
    .factory('Tasks', function($http, $window) {
        var factory = {};
        var baseUrl = $window.sessionStorage.baseurl;
        factory.get=function(count,sort,comp) {
          //console.log(sort);
          //console.log(comp);
          return $http.get(baseUrl+'/api/tasks?where={'+comp+'}&sort={'+sort+'}&skip='+count+'&limit='+(count+10));
        }
        factory.count=function(){
          return $http.get(baseUrl+'/api/tasks?count');
        }
        factory.delete=function(id){
          return $http.delete(baseUrl+'/api/tasks/'+id);
        }
        return factory;
    })
    .factory('Task',function($http,$window){
      var factory = {};
      var baseUrl = $window.sessionStorage.baseurl;
      factory.task;
      factory.edit = function(id,data){
        //console.log(data);
        return $http({
            method: 'PUT',
            url: baseUrl+'/api/tasks/'+id,
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
        //return $http.put(baseUrl+'/api/tasks/'+id,update);
      }
      factory.add = function(data){
        return $http({
            method: 'POST',
            url: baseUrl+'/api/tasks',
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
      }
      factory.get = function(id){
        return $http.get(baseUrl+'/api/tasks/'+id);
      }
      factory.getUserList = function(){
        return $http.get(baseUrl+'/api/users');
      }
      factory.getUser = function(id){
        return $http.get(baseUrl+'/api/users/'+id);
      }
      return factory;
    })
    .factory('User',function($http,$window){
      var factory = {};
      var baseUrl = $window.sessionStorage.baseurl;
      factory.user;
      factory.edit = function(id,data){
        return $http({
            method: 'PUT',
            url: baseUrl+'/api/users/'+id,
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
      }
      factory.add = function(data){
        return $http({
            method: 'POST',
            url: baseUrl+'/api/users',
            data: data,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        });
      }
      factory.get = function(id){
        return $http.get(baseUrl+'/api/users/'+id);
      }
      return factory;
    })
    ;
