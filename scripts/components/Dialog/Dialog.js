import '@components/Dialog/Dialog.scss';
import { H5PContext } from '@context/H5PContext';
import PropTypes from 'prop-types';
import React from 'react';

export default class Dialog extends React.Component {
  constructor(props) {
    super(props);
    this.dialogRef = React.createRef();
    this.focusableElements = [];
    this.lastFocusedElement = null;
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    this.lastFocusedElement = document.activeElement;

    if (this.dialogRef.current) {
      this.focusableElements = this.dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (this.focusableElements.length > 0) {
        this.focusableElements[0].focus();
      }
    }

    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
    }

    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event) {
    if (event.key === 'Escape') {
      // Close the dialog on Escape key press
      this.props.onHideTextDialog();
    } 
    else if (event.key === 'Tab') {
      // Trap focus within the dialog
      const firstElement = this.focusableElements[0];
      const lastElement = this.focusableElements[this.focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        // Shift+Tab: Move focus to the last element
        event.preventDefault();
        lastElement.focus();
      } 
      else if (!event.shiftKey && document.activeElement === lastElement) {
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

Dialog.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  dialogClasses: PropTypes.arrayOf(PropTypes.string),
  onHideTextDialog: PropTypes.func.isRequired,
};

Dialog.defaultProps = {
  dialogClasses: [],
};
