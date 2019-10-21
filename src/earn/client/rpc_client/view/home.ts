import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { getQueryRedBagDetail } from '../net/rpc';
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
            if (mod !== 'redEnvelope') {
                getQueryRedBagDetail('L95UX874GSF').then((r:any) => {
                    const redInfo = JSON.parse(r.msg);
                    debugger;
                });
            }
            this.paint();
        }, 1000);
        popNew('earn-client-rpc_client-view-redEnvelopeDetail');
        this.paint();
    }

}