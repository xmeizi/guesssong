var LevelIcon = (function (_super) {
    __extends(LevelIcon, _super);
    function LevelIcon() {
        _super.call(this);
        this.lb_level = new eui.Label();
        this.skinName = 'LevelIconSkin';
        this.lb_level.textColor = 0xFFFFFF;
        this.lb_level.horizontalCenter = 0;
        this.lb_level.verticalCenter = 0;
        this.addChild(this.lb_level);
    }
    var d = __define,c=LevelIcon,p=c.prototype;
    d(p, "Level"
        ,function () {
            return parseInt(this.lb_level.text);
        }
        ,function (value) {
            this.lb_level.text = value.toString();
        }
    );
    return LevelIcon;
}(eui.Button));
egret.registerClass(LevelIcon,'LevelIcon');
//# sourceMappingURL=LevelIcon.js.map