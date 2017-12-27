# ko-vm-change-detector
Define a module that help to call callback function once any change happened on KO view model.

How to use 
```javascript
vm = {    
    attr1: ko.observable(),  
    attr2: {  
        attr3: ko.observableArray()  
    }  
};  
//if there are only observable definition at the leaf node of your viewmodel, you can set fullTracking as false, if so the detector will subscribe the leaf nodes that was defined as ko.observable/observableArray, it will not track changes happening on the observables under observables.   
ko_extender.detect(your, { fullTracking: false }, function ()  
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
//if there are observables defined nestedly, you can set fullTracking as true, if so the detector will subscribe the leaf nodes that was defined as ko.observable/observableArray,and track changes happening on the observables/observableArrays under observables/observableArrays.   
ko_extender.detect(vm, { fullTracking: false }, function ()  
                {  
                    console.log("There are changes happend on viewmodel");  
                });  
```
