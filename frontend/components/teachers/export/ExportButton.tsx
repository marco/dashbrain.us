import React from 'react';
import sharedStyles from '../../../../styles/pages/teachers-students.module.scss';
import styles from './ExportButton.module.scss';
import classNames from 'classnames';

let ExportButton: React.FC = () => {
  return (
    <>
      <div
        onClick={onClick}
        className={classNames(sharedStyles.bottomButtonFlat, styles.button)}
      >
        <img src="/assets/export/blue.png" alt="Export" className="w-4" />
        Export Dashbrain
      </div>
    </>
  );

  function onClick() {
    window.print();
  }
};

export default ExportButton;
