import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {withOnyx} from 'react-native-onyx';
import PropTypes from 'prop-types';
import Str from 'expensify-common/lib/str';
import ExpensifyText from '../../components/ExpensifyText';
import styles from '../../styles/styles';
import themeColors from '../../styles/themes/default';
import ONYXKEYS from '../../ONYXKEYS';
import withLocalize, {withLocalizePropTypes} from '../../components/withLocalize';
import compose from '../../libs/compose';
import * as Session from '../../libs/actions/Session';

const propTypes = {
    /** The credentials of the logged in person */
    credentials: PropTypes.shape({
        /** The email the user logged in with */
        login: PropTypes.string,
    }),

    ...withLocalizePropTypes,
};

const defaultProps = {
    credentials: {
        login: '',
    },
};

const ChangeExpensifyLoginLink = props => (
    <View style={[styles.changeExpensifyLoginLinkContainer, styles.mt3]}>
        <ExpensifyText>
            {props.translate('common.not')}
            &nbsp;
            {Str.isSMSLogin(props.credentials.login)
                ? props.toLocalPhone(Str.removeSMSDomain(props.credentials.login))
                : Str.removeSMSDomain(props.credentials.login)}
            {'? '}
        </ExpensifyText>
        <TouchableOpacity
            style={[styles.link]}
            onPress={Session.clearSignInData}
            underlayColor={themeColors.componentBG}
        >
            <ExpensifyText style={[styles.link]}>
                {props.translate('common.goBack')}
                {'.'}
            </ExpensifyText>
        </TouchableOpacity>
    </View>
);

ChangeExpensifyLoginLink.propTypes = propTypes;
ChangeExpensifyLoginLink.defaultProps = defaultProps;
ChangeExpensifyLoginLink.displayName = 'ChangeExpensifyLoginLink';

export default compose(
    withLocalize,
    withOnyx({
        credentials: {key: ONYXKEYS.CREDENTIALS},
    }),
)(ChangeExpensifyLoginLink);
