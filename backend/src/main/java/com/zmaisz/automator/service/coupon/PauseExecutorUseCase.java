package com.zmaisz.automator.service.coupon;

import org.springframework.stereotype.Service;

import com.zmaisz.automator.model.user.User;
import com.zmaisz.automator.model.user.UserContext;
import com.zmaisz.automator.model.user.usergroup.UserGroup;
import com.zmaisz.automator.util.frotaflex.FrotaFlexService;

@Service
public class PauseExecutorUseCase {

    private final FrotaFlexService frotaFlexService;

    public PauseExecutorUseCase(FrotaFlexService frotaFlexService) {
        this.frotaFlexService = frotaFlexService;
    }

    public void execute() {
        User user = UserContext.getUser();
        UserGroup group = user.getGroup();
        frotaFlexService.pauseGroup(group.getId());
    }
}
