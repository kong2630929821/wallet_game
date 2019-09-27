/**
 * 单个排名列表组件
 */

import { getModulConfig } from '../../../../../app/publicLib/modulConfig';
import { Widget } from '../../../../../pi/widget/widget';

export class RankItem extends Widget {

    constructor() {
        super();
    }
    public setProps(props:JSON,oldProps:JSON) {
        this.props = {
            ...props,
            ktShow:getModulConfig('KT_SHOW')
        };
        super.setProps(this.props,oldProps);
    }
    // public props = {
    //     rank: 1,
    //     avatar: '',
    //     userName: '啊实打实的',
    //     ktNum: 500,

    // }

}
