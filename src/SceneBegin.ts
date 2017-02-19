class SceneBegin extends eui.Component{
    //单例
    private static shared:SceneBegin;
    public static Shared(){
        if(SceneBegin.shared == null){
            SceneBegin.shared = new SceneBegin();
        }
        return SceneBegin.shared;
    }
    private selLabel:eui.Label;
    public btn_begin:eui.Button = new eui.Button();
    public constructor(){
        super();
        this.skinName = 'SceneBeginSkin';
        let btnskin =   `<e:Skin class="btnskin" states="up,down,disabled" minHeight="63" minWidth="200" xmlns:e="http://ns.egret.com/eui">
                            <e:Image width="100%" height="100%" alpha.disabled="0.5" source="resource/assets/scenebeginbtn.png"/>
                        </e:Skin>`;
        this.btn_begin.skinName = btnskin;
        this.btn_begin.x = 200;
        this.btn_begin.y = 625;
        this.addChild(this.btn_begin);
        this.btn_begin.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onclick_begin,this);
    }
    private onclick_begin(){
        console.log(this.selLabel);
        //this.parent.addChild(SceneLevels.Shared());
        //this.parent.removeChild(this);
    }
}