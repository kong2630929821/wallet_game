/**
 * 竞猜主页-筛选
 */

import { Widget } from '../../../../../../pi/widget/widget';
import { getAllGuess } from '../../../net/rpc';

export class FilterGuess extends Widget {
    public ok: () => void;
    
    public props:any = {
        guessList:[],
        selectMacth:{
            list:[]
        }
    };

    public create () {
        super.create();
        getAllGuess().then((res:any[]) => {
            this.props.guessList = this.processData(res);
            this.changeTopbar(0);
            this.paint();
        });
        
    }

    public processData(ary:any[]) {
        const matchMap = {};
        const matchList = [];
        ary.forEach(element => {
            const matchType = element.matchType;
            if (!matchMap[matchType]) {
                matchList.push({
                    matchType,
                    matchName:element.matchName,
                    list:[element]
                });
                matchMap[matchType] = matchType;
            } else {
                matchList.forEach(element1 => {
                    if (element1.matchType === matchType) {
                        element1.list.push(element);

                    }
                });
            }
        });

        matchList.forEach(element => {
            element.list = this.processDayList(element.list);
        });

        console.log(matchList);
        
        return matchList;
    }
    
    public processDayList (ary:any[]) {
        const dayMap = {};
        const dayList = [];
        ary.forEach(element => {
            const timeStr = element.time.slice(0,10);
            if (!dayMap[timeStr]) {
                dayList.push({
                    time:timeStr,
                    week:element.week,
                    list:[element]
                });
                dayMap[timeStr] = timeStr;
            } else {
                dayList.forEach(element1 => {
                    if (element1.time.slice(0,10) === timeStr) {
                        element1.list.push(element);

                    }
                });
            }
        });

        return dayList;
    }
    /**
     * 修改筛选比赛
     * @param index 选择序号
     */
    public changeTopbar(index:number) {
        this.props.selectMacth = this.props.guessList[index];
        console.log(this.props.selectMacth);
        
        this.paint();
    }
    /**
     * 返回
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}