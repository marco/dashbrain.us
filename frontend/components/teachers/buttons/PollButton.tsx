import React, { useState } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as eventSender from '../../../lib/event-sender';
import { Room } from '../../../lib/rooms';
import Prompt from '../../Prompt';
import { Event, EventPollResponse, EventPollStart } from '../../../lib/events';

let PollButton: React.FC<{ room: Room; events: Event[] }> = (props) => {
  let [state, setState] = useState<PollState>({ state: 'no_poll' });

  return (
    <>
      <button onClick={onClick}>{renderButtonText()}</button>
      {state.state === 'prompting' ? (
        <PollPrompt
          onClose={() => setState({ state: 'no_poll' })}
          onSubmit={onSubmit}
        />
      ) : null}
    </>
  );

  async function onClick() {
    switch (state.state) {
      case 'ending':
      case 'prompting':
      case 'starting':
        break;
      case 'no_poll':
        setState({ state: 'prompting' });
        break;
      case 'started':
        setState({ state: 'ending' });
        await await eventSender.sendPollEnd(
          props.room,
          state.event.id,
          state.event.options.length,
          props.events.filter(
            (event) => event.type === 'poll_response'
          ) as EventPollResponse[]
        );
        setState({ state: 'no_poll' });
    }
  }

  async function onSubmit(values: {
    options: string[];
    showLiveResults: boolean;
  }) {
    setState({ state: 'starting' });
    let event = await eventSender.sendPollStart(
      props.room,
      values.options,
      values.showLiveResults
    );
    setState({ state: 'started', event: event });
  }

  function renderButtonText(): string {
    switch (state.state) {
      case 'ending':
      case 'prompting':
      case 'no_poll':
        return 'Poll';
      case 'started':
      case 'starting':
        return 'End Poll';
    }
  }
};

let PollPrompt: React.FC<{
  onClose: () => void;
  onSubmit: (values: {
    options: string[];
    showLiveResults: boolean;
  }) => Promise<void>;
}> = (props) => {
  return (
    <Prompt onClose={props.onClose}>
      <Formik
        initialValues={{ options: ['Yes 👍', 'No 👎'], showLiveResults: false }}
        onSubmit={props.onSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <p>Start a Poll</p>
            <label>Options</label>
            <FieldArray name="options">
              {(arrayHelpers) => (
                <div>
                  {values.options.map((optionValue, index) => (
                    <div key={index}>
                      <Field name={`options.${index}`} />
                      <button
                        type="button"
                        onClick={() => arrayHelpers.remove(index)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      arrayHelpers.push('');
                    }}
                  >
                    Add
                  </button>
                </div>
              )}
            </FieldArray>
            <Field name="showLiveResults" type="checkbox" />
            <label htmlFor="showLiveResults">
              Let students see live results
            </label>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sent!' : 'Send'}
            </button>
          </Form>
        )}
      </Formik>
    </Prompt>
  );
};

type PollState =
  | { state: 'no_poll' }
  | { state: 'prompting' }
  | { state: 'starting' }
  | { state: 'started'; event: EventPollStart }
  | { state: 'ending' };

export default PollButton;
