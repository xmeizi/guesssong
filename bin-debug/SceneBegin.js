var SceneBegin = (function (_super) {
    __extends(SceneBegin, _super);
    function SceneBegin() {
        _super.call(this);
        this.btn_begin = new eui.Button();
        this.skinName = 'SceneBeginSkin';
        var btnskin = "<e:Skin class=\"btnskin\" states=\"up,down,disabled\" minHeight=\"63\" minWidth=\"200\" xmlns:e=\"http://ns.egret.com/eui\">\n                            <e:Image width=\"100%\" height=\"100%\" alpha.disabled=\"0.5\" source=\"resource/assets/scenebeginbtn.png\"/>\n                        </e:Skin>";
        this.btn_begin.skinName = btnskin;
        this.btn_begin.x = 200;
        this.btn_begin.y = 625;
        this.addChild(this.btn_begin);
        this.btn_begin.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onclick_begin, this);
    }
    var d = __define,c=SceneBegin,p=c.prototype;
    SceneBegin.Shared = function () {
        if (SceneBegin.shared == null) {
            SceneBegin.shared = new SceneBegin();
        }
        return SceneBegin.shared;
    };
    p.onclick_begin = function () {
        console.log(this.selLabel);
        //this.parent.addChild(SceneLevels.Shared());
        //this.parent.removeChild(this);
    };
    return SceneBegin;
}(eui.Component));
egret.registerClass(SceneBegin,'SceneBegin');
//# sourceMappingURL=SceneBegin.js.map