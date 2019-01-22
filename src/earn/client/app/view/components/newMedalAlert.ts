/**
 * 勋章成就 -- 新获勋章提示
 */

import { Widget } from '../../../../../pi/widget/widget';
import { getStore } from '../../store/memstore';
import { getACHVmedalList, getMedalList } from '../../utils/util';

interface Props {
    medalId: number; // 勋章图片编号
    medalType: number; // 勋章类型
}

export class NewMedalAlert extends Widget {
    public ok: () => void;
    public props: any = {
        medalId: 0,
        medalType: 0,

        medalImg: '',
        condition: 0, // 勋章获得条件
        medalTitle: {}, // 勋章称号,
        userInfo:getStore('userInfo')
    };

    public setProps(props: Props) {
        super.setProps(this.props);
        let medalInfo;
        if (props.medalType === 0) {
            medalInfo = getMedalList(props.medalId, 'id');
            this.props.condition = medalInfo[0].coinNum;
            this.props.medalTitle = { zh_Hans: medalInfo[0].desc, zh_Hant: medalInfo[0].descHant, en: '' };
        } else if (props.medalType === 1) {
            medalInfo = getACHVmedalList(props.medalId, 'id');
            this.props.condition = '挖到0.5ETH取得成就';
            this.props.medalTitle = { zh_Hans: medalInfo[0].desc, zh_Hant: medalInfo[0].descHant, en: '' };
        }

        this.props = {
            ...this.props,
            medalImg: `medal${props.medalId}`,
            medalId: props.medalId,
            medalType: props.medalType
        };
        console.log(this.props);
        
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}
