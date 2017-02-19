var SoundManager = (function () {
    function SoundManager() {
        this.channel = new Audio();
    }
    var d = __define,c=SoundManager,p=c.prototype;
    SoundManager.Shared = function () {
        if (SoundManager.shared == null) {
            SoundManager.shared = new SoundManager();
        }
        return SoundManager.shared;
    };
    p._guess = function (data) {
        this.channel.src = "resource/sound/" + data["file_name"];
        this.play();
    };
    p._answer = function (data) {
        this.channel.src = "resource/sound/" + data["voice"];
        this.play();
    };
    p.play = function () {
        var _self = this;
        // 判断是否加载完毕
        this.channel.oncanplay = function () {
            _self.channel.play();
        };
    };
    p.replay = function () {
        this.channel.pause();
        this.channel.currentTime = 0;
        this.play();
    };
    p.pause = function () {
        // 判断是否存在
        if (this.channel !== null) {
            this.channel.pause();
        }
    };
    p.remove = function () {
        if (this.channel !== null) {
            this.channel.pause();
            this.channel.src = "";
        }
    };
    return SoundManager;
}());
egret.registerClass(SoundManager,'SoundManager');
//# sourceMappingURL=audio.js.map