/**
 * Created by Mark on 20/12/2015.
 * Used when the app is first opened
 * Will have the option to select a department and start scanning
 *
 */
(function (module) {

    var scanResultController = function (settings, log, $state, $scope, current_order, orderconfig, $mdDialog) {

        var vm = this;
        vm.current_order = {};
        $scope.$watch(function () {
            return settings;
        }, function (settings) {
            // handle it here. e.g.:
            vm.settings = settings;
        });
        $scope.$watch(function () {
            return current_order;
        }, function (current_order) {
            // handle it here. e.g.:
            vm.current_order = current_order;
            getOrderDetails(current_order.orderid);

        });

        function getOrderDetails(orderid) {
            vm.errMsg = ''
            orderconfig.sendCommand(orderid, 'check').then(function (_data) {
                if (_data.data.order) {
                    log.logMsg("Success in getting Order " + _data.data.order.orderid);
                    vm.current_order = _data.data.order;
                }
                else {
                    log.logMsg("ERROR >> No Order found but we got a HTTP 200");
                    //Need to display error
                    vm.errMsg = 'No Order Information was found for ' + vm.current_order.orderid
                }
                ;
            }, function (err) {
                log.logMsg("ERROR >> " + err);
                if (err.statusText == '') {
                    err.statusText = 'A connection error has occurred. No data can be retrieved. Click OK to edit / check your settings.'
                }
                //Need to display error
                vm.errMsg = 'A connection error has occurred. No data can be retrieved. Click OK to edit / check your settings.'
                vm.displayIndicator = false;
            });
        }

        //Hide / show action button - checks Order Data which holds which buttons to display sent from server
        vm.hasButton = function (key) {
            if (vm.current_order.buttons) {
                for (var i = 0; i < vm.current_order.buttons.length; i++) {
                    if (vm.current_order.buttons[i] === key) {
                        return true;
                    }
                }
            }
            return false;
        }

        vm.change_state = function (s) {
            log.logMsg('VIEW >> ' + s)
            $state.go(s);
        };

        vm.filterFn = function (ob) {
            // Do some tests

            if (ob.selectable == 'Yes') {
                return true; // this will be listed in the results
            }

            return false; // otherwise it won't be within the results
        };
        vm.filterCurrentDepartment = function (obj) {
            // Do some tests
            if (obj.stage !== settings.current_department) {
                return true; // this will be listed in the results
            }

            return false; // otherwise it won't be within the results
        };
        vm.filterRemoveDispatch = function (obj) {
            // Do some tests
            if (obj.stage !== 'Dispatch') {
                return true; // this will be listed in the results
            }

            return false; // otherwise it won't be within the results
        };

        vm.outDepartment = ""

        //Command(s) - send command to Server to update Order
        vm.sendCommand = function (command, outDepartment) {
            orderconfig.sendCommand(vm.current_order.orderid, command, outDepartment)
                .then(function (_data) {
                    log.logMsg('Success with command')


                    $mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('body')))
                            .clickOutsideToClose(true)
                            .title('Success')
                            .textContent('Thank you.  Your order has been scanned and updated successfully')
                            .ok('Ok!')
                    ).then(function(){
                            vm.change_state('scan home')
                        });


                }, function (err) {
                    log.logMsg('ERROR >> Error with command ' + err.statusText)
                    vm.errMsg = 'Error trying to send order update ' + err.statusText
                });
        }


    };

    module.controller("scanResultController", scanResultController);

}(angular.module("scanner")));