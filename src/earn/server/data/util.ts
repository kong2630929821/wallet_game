/**
 * 只有后端可以用的util
 */
import { Bucket } from '../../utils/db';
import { IDIndex } from './db/user.s';

// 获取唯一ID
export const get_index_id = (index: string) => {
    const IndexIDBucket = new Bucket('file', IDIndex._$info.name);
    const r = new IDIndex();
    IndexIDBucket.readAndWrite(index, (v) => {
        r.index = index;
        if (!v[0]) {
            r.id = 1;
        } else {
            r.id = v[0].id + 1;
        }

        return r;
    });

    return r.id;
};

export const getcdkey = (uid: number | string, code: string) => {
    return `${uid}:${code}`;
};