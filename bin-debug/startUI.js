var StartUI = (function (_super) {
    __extends(StartUI, _super);
    function StartUI() {
        _super.call(this);
        this.createView();
    }
    var d = __define,c=StartUI,p=c.prototype;
    p.createView = function () {
        var startUI = new egret.Bitmap();
        startUI.texture = RES.getRes('bg_png');
        startUI.x = 0;
        startUI.y = 0;
        startUI.width = 542;
        startUI.height = 801;
        this.addChild(startUI);
    };
    p.changeScene = function () {
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.y = 300;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
        this.textField.text = "\u70B9\u51FB\u8FD9\u91CC\u5F00\u59CB\u6E38\u620F";
    };
    return StartUI;
}(egret.Sprite));
egret.registerClass(StartUI,'StartUI');
//# sourceMappingURL=startUI.js.map