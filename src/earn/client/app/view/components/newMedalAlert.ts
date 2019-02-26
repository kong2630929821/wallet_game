/**
 * 勋章成就 -- 新获勋章提示
 */

import { makeScreenShot } from '../../../../../app/logic/native';
import { getModulConfig } from '../../../../../app/modulConfig';
import { ShareToPlatforms } from '../../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../../pi/ui/root';
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
        const ktShow = getModulConfig('KT_SHOW');
        this.props = {
            ...this.props,
            fadeOut:false,
            medalImg: `medal${props.medalId}`,
            medalId: props.medalId,
            medalType: props.medalType,
            ktShow
        };
        console.log(this.props);
        
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
