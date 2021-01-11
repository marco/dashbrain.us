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
      <p>Are you sure you want to end this Dashbrain?</p>
      <p>
        <button>Cancel</button>
        <button>End Dashbrain</button>
      </p>
    </Prompt>
  );
};

export default ExitButton;
