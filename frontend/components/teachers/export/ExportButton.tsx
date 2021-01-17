import React from 'react';
import sharedStyles from '../../../../styles/pages/teachers-students.module.scss';
import styles from './ExportButton.module.scss';
import classNames from 'classnames';

let ExportButton: React.FC<{ onClick: () => void }> = (props) => {
  return (
    <>
      <div
        onClick={props.onClick}
        className={classNames(sharedStyles.bottomButtonFlat, styles.button)}
      >
        <img src="/assets/export/blue.png" alt="Export" className="w-4" />
        Export Dashbrain
      </div>
    </>
  );
};

export default ExportButton;
