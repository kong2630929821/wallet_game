/**
 * 自动登录
 */

// =====================================导入
import { Client } from '../../../../pi/net/mqtt_c';
import { create } from '../../../../pi/net/rpc';
import { UserInfo } from '../../../server/data/db/user.s';
import { auto_login, getToken } from '../../../server/rpc/session.p';
import { AutoLogin, GetToken, Token } from '../../../server/rpc/user.s';
import { clientRpcFunc, subscribe } from '../net/init';
import { initReceive } from '../net/receive';
import { loginActivity } from './rpc';
import { initSubscribeInfo } from './subscribedb';

// 用户类型
export enum UserType {
    DEF = 1,
    WALLET
}

// 重登录状态
export enum ReLoginState {
    START,
    ING,
    END,
    ERROR
}

// 自动登录管理
export class AutoLoginMgr {
    public subMgr: SubMgr;
    private conState: boolean = false;
    private token: string;
    private uid: string;
    private rootClient: Client;
    private clientRpc: any;
    private server: string;
    private port: number;
    private relogin: ReLoginState;
    private userType: UserType;
    private user: string;
    private pwd: string;
    private loginCb: any;

    constructor(server?: string, port?: number) {
        this.server = server ? server : '127.0.0.1';
        this.port = port ? port : 2234;
        this.subMgr = new SubMgr();
    }

    // 连接服务器
    public connection(success:Function) {
        const options = {
            reconnect: true,
            timeout: 30,
            keepAliveInterval: 30,
            cleanSession: false,
            useSSL: false,
            mqttVersion: 3,
            onSuccess: () => {
                this.clientRpc = create(this.rootClient, (<any>self).__mgr);
                console.log('[活动]connect 连接成功！！！！！！！');
                // 连接成功
                this.conState = true;
                if (this.relogin === ReLoginState.START) {
                    // console.log(`连接成功！！！`);
                    this.relogin = ReLoginState.ING;
                    this.autoLogin();
                } else if (this.relogin === ReLoginState.ING) {
                    // console.log(`重新打开APP！！！`);
                }
                success && success();
            },
            onFailure: (r) => {
                console.log('[活动]connect fail', r);
                this.reconnect();
            }
        };
        // rootClient = new Client('127.0.0.1', 1234, 'clientId-wcd14PDgoZ', null, options);
        const client = new Client(this.server, this.port, 'clientId-wcd14PDgoZ', null, options);
        this.rootClient = client;
        client.setOnConnectionLost((r) => {
            // 连接断开调用
            console.log('[活动]connectinLost:r', r);
            // console.log(`连接断开！！！`);
            this.conState = false;
            this.relogin = ReLoginState.START;
        });

        return client;
    }

    // 重连
    public reconnect() {
        if (this.rootClient) {
            this.rootClient.reconnect();
        }

    }

    // 获取MATT客户端
    public getClient() {
        return this.rootClient;
    }
    // 获取rpc方法
    public getRpc() {
        return this.clientRpc;
    }
    // 登录
    public login(userType: UserType, user: string, pwd: string, cb: (r: UserInfo) => void) {
        this.userType = userType;
        this.user = user;
        this.pwd = pwd;
        this.loginCb = cb;
        if (userType === UserType.DEF) {
            // defLogin(Number(user), pwd, (r: UserInfo) => {
            //     this.uid = r.uid.toString();
            //     initReceive(r.uid);
            //     // 获取自动登录凭证
            //     this.getToken();
            //     cb(r);
            // });
        } else if (userType === UserType.WALLET) {
            loginActivity(user, pwd, (r: UserInfo) => {

                this.uid = r.uid.toString();
                initReceive(r.uid);
                initSubscribeInfo(); // 监听数据表变化  
                // 获取自动登录凭证
                this.getToken();
                cb(r);
            });
        }
    }
    // 获取TOKEN
    public getToken() {
        const token = new GetToken();
        token.uid = this.uid;
        clientRpcFunc(getToken, token, (r: Token) => {
            console.log('!!!!!!!!!!!!!!token:', r);
            // this.autoLogin(uid, r.token);
            this.token = r.token;
        });
    }
    // 自动登录
    public autoLogin() {
        console.log('autoLogin ------------ ');
        const login = new AutoLogin();
        login.token = this.token;
        login.uid = this.uid;
        clientRpcFunc(auto_login, login, (r: Token) => {
            console.log('!!!!!!!!!!!!!!token:', r);
            if (r.code === 1) {
                this.relogin = ReLoginState.END;
                // 重新订阅topic
                this.subMgr.reSubs();
            } else {
                this.relogin = ReLoginState.ERROR;
                // 登录
                this.login(this.userType, this.user, this.pwd, this.loginCb);
                // 重新订阅topic
                this.subMgr.reSubs();
            }

        });
    }
    // 设置连接状态
    public setState(state: boolean) {
        this.conState = state;
    }
    // 获取连接状态
    public getState() {
        return this.conState;
    }
}

// 订阅主题管理
class SubMgr {
    private subs: Map<string, object>;
    constructor() {
        this.subs = new Map();
    }
    // 更新订阅主题
    public update(topic: string, returnStruct: any, cb: Function) {
        this.subs.set(topic, { returnStruct, cb });
    }
    // 移除订阅主题
    public del(topic: string) {
        this.subs.delete(topic);
    }
    // 获取主题map
    public getSubs() {
        return this.subs;
    }
    // 重新定义所有主题
    public reSubs() {
        const map = this.subs;
        map.forEach((value: any, topic, _map) => {
            const returnStruct = value.returnStruct;
            const cb = value.cb;
            subscribe(topic, returnStruct, cb, false);
        });
    }
}
