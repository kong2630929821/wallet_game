import { Widget } from '../../../../pi/widget/widget';
interface Props {
    show:boolean;// 是否显示下载
}
/**
 * 下载
 */
export class DownLoad extends Widget {
    public props:Props = {
        show:false
    };
    public downLoad() {
        const ua:any = navigator.userAgent;
        const isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;   // 判断是否是 android终端
        const isIOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);     // 判断是否是 ios终端
        const isIosQQ = (isIOS && / QQ/i.test(ua));    // ios内置qq浏览器
        const isAndroidQQ = (isAndroid && /MQQBrowser/i.test(ua) && /QQ/i.test(ua.split('MQQBrowser'))); // android内置qq浏览器
        const isWX = ua.match(/MicroMessenger/i) === 'MicroMessenger';   // 微信
        // alert(`isIosQQ = ${isIosQQ},isAndroidQQ = ${isAndroidQQ},isWX = ${isWX}`);
        
        if (isWX || isIosQQ || isAndroidQQ) {
            this.props.show = true;
        } else {
            location.href = 'https://app.herominer.net/wallet/appversion/xzxd_1.0.6.apk';
        }
        this.paint();
    }

    public closeTips() {
        this.props.show = false;
        this.paint();
    }
}