import Onyx from 'react-native-onyx';
import Bugsnag from '@bugsnag/react-native';
import _ from 'underscore';
import ONYXKEYS from '../../ONYXKEYS';
import Log from '../Log';

// This migration changes the name of the Onyx key NVP_PRIORITY_MODE from priorityMode to nvp_priorityMode
export default function () {
    return new Promise((resolve) => {
        Bugsnag.leaveBreadcrumb(`renamePriorityModeKey 01`);
        // Connect to the old key in Onyx to get the old value of priorityMode
        // then set the new key nvp_priorityMode to hold the old data
        // finally remove the old key by setting the value to null
        const connectionID = Onyx.connect({
            key: 'priorityMode',
            callback: (oldPriorityMode) => {
                Bugsnag.leaveBreadcrumb(`renamePriorityModeKey 02`);
                Onyx.disconnect(connectionID);
                Bugsnag.leaveBreadcrumb(`renamePriorityModeKey 03`);
                // Fail early here because there is nothing to migrate
                if (_.isEmpty(oldPriorityMode)) {
                    Bugsnag.leaveBreadcrumb(`renamePriorityModeKey 03.1`);
                    Log.info('[Migrate Onyx] Skipped migration RenamePriorityModeKey');
                    return resolve();
                }
                Bugsnag.leaveBreadcrumb(`renamePriorityModeKey 04`);
                Onyx.multiSet({
                    priorityMode: null,
                    [ONYXKEYS.NVP_PRIORITY_MODE]: oldPriorityMode,
                })
                    .then(() => {
                        Bugsnag.leaveBreadcrumb(`renamePriorityModeKey 04.1`);
                        Log.info('[Migrate Onyx] Ran migration RenamePriorityModeKey');
                        resolve();
                    });
            },
        });
    });
}
