import PropTypes from 'prop-types';

function MainDisplay({ children }) {
  return (
    <main style={{ margin: '0 auto', width: '100%', maxWidth: '800px', padding: '1em' }}>
      {children}
    </main>
  );
}

MainDisplay.propTypes = {
    children: PropTypes.node,
};

export default MainDisplay;