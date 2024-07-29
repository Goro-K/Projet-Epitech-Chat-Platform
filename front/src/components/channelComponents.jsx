import PropTypes from 'prop-types';

function ChannelComponents({channelName}) {
    return (
        <p>#{channelName}</p>
    )
}

ChannelComponents.propTypes = {
    channelName: PropTypes.string.isRequired
}

export default ChannelComponents;