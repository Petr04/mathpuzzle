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

// export const baseURL = 'https://scipuzzle.herokuapp.com';
export const baseURL = 'https://petr1337makarov.pythonanywhere.com';
// export const baseURL = 'http://localhost:8000';
