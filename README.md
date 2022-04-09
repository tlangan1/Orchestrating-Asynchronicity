# Orchestrate Asynchronicity

Included is a rudimentary observables library I authored, 'observable-library.js', along with examples of its use in the ObservableExamples.html web page.

A call to Observable.[some observable initiator function] creates an object based on the custom prototype and then puts the function designed to initialize the particular observable in the \_forEach property. The library currently provides observable initiator functions for DOM events, intervals, timers, memory proxies and DOM mutation observers. Finally, it returns the following observable object:

{

\_forEach: a place to store the observable initiator function to use until it is subscribed to by a call to forEach.

[[Prototype]]: my custom prototype object.

It is the prototype that contains the definition for forEach. This function abstracts away the fact that the supported observables can be called with either functions or an object.

The forEach function on the prototype works as follows:

1. If the first parameter to forEach is a function, it assumes that the observer was passed in as separate functions to be used for onNext, onCompleted and onError in that order. At least onNext must be supplied. If onError or both onCompleted and onError are not supplied then noop functions are put in their place. These functions are then wrapped in an object.
1. If the first parameter is an object, then it is used as is.
1. In either event, forEach returns a subscription object which contains only a dispose() method.
   }
