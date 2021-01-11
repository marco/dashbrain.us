import React, { useState } from 'react';
import { Room, deleteRoom } from '../../../lib/rooms';
import Prompt from '../../Sheet';
import sharedStyles from '../../../../styles/pages/teachers-students.module.scss';
import styles from './ExitButton.module.scss';
import classNames from 'classnames';

let ExitButton: React.FC<{ room: Room }> = (props) => {
  let [showingPrompt, setShowingPrompt] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowingPrompt(true)}
        className={classNames(sharedStyles.bottomButtonFlat, styles.button)}
      >
        <img src="/assets/close/red.png" alt="Exit" className="w-4" />
        End Dashbrain
      </div>
      {showingPrompt ? (
        <PollPrompt
          onClose={() => setShowingPrompt(false)}
          onConfirm={onConfirm}
        />
      ) : null}
    </>
  );

  async function onConfirm() {
    await deleteRoom(props.room.id);
    window.location.href = '/';
  }
};

let PollPrompt: React.FC<{
  onClose: () => void;
  onConfirm: () => void;
}> = (props) => {
  return (
    <Prompt onClose={props.onClose}>
      <div className="p-8">
        <p className="text-gray-500 text-center mt-1 mb-4">
          Are you sure you want to end this Dashbrain?
        </p>
        <p>
          <button
            onClick={props.onClose}
            className={classNames('blueButton text-white block w-full mb-2')}
          >
            Cancel
          </button>
          <button
            onClick={props.onConfirm}
            className={classNames(
              styles.confirmButton,
              'block text-white w-full mb-2'
            )}
          >
            End Dashbrain
          </button>
        </p>
      </div>
    </Prompt>
  );
};

export default ExitButton;
