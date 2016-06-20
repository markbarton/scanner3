angular.module('scanner').service('settings', function($q){
    var settings = {};

    //Default Properties
    settings.serverendpoint='';
    settings.username='';
    settings.password='';
    settings.current_department='';
    settings.factory='';
    settings.log_enabled=true;
    settings.departments=[];
    settings.network_status=false; //Indicates if we have a good network connection - will be false initially

    settings.factories=['Birmingham','Sheffield','Redruth']
    //Get Settings from local storage
    //Has to be a promise due to using a Chrome API
    settings.getSettingsFromLocalVariables=function(key){
        var deferred = $q.defer();
        var self = this;
        chrome.storage.local.get(key, function(data) {
            if(data[key]){
                if(data[key].serverendpoint){
                    self.serverendpoint = data[key].serverendpoint;
                }
                if(data[key].username){
                    self.username = data[key].username;
                }
                  if(data[key].password){
                    self.password = data[key].password;
                }

                if(data[key].current_department){
                    self.current_department = data[key].current_department;
                }
                if(data[key].factory){
                    self.factory = data[key].factory;
                }else{
                    //Default Birmingham
                    self.factory='Birmingham'
                }
                if(data[key].departments){
                    self.departments = data[key].departments;
                }
                deferred.resolve(data[key]);
            }else{
                console.log('no settings')
                deferred.reject('No Settings');
            }

        });

        return deferred.promise;
    }


    settings.version=chrome.runtime.getManifest().version;

    settings.saveLocalStorage=function(){
        //if view is passed we are changing state
        var obj={}
        var deferred = $q.defer();
        obj.serverendpoint=this.serverendpoint;
        obj.username=this.username;
        obj.password=this.password;
        obj.departments=this.departments;
        obj.current_department=this.current_department;
        obj.factory=this.factory;
        chrome.storage.local.set({'scanner_settings': obj},function(){

            deferred.resolve();

        });
        return deferred.promise;
    }


    return settings;
});