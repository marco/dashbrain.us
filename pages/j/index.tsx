import React, { useRef } from 'react';
import LogoType from '../../frontend/components/LogoType';
import { Formik, Form, Field } from 'formik';
import { useRouter } from 'next/router';
import * as rooms from '../../frontend/lib/rooms';

let EnterCodePage: React.FC = () => {
  let router = useRouter();

  return (
    <div className="flex items-center justify-center h-full flex-col pb-6">
      <LogoType color="blue" className="text-center" size="xl" />
      <Formik
        initialValues={{ code: '' }}
        onSubmit={async (values) => {
          let exists = await rooms.checkRoomExists(values.code);
          if (exists) {
            router.push('/j/' + values.code);
          } else {
            // TODO: Toast;
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="w-64">
            <Field
              name="code"
              required
              className="input w-full mt-6 text-center text-lg py-0.5"
              placeholder="Dashbrain ID"
            />
            <button
              type="submit"
              className="blueButton block w-full text-white font-black mt-1"
              disabled={isSubmitting}
            >
              Next
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EnterCodePage;
