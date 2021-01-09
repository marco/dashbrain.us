import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as rooms from '../../../lib/rooms';
import * as eventSender from '../../../lib/event-sender';

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
    <div className="fixed bottom-0">
      <button onClick={props.onClose}>
        {
          // TODO: Use an SVG for close.
        }
        x
      </button>
      <p>What&apos;s your Question?</p>
      <p>Only you and your teacher will see your question.</p>
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
    </div>
  );
};

export default QuestionButton;
