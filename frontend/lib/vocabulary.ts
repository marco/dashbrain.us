export function isSchool(): boolean {
  return process.env.vocabulary === 'school';
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
