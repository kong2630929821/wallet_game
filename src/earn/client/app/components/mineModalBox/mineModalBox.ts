/**
 * mineModalBox 挖矿提示弹框
 */

import { Widget } from '../../../../../pi/widget/widget';
import { Item_Enum } from '../../../../server/data/db/item.s';
import { setStore } from '../../store/memstore';
import { HoeType } from '../../xls/hoeType.s';

interface Props {
    miningMax:boolean;  // 挖矿达到上限提示
    routineAward:Award;    // 常规奖励内容
    extraAward:Award;   // 额外奖励内容
}
interface Award {
    awardType:number; 
    // tslint:disable-next-line:no-reserved-keywords
    type:number;
    // tslint:disable-next-line:no-reserved-keywords
    number:number;
}
export class MineModalBox extends Widget {
    public ok:() => void;
    public setProps(props:Props,oldProps:Props) {
        console.log(props);
        this.props = {
            ...props,
            routineAwardImgUrl:this.parseAward(props.routineAward),
            extraAwardImgUrl:this.parseAward(props.extraAward)
        };
        super.setProps(this.props,oldProps);
    }
    public parseAward(award:Award) {
        if (!award) return;
        let imgUrl = '../../res/image/'; 
        switch (award.awardType) {
            case Item_Enum.HOE:
                if (award.type === HoeType.IronHoe) {
                    imgUrl = `${imgUrl}2001.png`;
                } else if (award.type === HoeType.GoldHoe) {
                    imgUrl = `${imgUrl}2002.png`;
                } else if (award.type === HoeType.DiamondHoe) {
                    imgUrl = `${imgUrl}2003.png`;
                }
                break;
            case Item_Enum.BTC:
                imgUrl = `${imgUrl}BTC.png`;
                break;
            case Item_Enum.ETH:
                imgUrl = `${imgUrl}ETH.png`;
                break;
            case Item_Enum.KT:
                imgUrl = `${imgUrl}KT.png`;
                break;
            case Item_Enum.ST:
                imgUrl = `${imgUrl}ST.png`;
                break;
            default:
        }

        return imgUrl;
    }
    public closeClick() {
        setStore('flags/startMining',false); // 挖矿的时候勋章延迟弹出 (在点击奖励关闭后弹出)
        this.ok && this.ok();
    }
}