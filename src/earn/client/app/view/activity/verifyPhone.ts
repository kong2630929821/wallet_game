
/**
 * 活动-验证手机号
 */

import { Widget } from "../../../../../pi/widget/widget";
import { popNew } from "../../../../../pi/ui/root";

export class VerifyPhone extends Widget {
    public ok : () => void;
    constructor() {
        super();
    }

    /**
     * 返回上一页
     */
    public backPrePage() {
        this.ok && this.ok();
    }
    /**
     * 跳转验证手机号
     */
    public goVerifyPhone() {
        popNew('app-view-mine-setting-phone');
    }

}