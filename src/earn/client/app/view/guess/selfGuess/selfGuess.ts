/**
 * 竞猜主页-我的
 */

import { popNew } from '../../../../../../pi/ui/root';
import { Widget } from '../../../../../../pi/widget/widget';
import { getMyGuess } from '../../../net/rpc';
import { st2ST } from '../../../utils/tools';

export class SelfGuess extends Widget {
    public ok: () => void;
    
    public props:any = {
        myGuessList:[]
    };

    public create () {
        super.create();
        getMyGuess().then((resAry:any) => {
            this.props.myGuessList = this.processData(resAry);
            this.paint();
        });
    }

    public processData(ary:any[]) {
        const map = {};
        const list = [];
        ary.forEach(element => {
            const cid = element.guessData.cid;
            const teamName = element.guessing.guessTeam;
            if (!map[cid] || !map[teamName]) {
                list.push({
                    ...element,
                    cid:cid,
                    teamName:teamName
                });
                map[cid] = cid;
                map[teamName] = teamName;
            } else {
                list.forEach(element1 => {
                    if (element1.cid === cid && element1.teamName === teamName) {
                        element1.guessing.guessSTnum += element.guessing.guessSTnum;
                        element1.guessing.benefit += element.guessing.benefit;
                        element1.guessing.time = element.guessing.time;
                    }
                });
            }
        });

        list.forEach(element => {
            element.guessing.benefit = st2ST(element.guessing.benefit);
            element.guessing.guessSTnum = st2ST(element.guessing.guessSTnum);
        });
        console.log(list);
        
        return list;
    }

    /**
     * 详情
     */
    public goDetail(index:number) {
        popNew('earn-client-app-view-guess-selfGuess-selfGuessDetail',this.props.myGuessList[index]);
    }

    /**
     * 返回
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}