import _ from 'underscore';
import Bugsnag from '@bugsnag/react-native';
import Onyx from 'react-native-onyx';
import Log from '../Log';
import ONYXKEYS from '../../ONYXKEYS';
import {reauthenticate} from '../API';

/**
 * This migration adds an encryptedAuthToken to the SESSION key, if it is not present.
 *
 * @returns {Promise}
 */
export default function () {
    return new Promise((resolve) => {
        Bugsnag.leaveBreadcrumb(`addEncryptedAuthToken 00`);
        const connectionID = Onyx.connect({
            key: ONYXKEYS.SESSION,
            callback: (session) => {
                Bugsnag.leaveBreadcrumb(`addEncryptedAuthToken 01`);
                Onyx.disconnect(connectionID);
                Bugsnag.leaveBreadcrumb(`addEncryptedAuthToken 02`, {session, encryptedAuthToken: session.encryptedAuthToken});
                if (session && !_.isEmpty(session.encryptedAuthToken)) {
                    Bugsnag.leaveBreadcrumb(`addEncryptedAuthToken 02.1`);
                    Log.info('[Migrate Onyx] Skipped migration AddEncryptedAuthToken');
                    return resolve();
                }
                Bugsnag.leaveBreadcrumb(`addEncryptedAuthToken 03`);
                if (!session || !session.authToken) {
                    Bugsnag.leaveBreadcrumb(`addEncryptedAuthToken 03.1`);
                    Log.info('[Migrate Onyx] Skipped migration AddEncryptedAuthToken');
                    return resolve();
                }

                // If there is an auth token but no encrypted auth token, reauthenticate.
                Bugsnag.leaveBreadcrumb(`addEncryptedAuthToken 04`);
                if (session.authToken && _.isUndefined(session.encryptedAuthToken)) {
                    Bugsnag.leaveBreadcrumb(`addEncryptedAuthToken 04.1`);
                    return reauthenticate('Onyx_Migration_AddEncryptedAuthToken')
                        .then(() => {
                            Bugsnag.leaveBreadcrumb(`addEncryptedAuthToken 04.1.1`);
                            Log.info('[Migrate Onyx] Ran migration AddEncryptedAuthToken');
                            return resolve();
                        });
                }

                return resolve();
            },
        });
    });
}
