import { CloudType } from '../../../../app/public/interface';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { getQueryRedBagDetail, getRedBagConvert } from '../net/rpc';
interface Props {
    message:string;
    animation:boolean;// 开红包动画
}

/**
 * 发红包
 */
export class Home extends Widget {
    public props:Props = {
        message:'恭喜发财 万事如意',
        animation:false
    };

    /**
     * 点击打开红包
     */
    public openRedEnvelopeClick() {
        this.props.animation = true;
        setTimeout(() => {
            this.props.animation = false;
            const search = window.location.search.split('&');
            const mod = search[0].split('=')[1];
            const code =  search[1].split('=')[1];
            if (mod === 'redEnvelope') {
                getQueryRedBagDetail(code).then((r:any) => {
                    const redInfo = JSON.parse(r.msg);
                    const receive = redInfo.convert_info_list;
                    const receiveOpenId = [
                        {
                            openid: JSON.parse(redInfo.openid),
                            time:timestampFormat(JSON.parse(redInfo.send_time)),
                            sum:redInfo.total_amount
                        }
                    ];// 领取人的用户openID
                    receive.forEach(v => {
                        if (v.openid) {
                            receiveOpenId.push({
                                openid: JSON.parse(v.openid),
                                time:timestampFormat(JSON.parse(v.get_time)),
                                sum:v.amount
                            });
                        }
                    });
                    popNew('earn-client-rpc_client-view-redEnvelopeDetail',{
                        moneyType:CloudTypeName[CloudType[redInfo.coin_type]],
                        receiveOpenId,
                        count:redInfo.cid_list.length,
                        status:redInfo.redBag_type,
                        leftCount:redInfo.left_cid_list.length,
                        rid:code,
                        message:redInfo.desc
                    });
                });
            }
            this.paint();
        }, 1000);
        this.paint();
    }

}
/**
 * 时间戳格式化 毫秒为单位
 * timeType 1 返回时分， 2 返回月日， 3 返回月日时分
 */ 
export const timestampFormat = (timestamp: number,timeType?: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`;
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
    const hour = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
    const minutes = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
    const seconds = date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;

    if (timeType === 1) {
        return `${hour}:${minutes}`;
    }
    if (timeType === 2) {
        return `${month}月${day}日`;
    }
    if (timeType === 3) {
        return `${month}月${day}日 ${hour}:${minutes}`;
    }

    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
};

export enum CloudTypeName {
    KT = '嗨豆',  // KT
    ETH = 4001,       // ETH 
    BTC = 3001,       // BTC
    ST = '碎银'        // ST
}