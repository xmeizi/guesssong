/**
 *每个关卡的数据结构
 */
var LevelDataItem = (function () {
    function LevelDataItem() {
    }
    var d = __define,c=LevelDataItem,p=c.prototype;
    return LevelDataItem;
}());
egret.registerClass(LevelDataItem,'LevelDataItem');
/**
 * 关卡数据管理器
 */
var LevelDataManager = (function () {
    function LevelDataManager() {
        //一个关卡的保存数据组
        this.items = [];
        //使用res读取和构建json数据，json数据可以直接解析到目标结构
        this.items = RES.getRes("levels_json");
        //如此获得json中的数据
        //console.log(this.items['document'].Level[1]['tips'])
    }
    var d = __define,c=LevelDataManager,p=c.prototype;
    LevelDataManager.Shared = function () {
        if (LevelDataManager.shared == null) {
            LevelDataManager.shared = new LevelDataManager();
        }
        return LevelDataManager.shared;
    };
    //通过关卡号获得一个关的数据
    p.GetLevel = function (level) {
        if (level < 0)
            level = 0;
        if (level >= this.items.length)
            level = this.items.length - 1;
        return this.items["document"].Level[level];
    };
    d(p, "Milestone"
        //获得当前的游戏最远进度
        ,function () {
            var milestone = egret.localStorage.getItem('FKCFM_milestone');
            //如果没有数据，那么默认值就是第一关
            if (milestone == '' || milestone == null) {
                milestone = '1';
            }
            return parseInt(milestone);
        }
        //设置当前的游戏最远进度
        ,function (value) {
            egret.localStorage.setItem("FKCFM_milestone", value.toString());
        }
    );
    return LevelDataManager;
}());
egret.registerClass(LevelDataManager,'LevelDataManager');
var SceneLevels = (function (_super) {
    __extends(SceneLevels, _super);
    function SceneLevels() {
        _super.call(this);
        //开始每一关的游戏
        this.sel_level = 0;
        this.LevelIcons = [];
        this.skinName = "SceneLevel";
        this.group_levels = new eui.Group();
        //创建地图选项
        var row = 20;
        var col = 10;
        var spanx = 542 / col; //计算行x列y间隔
        var spany = 801 / row;
        var group = new eui.Group(); //地图背景
        group.width = 542;
        group.height = (spany * 99);
        //repeat-y填充背景 音符存在的那张背景 
        //<e:Image source="resource/assets/element.png" x="43" y="0" height="797"  width="455" visible="true" scaleX="1.01" scaleY="1.01"/>
        for (var i = 0; i <= (group.height / 801); i++) {
            var img = new eui.Image();
            img.source = RES.getRes("element_png");
            img.x = 48;
            img.y = i * 801;
            img.height = 797;
            img.width = 455;
            img.scaleX = 1.01;
            img.scaleY = 1.01;
            img.touchEnabled = false;
            this.group_levels.addChild(img);
        }
        //以正弦曲线绘制关卡图标的路径
        var milestone = LevelDataManager.Shared().Milestone;
        for (var i = 0; i < 99; i++) {
            var icon = new LevelIcon();
            icon.Level = i + 1;
            icon.y = spany * i / 2;
            icon.x = Math.sin(icon.y / 180 * Math.PI) * 400 + group.width / 8;
            icon.y += spany * i / 2;
            icon.y = group.height - icon.y - spany;
            group.addChild(icon);
            //依据进度设置关卡显示
            icon.enabled = i < milestone;
            // 保存到一个列表中
            this.LevelIcons.push(icon);
        }
        group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onclick_level, this);
        //开启位图缓存模式
        group.cacheAsBitmap = true;
        // 跟踪小手
        this.img_arrow = new eui.Image();
        this.img_arrow.source = RES.getRes("dir_png");
        this.img_arrow.anchorOffsetX = 124 / 2 - group.getChildAt(0).width / 2;
        this.img_arrow.anchorOffsetY = 76;
        this.img_arrow.touchEnabled = false;
        this.img_arrow.x = group.getChildAt(0).x;
        this.img_arrow.y = group.getChildAt(0).y;
        this.group_levels.addChild(this.img_arrow);
        this.group_levels.scrollEnabled = true;
        //卷动到最底层 可视区域竖直方向起始点
        this.group_levels.scrollV = group.height - 801;
        this.group_levels.addChild(group);
        this.scroller.addChild(this.group_levels);
        this.scroller.viewport = this.group_levels;
    }
    var d = __define,c=SceneLevels,p=c.prototype;
    SceneLevels.Shared = function () {
        if (SceneLevels.shared == null) {
            SceneLevels.shared = new SceneLevels();
        }
        return SceneLevels.shared;
    };
    p.onclick_level = function (e) {
        for (var i = 0; i < this.LevelIcons.length; i++) {
            var icon = this.LevelIcons[i];
            if (e.target == icon) {
                if (this.sel_level != icon.Level) {
                    this.img_arrow.x = icon.x;
                    this.img_arrow.y = icon.y;
                    this.sel_level = icon.Level;
                }
                else {
                    //进入并开始游戏
                    console.log('icon.Level:' + icon.Level);
                    console.log(typeof (icon.Level));
                    this.parent.addChild(SceneGame.Shared());
                    SceneGame.Shared().InitLevel(icon.Level);
                    this.parent.removeChild(this);
                }
            }
        }
    };
    //打开指定的关卡，如果大于最远关卡，则保存数据也跟着调整
    // 是为了将来做准备，当关卡完成后就会开启对应关卡icon
    p.OpenLevel = function (level) {
        var icon = this.LevelIcons[level - 1];
        icon.enabled = true;
        if (level > LevelDataManager.Shared().Milestone) {
            LevelDataManager.Shared().Milestone = level;
            // 同时将选定标记置于其上
            this.img_arrow.x = icon.x;
            this.img_arrow.y = icon.y;
            this.sel_level = icon.Level;
        }
    };
    return SceneLevels;
}(eui.Component));
egret.registerClass(SceneLevels,'SceneLevels');
//# sourceMappingURL=SceneLevels.js.map