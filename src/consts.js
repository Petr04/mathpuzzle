export const StatusEnum = Object.freeze({
    default: 'default',
    saved: 'saved',
    checking: 'checking',
    wrong: 'wrong',
    correct: 'correct',
});

// When needed to switch page
export const finalStatuses = Object.freeze([
    StatusEnum.correct,
    StatusEnum.saved,
]);
