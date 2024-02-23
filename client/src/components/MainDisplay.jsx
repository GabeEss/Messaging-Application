import PropTypes from 'prop-types';

function MainDisplay({ children }) {
  return (
    <main className="main-display">
      {children}
    </main>
  );
}

MainDisplay.propTypes = {
    children: PropTypes.node,
};

export default MainDisplay;