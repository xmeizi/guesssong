/**
 *每个关卡的数据结构
 */
class LevelDataItem{
    public songname:string;
    public filename:string;
    public voice:string;
    public tips:string;
    public confuseword:string;
}
/**
 * 关卡数据管理器
 */
class LevelDataManager{
    private static shared:LevelDataManager;
    public static Shared(){
        if(LevelDataManager.shared == null){
            LevelDataManager.shared = new LevelDataManager();
        }
        return LevelDataManager.shared;
    }
    //一个关卡的保存数据组
    private items:LevelDataItem[] = [];
    
    public constructor(){
        //使用res读取和构建json数据，json数据可以直接解析到目标结构
        this.items = RES.getRes("levels_json");
        //如此获得json中的数据
        //console.log(this.items['document'].Level[1]['tips'])
    }
    
    //通过关卡号获得一个关的数据
    public GetLevel(level:number):LevelDataItem{
        if(level < 0) level = 0;
        if(level >= this.items.length) level = this.items.length-1;
        return this.items["document"].Level[level];
    }

    //获得当前的游戏最远进度
    public get Milestone():number{
        let milestone = egret.localStorage.getItem('FKCFM_milestone');
        //如果没有数据，那么默认值就是第一关
        if(milestone == '' || milestone == null){
            milestone = '1';
        }
        return parseInt(milestone);
    }
    //设置当前的游戏最远进度
    public set Milestone(value:number){
        egret.localStorage.setItem("FKCFM_milestone",value.toString());
    }
}


class SceneLevels extends eui.Component{
    
    //单例
    private static shared:SceneLevels;
    public static Shared(){
        if(SceneLevels.shared == null){
            SceneLevels.shared = new SceneLevels();
        }
        return SceneLevels.shared;
    }
    //开始每一关的游戏
    private sel_level:number = 0;
    private LevelIcons:LevelIcon[]=[];
    
    private group_levels:eui.Group;    //scroller组件的下属内容命名group_levels
    private img_arrow:eui.Image;
    private scroller:eui.Scroller;

    public constructor(){
        super();
        this.skinName = "SceneLevel";
        this.group_levels = new eui.Group();
        
        //创建地图选项
        let row = 20;
        let col =10;
        let spanx = 542 / col;          //计算行x列y间隔
        let spany = 801 / row;
        let group = new eui.Group();    //地图背景
        group.width = 542;
        group.height = (spany*99);
        //repeat-y填充背景 音符存在的那张背景 
        //<e:Image source="resource/assets/element.png" x="43" y="0" height="797"  width="455" visible="true" scaleX="1.01" scaleY="1.01"/>
        for(let i = 0;i <= (group.height/801);i++){
            let img = new eui.Image();
            img.source = RES.getRes("element_png") ;
            img.x = 48;
            img.y = i*801;
            img.height = 797;
            img.width = 455;
            img.scaleX = 1.01;
            img.scaleY = 1.01;
            img.touchEnabled = false;
            this.group_levels.addChild(img);
        }
        
        //以正弦曲线绘制关卡图标的路径
        let milestone:number = LevelDataManager.Shared().Milestone;
        for(let i=0;i < 99;i++){
            let icon = new LevelIcon();
            icon.Level = i+1;
            icon.y = spany*i/2;
            icon.x = Math.sin(icon.y / 180 * Math.PI) * 400 + group.width / 8;
            icon.y += spany*i/2;
            icon.y = group.height - icon.y -spany;
            group.addChild(icon);
            //依据进度设置关卡显示
            icon.enabled = i < milestone;
            // 保存到一个列表中
            this.LevelIcons.push(icon);
        }
        group.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onclick_level,this);

        //开启位图缓存模式
        group.cacheAsBitmap = true;
        
        // 跟踪小手
        this.img_arrow = new eui.Image();
        this.img_arrow.source = RES.getRes("dir_png");
        this.img_arrow.anchorOffsetX = 124/2 - group.getChildAt(0).width/2;
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

    private onclick_level(e:egret.TouchEvent){
        for(let i=0;i<this.LevelIcons.length;i++){
            let icon = this.LevelIcons[i];
            if(e.target == icon){
                if(this.sel_level != icon.Level){
                    this.img_arrow.x = icon.x;
                    this.img_arrow.y = icon.y;
                    this.sel_level = icon.Level;
                }else{
                    //进入并开始游戏
                    console.log('icon.Level:'+icon.Level);
                    console.log(typeof(icon.Level))
                    this.parent.addChild(SceneGame.Shared());
                    SceneGame.Shared().InitLevel(icon.Level);
                    this.parent.removeChild(this);
                }
            }
        }
    }

    //打开指定的关卡，如果大于最远关卡，则保存数据也跟着调整
    // 是为了将来做准备，当关卡完成后就会开启对应关卡icon
    public OpenLevel(level:number){
        let icon = this.LevelIcons[level-1];
        icon.enabled = true;
        if(level > LevelDataManager.Shared().Milestone){       //大于最大一关 之后 这个是干啥  待 
            LevelDataManager.Shared().Milestone = level;
            // 同时将选定标记置于其上
            this.img_arrow.x = icon.x;
            this.img_arrow.y = icon.y;
            this.sel_level = icon.Level;
        }
    }
}
