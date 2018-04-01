

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAY5VDHuoqxnCA2qbNGeGFwvD598qJqksE",
    authDomain: "alfcastillo-ff1ec.firebaseapp.com",
    databaseURL: "https://alfcastillo-ff1ec.firebaseio.com",
    projectId: "alfcastillo-ff1ec",
    storageBucket: "alfcastillo-ff1ec.appspot.com",
    messagingSenderId: "524789471850"
};

firebase.initializeApp(config);

var database = firebase.database();

// Button for adding Train
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#train-destination").val().trim();
  // var empStart = moment($("#start-input").val().trim(), "DD/MM/YY").format("X");
  var trainTime = $("#start-input").val().trim();
  var trainFrequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    traintime: trainTime,
    frequency: trainFrequency,
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.traintime);
  console.log(newTrain.frequency);

  // Added info to Firebase
 console.log("Train Info successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#train-destination").val("");
  $("#start-input").val("");
  $("#frequency-input").val("");
});

// Create Firebase event for adding Train Schedule to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainStart = childSnapshot.val().traintime;
  var trainFrequency = childSnapshot.val().frequency;

  // train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainStart);
  console.log(trainFrequency);

var nextTrainTime = nextTrain(trainFrequency,trainStart);

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
  trainFrequency + "</td><td>" + nextTrainTime[0] + "</td><td>" + nextTrainTime[1] );
});

// FUNCTION to calculate nextTrain arrival time
function nextTrain(tFrequency,firstTime){ 
console.log("**** Next Traim Time Calculation Function ****")
console.log("Train Frequency: "+tFrequency)
console.log("First Time: "+firstTime);

// First Time (pushed back 1 year to make sure it comes before current time)
var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
console.log(firstTimeConverted);

// Current Time
var currentTime = moment();
console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

// Difference between the times
var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
console.log("DIFFERENCE IN TIME: " + diffTime);

// Time apart (remainder)
var tRemainder = diffTime % tFrequency;
console.log("Remainer: "+ tRemainder);

// Minute Until Train
var tMinutesTillTrain = tFrequency - tRemainder;
console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

// Next Train
var nextTrain = moment().add(tMinutesTillTrain, "minutes");
console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
var nextTrainArray = [moment(nextTrain).format("hh:mm"),tMinutesTillTrain];
// return moment(nextTrain).format("hh:mm");
return nextTrainArray;
}
