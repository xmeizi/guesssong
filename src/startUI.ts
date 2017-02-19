class StartUI extends egret.Sprite {

    public constructor() {
        super();
        this.createView();
    }

    public textField:egret.TextField;
    private createView():void {
        let startUI = new egret.Bitmap();
        startUI.texture = RES.getRes('bg_png');
        startUI.x = 0;
        startUI.y = 0;
        startUI.width = 542;
        startUI.height = 801;
        this.addChild(startUI);
    }
    public changeScene(){
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.y = 300;
        this.textField.width = 480;
        this.textField.height = 100;
        this.textField.textAlign = "center";
        this.textField.text = `点击这里开始游戏`;
    }
}
