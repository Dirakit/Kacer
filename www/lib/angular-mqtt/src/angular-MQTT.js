/**
 * Created by shellus on 2016-03-16.
 */
angular.module('ngMQTT', [])
    .config(['$provide', function($provide){
        $provide.provider('MQTT', function(){

            var settings = {
                href: "",
                opts: {
                  auth: "",
                  clientId: ""
                }
            };

            this.setHref = function(href){
                settings.href = href;
            };
            this.setAuth = function(auth){
                settings.opts.auth = auth;
            };
            this.setClient = function(client){
                settings.opts.clientId = client;
            };
            this.setOptions = function(opts){
                settings.opts = null;
                settings.opts = opts;
            };
            this.$get = function() {
                return settings;
            };
        });
    }])

    .service('MQTTService',
        ['$q', '$rootScope', 'MQTT', function($q, $rootScope, MQTT) {
            var Service = {};
            var callbacks = {};

            // console.log(MQTT.opts);
            if(MQTT.href)
              var client = mqtt.connect(MQTT.href, MQTT.opts); // you add a ws:// url here
            else
              var client = mqtt.connect(MQTT.opts);

            client.on("message", function(topic, payload) {
                try {
                    var data = JSON.parse(payload.toString());
                }catch (e){
                    throw new Error("received data can not parse for JSON !");
                }
                angular.forEach(callbacks,function(callback, name){
                    var regexpStr = name.replace(new RegExp('(#)|(\\*)'),function(str){
                        if(str=="#"){
                            return ".*?"
                        }else if(str=="*"){
                            return ".*?"
                        }
                    });
                    if(topic.match(regexpStr)){
                        $rootScope.$apply(function() {
                            callback(data);
                        });
                    }
                })
            });

            client.publish("time", (new Date()).getDate());

            Service.on = function(name, callback){
                callbacks[name] = callback;
                client.subscribe(name);
            };
            Service.send = function(name, data, opts=null){
                client.publish(name, JSON.stringify(data), opts);
            };
            return Service;
        }]);
