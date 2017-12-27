define(function (require) {
    "use strict";
    var ko = require("knockout"),
        koExtender = (function () {
            var self = this,
                disposables = [];

            function subscribe(target, params) {
                var stateAccessor = params.stateAccessor;
                var subs = target.subscribe(function (value) {
                    if (stateAccessor !== undefined && !stateAccessor()) {
                        stateAccessor(true);
                    }
                    if (typeof subs !== "undefined") {
                        subs.dispose();
                    }
                });
                disposables.push(subs);
            }
            function disposeAllSubs() {
                disposables.forEach(function (subs) {
                    if (subs && typeof subs.dispose !== "undefined") {
                        subs.dispose();
                    }
                });
                disposables = [];
            }
            function checkStateAccessor(stateAccessor) {
                if (!ko.isObservable(stateAccessor)) {
                    throw new Error("sp.app: Parameter stateAccessor for function trackChange should be an observable.");
                }
            }
            function subsStateAccessor(accessor, callback) {
                checkStateAccessor(accessor);
                if (callback === undefined) {
                    return;
                }
                if (typeof callback !== 'function') {
                    throw new Error("sp.app: Parameter callback for function trackChange should be a function.");
                } else {
                    var subs = accessor.subscribe(function (isChanged) {
                        if (isChanged) {
                            // callback.bind(null,'changed prop name','path')();
                            callback();
                        }
                        if (typeof subs !== 'undefined') {
                            subs.dispose();
                        }
                        //if user do some change , dispose all subscribe and do not track form field any more.
                        disposeAllSubs();
                    });
                }
            }

            function trackFieldChange(target, value, callback) {
                //@params target: an observable or observableArray;
                //@params value: initial value of target;
                //@params callback: call this function when observables are changed;
                var stateAccessor = ko.observable(false);
                subsStateAccessor(stateAccessor, callback);
                function checkObs(obs) {
                    if (!ko.isObservable(obs)) {
                        throw new Error("sp.app: Parameter target for function trackChange should be observable.");
                    }
                }
                if (target instanceof Array && target.length > 0) {
                    target.forEach(function (obs) {
                        checkObs(obs);
                        subscribe(obs, {
                            stateAccessor: stateAccessor
                        });
                    });
                } else {
                    checkObs(target);
                    if (value !== undefined) {
                        target(value);
                    }
                    subscribe(target, {
                        stateAccessor: stateAccessor
                    });
                }
            }

            function trackLeafNodesChange(root, options, callback)
            {
                var stateAccessor = ko.observable(false);
                subsStateAccessor(stateAccessor, callback);

                function extend(root) {
                    for (var prop in root) {
                        if (ko.isObservable(root[prop])) {
                            subscribe(root[prop], {
                                stateAccessor: stateAccessor
                            });
                        } else if (typeof root[prop] === 'object') {
                            extend(root[prop]);
                        }
                    }
                }
                extend(root);
            }

            function needSkip(skip,prop)
            {
                return skip instanceof Array && skip.length > 0 && skip.indexOf(prop) !== -1;
            }

            function trackAllObs(root, options, callback) {
                var stateAccessor = ko.observable(false);
                subsStateAccessor(stateAccessor, callback);
                function extend(obj) {
                    if (ko.isObservable(obj)) {
                        subscribe(obj, {
                            stateAccessor: stateAccessor
                        });
                        extend(ko.utils.unwrapObservable(obj));
                    } else {
                        if (obj !== null && typeof obj === 'object') {
                            if (obj instanceof Array) {
                                obj.forEach(function (item) {
                                    extend(item);
                                });
                            } else {
                                for (var prop in obj)
                                {
                                    if (!needSkip(options.skip,prop))
                                    {
                                        extend(obj[prop]);
                                    }
                                }
                            }
                        }
                    }
                }

                extend(root);
            }

            function track(root, options, callback) {
                disposeAllSubs();
                if (options.fullTracking) {
                    trackAllObs(root, options, callback);
                } else {
                    trackLeafNodesChange(root, options, callback);
                }
            };
            return {
                detectFieldChange: trackFieldChange,
                detect: track
            };
        })();

    return {
        detectFieldChange: koExtender.detectFieldChange,
        detect: koExtender.detect
    }
});
