/**
 * 工具类函数
 */

// 时间戳格式化 毫秒为单位
export const timestampFormat = (timestamp) => {
    if (typeof(timestamp) === 'string') {
        // tslint:disable-next-line:radix
        timestamp = parseInt(timestamp);
    }
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`;
    const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`;
    const hour = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
    const minutes = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
    const seconds = date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;

    return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
};

/**
 * st小转大单位
 * @param stNum st数量
 */
export const st2ST = (stNum:number) => {
    let ST = 0;
    if (stNum !== 0) {
        ST = stNum / 1000;
    }

    return ST;
};

/**
 * ST大转小单位
 * @param STNum ST数量
 */
export const ST2st = (STNum:number) => {
    let st = 0;
    if (STNum !== 0) {
        st = STNum * 1000;
    }

    return st;
};