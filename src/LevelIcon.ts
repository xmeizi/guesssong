class LevelIcon extends eui.Button{
    private lb_level:eui.Label = new eui.Label();
    public constructor(){
        super();
        this.skinName = 'LevelIconSkin';
        
        this.lb_level.textColor=0xFFFFFF;
        this.lb_level.horizontalCenter=0; 
        this.lb_level.verticalCenter=0;
        this.addChild(this.lb_level);
    }
  
    public get Level():number{
        return parseInt(this.lb_level.text);
    }
    public set Level(value:number){
        this.lb_level.text = value.toString();
    }
}