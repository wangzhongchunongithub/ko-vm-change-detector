# ko-vm-change-detector
Define a module that help to call callback function once any change happened on KO view model.

How to use detect
```javascript
var vm_detector = require("vmChangeDetector");
var vm = {    
    attr1: ko.observable(),  
    attr2: {  
        attr3: ko.observableArray()  
    }  
};  
/*if you just want track changes on observables that are not defined nestedly, 
you can set fullTracking as false, if so the detector will subscribe the observables that was defined as ko.observable/observableArray, 
it will not track changes happening on the observables under observables.  
*/
vm_detector.detect(vm, { fullTracking: false }, function ()  
                {  
                    console.log("There are changes happend on viewmodel");  
                });  

vm = {  
    attr1: ko.observable(),  
    attr2: {  
        attr3: ko.observableArray([  
            {  
                attr4: ko.observable()  
            }  
        ])  
    }  
};  
/*if there are observables defined nestedly, you can set fullTracking as true, 
if so the detector will subscribe the fields that was defined as ko.observable/observableArray,
and track changes happening on the observables/observableArrays under observables/observableArrays.   
*/
vm_detector.detect(vm, { fullTracking: true }, function ()  
                {  
                    console.log("There are changes happend on viewmodel");  
                });  
```
