import {StatusEnum} from '@/consts';

export function submit() {
    this.status = StatusEnum.checking;
    this.checkAnswer().then(correct => this.status = correct
        ? StatusEnum.correct
        : StatusEnum.wrong);
    this.attempts++;
}

export function onSubmit() {
    if (this.check_on_submit)
        this.status = StatusEnum.saved;
    else
        this.submit();
}
