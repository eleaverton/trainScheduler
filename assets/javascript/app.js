// Initialize Firebase
var config = {
    apiKey: "AIzaSyCQ0b3kUBd7bt82PHm1I_O3Y2NL8t2Izuc",
    authDomain: "trainscheduler-53177.firebaseapp.com",
    databaseURL: "https://trainscheduler-53177.firebaseio.com",
    projectId: "trainscheduler-53177",
    storageBucket: "",
    //storage?
    messagingSenderId: "320427435073"
};
firebase.initializeApp(config);

//setup database variables and newTrain object
var database = firebase.database();
var trainRef = database.ref("/trains");

//On submit button click, get values from the input fields and push those values to database
$("#submitButton").on("click", function(event) {
    console.log("click");
    event.preventDefault();
    var trName = $("#trainNameInput").val().trim();
    var trDestination = $("#destinationInput").val().trim();
    var trStartTime = $("#timeInput").val().trim();
    var trFrequency = $("#frequencyInput").val().trim();
    

    var newTrain = {
    	name: trName,
    	destination:trDestination,
    	startTime:trStartTime,
    	frequency:trFrequency
    };
    console.log(newTrain);

    trainRef.push(newTrain);

    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#timeInput").val("");
    $("#frequencyInput").val("");

});

trainRef.on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());

    var trName = childSnapshot.val().name;
    var trDestination = childSnapshot.val().destination;
    var trStartTime = childSnapshot.val().startTime;
    var trFrequency = childSnapshot.val().frequency;
    

    //diff between current time and first time in minutes
    //divide diff in minutes by frequency in minutes - remainder gives us amount of time into next frequency interval that has already passed
    //frequency minus remainder = how many minutes away
    //add how many minutes away to current time to get next train time. 

    var startTimeConverted = moment(trStartTime, "hh:mm").subtract(1, "years");
    console.log(startTimeConverted);

    var diffTime = moment().diff(moment(startTimeConverted), "minutes");
    console.log(diffTime);

    var tRemainder = diffTime % trFrequency;
    console.log(tRemainder);

    var tMinutesTilTrain = trFrequency - tRemainder;
    console.log(tMinutesTilTrain);

    var nextTrain = moment().add(tMinutesTilTrain, "minutes").format("hh:mm");
    console.log(nextTrain);

    var newRow = $('<tr><td>' + trName + '</td><td>' + trDestination + '</td><td>' + trFrequency + '</td><td>' + nextTrain + '</td><td>' + tMinutesTilTrain + '</td>');
    $('table.trainTable').append(newRow);
});








//on page load I always want to see the train information I already have so i need a document.ready function?