package com.zmaisz.automator.util.frotaflex;

import java.nio.file.Path;

import com.zmaisz.automator.model.user.usergroup.UserGroup;

public interface FrotaFlexService {

    void enqueueFile(UserGroup group, Path filePath, Long couponId);

    void pauseGroup(Long groupId);

    void resumeGroup(UserGroup group);

}
