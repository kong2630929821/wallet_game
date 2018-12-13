/**
 * uploadFile to server
 * @param base64 base54 encode
 */
export const uploadFile = async (base64, successCb?:(imgUrlSuf:string) => void,faileCb?:(err:any) => void) => {
    const file = base64ToFile(base64);
    const formData = new FormData();
    formData.append('upload',file);
    fetch(`${uploadFileUrlPrefix}?$forceServer=1`, {
        body: formData, // must match 'Content-Type' header
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors' // no-cors, cors, *same-origin
    }).then(response => response.json())
        .then(res => {
            console.log('uploadFile success ',res);
            if (res.result === 1) {
                successCb && successCb(res.sid);
            }
        }).catch(err => {
            console.log('uploadFile fail ',err);            
            faileCb && faileCb(err);
        });
};

/**
 * 图片base64转file格式
 */
const base64ToFile = (base64: string) => {
    const blob = base64ToBlob(base64);
    const newFile = new File([blob], 'avatar.jpeg', { type: blob.type });
    console.log(newFile);

    return newFile;
};

/**
 * base64 to blob
 */
const base64ToBlob = (base64: string) => {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
};

// FIXME: 临时使用的kuplay的服务
// 资源服务器ip
const sourceIp = 'app.kuplay.io';

// 资源服务器port
const sourcePort = '80';

// 上传图片的url前缀
const uploadFileUrlPrefix = `http://${sourceIp}:${sourcePort}/service/upload`;

// 下载图片的url前缀
export const downloadFileUrlPrefix = `http://${sourceIp}:${sourcePort}/service/get_file?sid=`;