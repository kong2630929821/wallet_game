import { LuckyMoneyType } from '../../../../app/public/interface';
import { popNew } from '../../../../pi/ui/root';
import { Widget } from '../../../../pi/widget/widget';
import { getRedBagConvert, getUserList } from '../net/rpc';
interface Props {
    receiveOpenId:any;// 领取的用户openId 0项是发红包人
    code:string;// 兑换码
    message:string;// 描述
    count:number;// 个数
    sum:number;// 红包总金额
    moneyType:string;// 金额类型
    status:number;// 红包类型
    leftCount:number;// 剩余个数
    rid:string;// 红包码
    userInfo:any;// 用户信息
}
/**
 * 红包详情
 */
export class RedEnvelopeDetail extends Widget {
    public props:Props = {
        receiveOpenId:[],
        code:'',
        message:'',
        count:0,
        sum:0,
        moneyType:'',
        status:0,
        leftCount:0,
        rid:'',
        userInfo:[]
    };

    public setProps(props:any) {
        this.props = {
            ...this.props,
            ...props
        };
        super.setProps(this.props);
        this.getRedCode();
        this.getUserInfo();
    }

    /**
     * 获取红包兑换码
     */
    public getRedCode() {
        getRedBagConvert(this.props.rid).then((r:any) => {
            if (r.reslutCode === 1) {
                const msg = JSON.parse(r.msg);
                this.props.code = this.props.status === 1 ? LuckyMoneyType.Normal + msg.cid :LuckyMoneyType.Random + msg.cid;
                this.paint();
            }
        });
    }

    public getUserInfo() {
        getUserList(this.props.receiveOpenId,1).then((r:any) => {
            this.props.userInfo = r;
            this.paint();
        });
    }
    public copyBtnClick() {
        copyToClipboard(this.props.code);
        popMessage('复制成功');
    }

    /**
     * 下载页面
     */
    public receiveClick() {
        popNew('earn-client-rpc_client-view-downLoad');
    }
}

// 复制到剪切板
export const copyToClipboard = (copyText) => {
    const input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('value', copyText);
    input.setAttribute('style', 'position:absolute;top:-9999px;');
    document.body.appendChild(input);
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        input.setSelectionRange(0, 9999);
    } else {
        input.select();
    }
    if (document.execCommand('copy')) {
        document.execCommand('copy');
    }
    document.body.removeChild(input);
};

// 弹出提示框
const popMessage = (str) => {
    const element = document.createElement('div');
    element.className = 'messageMain';
    element.innerHTML = str;
    element.style = `
    position: fixed;
    left: 50%;
    bottom: 100px;
    border-radius: 6px;
    background-color: rgba(0, 0, 0, 0.9);
    line-height: 45px;
    color: rgba(255, 255, 255, 0.87);
    font-size: 16px;
    text-align: center;
    padding: 0 25px;
    transform: translateX(-50%);
    animation: popUpMess 0.3s forwards
    `;
    document.body.appendChild(element);
    setTimeout(() => {
        element.style = `
    position: fixed;
    left: 50%;
    bottom: 100px;
    border-radius: 6px;
    background-color: rgba(0, 0, 0, 0.9);
    line-height: 45px;
    color: rgba(255, 255, 255, 0.87);
    font-size: 16px;
    text-align: center;
    padding: 0 25px;
    transform: translateX(-50%);
    animation: removeMess 0.3s forwards;
    `;
        setTimeout(() => {
            document.body.removeChild(element);
        }, 500);
    }, 1000);
};