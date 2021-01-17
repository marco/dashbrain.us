export function isSchool(): boolean {
  // This must have the prefix `NEXT_PUBLIC_`. See
  // https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser.
  return process.env.NEXT_PUBLIC_VOCABULARY === 'school';
}

export function getParticipantWord(): string {
  if (isSchool()) {
    return 'student';
  } else {
    return 'participant';
  }
}

export function getHostWord(): string {
  if (isSchool()) {
    return 'teacher';
  } else {
    return 'host';
  }
}
