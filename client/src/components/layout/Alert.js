import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux' // interact to component with redox 

const Alert = ({alerts}) => alerts !== null && alerts.length > 0 && alerts.map(alert => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
        {alert.msg}
    </div>
));

Alert.propTypes = {
    alerts: propTypes.array.isRequired
}

const mapstateToProps = state => ({
    alerts: state.alert
});

export default connect(mapstateToProps)(Alert);
