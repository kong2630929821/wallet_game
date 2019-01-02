/**
 * sign in
 */
import { popNew } from '../../../../../../pi/ui/root';
import { Widget } from '../../../../../../pi/widget/widget';
import { getInvitedNumberOfPerson } from '../../../net/rpc';
import { inviteAwardsMultiple } from '../../../utils/constants';

export class Welfare extends Widget {
    public ok:() => void;
    public create() {
        this.props = {
            welfareAwards : [],
            invitedNumberOfPerson:0,
            inviteAwardsMultiple
        };
        this.initWelfareAwards();
        getInvitedNumberOfPerson();
    }

    /**
     * 初始化奖励列表
     */
    public initWelfareAwards() {
        const defaultAwardsLen = 4;
        const calAwardsLen = Math.floor(this.props.invitedNumberOfPerson / inviteAwardsMultiple);
        const awardsLen = calAwardsLen > defaultAwardsLen ? calAwardsLen : defaultAwardsLen;
        for (let i = 0;i < awardsLen;i++) {
            const received = false;
            const canReceive = this.props.invitedNumberOfPerson >= (i + 1) * inviteAwardsMultiple;
            this.props.welfareAwards.push({
                received,
                canReceive
            });
        }
    }
    public closeClick() {
        this.ok && this.ok();
    }

    public inviteClick() {
        popNew('earn-client-app-view-activity-inviteFriend');
    }
}