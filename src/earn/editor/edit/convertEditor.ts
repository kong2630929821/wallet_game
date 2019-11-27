import { uploadFileUrl } from '../../../app/public/config';
import { piFetch } from '../../../app/utils/pureUtils';
import { Widget } from '../../../pi/widget/widget';
import { clientRpcFunc } from '../../client/app/net/init';
import { RESULT_SUCCESS } from '../../server/data/constant';
import { Result } from '../../server/data/db/guessing.s';
import { AddConvert, AddConvertList, ConvertAwardList, ProductInfo } from '../../server/data/db/item.s';
import { add_convert, add_convert_info, add_convert_infos, delete_convert_info, get_convert_list, modify_convert_info } from '../../server/rpc/stParties.p';

/**
 * 商城编辑
 */

interface Props {
    productsList: any;
    addProducts: any;
    addProduct: any;
    productId: number;
    stNum: number;
    productName: string;
    value: string;
    desc: string;
    progress: string;
    tips: string;
    level: number;
    pic: string;
    convert: string;
    productNum: number;
    deadTime: string;
}

export class ConvertEditor extends Widget {
    public ok : () => void;
    public props: Props = {
        productsList: [],
        addProducts: [],
        addProduct: {},
        productId: 0,
        stNum: 0,
        productName: '',
        value: '',
        desc: '',
        progress: '',
        tips: '',
        pic: '',
        level: 1,
        convert: '',
        productNum: 0,
        deadTime: ''
    };

    public create() {
        super.create();
        this.initData();
    }

    public initData() {
        get_productInfo().then((res: any) => {
            this.props.productsList = res;
            this.paint();
            console.log('initData in !!!!!!!!!!!!!!!!!!!', this.props.productsList);
        });
        this.paint();
    }

    public addProduct() {
        add_product(this.props.productId, this.props.stNum, this.props.productName, this.props.value, this.props.desc, this.props.progress, this.props.tips, this.props.level, this.props.pic);
        this.initData();
        this.paint();
    }

    public addProducts() {
        add_products();
        this.initData();
        this.paint();
    }

    public inputProduct(event: any) {
        this.props.addProducts.push(event.currentTarget.value);
        console.log('addProducts!!!!!!!!!!', this.props.addProducts);
    }

    public inputProductId(event: any) {
        this.props.productId = parseInt(event.currentTarget.value, 10);
        console.log('this.props.productId', event.currentTarget.value);
    }
    
    public inputStNum(event: any) {
        this.props.stNum = parseInt(event.currentTarget.value, 10);
        console.log('this.props.productId', event.currentTarget.value);
    }

    public inputProductName(event: any) {
        this.props.productName = event.currentTarget.value;
    }

    public inputValue(event: any) {
        this.props.value = event.currentTarget.value;
    }

    public inputDesc(event: any) {
        this.props.desc = event.currentTarget.value;
    }

    public inputProgress(event: any) {
        this.props.progress = event.currentTarget.value;
    }

    public inputTips(event: any) {
        this.props.tips = event.currentTarget.value;
    }

    public inputLevel(event: any) {
        this.props.level = parseInt(event.currentTarget.value, 10);
    }

    public inputPic(event: any) {
        this.props.pic = event.currentTarget.value;
    }

    public inputConvert(event: any) {
        this.props.convert = event.currentTarget.value;
    }

    public inputProductNum(event: any) {
        this.props.productNum = parseInt(event.currentTarget.value, 10);
    }

    public inputDeadTime(event: any) {
        this.props.deadTime = event.currentTarget.value;
    }

    public addConvert() {
        add_converts(this.props.convert, this.props.productNum, this.props.deadTime);
        this.initData();
        this.paint();
    }
    
    public modify(e: any, index: number) {
        const product = this.props.productsList[index];
        console.log('product', product);
        this.props.addProduct = product;
        this.props.productId = product.id;
        this.props.stNum = product.stCount;
        this.props.productName = product.name;
        this.props.value = product.value;
        this.props.desc = product.desc;
        this.props.progress = product.progress;
        this.props.tips = product.tips;
        this.props.level = product.level;
        this.props.pic = product.pic;
        this.paint();
    }

    public doModify() {
        const product = new ProductInfo(this.props.productId, this.props.stNum, this.props.productName, this.props.value, this.props.desc, this.props.progress, this.props.tips, this.props.level, this.props.pic, this.props.addProduct.leftCount, this.props.addProduct.convertCount);
        modify_product(product);
        this.initData();
        this.paint();
    }

    public deleteProduct(e:any, id: number) {
        delete_product(id);
        this.initData();
        this.paint();
    }

    public uploadAvatar(event: any) {
        const file = event.srcElement.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            uploadFile(reader.result).then((sid) => {
                console.log('pic!!!!!', sid);
                // this.props.pic = sid;
            });
        };
        this.paint();
    }
}

// 获取商品信息
const get_productInfo = () => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(get_convert_list, null, (r: Result) => {
            console.log(r);
            if (r.reslutCode === RESULT_SUCCESS) {
                const compList: ConvertAwardList = JSON.parse(r.msg);
                const resData = [];
                compList.list.forEach(element => {
                    const data = {
                        id: element.id,
                        stCount: element.stCount,
                        name: element.name,
                        value: element.value,
                        desc: element.desc,
                        progress: element.progress,
                        tips: element.tips,
                        level: element.level,
                        pic: element.pic,
                        leftCount: element.leftCount,
                        convertCount: element.convertCount
                    };
                    resData.push(data);
                });
                console.log('商品信息!!!!!!!!：', resData);
                resolve(resData);
            } else {
                reject(r);
            }
        });
    });
};

// 添加单个商品
const add_product = (productId: number, stNum: number, productName: string, value: string, desc:string, progress:string, tips: string, level: number, pic: string) => {
    return new Promise((resolve, reject) => {
        const product = new ProductInfo(productId, stNum, productName, value, desc, progress, tips, level, pic);
        console.log('productId!!!!!!', typeof(productId));
        const addList = new ConvertAwardList();
        addList.list = [];
        addList.list.push(product);
        console.log('product!!!!!!', product);
        clientRpcFunc(add_convert_info, addList, (r: Result) => {
            console.log(r);
            if (r.reslutCode === RESULT_SUCCESS) {
                alert('添加商品成功');
                resolve(r);
            } else {
                reject(r);
            }
        });
    });
};

// 修改商品
const modify_product = (product: ProductInfo) => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(modify_convert_info, product, (r: Result) => {
            console.log(r);
            if (r.reslutCode === RESULT_SUCCESS) {
                alert('修改商品成功');
                resolve(r);
            } else {
                reject(r);
            }
        });
    });
};

// 删除商品
const delete_product = (productId: number) => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(delete_convert_info, productId, (r: Result) => {
            console.log(r);
            if (r.reslutCode === RESULT_SUCCESS) {
                alert('删除商品成功');
                resolve(r);
            } else {
                reject(r);
            }
        });
    });
};

// 添加兑换码
const add_converts = (convert: string, productNum: number, deadTime: string) => {
    return new Promise((resolve, reject) => {
        const product = new AddConvert(productNum, convert, deadTime);
        const addList = new AddConvertList();
        addList.list = [];
        addList.list.push(product);
        console.log('product!!!!!!', product);
        clientRpcFunc(add_convert, addList, (r: Result) => {
            console.log(r);
            if (r.reslutCode === RESULT_SUCCESS) {
                alert('添加兑换码成功');
                resolve(r);
            } else {
                reject(r);
            }
        });
    });
};

// 批量添加商品
const add_products = () => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(add_convert_infos, null, (r: Result) => {
            console.log(r);
            if (r.reslutCode === RESULT_SUCCESS) {
                alert('添加商品成功');
                resolve(r);
            } else {
                reject(r);
            }
        });
    });
};

// 上传文件
export const uploadFile = async (base64) => {
    console.log('uploadFile in !!!!!!!!!!!!!');
    const file = base64ToFile(base64);
    const formData = new FormData();
    formData.append('upload',file);
    piFetch(`${uploadFileUrl}?$forceServer=1`, {
        body: formData, // must match 'Content-Type' header
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, same-origin, *omit
        headers: {
            'user-agent': 'Mozilla/4.0 MDN Example'
        },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'no-cors' // no-cors, cors, *same-origin
        // redirect: 'follow', // manual, *follow, error
        // referrer: 'no-referrer' // *client, no-referrer
    }).then(res => {
        console.log('uploadFile success ',res);
        if (res.result === 1) {
            alert(`图片上传成功${res.sid}`);

            return Promise.resolve(res.sid);
        }
    }).catch(err => {
        console.log('uploadFile fail ',err);
    });
};

/**
 * 图片base64转file格式
 */
export const base64ToFile = (base64: string) => {
    const blob = base64ToBlob(base64);
    const newFile = new File([blob], 'avatar.jpeg', { type: blob.type });
    console.log(newFile);

    return newFile;
};

/**
 * base64 to blob
 */
export const base64ToBlob = (base64: string) => {
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