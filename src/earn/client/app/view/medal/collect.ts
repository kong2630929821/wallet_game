/**
 * 我的收藏 --主页
 */

import { getUserInfo, popNewMessage } from '../../../../../app/utils/tools';
import { makeScreenShot } from '../../../../../app/viewLogic/native';
import { ShareType } from '../../../../../pi/browser/shareToPlatforms';
import { popModalBoxs, popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { getRealNode } from '../../../../../pi/widget/painter';
import { Widget } from '../../../../../pi/widget/widget';
import { getStore, register } from '../../store/memstore';
import { getACHVmedalList } from '../../utils/util';
import { MedalType } from './medalShow';

// ================================ 导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

// tslint:disable-next-line:completed-docs
export class Collect extends Widget {
    public ok: () => void;
    public props:any = {
        scrollHeight: 0,
        medalList: [],
        myCollect:[],
        percentage:0,
        avatar:''
    };

    public create() {
        super.create();
        const list = getACHVmedalList('偶然成就','typeNum');
        getUserInfo().then(userInfo => {
            if (userInfo) {  
                this.props.avatar = userInfo.avatar ? userInfo.avatar : 'app/res/image/default_avater_big.png';
            }
        });
        
        list.forEach(element => {
            const data = { title: { zh_Hans: element.desc, zh_Hant: element.descHant, en: '' }, img: `medal${element.id}`, id: element.id ,isHave:false };
            this.props.medalList.push(data);
        });
        this.initData();
    }

    /**
     * 更新props数据
     */
    public initData() {

        this.props.myCollect = getStore('ACHVmedals');
        this.props.medalList.forEach(element => {
            element.isHave = this.props.myCollect.includes(element.id);
        });
        this.props.percentage = Math.floor(this.props.myCollect.length / this.props.medalList.length * 100) ;

        this.paint();
    }

    /**
     * 屏幕滑动
     */
    public scrollPage(e: any) {

        const scrollTop = e.target.scrollTop;
        this.props.scrollHeight = scrollTop;
        this.paint();
    }

    /**
     * 分享
     */
    public shareClick() {
        makeScreenShot(() => {
            popNew('app-components-share-share', { shareType: ShareType.TYPE_SCREEN });
        }, () => {
            popNewMessage(this.config.value.tips);
        });
        
    }

    /**
     * 勋章展示
     */
    public medalShow(e: any, index: number) {

        const $realDom = getRealNode(e.node);
        const medalSite = {
            top: Math.floor($realDom.getBoundingClientRect().top),
            left: Math.floor($realDom.getBoundingClientRect().left),
            width: $realDom.getBoundingClientRect().width,
            height: $realDom.getBoundingClientRect().height
        };

        const $realDomStyle = $realDom.style;
        $realDomStyle.visibility  = `hidden`;

        popModalBoxs('earn-client-app-view-medal-medalShow', { 
            medalId:this.props.medalList[index].id, 
            medalSite ,
            isHave:this.props.medalList[index].isHave,
            medalType:MedalType.ACHVmedal 
        }, () => {
            $realDomStyle.visibility = `visible`;
            this.paint();
        });

        this.paint();
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
}

// ===================================================== 立即执行

register('ACHVmedals', (r) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    w && w.initData();
});