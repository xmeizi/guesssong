class SoundManager{

    private static shared: SoundManager;
    public static Shared(){
        if(SoundManager.shared == null){
            SoundManager.shared = new SoundManager();
        }
        return SoundManager.shared;
    }

    private channel = new Audio();
    constructor(){

    }
    public _guess(data){
        this.channel.src = "resource/sound/"+data["file_name"];
        this.play();
    }

    public _answer(data){
        this.channel.src ="resource/sound/"+data["voice"];
        this.play();
    }
    public play(){
        var _self = this;
        // 判断是否加载完毕
        this.channel.oncanplay = function(){
            _self.channel.play();
        }
    }
    public replay(){
        this.channel.pause();
        this.channel.currentTime = 0;
        this.play();
    }
    public pause(){
        // 判断是否存在
        if(this.channel !== null){
            this.channel.pause();
        }
    }
    public remove(){
        if(this.channel!==null){
            this.channel.pause();
            this.channel.src = "";
        }
        
    }
}