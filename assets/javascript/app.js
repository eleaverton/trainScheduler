// Initialize Firebase
var config = {
    apiKey: "AIzaSyCQ0b3kUBd7bt82PHm1I_O3Y2NL8t2Izuc",
    authDomain: "trainscheduler-53177.firebaseapp.com",
    databaseURL: "https://trainscheduler-53177.firebaseio.com",
    projectId: "trainscheduler-53177",
    storageBucket: "",
    messagingSenderId: "320427435073"
};
firebase.initializeApp(config);

//setup database variables and newTrain object
var database = firebase.database();
var trainRef = database.ref("/trains");
var newTrain = {};

//On submit button click, get values from the input fields and push those values to database
$("#submitButton").on("click", function() {
    console.log("click");
    event.preventDefault();
    newTrain.name = $("#trainNameInput").val().trim();
    newTrain.destination = $("#destinationInput").val().trim();
    newTrain.startTime = $("#timeInput").val().trim();
    newTrain.frequency = $("#frequencyInput").val().trim();
    console.log(newTrain);

    trainRef.push(newTrain);

    trainRef.on("child_added", function(childSnapshot) {
        console.log(childSnapshot.val());
        //diff between current time and first time in minutes
        //divide diff in minutes by frequency in minutes - remainder gives us amount of time into next frequency interval that has already passed
        //frequency minus remainder = how many minutes away
        //add how many minutes away to current time to get next train time. 

        var startTimeConverted = moment(newTrain.startTime, "hh:mm").subtract(1, "years");
        console.log(startTimeConverted);
        var diffTime = moment().diff(moment(startTimeConverted),"minutes");
        console.log(diffTime);
        var tRemainder = diffTime%newTrain.frequency;
        console.log(tRemainder);
        var tMinutesTilTrain = newTrain.frequency-tRemainder;
        console.log(tMinutesTilTrain);
        var nextTrain = moment().add(tMinutesTilTrain,"minutes");
        console.log(nextTrain);
        var newRow = $('<tr><td>' + childSnapshot.val().name + '</td><td>' + childSnapshot.val().destination + '</td><td>' + childSnapshot.val().frequency + '</td><td>'+nextTrain+'</td><td>'+tMinutesTilTrain+'</td>');
        $('table.trainTable').append(newRow);
    });


});





//on page load I always want to see the train information I already have so i need a document.ready function?