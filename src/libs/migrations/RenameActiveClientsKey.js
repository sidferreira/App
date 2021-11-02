import Onyx from 'react-native-onyx';
import Bugsnag from '@bugsnag/react-native';
import _ from 'underscore';
import Log from '../Log';
import ONYXKEYS from '../../ONYXKEYS';

// This migration changes the name of the Onyx key ACTIVE_CLIENTS from activeClients2 to activeClients
export default function () {
    return new Promise((resolve) => {
        Bugsnag.leaveBreadcrumb(`renameActiveClientsKey 01`);
        // Connect to the old key in Onyx to get the old value of activeClients2
        // then set the new key activeClients to hold the old data
        // finally remove the old key by setting the value to null
        const connectionID = Onyx.connect({
            key: 'activeClients2',
            callback: (oldActiveClients) => {
                Bugsnag.leaveBreadcrumb(`renameActiveClientsKey 02`);
                Onyx.disconnect(connectionID);
                Bugsnag.leaveBreadcrumb(`renameActiveClientsKey 03`);
                // Fail early here because there is nothing to migrate
                if (_.isEmpty(oldActiveClients)) {
                    Bugsnag.leaveBreadcrumb(`renameActiveClientsKey 03.1`);
                    Log.info('[Migrate Onyx] Skipped migration RenameActiveClientsKey');
                    return resolve();
                }
                Bugsnag.leaveBreadcrumb(`renameActiveClientsKey 04`);
                Onyx.multiSet({
                    activeClients2: null,
                    [ONYXKEYS.ACTIVE_CLIENTS]: oldActiveClients,
                })
                    .then(() => {
                        Bugsnag.leaveBreadcrumb(`renameActiveClientsKey 04.1`);
                        Log.info('[Migrate Onyx] Ran migration RenameActiveClientsKey');
                        resolve();
                    });
            },
        });
    });
}
