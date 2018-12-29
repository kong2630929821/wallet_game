/**
 * 新用户登录
 */

import { Widget } from '../../../../../pi/widget/widget';

export class NewUserLogin extends Widget {
    public ok: () => void;
    public close(e: any) {
        this.ok && this.ok();
    }
}