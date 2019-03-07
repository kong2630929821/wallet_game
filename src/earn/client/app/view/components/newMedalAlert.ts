/**
 * 勋章成就 -- 新获勋章提示
 */

import { makeScreenShot } from '../../../../../app/logic/native';
import { getModulConfig } from '../../../../../app/modulConfig';
import { getUserInfo } from '../../../../../app/utils/tools';
import { ShareToPlatforms } from '../../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../../pi/ui/root';
import { Widget } from '../../../../../pi/widget/widget';
import { coinUnitchange } from '../../utils/tools';
import { getMedalList } from '../../utils/util';
import { CoinType } from '../../xls/dataEnum.s';
import { MedalType } from '../medal/medalShow';

interface Props {
    medalId: number; // 勋章图片编号
}

export class NewMedalAlert extends Widget {
    public ok: () => void;
    public props: any = {
        medalId: 0,
        medalImg: '',
        condition: 0, // 勋章获得条件
        medalTitle: {}, // 勋章称号,
        userInfo:getUserInfo()
    };

    public setProps(props: Props) {
        const medalInfo = getMedalList(props.medalId, 'id');
        this.props.condition = coinUnitchange(medalInfo[0].coinType,medalInfo[0].coinNum);
        this.props.medalType = medalInfo[0].coinType === CoinType.KT ? MedalType.rankMedal : MedalType.ACHVmedal;
        this.props.medalTitle = { zh_Hans: medalInfo[0].desc, zh_Hant: medalInfo[0].descHant, en: '' };
        if (this.props.medalType === MedalType.ACHVmedal) {
            const coinType = medalInfo[0].coinType;
            const coinShow = coinType === CoinType.ST ? getModulConfig('ST_SHOW') : (coinType === CoinType.ETH ? 'ETH' : 'BTC'); 
            this.props.coinShow = `挖到${coinShow}`;
        }
        const ktShow = getModulConfig('KT_SHOW');
        this.props = {
            ...this.props,
            ...props,
            fadeOut:false,
            medalImg: `medal${props.medalId}`,
            medalId: props.medalId,
            ktShow
        };
        console.log(this.props);
        super.setProps(this.props);
    }

    public shareWX() {
        makeScreenShot(() => {
            const stp = new ShareToPlatforms();
            stp.init();
            stp.shareScreenShot({
                success: (result) => { console.log('share success callback'); },
                fail: (result) => { console.log('share fail callback'); },
                platform: ShareToPlatforms.PLATFORM_WEBCHAT
            });
        }, () => {
            popNew('app-components1-message-message', { content: this.config.value.tips });
        });
        
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.props.fadeOut = true;
        this.paint();
        setTimeout(() => {
            this.ok && this.ok();
        },300);
    }
}
