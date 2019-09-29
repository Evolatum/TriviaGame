let clock = {
    time:0,
    intervalId:"",
    running:false,
    start:function(){
        if(!this.running){
            this.intervalId = setInterval(count, 1000);
        }
    },
    stop:function(){
        this.running=false;
        clearInterval(this.intervalId);
    },
    reset:function(){
        this.time=0;
        //$("#display").text(0);
    },
    count:function(){
        this.time++;
        //$("#display").text(time);
    }
}