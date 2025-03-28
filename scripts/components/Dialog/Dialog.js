import PropTypes from 'prop-types';
import React from 'react';
import { H5PContext } from '../../context/H5PContext';
import './Dialog.scss';

export default class Dialog extends React.Component {
  constructor(props) {
    super(props);
    this.dialogRef = React.createRef();
    this.focusableElements = [];
    this.lastFocusedElement = null;
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    // Save the last focused element
    this.lastFocusedElement = document.activeElement;

    // Focus the dialog
    if (this.dialogRef.current) {
      this.focusableElements = this.dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (this.focusableElements.length > 0) {
        this.focusableElements[0].focus();
      }
    }

    // Add keydown listener for Escape and focus trap
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    // Restore focus to the last focused element
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
    }

    // Remove keydown listener
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event) {
    if (event.key === 'Escape') {
      // Close the dialog on Escape key press
      this.props.onHideTextDialog();
    } else if (event.key === 'Tab') {
      // Trap focus within the dialog
      const firstElement = this.focusableElements[0];
      const lastElement = this.focusableElements[this.focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        // Shift+Tab: Move focus to the last element
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        // Tab: Move focus to the first element
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  render() {
    let dialogClasses = ['h5p-text-dialog'];
    if (this.props.dialogClasses) {
      dialogClasses = dialogClasses.concat(this.props.dialogClasses);
    }

    const children =
      this.props.children.type === 'div'
        ? this.props.children
        : React.Children.map(this.props.children, (child) =>
            React.cloneElement(child, {
              onResize: this.handleResize,
            })
          );

    return (
      <div
        className='h5p-text-overlay'
        role='dialog'
        aria-label={this.props.title}
        ref={this.dialogRef}
        aria-modal='true'
      >
        <div className='h5p-dialog-focusstart' tabIndex='-1'></div>
        <div className={dialogClasses.join(' ')}>
          <div className='h5p-text-content'>{children}</div>
          <button
            ref={(el) => (this.closeButton = el)}
            aria-label={'Close'}
            className='close-button-wrapper'
            onClick={this.props.onHideTextDialog}
          ></button>
        </div>
      </div>
    );
  }
}

Dialog.contextType = H5PContext;

// Define prop types for the Dialog component
Dialog.propTypes = {
  title: PropTypes.string.isRequired, // Title of the dialog
  children: PropTypes.node.isRequired, // Content inside the dialog
  dialogClasses: PropTypes.arrayOf(PropTypes.string), // Additional CSS classes for the dialog
  onHideTextDialog: PropTypes.func.isRequired, // Function to handle closing the dialog
};

// Define default props for optional props
Dialog.defaultProps = {
  dialogClasses: [], // Default to an empty array if no classes are provided
};
