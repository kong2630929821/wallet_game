/**
 * 
 */
import { popNew } from '../../../../pi/ui/root';
import { addWidget } from '../../../../pi/widget/util';

export const run = (cb): void => {
    addWidget(document.body, 'pi-ui-root');
    popNew('earn-client-rpc_client-view-home');
    setTimeout(() => {
        if (cb) cb();
    }, 20);
};