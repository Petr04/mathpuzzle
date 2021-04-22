import {StatusEnum, finalStatuses} from '@/consts';

export function empty() {
    return !this.answer && this.answer !== 0;
}

export function readonly() {
    return this.status == StatusEnum.correct ||
        (this.status == StatusEnum.wrong &&
            (this.attempts >= this.attemptsMax || this.check_on_submit));
}

export function error() {
    return this.status == StatusEnum.wrong;
}

export function success() {
    return this.status == StatusEnum.correct;
}

export function color() {
    if (this.error) return 'error';
    if (this.success) return 'success';
    return 'grey lighten-4';
}

export function final() {
    return finalStatuses.includes(this.status)
        || (this.status == StatusEnum.wrong && this.attemptsLeft == 0);
}

export function attemptsLeft() {
    return this.attemptsMax - this.attempts;
}

export function attemptMessages() {
    if (this.attemptsMax == Infinity)
        return [];

    return [this.attemptsLeft
        ? `Остал${this.attemptsLeft == 1 ? 'а' : 'о'}сь `
            + this.attemptsLeft + ' '
            + this.decline('попытка', 1, this.attemptsLeft, 'и')
        : 'Не осталось попыток'
    ];
}
