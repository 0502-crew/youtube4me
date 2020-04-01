import './PageNavigation.css';

import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretSquareRight, faCaretSquareLeft } from '@fortawesome/free-solid-svg-icons';

export interface PageNavigationProps {
  currentPage: number;
  lastPage: number;
  onClickPrev: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  onClickNext: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}

export class PageNavigation extends React.Component<PageNavigationProps, {}> {
  render(): React.ReactNode {
    return (
      <div className='page-navigation'>
        <span className='prev' onClick={this.props.onClickPrev}><FontAwesomeIcon icon={faCaretSquareLeft}/></span>
        <span className='location'>{this.props.currentPage + 1} of {this.props.lastPage + 1}</span>
        <span className='next' onClick={this.props.onClickNext}><FontAwesomeIcon icon={faCaretSquareRight}/></span>
      </div>
    );
  }
}