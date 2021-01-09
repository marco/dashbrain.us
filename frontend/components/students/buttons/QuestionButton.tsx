import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as rooms from '../../../lib/rooms';
import * as eventSender from '../../../lib/event-sender';
import Prompt from '../../Prompt';

let QuestionButton: React.FC<{ room: rooms.Room }> = (props) => {
  let [showPrompt, setShowPrompt] = useState(false);

  return (
    <>
      <button onClick={() => setShowPrompt(true)}>Ask a Question</button>
      {showPrompt ? (
        <QuestionPrompt
          onSubmit={onSubmit}
          onClose={() => setShowPrompt(false)}
        />
      ) : null}
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
}> = (props) => {
  return (
    <Prompt onClose={props.onClose}>
      <p>What&apos;s your Question?</p>
      <p>
        Classmates will see your question, but won&apos;t see who it&apos;s
        from.
      </p>
      <p>If you want to send a private question, use message button instead.</p>
      <Formik initialValues={{ text: '' }} onSubmit={props.onSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <Field as="textarea" name="text" />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitted!' : 'Submit'}
            </button>
          </Form>
        )}
      </Formik>
    </Prompt>
  );
};

export default QuestionButton;
