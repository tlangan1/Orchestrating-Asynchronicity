var observableOuter = {} 
function fromSetInterval(interval) {
    observableOuter.forEach = function (observable) {
        var handle = setInterval(observable.onNext, interval)

        observableOuter.onCompleted = function () {
            clearInterval(handle)
        }

        var fromTimer = function fromTimer(duration) {
            var observableInner = Object.create({}); 
            observableInner.forEach = function (observer) {
                var handle = setTimeout(observer.onNext, duration)

                return function dispose() {
                    clearTimeout(handle);
                }
            }
    
            return observableInner
        }

        var timer = fromTimer(5000);

        timer.forEach({onNext: function() {
            console.log("timer fired")
            this.onCompleted()
        }.bind(observableOuter)})
    
        return {dispose: function() {
            clearInterval(handle);
        }
    }
}

    return observableOuter
}

var interval = fromSetInterval(1000)

interval.forEach({onNext: function() {console.log("interval fired")},
})
