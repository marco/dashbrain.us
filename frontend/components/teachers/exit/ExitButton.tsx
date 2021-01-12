import React, { useState } from 'react';
import { Room, deleteRoom } from '../../../lib/rooms';
import Prompt from '../../Sheet';
import sharedStyles from '../../../../styles/pages/teachers-students.module.scss';
import styles from './ExitButton.module.scss';
import classNames from 'classnames';
import { useRouter } from 'next/router';

let ExitButton: React.FC<{ room: Room }> = (props) => {
  let router = useRouter();
  let [showingPrompt, setShowingPrompt] = useState(false);

  return (
    <>
      {/*
        This has to be done above because the bottom button has a last-of-type
        selector for its margin. Making the popup at the bottom would make it the
        last element and break the margin.
      */}
      <PollPrompt
        onClose={() => setShowingPrompt(false)}
        onConfirm={onConfirm}
        hidden={!showingPrompt}
      />
      <div
        onClick={() => setShowingPrompt(true)}
        className={classNames(sharedStyles.bottomButtonFlat, styles.button)}
      >
        <img src="/assets/close/red.png" alt="Exit" className="w-4" />
        End Dashbrain
      </div>
    </>
  );

  async function onConfirm() {
    await deleteRoom(props.room.id);
    router.push('/');
  }
};

let PollPrompt: React.FC<{
  hidden: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}> = (props) => {
  let [isDeleting, setIsDeleting] = useState(false);

  return (
    <Prompt onClose={props.onClose} hidden={props.hidden}>
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
            disabled={isDeleting}
            onClick={async () => {
              setIsDeleting(true);
              await props.onConfirm();
              setIsDeleting(false);
            }}
            className={classNames(
              styles.confirmButton,
              'block text-white w-full mb-2'
            )}
          >
            {isDeleting ? 'Ending...' : 'End Dashbrain'}
          </button>
        </p>
      </div>
    </Prompt>
  );
};

export default ExitButton;
