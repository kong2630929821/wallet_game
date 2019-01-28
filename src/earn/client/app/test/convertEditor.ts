/**
 * 商城编辑
 */

import { Widget } from '../../../../pi/widget/widget';
import { RESULT_SUCCESS } from '../../../server/data/constant';
import { Result } from '../../../server/data/db/guessing.s';
import { AddConvert, AddConvertList, ConvertAwardList, ConvertTab, ProductInfo } from '../../../server/data/db/item.s';
import { add_convert, add_convert_info, get_convert_list } from '../../../server/rpc/stParties.p';
import { clientRpcFunc } from '../net/init';
import { uploadFile } from './compEditor';

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
        level: 1,
        pic: '',
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
        add_product(this.props.productId, this.props.stNum, this.props.productName, this.props.value, this.props.desc, this.props.progress, this.props.tips, this.props.level);
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

    public uploadAvatar(event: any) {
        console.log('res!!!!!', event);
        const file = event.srcElement.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            console.log(reader.result);
            uploadFile(reader.result);
        };
    }

    public importExcel(event:any) {
        const objCon = new ActiveXObject('ADODB.Connection');
        objCon.Provider = 'Microsoft.Jet.OLEDB.4.0"';
        objCon.ConnectionString = `Data Source=${event.srcElement.value};Extended Properties=Excel 8.0`;
        objCon.CursorLocation = 1;
        objCon.Open;
        let strQuery;
        // Get the SheetName
        let strSheetName = 'Sheet1$';
        let rsTemp =   new ActiveXObject('ADODB.Recordset');
        rsTemp = objCon.OpenSchema(20);
        if (!rsTemp.EOF) {
            strSheetName = rsTemp.Fields('Table_Name').Value;
        }
        rsTemp = null;
        const rsExcel =  new ActiveXObject('ADODB.Recordset');
        strQuery = `SELECT * FROM [ + ${strSheetName} + ]`;
        rsExcel.ActiveConnection = objCon;
        rsExcel.Open(strQuery);
        while (!rsExcel.EOF) {
            for (let i = 0;i < rsExcel.Fields.Count;++i) {
                alert(rsExcel.Fields(i).value);
            }
            rsExcel.MoveNext; 
        }
        // Close the connection and dispose the file
        objCon.Close;
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
                        progress: element.desc,
                        tips: element.tips,
                        level: element.level,
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
const add_product = (productId: number, stNum: number, productName: string, value: string, desc:string, progress:string, tips: string, level: number) => {
    return new Promise((resolve, reject) => {
        const product = new ProductInfo(productId, stNum, productName, value, desc, progress, tips, level);
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
const add_products = (addProductList: ConvertAwardList) => {
    return new Promise((resolve, reject) => {
        clientRpcFunc(add_convert_info, addProductList, (r: Result) => {
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