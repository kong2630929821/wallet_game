import { Widget } from '../../../../pi/widget/widget';
/**
 * 红包详情
 */
export class RedEnvelopeDetail extends Widget {
    public copyBtnClick() {
        copyToClipboard('1111');
    }
}

// 复制到剪切板
const copyToClipboard = (copyText) => {
    
    const input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('value', copyText);
    input.setAttribute('style', 'position:absolute;top:-9999px;');
    document.body.appendChild(input);
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        input.setSelectionRange(0, 9999);
    } else {
        input.select();
    }
    if (document.execCommand('copy')) {
        document.execCommand('copy');
    }
    document.body.removeChild(input);
    popMessage('复制成功');
};
// 弹出提示框
const popMessage = (str) => {
    const element = document.createElement('div');
    element.setAttribute('class','messageMain');
    element.innerHTML = str;
    document.body.appendChild(element);
    setTimeout(() => {
        element.setAttribute('style','animation: popUpMess 0.3s forwards');
    }, 100);
    setTimeout(() => {
        element.setAttribute('style','animation: removeMess 0.3s forwards');
        setTimeout(() => {
            document.body.removeChild(element);
        }, 300);
    }, 2000);
};