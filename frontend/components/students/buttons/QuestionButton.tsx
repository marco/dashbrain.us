import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as rooms from '../../../lib/rooms';
import * as eventSender from '../../../lib/event-sender';
import Prompt from '../../Sheet';
import sharedStyles from '../../../../styles/pages/teachers-students.module.scss';
import styles from './QuestionButton.module.scss';
import classNames from 'classnames';

let QuestionButton: React.FC<{ room: rooms.Room }> = (props) => {
  let [showPrompt, setShowPrompt] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowPrompt(true)}
        className={classNames(
          styles.button,
          sharedStyles.bottomButtonSquare,
          'mb-1.5 flex flex-col flex-1 items-stretch'
        )}
      >
        <div className="flex-1 items-center justify-center flex">
          <img
            src={'/assets/question/purple.png'}
            alt="Question"
            className="h-12"
          />
        </div>
        Ask a Question
      </button>
      <QuestionPrompt
        hidden={!showPrompt}
        onSubmit={onSubmit}
        onClose={() => setShowPrompt(false)}
      />
    </>
  );

  async function onSubmit(values: { text: string }) {
    await eventSender.askQuestion(props.room, values.text);
    setShowPrompt(false);
  }
};

let QuestionPrompt: React.FC<{
  onSubmit: (values: { text: string }) => Promise<void>;
  onClose: () => void;
  hidden: boolean;
}> = (props) => {
  return (
    <Prompt onClose={props.onClose} hidden={props.hidden}>
      <div className="p-8">
        <p className="font-bold text-xl tracking-tight">
          What&apos;s your Question?
        </p>
        <p className="mt-2 leading-snug text-gray-500">
          Classmates will see your question, but won&apos;t see who it&apos;s
          from. If you want to send a private question, use the Message button
          instead.
        </p>
        <Formik initialValues={{ text: '' }} onSubmit={props.onSubmit}>
          {({ isSubmitting }) => (
            <Form className="mt-4">
              <Field
                as="textarea"
                name="text"
                className="input block w-full"
                placeholder="Your question"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="blueButton w-full text-white mt-4"
              >
                {isSubmitting ? 'Submitted!' : 'Submit'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </Prompt>
  );
};

export default QuestionButton;
