import React, {PureComponent} from 'react';
import View from 'react-native-web';
import {withOnyx} from 'react-native-onyx';
import _ from 'underscore';
import PropTypes from 'prop-types';
import ONYXKEYS from '../ONYXKEYS';
import ReportActionPropTypes from '../pages/home/report/ReportActionPropTypes';
import ReportTransaction from './ReportTransaction';

const propTypes = {
    reportActions: PropTypes.arrayOf(PropTypes.shape(ReportActionPropTypes)), // should this be array/object?

    // ReportID for the associated chat report
    chatReportID: PropTypes.number.isRequired,

    // ReportID for the associated IOU report
    iouReportID: PropTypes.number.isRequired,

    transactions: PropTypes.arrayOf(PropTypes.shape({
        // The transaction currency
        currency: PropTypes.string,

        // The transaction amount
        total: PropTypes.number,

        // The transaction comment
        comment: PropTypes.string,
    })),
};

const defaultProps = {
    reportActions: [],
    transactions: [],
};

class IOUDetailsTransactions extends PureComponent {
    render() {
        const transactionsByCreationDate = this.props.transactions ? this.props.transactions.reverse() : [];
        return (
            <View>
                {_.map(transactionsByCreationDate, (transaction) => {
                    const actionForTransaction = _.find(this.props.reportActions, (action) => {
                        if (action && action.originalMessage) {
                            return action.originalMessage.IOUTransactionID == transaction.transactionID;

                            // TODO: make sure type is equal
                        }
                        return false;
                    });
                    return (
                        <ReportTransaction
                            chatReportID={this.props.chatReportID}
                            transaction={transaction}
                            action={actionForTransaction}
                        />
                    );
                })}
            </View>
        );
    }
}

IOUDetailsTransactions.defaultProps = defaultProps;
IOUDetailsTransactions.propTypes = propTypes;
export default withOnyx({
    reportActions: {
        key: ({chatReportID}) => `${ONYXKEYS.COLLECTION.REPORT_ACTIONS}${chatReportID}`,
        canEvict: false,
    },
})(IOUDetailsTransactions);