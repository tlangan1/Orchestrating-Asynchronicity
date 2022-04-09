var proto = {
  forEach: function forEach(onNext, onError, onCompleted) {
    if (typeof onNext == "function") {
      observer = {
        onNext: onNext,
        onError: onError ? onError : function (e) {},
        onCompleted: onCompleted ? onCompleted : function () {},
      };
    } else {
      observer = onNext;
    }

    return this._forEach(observer);
  },

  map: function map(mappingFunction) {
    var self = this;
    var observable = Object.create(proto);

    observable._forEach = function (observer) {
      return self.forEach(function (e) {
        observer.onNext(mappingFunction(e));
      });
    };

    return observable;
  },

  filter: function filter(filteringFunction) {
    var self = this;
    var observable = Object.create(proto);

    observable._forEach = function (observer) {
      return self.forEach(function (e) {
        if (filteringFunction(e)) observer.onNext(e);
      });
    };

    return observable;
  },

  take: function take(total) {
    var self = this;
    var count = 0;
    var observable = Object.create(proto);

    observable._forEach = function (observer) {
      var subscription = self.forEach(function (e) {
        if (count++ < total) {
          observer.onNext(e);
        } else {
          observer.onCompleted();
          subscription.dispose();
        }
      });
      return subscription;
    };

    return observable;
  },

  takeUntil: function takeUntil(untilObservable) {
    var self = this;
    var observable = Object.create(proto);

    observable._forEach = function (observer) {
      var subscription = self.forEach(observer);
      untilObservable.forEach(function () {
        observer.onCompleted();
        subscription.dispose();
      });
    };

    return observable;
  },
};

var Observable = {
  fromEvent: function (targetNode, eventName) {
    var observable = Object.create(proto);
    observable._forEach = function (observer) {
      var handler = function (e) {
        observer.onNext(e);
      };

      targetNode.addEventListener(eventName, handler);

      return {
        dispose: function () {
          targetNode.removeEventListener(eventName, handler);
        },
      };
    };

    return observable;
  },

  fromSetInterval: function fromSetInterval(interval) {
    var observable = Object.create(proto);
    observable._forEach = function (observer) {
      var handle = setInterval(observer.onNext, interval);

      return {
        dispose: function () {
          clearInterval(handle);
        },
      };
    };

    return observable;
  },

  fromTimer: function fromTimer(duration) {
    var observable = Object.create(proto);
    observable._forEach = function (observer) {
      var handle = setTimeout(observer.onNext, duration);

      return {
        dispose: function () {
          clearTimeout(handle);
        },
      };
    };
    return observable;
  },

  fromProxy: function fromProxy(object) {
    return {
      forEach: function (observer) {
        var handler = {
          set: function (target, property, value) {
            observer.onNext({ property, value });
            console.log("property " + property + " set to " + value);
            target[property] = value;
          },
          get: function (target, property) {
            console.log("property " + property + " accessed");
            return target[property];
          },
        };

        var { proxy, revoke } = Proxy.revocable(object, handler);

        return {
          proxy,
          subscription: {
            dispose: function () {
              revoke();
            },
          },
        };
      },
    };
  },

  fromDOMMutationObserver: function fromDOMMutationObserver(
    targetNode,
    observerOptions
  ) {
    var observable = Object.create(proto);
    observable._forEach = function (observer) {
      // the callback should come in the ForEach call
      observer = new MutationObserver(observer.onNext);
      observer.observe(targetNode, observerOptions);

      return {
        dispose: function () {
          observer.disconnect();
        },
      };
    };

    return observable;
  },
};

//var  timer = Observable.fromTimer(5000);

// var timer1Subscription = timer.forEach({onNext: function () {
//     console.log("timer with object oberver fired")
//     //intervalSubscription.dispose();
//     }, onCompleted: function() {}
// })

// var timer2Subscription = timer.forEach(function () {
//     console.log("timer with function oberver fired")
//     //intervalSubscription.dispose();
//     }, function() {}
// )

//var interval = Observable.fromSetInterval(996)

// var intervalSubscription = interval.forEach({onNext: function () {
//     console.log("interval with object oberver fired")
//     }, onCompleted: function() {}
// })

//var final = interval.takeUntil(timer)

// final.forEach({
//     onNext: function(r) {
//         console.log("interval fired")
//     },
//     onCompleted: function() {
//         console.log("complete")
//     }
// });

// intervalSubscription.dispose()
// timer1Subscription.dispose()
// timer2Subscription.dispose()
