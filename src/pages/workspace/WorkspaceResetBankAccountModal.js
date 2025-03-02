import _ from 'underscore';
import lodashGet from 'lodash/get';
import PropTypes from 'prop-types';
import React from 'react';
import {withOnyx} from 'react-native-onyx';
import ConfirmModal from '../../components/ConfirmModal';
import * as BankAccounts from '../../libs/actions/BankAccounts';
import withLocalize, {withLocalizePropTypes} from '../../components/withLocalize';
import reimbursementAccountPropTypes from '../ReimbursementAccount/reimbursementAccountPropTypes';
import compose from '../../libs/compose';
import ONYXKEYS from '../../ONYXKEYS';
import bankAccountPropTypes from '../../components/bankAccountPropTypes';
import ExpensifyText from '../../components/ExpensifyText';
import styles from '../../styles/styles';
import BankAccount from '../../libs/models/BankAccount';

const propTypes = {
    /** Reimbursement account data */
    reimbursementAccount: reimbursementAccountPropTypes,

    /** List of bank accounts */
    bankAccountList: PropTypes.arrayOf(bankAccountPropTypes),

    ...withLocalizePropTypes,
};

const defaultProps = {
    reimbursementAccount: {},
    bankAccountList: [],
};

const WorkspaceResetBankAccountModal = (props) => {
    const isInOpenState = lodashGet(props.reimbursementAccount, 'achData.state') === BankAccount.STATE.OPEN;
    const bankAccountID = lodashGet(props.reimbursementAccount, 'achData.bankAccountID');
    const account = _.find(props.bankAccountList, bankAccount => bankAccount.bankAccountID === bankAccountID);
    const bankShortName = account ? `${account.addressName} ${account.accountNumber.slice(-4)}` : '';
    return (
        <ConfirmModal
            title="Are you sure?"
            confirmText={isInOpenState ? props.translate('workspace.bankAccount.yesDisconnectMyBankAccount') : props.translate('workspace.bankAccount.yesStartOver')}
            cancelText={props.translate('common.cancel')}
            prompt={isInOpenState ? (
                <ExpensifyText>
                    <ExpensifyText>{props.translate('workspace.bankAccount.disconnectYour')}</ExpensifyText>
                    <ExpensifyText style={styles.textStrong}>
                        {bankShortName}
                    </ExpensifyText>
                    <ExpensifyText>{props.translate('workspace.bankAccount.bankAccountAnyTransactions')}</ExpensifyText>
                </ExpensifyText>
            ) : props.translate('workspace.bankAccount.clearProgress')}
            danger
            onCancel={BankAccounts.cancelResetFreePlanBankAccount}
            onConfirm={() => BankAccounts.resetFreePlanBankAccount()}
            shouldShowCancelButton
            isVisible={lodashGet(props.reimbursementAccount, 'shouldShowResetModal', false)}
        />
    );
};

WorkspaceResetBankAccountModal.displayName = 'WorkspaceResetBankAccountModal';
WorkspaceResetBankAccountModal.propTypes = propTypes;
WorkspaceResetBankAccountModal.defaultProps = defaultProps;

export default compose(
    withLocalize,
    withOnyx({
        reimbursementAccount: {
            key: ONYXKEYS.REIMBURSEMENT_ACCOUNT,
        },
        bankAccountList: {
            key: ONYXKEYS.BANK_ACCOUNT_LIST,
            initWithStoredValues: false,
        },
    }),
)(WorkspaceResetBankAccountModal);
