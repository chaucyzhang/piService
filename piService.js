var http = require('http');
var express = require('express');

var service = express();

var gpio = require('pi-gpio');

var inputs = [{pin:'16',gpio:'23', value:null},
              {pin:'22',gpio:'25', value:null},
              {pin:'18',gpio:'24', value:null}];

var i;

for (i in inputs) {
    console.log('opening GPIO port ' + inputs[i].gpio + ' on pin ' + inputs[i].pin + ' as input');
    gpio.open(inputs[i].pin, "output", function (err) {
    if (err) {
        throw err;
    }
  });
}


/*
//setInterval( function () {
  gpio.read(inputs[0].pin, function (err, value) {
    if (err) {
      throw err;
    }
    console.log('read pin ' + inputs[0].pin + ' value = ' + value);
    // update the inputs object
    inputs[0].value = value.toString(); // store value as a string
  });

  gpio.read(inputs[1].pin, function (err, value) {
    if (err) {
      throw err;
    }
    console.log('read pin ' + inputs[1].pin + ' value = ' + value);
    inputs[1].value = value.toString();
  });
//}, 500); // setInterval
*/

service.use(express['static'](__dirname));

service.post('/inputs', function (req, res) {
     var i;

  for (i in inputs){
     // if ((req.params.id === inputs[i].gpio)) {
      // send to client an inputs object as a JSON string
        
     light(i);
        
          
 //   }
  } // for
  res.send(inputs[0].value);
  return;
  console.log('invalid input port');
  res.status(403).send('dont recognise that input port number ' + req.params.id); 
});


function light(i)
{
     gpio.read(inputs[i].pin, function (err, value) {
      if (err) {

          throw err;
      }	
      else{
      console.log(inputs[i].pin);
          inputs[i].value = value.toString();
          if (value==1){
              gpio.write(inputs[i].pin,0,function(){
              console.log(inputs[i].pin + " is off.");
              
         // gpio.close(inputs[i].pin);
          });
         }
         else{
             gpio.write(inputs[i].pin,1,function(){
             console.log(inputs[i].pin + " is on.");
        //  gpio.close(inputs[i].pin);
             });
             }
         }
 });
}
/*
function light(i)
{
 gpio.read(inputs[i].pin, function (err, value) {
      if (err) {

          throw err;
      }	
      else{
      console.log(inputs[i].pin);
          inputs[i].value = value.toString();
          if (value==1){
              gpio.write(inputs[i].pin,0,function(){
              console.log(inputs[i].pin + " is off.");
         // gpio.close(inputs[i].pin);
          });
         }
         else{
         
             gpio.write(inputs[i].pin,1,function(){
             console.log(inputs[i].pin + " is on.");
        //  gpio.close(inputs[i].pin);
             });
             }
         }
 });
}

*/
// Express route for incoming requests for a single input
service.post('/inputs/:id', function (req, res) {
     var i;

  console.log('received API request for port number ' + req.params.id);
  
  for (i in inputs){
      if ((req.params.id === inputs[i].gpio)) {
      // send to client an inputs object as a JSON string
       
      gpio.read(inputs[i].pin, function (err, value) {
      if (err) {
          throw err;
      }
      else{
          inputs[i].value = value.toString();
          if (value==1){
              gpio.write(inputs[i].pin,0,function(){
              console.log(inputs[i].pin + " is off.");
         // gpio.close(inputs[i].pin);
      });
     }
     else{
         gpio.write(inputs[i].pin,1,function(){
         console.log(inputs[i].pin + " is on.");
        //  gpio.close(inputs[i].pin);
         });
      }
    }
 });
        res.send(inputs[i]);
          return;
    }
  } // for

  console.log('invalid input port');
  res.status(403).send('dont recognise that input port number ' + req.params.id); 
});

service.get('/inputs/:id', function (req, res) {
  var i;

  console.log('received API request for port number ' + req.params.id);
  
  for (i in inputs){
      if ((req.params.id === inputs[i].gpio)) {
      // send to client an inputs object as a JSON string
       
      gpio.read(inputs[i].pin, function (err, value) {
      if (err) {
          throw err;
      }
      else{
          inputs[i].value = value.toString();
          if (value==1){
              gpio.write(inputs[i].pin,0,function(){
              console.log(inputs[i].pin + " is off.");
         // gpio.close(inputs[i].pin);
      });
     }
     else{
         gpio.write(inputs[i].pin,1,function(){
         console.log(inputs[i].pin + " is on.");
        //  gpio.close(inputs[i].pin);
         });
      }
    }
 });
        res.send(inputs[i]);
          return;
    }
  } // for

  console.log('invalid input port');
  res.status(403).send('dont recognise that input port number ' + req.params.id);
}); // apt.get()

// Express route for incoming requests for a list of all inputs
service.get('/inputs', function (req, res) {
  // send array of inputs objects as a JSON string
  console.log('all inputs');
  res.status(200).send(inputs);
}); // apt.get()

// Express route for any other unrecognised incoming requests
service.get('*', function(req, res) {
  res.status(404).send('Unrecognised API call');
});

// Express route to handle errors
service.use(function(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send('Oops, Something went wrong!');
  } else {
    next(err);
  }
});


process.on('SIGINT', function() {
  var i;

  console.log("\nGracefully shutting down from SIGINT (Ctrl+C)");

  console.log("closing GPIO...");
  for (i in inputs) {
    gpio.close(inputs[i].pin);
  }
  process.exit();
});



service.listen(3000);
console.log('App Server running at port 3000');
