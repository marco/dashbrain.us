import React from 'react';
import sharedStyles from '../../../../styles/pages/teachers-students.module.scss';
import styles from './ExportButton.module.scss';
import classNames from 'classnames';
import * as devices from '../../../lib/devices';

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
    if (devices.isMobileSafari()) {
      // See https://github.com/firebase/firebase-js-sdk/issues/1145#issuecomment-425197071,
      // https://stackoverflow.com/a/50473614, https://stackoverflow.com/a/57957227.
      try {
        document.execCommand('print', false, null as any);
      } catch (error) {
        window.print();
      }
    } else {
      window.print();
    }
  }
};

export default ExportButton;
