import React from 'react';
import './Button.scss';

export default class Button extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick() {
    if (!this.props.disabled) {
      this.props.onClick();
    }
  }

  /**
   * React - after render
   * @param {object} prevProps Previous props.
   */
  componentDidUpdate(prevProps) {
    if (prevProps.nextFocus !== this.props.nextFocus && this.props.type === this.props.nextFocus) {
      this.element.focus();
    }
  }

  /**
   * React - create DOM elements.
   * @returns {HTMLElement} React element.
   */
  render() {
    return (
      <div className='btn-wrap'>
        <button
          ref={(el) => (this.element = el)}
          className={`hud-btn ${  this.props.type}`}
          onClick={this.handleClick.bind(this)}
          aria-label={this.props.label}
          disabled={!!this.props.disabled}
        />
        <div className='tooltip' aria-hidden='true'>
          <div className='text-wrap'>{this.props.label}</div>
        </div>
      </div>
    );
  }
}
