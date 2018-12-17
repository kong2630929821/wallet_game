/**
 * 
 */
import { popNew } from '../../../pi/ui/root';
import { addWidget } from '../../../pi/widget/util';

export const run = (cb): void => {
    addWidget(document.body, 'pi-ui-root');
    popNew('client-app-view-test-test');
    setTimeout(() => {
        if (cb) cb();
    }, 20);
};