/**
 * sign in
 */
import { popNew } from '../../../../../pi/ui/root';
import { Forelet } from '../../../../../pi/widget/forelet';
import { Widget } from '../../../../../pi/widget/widget';
import { getStore, Invited, register } from '../../store/memstore';
import { inviteAwardsMultiple } from '../../utils/constants';

// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class InviteAward extends Widget {
    public ok:() => void;
    public create() {
        super.create();
        const invited = getStore('invited');
        this.props = {
            welfareAwards : [],
            invitedNumberOfPerson:invited.invitedNumberOfPerson,
            inviteAwardsMultiple
        };
        this.initWelfareAwards(invited.convertedInvitedAward);
    }

    /**
     * 初始化奖励列表
     */
    public initWelfareAwards(receiveAwards:number[]) {
        const defaultAwardsLen = 4;
        const calAwardsLen = Math.floor(this.props.invitedNumberOfPerson / inviteAwardsMultiple);
        const awardsLen = calAwardsLen > defaultAwardsLen ? calAwardsLen : defaultAwardsLen;
        const welfareAwards = [];
        for (let i = 0;i < awardsLen;i++) {
            const received = receiveAwards[i] === 0 ? true : false;
            const canReceive = this.props.invitedNumberOfPerson >= (i + 1) * inviteAwardsMultiple;
            welfareAwards.push({
                received,
                canReceive
            });
        }
        this.props.welfareAwards = welfareAwards;
        console.log('InviteAward ==========',this.props.welfareAwards);
    }
    public closeClick() {
        this.ok && this.ok();
    }

    public inviteClick() {
        popNew('earn-client-app-view-activity-inviteFriend');
    }

    public updateInvited(invited:Invited) {
        this.props.invitedNumberOfPerson = invited.invitedNumberOfPerson;
        this.initWelfareAwards(invited.convertedInvitedAward);
        this.paint();
    }
}

// ========================

register('invited',(invited:Invited) => {
    const w:any = forelet.getWidget(WIDGET_NAME);
    w && w.updateInvited(invited);
});