// TypeScript file
var SceneGame = (function (_super) {
    __extends(SceneGame, _super);
    function SceneGame() {
        _super.call(this);
        this.aMyanswer = []; //存储己方答案
        this.aRightanswer = []; //存储正确答案 待 初始化
        this.relativelain = {
            sel: [],
            confuse: []
        };
        this.skinName = "resource/skin/SceneGameSkin.exml";
        SoundManager.Shared();
    }
    var d = __define,c=SceneGame,p=c.prototype;
    SceneGame.Shared = function () {
        if (SceneGame.shared == null) {
            SceneGame.shared = new SceneGame();
        }
        return SceneGame.shared;
    };
    p.InitLevel = function (level) {
        this.levelIndex = level;
        this.levelData = LevelDataManager.Shared().GetLevel(level);
        this.aMyanswer = [];
        this.aRightanswer = [];
        this.list_confuse.visible = true;
        this.list_sel.visible = true;
        this.backbtn.touchEnabled = true;
        this.retrybtn.touchEnabled = true;
        this.backbtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backLevelscene, this);
        this.retrybtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.retry, this);
        this.storageRight();
        this.selWord();
        this.shuffWord();
        SoundManager.Shared()._guess(this.levelData);
    };
    //展示己方答案
    p.selWord = function () {
        this.selCollection = new eui.ArrayCollection();
        for (var i = 0; i < this.aRightanswer.length; i++) {
            this.selCollection.addItem({ "label": "" });
        }
        this.list_sel.dataProvider = this.selCollection;
        this.addChild(this.list_sel);
        this.list_sel.itemRenderer = WordlabelRender;
        this.list_sel.useVirtualLayout = true;
        this.gridlayout(this.list_sel, this.aRightanswer.length);
        this.list_sel.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.selChange, this);
    };
    p.selChange = function () {
        this.selectedIdx = this.list_sel.selectedIndex;
        var sTemp = this.selCollection.getItemAt(this.selectedIdx).label;
        var oTemp;
        //console.log('this.relativelain.confuse[this.selectedIdx]:'+this.relativelain.confuse[this.selectedIdx])
        var posTemp = this.relativelain.confuse[this.selectedIdx];
        // console.log('posTemp:'+posTemp)
        if (sTemp != '') {
            oTemp = { label: sTemp };
            this.selCollection.replaceItemAt({ "label": "" }, this.selectedIdx);
            this.aMyanswer.splice(this.selectedIdx, 1, -1);
            console.log('my点击的answer:' + this.aMyanswer.join(''));
            this.sourceCollection.replaceItemAt({ "label": sTemp }, posTemp);
            this.selCollection.addEventListener(eui.CollectionEvent.COLLECTION_CHANGE, this.collectionChangeHandler, this);
            this.sourceCollection.addEventListener(eui.CollectionEvent.COLLECTION_CHANGE, this.collectionChangeHandler, this);
        }
    };
    //展示可选文字
    p.shuffWord = function () {
        var sourceArr = [];
        var temp = [];
        for (var i = 0; i < 24; i++) {
            temp.push(i);
        }
        BaseUtil.shuffle(temp);
        this.sourceCollection = new eui.ArrayCollection();
        for (var i = 0; i < temp.length; i++) {
            this.sourceCollection.addItem({ "label": this.levelData['confuse_word'].substring(temp[i], temp[i] + 1) });
        }
        this.list_confuse.dataProvider = this.sourceCollection;
        this.addChild(this.list_confuse);
        this.list_confuse.itemRenderer = WordlabelRender;
        this.list_confuse.useVirtualLayout = true;
        this.gridlayout(this.list_confuse, 6);
        this.list_confuse.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.itemChange, this);
    };
    p.itemChange = function () {
        var isContinue;
        //判断第一个为' '
        var temp = BaseUtil.eleIdx(this.aMyanswer, -1);
        if (temp == -1) {
            isContinue = false;
        }
        else {
            isContinue = true;
        }
        if (isContinue) {
            this.selectedIdx = this.list_confuse.selectedIndex;
            var sTemp = this.sourceCollection.getItemAt(this.selectedIdx).label;
            this.aMyanswer[temp] = sTemp;
            this.relativelain.sel.push(temp); //问题出在没有控制这个数组的长度,以至于后面那些值一直取不到
            this.relativelain.confuse[temp] = this.selectedIdx;
            /**
             * 要实现的功能：  点击选择的，然后，它上去，然后点击上去的那个 它下来原来的位置
             * 所以点击上去的那个，不能清空，不然位置会排列错的
             */
            this.selCollection.replaceItemAt({ "label": sTemp }, temp);
            this.selCollection.addEventListener(eui.CollectionEvent.COLLECTION_CHANGE, this.collectionChangeHandler, this);
            this.sourceCollection.replaceItemAt({ "label": "" }, this.selectedIdx);
            this.sourceCollection.addEventListener(eui.CollectionEvent.COLLECTION_CHANGE, this.collectionChangeHandler, this);
            console.log("my答案长度：" + this.aMyanswer.length + ";正确答案：" + this.aRightanswer.join(''));
        }
    };
    p.collectionChangeHandler = function () {
        //当数据改变的时候，ArrayCollection 派发的事件
        this.checkAnswer();
    };
    //校对答案
    p.checkAnswer = function () {
        if (this.aMyanswer.indexOf(-1) != -1) {
            this.isFull = false;
        }
        else {
            this.isFull = true;
        }
        if (this.isFull == true) {
            var smya = this.aMyanswer.join("");
            var srighta = this.aRightanswer.join('');
            if (smya == srighta) {
                console.log('win &&　next');
                SceneGame.Shared().showWin();
            }
            else {
                console.log('lose');
            }
        }
    };
    //存储正确答案
    p.storageRight = function () {
        var sTemp = BaseUtil.removeSpace(this.levelData["song_name"]);
        var eTemp;
        this.aRightanswer = [];
        for (var i = 0; i < sTemp.length; i++) {
            eTemp = sTemp[i];
            if (eTemp != " ") {
                this.aRightanswer.push(eTemp);
                this.aMyanswer.push(-1);
            }
        }
    };
    //重新播放
    p.retry = function () {
        SoundManager.Shared().replay();
    };
    p.showWin = function () {
        SoundManager.Shared().pause();
        SoundManager.Shared()._answer(this.levelData);
        //赢的界面 下一题
        this.list_confuse.visible = false;
        this.list_sel.visible = false;
        this.winUI.visible = true;
        this.sonename.text = this.levelData["song_name"];
        this.tip.text = this.levelData["tips"];
        this.nextItembtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onclick_next, this);
        this.mainUIbtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backLevelscene, this);
        //开启下一关
        this.levelIndex += 1;
        SceneLevels.Shared().OpenLevel(this.levelIndex);
    };
    p.onclick_next = function () {
        SoundManager.Shared().pause();
        //将赢得界面隐藏掉
        this.winUI.visible = false;
        // SceneLevels.Shared().OpenLevel(this.levelIndex+1);
        this.InitLevel(this.levelIndex);
    };
    //回到关卡界面
    p.backLevelscene = function () {
        SoundManager.Shared().remove();
        this.winUI.visible = false;
        this.parent.addChild(SceneLevels.Shared());
        this.parent.removeChild(this);
    };
    //网格布局
    p.gridlayout = function (obj, colNum) {
        var tLayout = new eui.TileLayout();
        tLayout.horizontalGap = 10;
        tLayout.verticalGap = 5;
        tLayout.columnAlign = eui.ColumnAlign.LEFT; //指定如何将完全可见列与容器宽度对齐
        tLayout.rowAlign = eui.RowAlign.TOP; //指定如何将完全可见行与容器高度对齐
        tLayout.requestedColumnCount = colNum; /// 设置n列显示
        obj.layout = tLayout;
    };
    return SceneGame;
}(eui.Component));
egret.registerClass(SceneGame,'SceneGame');
//数据容器 http://developer.egret.com/cn/github/egret-docs/extension/EUI/dataCollection/List/index.html
//创建ItemRenderer
var WordlabelRender = (function (_super) {
    __extends(WordlabelRender, _super);
    function WordlabelRender() {
        _super.call(this);
        this.temp_word = SceneGame.Shared().list_confuse;
        this.skinName = "WordlabelSkin";
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
    }
    var d = __define,c=WordlabelRender,p=c.prototype;
    p.onComplete = function () {
        this.dataChanged();
    };
    p.dataChanged = function () {
        if (this.data) {
            if (this.wordLabel) {
                this.wordLabel.text = this.data.label;
            }
        }
    };
    return WordlabelRender;
}(eui.ItemRenderer));
egret.registerClass(WordlabelRender,'WordlabelRender');
/**
 * base
 */
var BaseUtil = (function () {
    function BaseUtil() {
    }
    var d = __define,c=BaseUtil,p=c.prototype;
    // 打乱顺序
    // 每次从未处理的数组中随机取一个元素，然后把该元素放到数组的尾部，即数组的尾部放的就是已经处理过的元素，
    //这是一种原地打乱的算法，每个元素随机概率也相等，时间复杂度从 Fisher 算法的 O(n2)提升到了 O(n)
    BaseUtil.shuffle = function (arr) {
        var r, temp;
        var l = arr.length;
        while (l > 0) {
            r = Math.random() * arr.length | 0;
            l--;
            //swap
            temp = arr[l];
            arr[l] = arr[r];
            arr[r] = temp;
        }
        // console.log('打乱歌词可选json文字后得到的arr:'+arr);
        return arr;
    };
    //push进数组的元素是唯一的
    BaseUtil.pushonly = function (arr, ele) {
        if (arr.indexOf(ele) == -1) {
            arr.push(ele);
        }
    };
    //去除字符串中个空格
    BaseUtil.removeSpace = function (s) {
        var temp = s.replace(/[]/g, '');
        return temp;
    };
    //去除数组中''所在的元素
    BaseUtil.removeArrayspace = function (a) {
        var idx;
        var cur;
        for (var i = 0; i < a.length; i++) {
            idx = i;
            cur = a[idx];
            if (cur == '') {
                a.splice(i, 1);
            }
        }
        // console.log(a.length);
    };
    //判断数组中第一个某值的元素的idx
    BaseUtil.eleIdx = function (arr, ele) {
        var temp;
        var l = arr.length;
        var idx = 0;
        if (arr.indexOf(ele) == -1) {
            temp = -1;
        }
        else {
            _run();
        }
        function _run() {
            if (arr[idx] != ele) {
                idx += 1;
                _run();
            }
            else {
                temp = idx;
            }
        }
        return temp;
    };
    return BaseUtil;
}());
egret.registerClass(BaseUtil,'BaseUtil');
//# sourceMappingURL=SceneGame.js.map