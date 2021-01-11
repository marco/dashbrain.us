import React, { useState } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as eventSender from '../../../lib/event-sender';
import { Room } from '../../../lib/rooms';
import Prompt from '../../Sheet';
import { Event, EventPollResponse, EventPollStart } from '../../../lib/events';
import sharedStyles from '../../../../styles/pages/teachers-students.module.scss';
import styles from './PollButton.module.scss';
import classNames from 'classnames';

let PollButton: React.FC<{ room: Room; events: Event[] }> = (props) => {
  let [state, setState] = useState<PollState>({ state: 'no_poll' });

  return (
    <>
      <div
        onClick={onClick}
        className={classNames(sharedStyles.bottomButtonFlat, styles.button, {
          [styles.started]:
            state.state === 'starting' || state.state === 'started',
        })}
      >
        <img
          src={
            state.state === 'starting' || state.state === 'started'
              ? '/assets/poll/white.png'
              : '/assets/poll/orange.png'
          }
          alt="Poll"
          className="w-4"
        />
        {renderButtonText()}
      </div>
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
      case 'started': {
        setState({ state: 'ending' });
        let eventId = state.event.id;

        await await eventSender.sendPollEnd(
          props.room,
          state.event.id,
          state.event.options.length,
          props.events.filter(
            (event) =>
              event.type === 'poll_response' && event.pollEventId === eventId
          ) as EventPollResponse[]
        );
        setState({ state: 'no_poll' });
      }
    }
  }

  async function onSubmit(values: {
    text: string;
    options: string[];
    showLiveResults: boolean;
  }) {
    setState({ state: 'starting' });
    let event = await eventSender.sendPollStart(
      props.room,
      values.text,
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
        return 'Start a Poll';
      case 'started':
      case 'starting':
        return 'End Poll';
    }
  }
};

let PollPrompt: React.FC<{
  onClose: () => void;
  onSubmit: (values: {
    text: string;
    options: string[];
    showLiveResults: boolean;
  }) => Promise<void>;
}> = (props) => {
  return (
    <Prompt onClose={props.onClose}>
      <Formik
        initialValues={{
          text: '',
          options: ['Yes 👍', 'No 👎'],
          showLiveResults: false,
        }}
        onSubmit={props.onSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form className="p-8">
            <p className="font-bold text-xl tracking-tight">Start a Poll</p>
            <label className="block mt-4">Question (Optional)</label>
            <Field
              name="text"
              className={classNames(sharedStyles.input, 'block w-full mb-4')}
            />
            <label>Options</label>
            <FieldArray name="options">
              {(arrayHelpers) => (
                <div>
                  {values.options.map((optionValue, index) => (
                    <div key={index}>
                      <Field
                        name={`options.${index}`}
                        className={classNames(
                          sharedStyles.input,
                          'w-11/12 mb-2'
                        )}
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="#999"
                        className="w-5 inline ml-2 mb-1 cursor-pointer"
                        onClick={() => arrayHelpers.remove(index)}
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      arrayHelpers.push('');
                    }}
                    className="leading-none text-blue-500 rounded-sm mt-0.5 mb-5"
                  >
                    Add Option
                  </button>
                </div>
              )}
            </FieldArray>
            <Field name="showLiveResults" type="checkbox" />
            <label htmlFor="showLiveResults">
              {' '}
              Let students see live results after they vote.
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className={classNames(
                'w-full py-1.5 mt-8 text-white block',
                sharedStyles.blueButton
              )}
            >
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
