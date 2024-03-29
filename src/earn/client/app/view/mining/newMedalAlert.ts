/**
 * 勋章成就 -- 新获勋章提示
 */

import { getModulConfig, shareDownload } from '../../../../../app/public/config';
import { getUserInfo, popNewMessage } from '../../../../../app/utils/pureUtils';
import { SharePlatform, ShareToPlatforms } from '../../../../../pi/browser/shareToPlatforms';
import { Widget } from '../../../../../pi/widget/widget';
import { getMedalList } from '../../utils/tools';
import { coinUnitchange } from '../../utils/util';
import { CoinType } from '../../xls/dataEnum.s';
import { MedalType } from '../medal/medalShow';

interface Props {
    medalId: number; // 勋章图片编号
}

export class NewMedalAlert extends Widget {
    public ok: () => void;
    public props: any = {
        medalId: 8001,
        medalImg: '',
        condition: 0, // 勋章获得条件
        medalTitle: {}, // 勋章称号,
        userInfo:{},
        shareUrl:''
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
        getUserInfo().then(userInfo => {
            this.props.userInfo = userInfo;
            this.paint();
        });
    }

    public shareWX() {
        this.props.shareUrl = shareDownload;
        this.paint();
        this.baseShare(SharePlatform.PLATFORM_WEBCHAT);
    }

    public baseShare(platform: number) {
        ShareToPlatforms.makeScreenShot({
            success: (result) => { 
                this.ok && this.ok();

                ShareToPlatforms.shareScreenShot({
                    success: (result) => { 
                        popNewMessage('分享成功');
                    },
                    fail: (result) => { 
                        // console.log();
                    },
                    platform: platform
                });
            },
            fail: (result) => { 
                this.ok && this.ok();
                popNewMessage(this.config.value.tips);
            }
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
