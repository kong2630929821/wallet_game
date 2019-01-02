/**
 * 新用户登录
 */

import { Widget } from '../../../../../pi/widget/widget';
import { getPrizeInfo, getRegularPrizeList } from '../../utils/util';
import { ActivityType } from '../../xls/dataEnum.s';

export class NewUserLogin extends Widget {
    public ok: () => void;
    public props:any = {
        prizeList:[]
    };

    public create() {
        super.create();
        const data = getRegularPrizeList(ActivityType.NewUserWelfare);
        data.forEach(element => {
            const prize = {
                info:getPrizeInfo(element.prop),
                count:element.count
            };
            this.props.prizeList.push(prize);
        });
        
    }

    public close(e: any) {
        this.ok && this.ok();
    }
}