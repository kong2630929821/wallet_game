
import {cfgMgr} from "../../../pi/util/cfg";
import {Entrance} from "../../../pi_pt/entrance.s";

let _$c = (path, notes):Entrance => {return new Entrance(path, notes)};
let arr = [[0, _$c("server/tmp/rpc/user.login", new Map<string,string>([["rpc","rpcServer"]]))],[1, _$c("server/tmp/rpc/user.close_connect", new Map<string,string>([["event","net_connect_close"]]))]] as any;
cfgMgr.update(Entrance._$info.name, new Map<number,any>(arr));