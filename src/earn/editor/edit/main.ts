import { addWidget } from '../../../pi/widget/util';

import { popNew } from '../../../pi/ui/root';

/**
 * 
 */

export const run = (cb): void => {
    addWidget(document.body, 'pi-ui-root');
    popNew('earn-editor-edit-test');
    setTimeout(() => {
        if (cb) cb();
    }, 20);
};