/**
 * 
 */
import { popNew } from '../../../../pi/ui/root';
import { addWidget } from '../../../../pi/widget/util';

export const run = (cb): void => {
    addWidget(document.body, 'pi-ui-root');
    popNew('earn-client-app-test-test');
    setTimeout(() => {
        if (cb) cb();
    }, 20);
};