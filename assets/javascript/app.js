//Clock object manages all time-related properties
let clock = {
    time:0,
    intervalId:"",
    running:false,

    start:function(sec){
        if(!clock.running){
            clock.time=sec;
            clock.intervalId = setInterval(clock.count, 1000);
            clock.running=true;
        }
    },

    stop:function(){
        clock.running=false;
        clearInterval(clock.intervalId);
    },

    resume:function(){
        if(!clock.running){
            clock.intervalId = setInterval(clock.count, 1000);
            clock.running=true;
        }
    },

    count:function(){
        if(clock.time>0){
            $(".clock").text(clock.timeConverter(clock.time--));
        }else{
            clock.stop();
            $(".clock").text("00:00")
            clock.running=false;
            tE.timeUp();
        }
    },

    timeConverter:function(t){
        var minutes = Math.floor(t / 60);
        var seconds = t - (minutes * 60);
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        if (minutes === 0) {
            minutes = "00";
        }
        else if (minutes < 10) {
            minutes = "0" + minutes;
        }
        return minutes + ":" + seconds;
    }
};

//Trivia game engine (tE) manages all game-related properties
let tE = {
    //Game properties
    waitT:6*1000, //Time between questions
    questionT:10, //Time to give an answer
    wins:0, //Wins counter
    losses:0, //Losses counter
    currentQ:0, //Index of current random question
    currentA:0, //Answer of current question
    playing:false, //Check if answers are clickable
    timeout:"", //For receiving setTimeout
    onTimeout:false, //For checking if on timeout

    //Array of objects that have the question(q), the answers(a1-a4) and the correct answer (which directs to a1-a4).
    questions: [
        {q:"What is the biggest island of the world?",a1:"Iceland",a2:"Australia",a3:"Austria",a4:"Greenland",correctA:"a4"},
        {q:"Which of the following is NOT a Shakespeare play:",a1:"Hamlet",a2:"Cordelia",a3:"Macbeth",a4:"Othello",correctA:"a2"},
        {q:"Which is the largest continent?",a1:"Asia",a2:"Africa",a3:"America",a4:"Antartica",correctA:"a1"},
        {q:"How many degrees are in a circle?",a1:"180",a2:"270",a3:"360",a4:"450",correctA:"a3"},
        {q:"What is the capital of Italy?",a1:"Venice",a2:"Rome",a3:"Milan",a4:"Florence",correctA:"a2"},
        {q:"Where is the Sahara Desert situated?",a1:"Africa",a2:"Asia",a3:"America",a4:"Australia",correctA:"a3"},
        {q:"How many sides are in a hexagon?",a1:"4",a2:"6",a3:"8",a4:"12",correctA:"a2"},
        {q:"Which of the following is NOT part of the European Union?",a1:"Switzerland",a2:"Austria",a3:"Croatia",a4:"Finland",correctA:"a1"},
        {q:"What is the national sport in the United States?",a1:"Football",a2:"Soccer",a3:"Baseball",a4:"Basketball",correctA:"a3"},
        {q:"Who is the owner of Microsoft?",a1:"Steve Jobs",a2:"Mark Zuckerberg",a3:"John Microsoft",a4:"Bill Gates",correctA:"a4"},
        {q:"What is another word for Dictionary?",a1:"Lexicon",a2:"Worder",a3:"Wordary",a4:"Diction",correctA:"a1"},
        {q:"How many squares are in a chessboard?",a1:"64",a2:"49",a3:"36",a4:"25",correctA:"a1"},
        {q:"Which country invented paper?",a1:"England",a2:"Egypt",a3:"Greece",a4:"China",correctA:"a4"},
        {q:"How many liters of water fit in a cubic meter?",a1:"1",a2:"10",a3:"100",a4:"1000",correctA:"a4"},
        {q:"Which blood type is known as the universal donor?",a1:"AB+",a2:"AB-",a3:"O+",a4:"O-",correctA:"a4"},
        {q:"Which blood type is know as the universal recipient?",a1:"AB+",a2:"AB-",a3:"O+",a4:"O-",correctA:"a1"},
        {q:"Which country was the first to accept women's wote?",a1:"Finland",a2:"New Zealand",a3:"Norway",a4:"Sweden",correctA:"a2"},
        {q:"Which of the following rivers is situated in London?",a1:"Seine",a2:"Amazonas",a3:"Thames",a4:"Irving",correctA:"a3"},
        {q:"Which color absorbs the most light?",a1:"White",a2:"Black",a3:"Brown",a4:"Blue",correctA:"a2"},
        {q:"What is the chemical symbol of iron?",a1:"Fe",a2:"In",a3:"Rn",a4:"St",correctA:"a1"},
        {q:"Which are the primary colors in print?",a1:"Red, green, and blue",a2:"Red, blue, and yellow",a3:"Cyan, magenta, yellow, and black",a4:"Purple, green, orange, and black",correctA:"a3"},
        {q:"What is a tomato?",a1:"Vegetable",a2:"Fruit",a3:"Seed",a4:"Grain",correctA:"a2"},
        {q:"Which of the following is NOT a botanical berry?",a1:"Strawberry",a2:"Blueberry",a3:"Grape",a4:"Banana",correctA:"a1"},
        {q:"Ailurophobe is the extreme fear of?",a1:"Death",a2:"Flying",a3:"Eagles",a4:"Cats",correctA:"a4"},
        {q:"In which country did Halloween originate?",a1:"USA",a2:"Ireland",a3:"England",a4:"Mexico",correctA:"a2"},
        {q:"What is the common name for young whale?",a1:"Cub",a2:"Willy",a3:"Calf",a4:"Red",correctA:"a3"},
        //{q:"",a1:"",a2:"",a3:"",a4:"",correctA:""},
    ],

    //Initialize checks and crosses in answers
    init:function(){
        $(".check").hide();
        $(".cross").hide();
    },

    //Generate a new random question from the array and display it
    newQ: function(){
        tE.onTimeout=false;
        tE.init();
        tE.playing=true;
        clock.start(tE.questionT);
        tE.currentQ = randomNumE(tE.questions.length);
        tE.currentA = tE.questions[tE.currentQ].correctA;
        tE.currentA = tE.questions[tE.currentQ][tE.currentA];
        console.log(`Randomly chose question ${tE.currentQ} out of ${tE.questions.length}`);
        $("#question").children("h3").text("Pop Quiz");
        $("#question").children("p").text(tE.questions[tE.currentQ].q);
        $("#a1").children("p").text(tE.questions[tE.currentQ].a1);
        $("#a2").children("p").text(tE.questions[tE.currentQ].a2);
        $("#a3").children("p").text(tE.questions[tE.currentQ].a3);
        $("#a4").children("p").text(tE.questions[tE.currentQ].a4);
    },

    //Receive the answer clicked and call the corresponding method
    checkA:function(selectedA){
        if(selectedA===tE.questions[tE.currentQ].correctA&&tE.playing){
            tE.rightA();
        } else if(tE.playing){
            tE.wrongA(selectedA);
        }
    },

    //Method called if correct answer was chosen
    rightA:function(){
        tE.playing = false;
        clock.stop();
        $("#question").children("h3").text("Quiz Passed!");
        $("#question").children("p").text(`
            You passed the Pop Quiz! Great job!!`);
        $(`#${tE.questions[tE.currentQ].correctA}`).children(".check").show();
        $("#wins").text(`Wins: ${++tE.wins}`);
        tE.timeout = setTimeout(tE.newQ,tE.waitT);
        tE.onTimeout = true;
    },

    //Method calld if wrong anser was chosen
    wrongA:function(selectedA){
        tE.playing = false;
        clock.stop();
        $("#question").children("h3").text("Quiz Failed!");
        $("#question").children("p").text(`
            You failed the Pop Quiz, the correct answer was ${tE.currentA}.`);
        $(`#${tE.questions[tE.currentQ].correctA}`).children(".check").show();
        $(`#${selectedA}`).children(".cross").show();
        $("#losses").text(`Losses: ${++tE.losses}`);
        tE.timeout = setTimeout(tE.newQ,tE.waitT);
        tE.onTimeout = true;
    },

    //Method called if time to answer runs out
    timeUp:function(){
        tE.playing=false;
        $("#question").children("h3").text("Absence!");
        $("#question").children("p").text(`
            You were checked as absent for the Pop Quiz, the correct answer was ${tE.currentA}.`);
        $(`#${tE.questions[tE.currentQ].correctA}`).children(".check").show();
        $("#losses").text(`Losses: ${++tE.losses}`);
        tE.timeout = setTimeout(tE.newQ,tE.waitT);
        tE.onTimeout = true;
    },

    pause:function(){
        if(tE.onTimeout){
            clearTimeout(tE.timeout);
        } else{
            clock.stop();
            tE.playing=false;
        }
        $(".fa-pause-circle").hide();
        $(".fa-play-circle").show();
    },

    resume:function(){
        if(tE.onTimeout){
            tE.timeout = setTimeout(tE.newQ,tE.waitT);
        } else{
            clock.resume();
            tE.playing=true;
        }
        $(".fa-pause-circle").show();
        $(".fa-play-circle").hide();
    }
}

$(document).ready(function() {
    tE.newQ();

    //When clicking an answer
    $(document).on("click", ".answer",function() {
        //Receive id of click and send it to game object
        tE.checkA($(this).attr('id').toString());
    });

    //When clicking pause bell
    $(document).on("click", ".fa-pause-circle",function() {
        tE.pause();
    });

    //When clicking resume bell
    $(document).on("click", ".fa-play-circle",function() {
        tE.resume();
    });

});

//Generate a number between min(inclusive) and max(exclusive)
function randomNumE (max=10, min=0){
    return Math.floor(Math.random() * (max - min)) + min;
}