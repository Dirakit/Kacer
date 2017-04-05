angular.module('controllers', [])

.controller('PowerCtrl', function($scope, MQTTService, AppCache) {
  $scope.arus = AppCache.get('arus')      || 2;
  $scope.volt = AppCache.get('volt')      || 220;
  $scope.watt = $scope.arus * $scope.volt || 440;

  MQTTService.on('iot-2/type/esp8266/id/espcurrent/evt/data/fmt/json', function(data){
      $scope.arus = data.current;
      $scope.watt = $scope.arus * $scope.volt;
      AppCache.set('arus', data.current);
  });

  MQTTService.on('iot-2/type/esp8266/id/espvoltage/evt/data/fmt/json', function(data){
      $scope.volt = data.voltage;
      $scope.watt = $scope.arus * $scope.volt;
      AppCache.set('volt', data.voltage);
  });
})

.controller('LightCtrl', function($scope, MQTTService, AppCache) {
  $scope.cahaya = AppCache.get('cahaya')            || 56;
  $scope.record = AppCache.getObject('cahaya_rec')  || [{}, {}, {}];

  MQTTService.on('iot-2/type/esp8266/id/espvoltage/evt/data/fmt/json', function(data){
      $scope.cahaya = data.brightness;
      $scope.record.shift();
      $scope.record.push({val:data.brightness, time:new Date()});
      AppCache.set('cahaya', data.brightness);
      AppCache.setObject('cahaya_rec', $scope.record);
  });

  $scope.lamp = {
    on: 'button-default',
    off: 'button-default',
    auto: 'button-positive',
    mod: function(m, update=true){
      this.on = 'button-default';
      this.off = 'button-default';
      this.auto = 'button-default';
      this[m] = 'button-positive';

      AppCache.set('lampu1', m);
      // AppCache.set('lampu2', m);
      if(update){
        MQTTService.send('iot-2/type/esp8266/id/espvoltage/cmd/lampu1/fmt/json', m);
        // MQTTService.send('iot-2/type/esp8266/id/espvoltage/cmd/lampu2/fmt/json', m);
      }
    }
  };

  var lampu1    = AppCache.get('lampu1') || 'auto';
  $scope.lamp.mod(lampu1, false);
  // var lampu2    = AppCache.get('lampu2') || 'auto';
  // $scope.lamp.mod(lampu2, false);

  MQTTService.on('iot-2/type/esp8266/id/espvoltage/cmd/lampu1/fmt/json', function(data){
    $scope.lamp.mod(data, false);
  });
  // MQTTService.on('iot-2/type/esp8266/id/espvoltage/cmd/lampu2/fmt/json', function(data){
  //   $scope.lamp.mod(data, false);
  // });
})

.controller('TempCtrl', function($scope, MQTTService, AppCache) {
  $scope.suhu   = AppCache.get('suhu')            || 24;
  $scope.record = AppCache.getObject('suhu_rec')  || [{}, {}, {}];

  MQTTService.on('iot-2/type/esp8266/id/espgastemp/evt/data/fmt/json', function(data){
      $scope.suhu = data.temp;
      $scope.record.shift();
      $scope.record.push({val:data.temp, time:new Date()});
      AppCache.set('suhu', data.temp);
      AppCache.setObject('suhu_rec', $scope.record);
  });

  $scope.stove = {
    on: 'button-default',
    off: 'button-default',
    auto: 'button-assertive',
    mod: function(m, update=true){
      this.on = 'button-default';
      this.off = 'button-default';
      this.auto = 'button-default';
      this[m] = 'button-assertive';

      AppCache.set('kompor', m);
      if(update) MQTTService.send('iot-2/type/esp8266/id/espkompor/cmd/kompor/fmt/json', m);
    }
  };

  var kompor    = AppCache.get('kompor') || 'auto';
  $scope.stove.mod(kompor, false);

  MQTTService.on('iot-2/type/esp8266/id/espkompor/cmd/kompor/fmt/json', function(data){
    $scope.stove.mod(data, false);
  });
})

.controller('FeederCtrl', function($scope, MQTTService, AppCache) {
  $scope.realpk= AppCache.get('pakan') || 100;
  $scope.pakan = [50, 80, 20, 40];

  MQTTService.on('iot-2/type/esp8266/id/esptimbangan/evt/data/fmt/json', function(data){
      $scope.realpk = ((data.pakan/5) * 100);
      AppCache.set('pakan', $scope.realpk);
  });
})
