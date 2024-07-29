import PropTypes from 'prop-types';

function ServerComponent({server}) {
    return (
        <>
            <img src={server.imageUrl} alt="Picture of server" className="server_icon"></img>
        </>
    )
}

ServerComponent.propTypes = {
    server: PropTypes.object.isRequired
}
export default ServerComponent;