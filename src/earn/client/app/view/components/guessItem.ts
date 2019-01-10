/**
 * 竞猜组件
 */

import { Widget } from '../../../../../pi/widget/widget';

export interface Props {
    
}
export class GuessItem extends Widget {
    public ok: () => void;
    public props:any = {
        
    };

    public setProps(props:Props) {
        super.setProps(this.props);
        this.props = {
            ...this.props
            
        };
    }

}