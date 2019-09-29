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
    questionT:3, //Time to give an answer
    wins:0, //Wins counter
    losses:0, //Losses counter
    currentQ:0, //Index of current random question
    currentA:0, //Answer of current question
    playing:false, //Check if answers are clickable
    timeout:"", //For receiving setTimeout
    onTimeout:false, //For checking if on timeout

    //Array of objects that have the question(q), the answers(a1-a4) and the correct answer.
    questions: [
        {q:"Q1,a3",a1:"a1aaa",a2:"a2aaa",a3:"a3aaa",a4:"a4aaa",correctA:"a3"},
        {q:"Q2,a2",a1:"a1aaa",a2:"a2aaa",a3:"a3aaa",a4:"a4aaa",correctA:"a2"},
        {q:"Q3,a1",a1:"a1aaa",a2:"a2aaa",a3:"a3aaa",a4:"a4aaa",correctA:"a1"},
        {q:"Q4,a4",a1:"a1aaa",a2:"a2aaa",a3:"a3aaa",a4:"a4aaa",correctA:"a4"}
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