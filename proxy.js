const obj = {a: "string"}

const handler = {
    get: function(obj, prop) {
      return prop in obj ?
        obj[prop] :
        37;
    },
    set: function(obj, prop, value) {
        prop in obj ?
          obj[prop] = value :
          console.log("property does not exist");
      }
    };
  
  const p = new Proxy(obj, handler);
  
  p.a = 1;
  p.b = undefined;
  
  console.log(p.a, p.b); 
  //  1, undefined
  
  console.log('c' in p, p.c); 
  //  false, 37

  