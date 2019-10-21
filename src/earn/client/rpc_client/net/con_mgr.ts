/**
 * 连接管理
 */

// =====================================导入
import { Client } from '../../../../pi/net/mqtt_c';
import { create } from '../../../../pi/net/rpc';

// 重登录状态
export enum ReLoginState {
    INIT,
    START,
    ING,
    END,
    ERROR
}

// 自动登录管理
export class ConMgr {
    private conState: boolean = false;
    private token: string;
    private uid: string;
    private rootClient: Client;
    private clientRpc: any;
    private server: string;
    private port: number;
    private relogin: ReLoginState = ReLoginState.INIT;
    private user: string;
    private pwd: string;
    private loginCb: any;

    constructor(server?: string, port?: number) {
        this.server = server ? server : '127.0.0.1';
        this.port = port ? port : 2234;
    }

    // 连接服务器
    public connection(success:Function,fail:Function) {
        const options = {
            reconnect: true,
            timeout: 10,
            keepAliveInterval: 30,
            cleanSession: true,
            useSSL: false,
            mqttVersion: 3,
            onSuccess: () => {
                this.clientRpc = create(this.rootClient, (<any>self).__mgr);
                console.log('[活动]connect 连接成功！！！！！！！');
                // 连接成功
                this.conState = true;
                success && success();
            },
            onFailure: (r) => {
                this.conState = false;
                console.log('[活动]connect fail', r);
                if (!(typeof r === 'string')) {
                    this.reconnect();
                }
                
                fail && fail();
            }
        };
        const clientId = `clientId-${((Date.now() + Math.floor(Math.random() * 1000000) * 10000000).toString(36))}`;
        const client = new Client(this.server, this.port, clientId, null, options);
        this.rootClient = client;
        client.setOnConnectionLost((r) => {
            // 连接断开调用
            console.log('[活动]connectinLost:r', r);
            // console.log(`连接断开！！！`);
            this.conState = false;
            fail && fail();
        });

        return client;
    }

    // 重连
    public reconnect() {
        if (this.rootClient) {
            this.rootClient.reconnect();
        }
    }

    // 断开连接
    public disconnect() {
        if (this.rootClient) {
            try {
                this.rootClient.disconnect();
            } catch (err) {
                console.log(err);
            }
            
            this.relogin = ReLoginState.INIT;
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
    // 设置连接状态
    public setState(state: boolean) {
        this.conState = state;
    }
    // 获取连接状态
    public getState() {
        return this.conState;
    }
}